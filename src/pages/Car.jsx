import { useEffect, useState } from 'react'
import { Row, Col, Spin, Empty } from 'antd'
import { getCars } from '../services/carService'
import CarCard from '../components/car/CarCard'
import CarFilter from '../components/car/CarFilter'

const Cars = () => {
    const [cars, setCars] = useState([])
    const [filteredCars, setFilteredCars] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const data = await getCars()
                setCars(Array.isArray(data) ? data : [])
                setFilteredCars(Array.isArray(data) ? data : [])
            } catch (err) {
                console.error(err)
                setCars([])
                setFilteredCars([])
            } finally {
                setLoading(false) // 🔥 tắt loading
            }
        }

        fetchCars()
    }, [])

    const handleFilter = (filters) => {
        let result = [...cars]

        if (filters.location) {
            result = result.filter(car =>
                car.location.toLowerCase().includes(filters.location.toLowerCase())
            )
        }

        if (filters.brand) {
            result = result.filter(car =>
                car.brand.toLowerCase().includes(filters.brand.toLowerCase())
            )
        }

        if (filters.price) {
            result = result.filter(car =>
                Number(car.price) <= filters.price
            )
        }

        setFilteredCars(result)
    }

    return (
        <div style={{ padding: 20 }}>
            <h2 style={{ textAlign: 'center' }}>Cars For You</h2>

            {/* 🔥 FILTER */}
            <div style={{ marginTop: 50 }}>
                <CarFilter onFilter={handleFilter} />
            </div>

            {/* LIST */}
                {loading ? (
                    <div style={{ textAlign: 'center', marginTop: 50 }}>
                        <Spin size="large" />
                    </div>
                ) : filteredCars.length === 0 ? (
                    <Empty description="No cars found" />
                ) : (
                    <Row gutter={[16, 16]} style={{marginTop: 30}}>
                        {filteredCars.map(car => (
                            <Col span={6} key={car._id}>
                                <CarCard car={car} />
                            </Col>
                        ))}
                    </Row>
                )}
        </div>
    )
}

export default Cars