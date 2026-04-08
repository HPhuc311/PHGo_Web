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

    const [cardType, setCardType] = useState('card')

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

        const validateCardNumber = (number) => {
        const cleaned = number.replace(/\s+/g, '')

        if (!/^\d{13,19}$/.test(cleaned)) return false

        let sum = 0
        let shouldDouble = false

        for (let i = cleaned.length - 1; i >= 0; i--) {
            let digit = parseInt(cleaned[i])

            if (shouldDouble) {
                digit *= 2
                if (digit > 9) digit -= 9
            }

            sum += digit
            shouldDouble = !shouldDouble
        }

        return sum % 10 === 0
    }


    const formatCardNumber = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(.{4})/g, '$1 ')
            .trim()
    }

    const detectCardType = (number) => {
        const cleaned = number.replace(/\s/g, '')

        if (cleaned.startsWith('4')) return 'visa'
        if (/^5[1-5]/.test(cleaned)) return 'mastercard'

        return 'card'
    }

    return (
        <Card title="Payment">

            {/* 👉 HIỂN THỊ GIÁ GỐC */}
            <div style={{ marginTop: 10 }}>

                {/* SUBTOTAL */}
                <div>
                    Subtotal:{" "}
                    {previewPrice
                        ? previewPrice.originalPrice.toLocaleString()
                        : totalPrice.toLocaleString()
                    } VND
                </div>

                {/* DISCOUNT */}
                {previewPrice?.discount > 0 && (
                    <div style={{ color: 'green' }}>
                        Discount: -{Math.round(previewPrice.originalPrice * previewPrice.discount / 100).toLocaleString()} VND
                    </div>
                )}

                {/* TOTAL */}
                <h3>
                    Total:{" "}
                    {previewPrice
                        ? previewPrice.finalPrice.toLocaleString()
                        : totalPrice.toLocaleString()
                    } VND
                </h3>

            </div>

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
                        rules={[{ required: true, message: 'Enter card holder name' }]}
                    >
                        <Input placeholder="Nguyen Van A" />
                    </Form.Item>

                    <Form.Item
                        name="number"
                        label="Card Number"
                        rules={[
                            { required: true, message: 'Please enter card number' },
                            {
                                validator: (_, value) => {
                                    if (!value) return Promise.resolve()

                                    if (!validateCardNumber(value)) {
                                        return Promise.reject('Invalid card number ❌')
                                    }

                                    return Promise.resolve()
                                }
                            }
                        ]}
                    >
                        <Input
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}

                            // 🔥 LOGO TRONG INPUT
                            suffix={
                                <span style={{ fontWeight: 600 }}>
                                    {cardType === 'visa' && 'VISA'}
                                    {cardType === 'mastercard' && 'MC'}
                                </span>
                            }

                            onChange={(e) => {
                                const formatted = formatCardNumber(e.target.value)
                                cardForm.setFieldsValue({ number: formatted })

                                setCardType(detectCardType(formatted))
                            }}
                        />
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
