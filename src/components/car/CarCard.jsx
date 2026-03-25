import { Card, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'
import { buildImageUrl } from '../../utils/image'

const CarCard = ({ car }) => {
    const navigate = useNavigate()

    return (
        <Card
            hoverable
            onClick={() => navigate(`/cars/${car._id}`)}
            // 1. FIX KÍCH THƯỚC THẺ TẠI ĐÂY
            style={{ 
                borderRadius: '16px', 
                height: '380px', // Đặt chiều cao cố định tổng thể
                display: 'flex', 
                flexDirection: 'column', // Để phần body có thể flex
                overflow: 'hidden' // Đảm bảo nội dung không tràn ra ngoài bo góc
            }}
            // 2. TỐI ƯU HÌNH ẢNH
            cover={
                <div style={{ height: '140px', overflow: 'hidden' }}> {/* Khung chứa ảnh cố định */}
                    <img
                        src={buildImageUrl(car.image)}
                        alt={car.name}
                        style={{ 
                            width: "100%" , 
                            height: "100%", // Chiều cao 100% của khung chứa
                            objectFit: "cover", // Đảm bảo ảnh không bị méo
                            borderTopLeftRadius: "16px", // Bo góc trên
                            borderTopRightRadius: "16px"
                        }}
                    />
                </div>
            }
            // 3. FIX CHIỀU CAO NỘI DUNG
            bodyStyle={{ 
                padding: '16px', 
                flex: 1, // Chiếm phần còn lại của Card
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between' // Đẩy các phần xa nhau ra
            }}
        >
            <div>
                {/* 4. XỬ LÝ TÊN XE QUÁ DÀI */}
                <h4 style={{ 
                    marginBottom: '8px',
                    display: '-webkit-box',
                    WebkitLineClamp: 1, // Chỉ hiện 1 dòng
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis' // Hiện dấu ...
                }}>
                    {car.name}
                </h4>

                {/* 5. XỬ LÝ ĐỊA ĐIỂM QUÁ DÀI */}
                <p style={{ 
                    marginBottom: '8px', 
                    color: '#666',
                    display: '-webkit-box',
                    WebkitLineClamp: 1, // Chỉ hiện 1 dòng
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    📍 {car.location}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>⭐ {car.rating}</span>
                    <span style={{ color: '#406093', fontWeight: 'bold' }}>
                        {Number(car.price).toLocaleString()}đ/day
                    </span>
                </div>

                <p style={{ marginBottom: '8px' }}>{car.seats} seats</p>
            </div>

            {/* 6. CỐ ĐỊNH VÙNG TAGS */}
            <div style={{ 
                marginTop: 'auto', // Đẩy xuống đáy
                height: '32px', // Chiều cao cố định cho vùng tag (đủ cho 1 dòng)
                overflow: 'hidden', // Ẩn các tag bị thừa sang dòng 2
                display: 'flex',
                flexWrap: 'wrap', // Cho phép các tag nằm trên 1 dòng
                gap: '4px' // Khoảng cách giữa các tag
            }}>
                {car.tags?.map((tag, i) => (
                    // Style tag để không bị quá to
                    <Tag key={i} style={{ marginRight: 0, fontSize: '12px' }}>{tag}</Tag>
                ))}
            </div>
        </Card>
    )
}

export default CarCard