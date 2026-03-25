import { Card, Radio, Button } from 'antd'
import dayjs from 'dayjs'

const PaymentSection = ({ bookingData, onConfirm, loading }) => {
    const pricePerDay = Number(bookingData?.car?.price || 0)

    // lấy thời gian
    const [start, end] = bookingData?.time || []

    // tính số ngày (tối thiểu 1 ngày)
    const totalDays = start && end
        ? Math.max(1, dayjs(end).diff(dayjs(start), 'day') + 1)
        : 1

    // tổng tiền
    const totalPrice = pricePerDay * totalDays

    return (
        <Card title="Payment">
            <p><b>Price / day:</b> {pricePerDay.toLocaleString()} VND</p>
            <p><b>Total days:</b> {totalDays} day(s)</p>

            <h3>
                Total Price: {totalPrice.toLocaleString()} VND
            </h3>

            <Radio.Group>
                <Radio value="card">Credit Card</Radio>
                <Radio value="paypal">PayPal</Radio>
            </Radio.Group>

            <Button
                type="primary"
                block
                loading={loading}
                style={{ marginTop: '20px' }}
                onClick={() => onConfirm(totalPrice)} // 🔥 truyền đúng giá
            >
                Pay Now
            </Button>
        </Card>
    )
}

export default PaymentSection