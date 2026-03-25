import { useEffect, useState } from 'react'
import CarCard from './CarCard'
import { getCars } from '../../services/carService'
import { Button, Spin } from 'antd'
import { useNavigate } from 'react-router-dom'

const CarList = () => {
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true) 
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const data = await getCars()
                setCars(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchCars()
    }, [])

    // ✅ LOADING UI
    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '60px' }}>
                <Spin size="large" />
            </div>
        )
    }

    const displayedCars = cars.slice(0, 8)

    return (
        <div style={{ marginTop: '40px' }}>
            <h2 style={{ textAlign: 'center' }}>Cars For You</h2>

            <div className="row mt-4">
                {displayedCars.map((car) => (
                    <div className="col-md-3 mb-4" key={car._id}>
                        <CarCard car={car} />
                    </div>
                ))}
            </div>

            {/* Chỉ hiện nút "More List" nếu tổng số xe lớn hơn 8 */}
            {cars.length > 8 && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Button
                        type="primary"
                        size="large"
                        onClick={() => navigate('/cars-list')} 
                    >
                        View More Cars
                    </Button>
                </div>
            )}
        </div>
    )
}

export default CarList