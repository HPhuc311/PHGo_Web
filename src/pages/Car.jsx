import { useEffect, useState } from 'react'
import {
    Row,
    Spin,
    Empty,
    Slider,
    Typography,
    Select,
    Button,
    Card,
    Space,
    Col,
    ConfigProvider
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

            {/* FILTER NGANG */}
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
                    <ConfigProvider
                        theme={{
                            token: {
                                colorTextPlaceholder: '#000',   
                                colorBorder: '#000',            
                                colorPrimary: '#406093',          
                            },
                            components: {
                                Select: {
                                    colorTextPlaceholder: '#000',
                                    activeBorderColor: '#000',
                                    hoverBorderColor: '#000',
                                }
                            }
                        }}
                    >
                        <Select
                            placeholder="Brand"
                            allowClear
                            size="middle"
                            style={{ width: 140 }}
                            value={tempFilter.brand || undefined}
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
                    </ConfigProvider>

                    {/* SEATS */}
                    <ConfigProvider
                        theme={{
                            token: {
                                colorTextPlaceholder: '#000',   
                                colorBorder: '#000',            
                                colorPrimary: '#406093',          
                            },
                            components: {
                                Select: {
                                    colorTextPlaceholder: '#000',
                                    activeBorderColor: '#000000',
                                    hoverBorderColor: '#000',
                                }
                            }
                        }}
                    >
                        <Select
                            placeholder="Seats"
                            allowClear
                            size="middle"
                            style={{ width: 120 }}
                            value={tempFilter.seats || undefined}
                            onChange={(val) =>
                                setTempFilter(prev => ({ ...prev, seats: val }))
                            }
                        >
                            <Select.Option value="4">4 seats</Select.Option>
                            <Select.Option value="5">5 seats</Select.Option>
                            <Select.Option value="7">7 seats</Select.Option>
                        </Select>
                    </ConfigProvider>

                    {/* SORT */}
                    <ConfigProvider
                        theme={{
                            token: {
                                colorTextPlaceholder: '#000',   
                                colorBorder: '#000',            
                                colorPrimary: '#406093',          
                            },
                            components: {
                                Select: {
                                    colorTextPlaceholder: '#000',
                                    activeBorderColor: '#000',
                                    hoverBorderColor: '#000',
                                }
                            }
                        }}
                    >
                        <Select
                            placeholder="Sort"
                            allowClear
                            size="middle"
                            style={{ width: 140 }}
                            value={tempFilter.sort || undefined}
                            onChange={(val) =>
                                setTempFilter(prev => ({ ...prev, sort: val }))
                            }
                        >
                            <Select.Option value="low">Price ↑</Select.Option>
                            <Select.Option value="high">Price ↓</Select.Option>
                        </Select>
                    </ConfigProvider>
                    {/* SLIDER GỌN */}
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

            {/* CAR LIST */}
            <Text strong>{filteredCars.length} cars found</Text>

            {loading ? (
                <div style={{ textAlign: 'center', marginTop: 50 }}>
                    <Spin size="large" />
                </div>
            ) : filteredCars.length === 0 ? (
                <Empty description="No cars found" style={{ marginTop: 50 }} />
            ) : (
                        <Row gutter={[24, 24]}>
                            {filteredCars.map(car => (
                                <Col span={6} key={car._id}>
                                    <div style={{ height: '100%' }}> {/* 🔥 thêm wrapper */}
                                        <CarCard car={car} />
                                    </div>
                                </Col>
                            ))}
                        </Row>
            )}

        </div>
    )
}

export default Cars