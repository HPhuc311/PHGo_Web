import { Card, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'
import { buildImageUrl } from '../../utils/image'

const CarCard = ({ car }) => {
    const navigate = useNavigate()

    return (
        <Card
            hoverable
            onClick={() => navigate(`/cars/${car._id}`)}
            style={{
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}
            cover={
                <div style={{ height: '180px', overflow: 'hidden' }}>
                    <img
                        src={buildImageUrl(car.image)}
                        alt={car.name}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                        }}
                    />
                </div>
            }
            bodyStyle={{
                padding: '16px'
            }}
        >
            <h4 style={{ marginBottom: 8 }}>{car.name}</h4>

            <p style={{ marginBottom: 8, color: '#666' }}>
                📍 {car.location}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>⭐ {car.rating}</span>
                <span style={{ color: '#406093', fontWeight: 'bold' }}>
                    {Number(car.price).toLocaleString()}đ/day
                </span>
            </div>

            <p style={{ marginTop: 8 }}>{car.seats} seats</p>
        </Card>
    )
}

export default CarCard