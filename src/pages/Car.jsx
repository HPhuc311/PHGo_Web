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
        priceRange: [0, 0],
        brand: '',
        seats: '',
        sort: ''
    })

    const [filter, setFilter] = useState(null)

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

                setTempFilter({
                    priceRange: [0, max],
                    brand: '',
                    seats: '',
                    sort: ''
                })
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchCars()
    }, [])

    // APPLY FILTER
    useEffect(() => {
        if (!filter) return

        let result = [...cars]

        const { priceRange, brand, seats, sort } = filter

        result = result.filter(car => {
            const price = Number(car.price)
            return price >= priceRange[0] && price <= priceRange[1]
        })

        if (brand) {
            result = result.filter(car =>
                car.brand?.toLowerCase().includes(brand.toLowerCase())
            )
        }

        if (seats) {
            result = result.filter(car =>
                Number(car.seats) === Number(seats)
            )
        }

        if (sort === 'low') {
            result.sort((a, b) => a.price - b.price)
        } else if (sort === 'high') {
            result.sort((a, b) => b.price - a.price)
        }

        setFilteredCars(result)
    }, [filter, cars])

    const handleApply = () => setFilter(tempFilter)

    const handleReset = () => {
        const defaultFilter = {
            priceRange: [0, maxPrice],
            brand: '',
            seats: '',
            sort: ''
        }

        setTempFilter(defaultFilter)
        setFilter(null)
        setFilteredCars(cars)
    }

    return (
        <div style={{ padding: 20 }}>

            {/* 🔥 FILTER NGANG */}
            <Card
                style={{
                    borderRadius: 12,
                    marginBottom: 16,
                    padding: '10px 16px'
                }}
                bodyStyle={{ padding: 0 }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 12,
                        flexWrap: 'wrap'
                    }}
                >

                    {/* BRAND */}
                    <Select
                        placeholder="Brand"
                        allowClear
                        size="middle"
                        style={{ width: 140 }}
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

                    {/* SEATS */}
                    <Select
                        placeholder="Seats"
                        allowClear
                        size="middle"
                        style={{ width: 120 }}
                        value={tempFilter.seats}
                        onChange={(val) =>
                            setTempFilter(prev => ({ ...prev, seats: val }))
                        }
                    >
                        <Select.Option value="4">4 seats</Select.Option>
                        <Select.Option value="5">5 seats</Select.Option>
                        <Select.Option value="7">7 seats</Select.Option>
                    </Select>

                    {/* SORT */}
                    <Select
                        placeholder="Sort"
                        allowClear
                        size="middle"
                        style={{ width: 140 }}
                        value={tempFilter.sort}
                        onChange={(val) =>
                            setTempFilter(prev => ({ ...prev, sort: val }))
                        }
                    >
                        <Select.Option value="low">Price ↑</Select.Option>
                        <Select.Option value="high">Price ↓</Select.Option>
                    </Select>

                    {/* 🔥 SLIDER GỌN */}
                    <div style={{ width: 220 }}>
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
                        <div style={{ fontSize: 12, textAlign: 'center' }}>
                            ≤ {tempFilter.priceRange[1].toLocaleString()} VND
                        </div>
                    </div>

                    {/* BUTTON */}
                    <Button size="middle" onClick={handleReset}>
                        Reset
                    </Button>

                    <Button size="middle" type="primary" onClick={handleApply}>
                        Apply
                    </Button>

                </div>
            </Card>

            {/* 🔥 CAR LIST */}
            <Text strong>{filteredCars.length} cars found</Text>

            {loading ? (
                <div style={{ textAlign: 'center', marginTop: 50 }}>
                    <Spin size="large" />
                </div>
            ) : filteredCars.length === 0 ? (
                <Empty description="No cars found 😢" style={{ marginTop: 50 }} />
            ) : (
                <Row gutter={[20, 20]}>
                    {filteredCars.map(car => (
                        <div
                            key={car._id}
                            style={{
                                width: '20%', // 🔥 1 hàng 5 card
                                padding: '10px'
                            }}
                        >
                            <CarCard car={car} />
                        </div>
                    ))}
                </Row>
            )}

        </div>
    )
}

export default Cars