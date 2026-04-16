import { Card, Button, Typography, Result, Divider, Space } from 'antd'
import { useNavigate } from 'react-router-dom'
import {
    EnvironmentOutlined,
    UserOutlined,
    CarOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography

const Receipt = ({ bookingData, price, discount = 0 }) => {
    const navigate = useNavigate()

    if (!bookingData) return null

    // FIX: đảm bảo discount luôn là number
    const discountValue = Number(discount || 0)

    const originalPrice = Number(price || 0) + Number(discountValue || 0)

    const format = (num) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(num)


    return (
        <Card
            style={{
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                maxWidth: '600px',
                margin: '20px auto'
            }}
        >
            {/* HEADER */}
            <Result
                status="success"
                title={<Title level={2}>Thank you for Booking!</Title>}
                subTitle="Your ride request has been successfully received."
            />

            <Divider orientation="left">Trip Details</Divider>

            <div style={{ padding: '0 12px' }}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>

                    {/* PICKUP */}
                    <div style={row}>
                        <Text type="secondary">
                            <EnvironmentOutlined /> Pickup
                        </Text>
                        <Text strong>{bookingData?.pickup}</Text>
                    </div>

                    {/* DESTINATION */}
                    {bookingData?.destination && (
                        <div style={row}>
                            <Text type="secondary">
                                <EnvironmentOutlined /> Destination
                            </Text>
                            <Text strong>{bookingData?.destination}</Text>
                        </div>
                    )}

                    {/* PASSENGERS */}
                    <div style={row}>
                        <Text type="secondary">
                            <UserOutlined /> Passengers
                        </Text>
                        <Text strong>{bookingData?.passengers}</Text>
                    </div>

                    {/* SERVICE */}
                    <div style={row}>
                        <Text type="secondary">
                            <CarOutlined /> Service
                        </Text>
                        <Text strong>{bookingData?.service}</Text>
                    </div>

                    {/* ===== PRICE BOX ===== */}
                    <div style={{
                        marginTop: 16,
                        padding: 20,
                        background: '#f0f5ff',
                        borderRadius: 12,
                        border: '1px solid #adc6ff'
                    }}>

                        {/* ORIGINAL PRICE (LUÔN HIỂN THỊ) */}
                        <div style={row}>
                            <Text type="secondary">Original Price</Text>
                            <Text>
                                {format(originalPrice)}
                            </Text>
                        </div>

                        {/* DISCOUNT (CHỈ HIỆN KHI CÓ) */}
                        {discountValue > 0 && (
                            <div style={row}>
                                <Text type="secondary">Discount</Text>
                                <Text style={{ color: '#52c41a' }}>
                                    -{format(discountValue)}
                                </Text>
                            </div>
                        )}

                        <Divider style={{ margin: '12px 0' }} />

                        {/* FINAL PRICE */}
                        <div style={row}>
                            <Text strong style={{ fontSize: 18 }}>
                                Total Amount
                            </Text>
                            <Title level={3} style={{ margin: 0, color: '#1677ff' }}>
                                {format(price)}
                            </Title>
                        </div>

                        {/* VAT */}
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            ((VAT 10% included))
                        </Text>

                    </div>

                </Space>
            </div>

            <Button
                type="primary"
                size="large"
                block
                style={{
                    marginTop: 32,
                    height: 50,
                    borderRadius: 8,
                    fontWeight: 600
                }}
                onClick={() => navigate('/trips')}
            >
                View Your Trip
            </Button>
        </Card>
    )
}

export default Receipt

const row = {
    display: 'flex',
    justifyContent: 'space-between'
}