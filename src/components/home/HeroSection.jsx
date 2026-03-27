import { Typography } from 'antd'

const { Title, Paragraph } = Typography

const HeroSection = () => {
    return (
        <div
            style={{
                position: 'relative',
                height: '420px',
                borderRadius: '20px',
                overflow: 'hidden', // Quan trọng để ngăn phần mờ tràn ra ngoài border-radius
            }}
        >
            {/* Lớp nền hình ảnh (Áp dụng làm mờ ở đây) */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'url("./images/page.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'bottom',
                    filter: 'blur(3px)', // Độ mờ: tăng số này nếu muốn mờ hơn
                    transform: 'scale(1.1)', // Phóng to nhẹ để tránh các cạnh bị trắng do hiệu ứng blur
                    zIndex: 0,
                }}
            />

            {/* Lớp phủ màu tối (Overlay) */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.43)',
                    zIndex: 1,
                }}
            />

            {/* Nội dung chữ (Giữ nguyên độ sắc nét) */}
            <div
                style={{
                    position: 'relative',
                    textAlign: 'center',
                    top: '120px',
                    color: '#fff',
                    zIndex: 2,
                }}
            >
                <Title style={{ color: '#fff' }}>
                    PHGo – With You <br /> on Every Journey
                </Title>

                <Paragraph style={{ color: '#fff', fontSize: 16 }}>
                    Experience the difference with over <span style={{ color: '#406093' }}>10,000</span> modern family cars across Vietnam
                </Paragraph>
            </div>
        </div>
    )
}

export default HeroSection