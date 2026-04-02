import { Card, Button, Select, message, Modal, Form, Input } from 'antd'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import dayjs from 'dayjs'
import fetchWithAuth from '../../services/api'

const PaymentSection = ({ bookingData, onConfirm, onBack, bookingError }) => {
    const { user, updateProfile } = useAuth()

    const [selectedCard, setSelectedCard] = useState(null)
    const [loading, setLoading] = useState(false)

    const [openAddCard, setOpenAddCard] = useState(false)
    const [cardForm] = Form.useForm()

    const pricePerDay = Number(bookingData?.car?.price || 0)
    const [start, end] = bookingData?.time || []

    const totalDays = Math.max(
        1,
        Math.ceil(dayjs(end).diff(dayjs(start), 'hour') / 24)
    )

    const totalPrice = pricePerDay * totalDays

    // ================= ADD CARD =================
    const handleAddCard = async (values) => {
        try {
            const res = await fetchWithAuth('/api/user/add-card', {
                method: 'POST',
                body: JSON.stringify(values)
            })

            // 🔥 update global user
            updateProfile({
                ...user,
                cards: res.cards
            })

            message.success("Card added 💳")

            // 🔥 auto select card mới
            const newCard = res.cards[res.cards.length - 1]
            setSelectedCard(newCard.last4)

            setOpenAddCard(false)
            cardForm.resetFields()

        } catch (err) {
            message.error(err.message || "Add card failed ❌")
        }
    }

    // ================= PAY =================
    const handlePay = async () => {
        if (!selectedCard) {
            return message.error("Please select a card")
        }

        setLoading(true)
        await onConfirm(totalPrice, selectedCard)
        setLoading(false)
    }

    return (
        <Card title="Payment">

            <h3>Total: {totalPrice.toLocaleString()} VND</h3>

            {/* SELECT CARD */}
            <Select
                placeholder="Select your card"
                style={{ width: '100%' }}
                value={selectedCard}
                onChange={setSelectedCard}
                dropdownRender={(menu) => (
                    <>
                        {menu}

                        <div style={{ padding: 8 }}>
                            <Button
                                type="dashed"
                                block
                                onClick={() => setOpenAddCard(true)}
                            >
                                + Add new card
                            </Button>
                        </div>
                    </>
                )}
            >
                {user.cards?.map((card, i) => (
                    <Select.Option key={i} value={card.last4}>
                        💳 **** **** **** {card.last4}
                    </Select.Option>
                ))}
            </Select>

            {/* PAY BUTTON */}
            <Button
                type="primary"
                block
                loading={loading}
                onClick={handlePay}
                style={{ marginTop: 20 }}
            >
                Pay Now
            </Button>

            {/* BACK BUTTON */}
            {bookingError && (
                <Button block onClick={onBack} style={{ marginTop: 10 }}>
                    ← Back
                </Button>
            )}

            {/* ================= MODAL ADD CARD ================= */}
            <Modal
                title="Add New Card"
                open={openAddCard}
                onCancel={() => setOpenAddCard(false)}
                footer={null}
            >
                <Form
                    form={cardForm}
                    layout="vertical"
                    onFinish={handleAddCard}
                >
                    <Form.Item
                        name="holder"
                        label="Card Holder"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="Nguyen Van A" />
                    </Form.Item>

                    <Form.Item
                        name="number"
                        label="Card Number"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="1234 5678 9012 3456" />
                    </Form.Item>

                    <Form.Item
                        name="expiry"
                        label="Expiry"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="MM/YY" />
                    </Form.Item>

                    <Form.Item
                        name="cvv"
                        label="CVV"
                        rules={[{ required: true }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block>
                        Save Card
                    </Button>
                </Form>
            </Modal>
        </Card>
    )
}

export default PaymentSection