import { Typography } from 'antd'

const { Title, Paragraph } = Typography

const HeroSection = () => {
    return (
        <div
            style={{
                position: 'relative',
                height: '420px',
                borderRadius: '20px',
                overflow: 'hidden',
                backgroundImage:
                    'url("https://images.unsplash.com/photo-1503376780353-7e6692767b70")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.4)',
                }}
            />

            <div
                style={{
                    position: 'relative',
                    textAlign: 'center',
                    top: '120px',
                    color: '#fff',
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