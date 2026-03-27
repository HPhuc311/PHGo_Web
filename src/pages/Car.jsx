import { useEffect, useState } from 'react'
import {
    Row,
    Col,
    Spin,
    Empty,
    Slider,
    Typography,
    Select,
    Button,
    Card,
    Space
} from 'antd'
import { getCars } from '../services/carService'
import CarCard from '../components/car/CarCard'

const { Text } = Typography

const Cars = () => {
    const [cars, setCars] = useState([])
    const [filteredCars, setFilteredCars] = useState([])
    const [loading, setLoading] = useState(true)

    const [maxPrice, setMaxPrice] = useState(0)

    const [tempFilter, setTempFilter] = useState({
        priceRange: [0, 2000000],
        brand: '',
        seats: '',
        sort: ''
    })

    const [filter, setFilter] = useState(tempFilter)

    // FETCH
    useEffect(() => {
        const fetchCars = async () => {
            try {
                const data = await getCars()
                const list = Array.isArray(data) ? data : []

                setCars(list)
                setFilteredCars(list)

                const max = Math.max(...list.map(c => Number(c.price) || 0))
                setMaxPrice(max)
            } catch (err) {
                console.error(err)
                setCars([])
                setFilteredCars([])
            } finally {
                setLoading(false)
            }
        }

        fetchCars()
    }, [])

    // APPLY FILTER
    useEffect(() => {
        let result = [...cars]

        const { priceRange, brand, seats, sort } = filter

        // PRICE
        result = result.filter(car => {
            const price = Number(car.price)
            return price >= priceRange[0] && price <= priceRange[1]
        })

        // BRAND
        if (brand) {
            result = result.filter(car =>
                car.brand?.toLowerCase().includes(brand.toLowerCase())
            )
        }

        // SEATS
        if (seats) {
            result = result.filter(car =>
                Number(car.seats) === Number(seats)
            )
        }

        // SORT
        if (sort === 'low') {
            result.sort((a, b) => Number(a.price) - Number(b.price))
        } else if (sort === 'high') {
            result.sort((a, b) => Number(b.price) - Number(a.price))
        }

        setFilteredCars(result)
    }, [filter, cars])

    const handleApply = () => {
        setFilter(tempFilter)
    }

    const handleReset = () => {
        const defaultFilter = {
            priceRange: [0, maxPrice],
            brand: '',
            seats: '',
            sort: ''
        }

        setTempFilter(defaultFilter)
        setFilter(defaultFilter)
    }

    return (
        <div style={{ padding: 20 }}>
            <Row gutter={20}>

                {/* 🔥 SIDEBAR */}
                <Col span={6}>
                    <Card title="Filter" style={{ borderRadius: 12 }}>
                        <Space direction="vertical" style={{ width: '100%' }}>

                            {/* BRAND */}
                            <div>
                                <Text strong>Brand</Text>
                                <Select
                                    style={{ width: '100%', marginTop: 5 }}
                                    allowClear
                                    value={tempFilter.brand}
                                    onChange={(val) =>
                                        setTempFilter(prev => ({ ...prev, brand: val }))
                                    }
                                >
                                    {[...new Set(cars.map(c => c.brand))].map(b => (
                                        <Select.Option key={b} value={b}>
                                            {b}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>

                            {/* SEATS */}
                            <div>
                                <Text strong>Seats</Text>
                                <Select
                                    style={{ width: '100%', marginTop: 5 }}
                                    allowClear
                                    value={tempFilter.seats}
                                    onChange={(val) =>
                                        setTempFilter(prev => ({ ...prev, seats: val }))
                                    }
                                >
                                    <Select.Option value="4">4 seats</Select.Option>
                                    <Select.Option value="5">5 seats</Select.Option>
                                    <Select.Option value="7">7 seats</Select.Option>
                                </Select>
                            </div>

                            {/* SORT */}
                            <div>
                                <Text strong>Sort</Text>
                                <Select
                                    style={{ width: '100%', marginTop: 5 }}
                                    allowClear
                                    value={tempFilter.sort}
                                    onChange={(val) =>
                                        setTempFilter(prev => ({ ...prev, sort: val }))
                                    }
                                >
                                    <Select.Option value="low">Price: Low → High</Select.Option>
                                    <Select.Option value="high">Price: High → Low</Select.Option>
                                </Select>
                            </div>

                            {/* PRICE */}
                            <div>
                                <Text strong>Price Range</Text>
                                <Slider
                                    min={0}
                                    max={maxPrice}
                                    step={50000}
                                    value={tempFilter.priceRange[1]}
                                    onChange={(val) =>
                                        setTempFilter(prev => ({
                                            ...prev,
                                            priceRange: [0, val]
                                        }))
                                    }
                                />

                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    Up to {tempFilter.priceRange[1].toLocaleString()} VND
                                </div>
                            </div>

                            {/* BUTTON */}
                            <Space style={{ marginTop: 10 }}>
                                <Button onClick={handleReset}>
                                    Reset
                                </Button>
                                <Button type="primary" onClick={handleApply}>
                                    Lọc
                                </Button>
                            </Space>

                        </Space>
                    </Card>
                </Col>

                {/* 🔥 CAR LIST */}
                <Col span={18}>
                    <Text>{filteredCars.length} cars found</Text>

                    {loading ? (
                        <div style={{ textAlign: 'center', marginTop: 50 }}>
                            <Spin size="large" />
                        </div>
                    ) : filteredCars.length === 0 ? (
                        <Empty description="No cars found 😢" style={{ marginTop: 50 }} />
                    ) : (
                        <Row gutter={[16, 16]} style={{ marginTop: 10 }}>
                            {filteredCars.map(car => (
                                <Col span={8} key={car._id}>
                                    <CarCard car={car} />
                                </Col>
                            ))}
                        </Row>
                    )}
                </Col>

            </Row>
        </div>
    )
}

export default Cars