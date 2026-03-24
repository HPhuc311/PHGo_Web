import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Card, Button } from 'antd'
import { getCars } from '../../services/carService'
import { buildImageUrl } from '../../utils/image'

const CarDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [car, setCar] = useState(null)

    useEffect(() => {
        const fetchCar = async () => {
            const data = await getCars()
            const found = data.find(c => c._id === id)
            setCar(found)
        }
        fetchCar()
    }, [id])

    if (!car) return <div>Loading...</div>

    return (
        <div style={{ maxWidth: '800px', margin: 'auto' }}>
            <Card>
                <img
                    src={buildImageUrl(car.image)}
                    style={{ width: '100%', borderRadius: 10 }}
                />

                <h2>{car.name}</h2>
                <p>📍 {car.location}</p>
                <p>🚗 {car.brand}</p>

                <p style={{ color: '#2ecc71', fontSize: 18 }}>
                    {Number(car.price).toLocaleString()}/day
                </p>

                <Button
                    type="primary"
                    size="large"
                    onClick={() =>
                        navigate('/booking', { state: { car } })
                    }
                >
                    Book Now
                </Button>
            </Card>
        </div>
    )
}

export default CarDetail