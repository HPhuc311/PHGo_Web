import { Card } from 'antd'

const FeatureCard = ({ icon, title, description }) => {
    return (
        <Card
            bordered={false}
            style={{
                textAlign: 'center',
                borderRadius: '16px',
                height: '100%',
            }}
        >
            <div style={{ fontSize: '60px' }}>{icon}</div>

            <h3 style={{ marginTop: '15px' }}>{title}</h3>

            <p style={{ color: '#666' }}>{description}</p>
        </Card>
    )
}

export default FeatureCard