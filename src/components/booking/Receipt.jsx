import { Card, Button, Typography, Result, Divider, Space } from 'antd'
import { useNavigate } from 'react-router-dom'
import { CalendarOutlined, EnvironmentOutlined, UserOutlined, CarOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const Receipt = ({ bookingData, price }) => {
    const navigate = useNavigate()

    if (!bookingData) return null

    return (
        <Card
            style={{
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                maxWidth: '600px',
                margin: '20px auto'
            }}
        >
            {/* H2: Thank you for Booking */}
            <Result
                status="success"
                title={<Title level={2} style={{ margin: 0 }}>Thank you for Booking!</Title>}
                subTitle="Your ride request has been successfully received and processed."
            />

            <Divider orientation="left" plain>Trip Details</Divider>

            <div style={{ padding: '0 12px' }}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary"><EnvironmentOutlined /> Pickup</Text>
                        <Text strong>{bookingData?.pickup}</Text>
                    </div>

                    {bookingData?.service !== 'Daily Hire' && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text type="secondary"><EnvironmentOutlined /> Destination</Text>
                            <Text strong>{bookingData?.destination}</Text>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary"><UserOutlined /> Passengers</Text>
                        <Text strong>{bookingData?.passengers} Person(s)</Text>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary"><CarOutlined /> Service Type</Text>
                        <Text strong>{bookingData?.service}</Text>
                    </div>

                    <div style={{
                        marginTop: '16px',
                        padding: '20px',
                        background: '#f0f5ff',
                        borderRadius: '12px',
                        border: '1px solid #adc6ff'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text strong style={{ fontSize: '18px' }}>Total Amount</Text>
                            <Title level={3} style={{ margin: 0, color: '#1677ff' }}>
                                {price?.toLocaleString()} VND
                            </Title>
                        </div>
                    </div>
                </Space>
            </div>

            {/* Changed from Print Receipt to View Your Trip */}
            <Button
                type="primary"
                size="large"
                block
                style={{
                    marginTop: '32px',
                    height: '50px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '16px'
                }}
                onClick={() => navigate('/trips')}
            >
                View Your Trip
            </Button>
        </Card>
    )
}

export default Receipt