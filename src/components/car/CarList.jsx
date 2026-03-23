import { useEffect, useState } from 'react'
import CarCard from './CarCard'
import { getCars } from '../../services/carService'


const CarList = () => {
    const [cars, setCars] = useState([])

    useEffect(() => {
        const fetchCars = async () => {
            const data = await getCars()
            setCars(data)
        }

        fetchCars()
    }, [])

    return (
        <div style={{ marginTop: '40px' }}>
            <h2 style={{ textAlign: 'center' }}>Xe Dành Cho Bạn</h2>

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