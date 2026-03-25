import { Card } from 'antd'

const StepCard = ({ step, title, description, icon }) => {
    return (
        <Card
            bordered={false}
            style={{
                textAlign: 'center',
                borderRadius: '16px',
                height: '100%',
            }}
        >
            <div style={{ fontSize: '50px' }}>{icon}</div>

            <h4 style={{ marginTop: '10px' }}>
                <span style={{ color: '#406093', marginRight: '5px' }}>
                    {step}
                </span>
                {title}
            </h4>

            <p style={{ color: '#666' }}>{description}</p>
        </Card>
    )
}

export default StepCard