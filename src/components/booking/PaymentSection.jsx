import { Card, Radio, Button } from 'antd'

const PaymentSection = ({ bookingData, onConfirm }) => {
    const price = 1000000 + (bookingData.passengers || 1) * 50000

    return (
        <Card title="Payment">
            <p><b>Total Price:</b> {price.toLocaleString()} VND</p>

            <Radio.Group>
                <Radio value="card">Credit Card</Radio>
                <Radio value="paypal">PayPal</Radio>
            </Radio.Group>

            <Button
                type="primary"
                block
                style={{ marginTop: '20px' }}
                onClick={() => onConfirm(price)}
            >
                Pay Now
            </Button>
        </Card>
    )
}

export default PaymentSection