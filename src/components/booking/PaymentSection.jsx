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

    const [coupon, setCoupon] = useState("")
    const [checkingCoupon, setCheckingCoupon] = useState(false)

    const pricePerDay = Number(bookingData?.car?.price || 0)
    const [start, end] = bookingData?.time || []

    const [previewPrice, setPreviewPrice] = useState(null)

    const totalDays = Math.max(
        1,
        dayjs(end).startOf('day').diff(
            dayjs(start).startOf('day'),
            'day'
        ) + 1
    )

    // 👉 chỉ hiển thị base price (KHÔNG tính discount ở FE)
    const totalPrice = pricePerDay * totalDays

    // ================= ADD CARD =================
    const handleAddCard = async (values) => {
        try {
            const res = await fetchWithAuth('/api/user/add-card', {
                method: 'POST',
                body: JSON.stringify(values)
            })

            updateProfile({
                ...user,
                cards: res.cards
            })
            message.destroy()
            message.success("Card added 💳")

            const newCard = res.cards[res.cards.length - 1]
            setSelectedCard(newCard.last4)

            setOpenAddCard(false)
            cardForm.resetFields()

        } catch (err) {
            message.destroy()
            message.error(err.message || "Add card failed ❌")
        }
    }

    // ================= APPLY COUPON (OPTIONAL CHECK) =================
    const handleApplyCoupon = async () => {
        if (!coupon) return message.error("Enter coupon code")

        try {
            setCheckingCoupon(true)

            const res = await fetchWithAuth('/api/trips/preview-price', {
                method: 'POST',
                body: JSON.stringify({
                    carId: bookingData.car._id,
                    startTime: bookingData.time[0].toISOString(),
                    endTime: bookingData.time[1].toISOString(),
                    couponCode: coupon
                })
            })

            setPreviewPrice(res)
            message.destroy()
            message.success(`Discount ${res.discount}% applied 🎉`)

        } catch (err) {
            setPreviewPrice(null)
            message.destroy()
            message.error(err.message || "Coupon invalid ❌")

        } finally {
            setCheckingCoupon(false)
        }
    }

    // ================= PAY =================
    const handlePay = async () => {
        if (!selectedCard) {
            return message.error("Please select a card")
        }

        try {
            setLoading(true)

            // 👉 chỉ gửi coupon + card lên backend
            await onConfirm(selectedCard, coupon)

        } catch (err) {
            message.destroy()
            message.error(err.message || "Payment failed ❌")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card title="Payment">

            {/* 👉 HIỂN THỊ GIÁ GỐC */}
            <h3>
                Total:{" "}
                {previewPrice
                    ? (
                        <>
                            <span style={{ textDecoration: 'line-through', marginRight: 8 }}>
                                {previewPrice.originalPrice.toLocaleString()}
                            </span>
                            <span style={{ color: 'green' }}>
                                {previewPrice.finalPrice.toLocaleString()} VND
                            </span>
                        </>
                    )
                    : `${totalPrice.toLocaleString()} VND`
                }
            </h3>

            {/* COUPON */}
            <Input
                placeholder="Enter coupon code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                style={{ marginTop: 10 }}
            />

            <Button
                onClick={handleApplyCoupon}
                loading={checkingCoupon}
                style={{ marginTop: 10 }}
            >
                Apply Coupon
            </Button>

            {/* SELECT CARD */}
            <Select
                placeholder="Select your card"
                style={{ width: '100%', marginTop: 20 }}
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
