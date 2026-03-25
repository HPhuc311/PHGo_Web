import { useEffect, useState } from 'react'
import CarCard from './CarCard'
import { getCars } from '../../services/carService'
import { Spin } from 'antd'

const CarList = () => {
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true) 

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

    return (
        <div style={{ marginTop: '40px' }}>
            <h2 style={{ textAlign: 'center' }}>Cars For You</h2>

            <div className="row mt-4">
                {cars.map((car) => (
                    <div className="col-md-3 mb-4" key={car._id}>
                        <CarCard car={car} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CarList