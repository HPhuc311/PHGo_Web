import { Card, Radio, Button, Select, message } from 'antd'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import dayjs from 'dayjs'

const PaymentSection = ({ bookingData, onConfirm }) => {
    const { user } = useAuth()
    const [selectedCard, setSelectedCard] = useState(null)

    const pricePerDay = Number(bookingData?.car?.price || 0)
    const [start, end] = bookingData?.time || []

    const totalDays = start && end
        ? Math.ceil(dayjs(end).diff(dayjs(start), 'hour') / 24)
        : 1

    const totalPrice = pricePerDay * totalDays

    const handlePay = () => {
        if (!selectedCard) {
            return message.error("Please select a card")
        }

        onConfirm(totalPrice, selectedCard)
    }

    return (
        <Card title="Payment">

            <p>Total: {totalPrice.toLocaleString()} VND</p>

            <Select
                placeholder="Select your card"
                style={{ width: '100%' }}
                onChange={setSelectedCard}
            >
                {user.cards?.map((card, i) => (
                    <Select.Option key={i} value={card.last4}>
                        **** **** **** {card.last4}
                    </Select.Option>
                ))}
            </Select>

            <Button type="primary" block onClick={handlePay} style={{marginTop: 30}}>
                Pay Now
            </Button>
        </Card>
    )
}

export default PaymentSection