import { useParams } from 'react-router-dom'
import { Card, Button } from 'antd'

const CarDetail = () => {
    const { id } = useParams()

    return (
        <div style={{ maxWidth: '800px', margin: 'auto' }}>
            <Card>
                <img
                    src="https://images.unsplash.com/photo-1503376780353-7e6692767b70"
                    alt="car"
                    style={{ width: '100%', borderRadius: '10px' }}
                />

                <h2 style={{ marginTop: '20px' }}>Chi tiết xe #{id}</h2>

                <p>📍 Địa điểm: Tân Bình</p>
                <p>🚗 Loại xe: 7 chỗ</p>
                <p>⭐ Đánh giá: 5.0</p>
                <p style={{ color: '#2ecc71', fontSize: '18px' }}>
                    💰 1.300.000đ/ngày
                </p>

                <Button type="primary" size="large">
                    Đặt xe ngay
                </Button>
            </Card>
        </div>
    )
}

export default CarDetail