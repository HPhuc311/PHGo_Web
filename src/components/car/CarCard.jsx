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
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
            cover={
                <div style={{ height: 160, overflow: 'hidden' }}>
                    <img
                        src={buildImageUrl(car.image)}
                        alt={car.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                </div>
            }
            bodyStyle={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}
        >
            <div>
                {/* TITLE FIX */}
                <h4 style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: 44
                }}>
                    {car.name}
                </h4>

                {/* LOCATION */}
                <p style={{ marginBottom: 6, color: '#666' }}>
                    {car.location}
                </p>

                {/* PRICE */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 6
                }}>
                    <span>⭐ {car.rating}</span>
                    <span style={{ color: '#406093', fontWeight: 'bold' }}>
                        {Number(car.price).toLocaleString()}đ/day
                    </span>
                </div>
            </div>

            {/* FOOTER LUÔN Ở DƯỚI */}
            <div>
                <p style={{ margin: 0 }}>{car.seats} seats</p>
            </div>
        </Card>
    )
}

export default CarCard