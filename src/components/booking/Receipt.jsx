import { Card, Button } from 'antd'

const Receipt = ({ bookingData, price }) => {
    if (!bookingData) return null // ✅ FIX CRASH

    return (
        <Card title="Booking Receipt" variant="outlined">
            <p><b>Pickup:</b> {bookingData?.pickup}</p>
            <p><b>Destination:</b> {bookingData?.destination}</p>
            <p><b>Passengers:</b> {bookingData?.passengers}</p>
            <p><b>Service:</b> {bookingData?.service}</p>

            <h3>Total: {price?.toLocaleString()} VND</h3>

            <Button type="primary">Print Receipt</Button>
        </Card>
    )
}

export default Receipt