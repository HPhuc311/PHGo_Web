import { Card, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'

const CarCard = ({ car }) => {
    const navigate = useNavigate()

    return (
        <Card
            hoverable
            style={{ borderRadius: '16px'}}
            cover={
                <img
                    src={`http://localhost:5000${car.image}`}
                    alt={car.name}
                    style={{ width: "100%" , height: "120px",objectFit: "cover",borderRadius: "10px",marginBottom: 10}}
                />
            }
            onClick={() => navigate(`/cars/${car._id}`)}
        >
            <div>
                <h4>{car.name}</h4>

                <p>📍 {car.location}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>⭐ {car.rating}</span>
                    <span style={{ color: '#406093', fontWeight: 'bold' }}>
                        {Number(car.price).toLocaleString()}/day
                    </span>
                </div>

                <p>{car.seats} seats</p>

                <div style={{ marginTop: '8px' }}>
                    {car.tags?.map((tag, i) => (
                        <Tag key={i}>{tag}</Tag>
                    ))}
                </div>
            </div>
        </Card>
    )
}

export default CarCard