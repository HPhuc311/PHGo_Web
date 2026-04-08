import { useState, useEffect } from 'react'
import { Card, message, Button, Typography, Divider, Space } from 'antd'
import BookingForm from '../components/booking/BookingForm'
import PaymentSection from '../components/booking/PaymentSection'
import Receipt from '../components/booking/Receipt'
import { createTrip, payTrip,} from '../services/tripServices'
import { useLocation } from 'react-router-dom'
import {
    CarOutlined,
    EnvironmentOutlined,
    UserOutlined,
    ClockCircleOutlined,
    ScheduleOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const Booking = () => {
    const [step, setStep] = useState(1)
    const [bookingData, setBookingData] = useState(null)
    const [price, setPrice] = useState(0)
    const [discount, setDiscount] = useState(0)
    const [tripId, setTripId] = useState(null)

    const location = useLocation()
    const selectedCar = location.state?.car
    const existingTrip = location.state?.trip

    const { Title, Text } = Typography

    // ================= HANDLE RETRY PAYMENT =================
    useEffect(() => {
        if (existingTrip) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setBookingData({
                pickup: existingTrip.pickup,
                destination: existingTrip.destination,
                passengers: existingTrip.passengers,
                service: existingTrip.service,
                time: [
                    dayjs(existingTrip.startTime),
                    dayjs(existingTrip.endTime)
                ],
                car: {
                    _id: existingTrip.car,
                    name: existingTrip.carName,
                    price: existingTrip.price / Math.max(
                        1,
                        dayjs(existingTrip.endTime)
                            .startOf('day')
                            .diff(dayjs(existingTrip.startTime).startOf('day'), 'day') + 1
                    )
                }
            })

            setTripId(existingTrip._id)
            setStep(3) // 👉 jump to payment
        }
    }, [existingTrip])

    // ================= CREATE TRIP (PENDING) =================
    const handleCreateTrip = async () => {
        try {
            const [start, end] = bookingData.time

            const newTrip = {
                car: bookingData.car._id,
                carName: bookingData.car.name,
                pickup: bookingData.pickup,
                destination: bookingData.destination,
                startTime: start.toISOString(),
                endTime: end.toISOString(),
                passengers: bookingData.passengers,
                service: bookingData.service,
                status: 'pending'
            }

            const res = await createTrip(newTrip)

            setTripId(res._id)
            setStep(3)

        } catch (err) {
            message.error(err.message || 'Create trip failed')
        }
    }

    // ================= PAYMENT =================
    const handlePayment = async (card, coupon) => {
        try {
            const res = await payTrip(tripId, { card, couponCode: coupon })

            setPrice(res.price) // lấy từ backend
            setDiscount(res.discountAmount || 0)
            setStep(4)
            console.log('PAYMENT RESPONSE:', res)
            message.success('Payment successful 🎉')
        } catch (err) {
            message.error(err.message || 'Payment failed ❌')
        }
    }

    return (
        <div style={{ maxWidth: '700px', margin: 'auto' }}>

            {/* STEP 1: FORM */}
            {step === 1 && (
                <Card title="Book Your Ride">
                    <BookingForm
                        car={selectedCar}
                        onNext={(data) => {
                            setBookingData({
                                ...data,
                                passengers: selectedCar.seats,
                                car: selectedCar
                            })
                            setStep(2)
                        }}
                    />
                </Card>
            )}

            {/* STEP 2: CONFIRM */}
            {step === 2 && bookingData && (
                <Card style={{ borderRadius: 16 }}>

                    <Title level={3}>Confirm Your Booking</Title>
                    <Divider />

                    <Space direction="vertical" style={{ width: '100%' }}>

                        <div style={row}>
                            <Text><CarOutlined /> Car</Text>
                            <Text strong>{bookingData.car.name}</Text>
                        </div>

                        <div style={row}>
                            <Text><EnvironmentOutlined /> Pickup</Text>
                            <Text strong>{bookingData.pickup}</Text>
                        </div>

                        {bookingData.destination && (
                            <div style={row}>
                                <Text>Destination</Text>
                                <Text strong>{bookingData.destination}</Text>
                            </div>
                        )}

                        <div style={row}>
                            <Text><UserOutlined /> Passengers</Text>
                            <Text strong>{bookingData.passengers}</Text>
                        </div>

                        <div style={row}>
                            <Text><ScheduleOutlined /> Time</Text>
                            <Text>
                                {dayjs(bookingData.time[0]).format('DD/MM HH:mm')} -{' '}
                                {dayjs(bookingData.time[1]).format('DD/MM HH:mm')}
                            </Text>
                        </div>

                        {/* TOTAL DAYS */}
                        <div style={row}>
                            <Text><ClockCircleOutlined /> Days</Text>
                            <Text strong>
                                {Math.max(
                                    1,
                                    dayjs(bookingData.time[1]).startOf('day')
                                        .diff(dayjs(bookingData.time[0]).startOf('day'), 'day') + 1
                                )}
                            </Text>
                        </div>

                    </Space>

                    <Divider />

                    <div style={{ display: 'flex', gap: 10 }}>
                        <Button block onClick={() => setStep(1)}>
                            Back
                        </Button>

                        <Button
                            type="primary"
                            block
                            onClick={handleCreateTrip}
                        >
                            Confirm & Continue
                        </Button>
                    </div>

                </Card>
            )}

            {/* STEP 3: PAYMENT */}
            {step === 3 && bookingData && (
                <PaymentSection
                    bookingData={bookingData}
                    onConfirm={handlePayment}
                    onBack={() => setStep(2)}
                />
            )}

            {/* STEP 4: RECEIPT */}
            {step === 4 && (
                <Receipt bookingData={bookingData} price={price} discount={discount}  />
            )}
        </div>
    )
}

export default Booking

const row = {
    display: 'flex',
    justifyContent: 'space-between'
}