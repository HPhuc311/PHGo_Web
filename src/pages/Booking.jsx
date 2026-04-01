import { useState } from 'react'
import {Card, message, Button, Typography, Divider, Space} from 'antd'
import BookingForm from '../components/booking/BookingForm'
import PaymentSection from '../components/booking/PaymentSection'
import Receipt from '../components/booking/Receipt'
import { createTrip } from '../services/tripServices'
import { useLocation } from 'react-router-dom'
import {
    CarOutlined,
    EnvironmentOutlined,
    UserOutlined,
    ClockCircleOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const Booking = () => {
    const [step, setStep] = useState(1)
    const [bookingData, setBookingData] = useState(null)
    const [price, setPrice] = useState(0)
    const location = useLocation()
    const selectedCar = location.state?.car
    const [bookingError, setBookingError] = useState(null)
    const { Title, Text } = Typography

    // 🔥 GIỮ NGUYÊN LOGIC CŨ
    const handleConfirm = async (totalPrice) => {
        if (!bookingData || !selectedCar) return

        try {
            const [start, end] = bookingData.time || []

            if (!start || !end) {
                alert("Please select date & time")
                return
            }

            const newTrip = {
                car: selectedCar._id,
                carName: selectedCar.name,

                pickup: bookingData.pickup,
                destination: bookingData.destination,

                startTime: start.toISOString(),
                endTime: end.toISOString(),

                passengers: bookingData.passengers,
                price: totalPrice,
                service: bookingData.service,
            }

            setBookingError(null)
            await createTrip(newTrip)

            setPrice(totalPrice)
            setStep(4)

        } catch (err) {
            setBookingError(err.message)
            message.error(
                err?.message || "This time slot is already booked "
            )
        }
    }

    // const handleBack = () => {
    //     setStep(1)
    // }

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

            {/* STEP 2: CONFIRM (NEW) */}
            {step === 2 && bookingData && (
                <Card
                    style={{
                        borderRadius: 16,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
                    }}
                >

                    {/* HEADER */}
                    <Title level={3} style={{ marginBottom: 0 }}>
                        Confirm Your Booking
                    </Title>
                    <Text type="secondary">
                        Please review your trip details before payment
                    </Text>

                    <Divider />

                    {/* MAIN INFO */}
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>

                        {/* CAR */}
                        <div style={rowStyle}>
                            <Text type="secondary">
                                <CarOutlined /> Car
                            </Text>
                            <Text strong>{selectedCar?.name}</Text>
                        </div>

                        {/* PICKUP */}
                        <div style={rowStyle}>
                            <Text type="secondary">
                                <EnvironmentOutlined /> Pickup
                            </Text>
                            <Text strong>{bookingData.pickup}</Text>
                        </div>

                        {/* DESTINATION */}
                        {bookingData.destination && (
                            <div style={rowStyle}>
                                <Text type="secondary">
                                    <EnvironmentOutlined /> Destination
                                </Text>
                                <Text strong>{bookingData.destination}</Text>
                            </div>
                        )}

                        {/* PASSENGERS */}
                        <div style={rowStyle}>
                            <Text type="secondary">
                                <UserOutlined /> Passengers
                            </Text>
                            <Text strong>{bookingData.passengers}</Text>
                        </div>

                        {/* TIME */}
                        <div style={rowStyle}>
                            <Text type="secondary">
                                <ClockCircleOutlined /> Time
                            </Text>
                            <Text strong>
                                {dayjs(bookingData.time?.[0]).format('DD/MM HH:mm')} -{" "}
                                {dayjs(bookingData.time?.[1]).format('DD/MM HH:mm')}
                            </Text>
                        </div>

                    </Space>

                    <Divider />

                    {/* PRICE BOX */}
                    <div
                        style={{
                            background: '#f0f5ff',
                            padding: 20,
                            borderRadius: 12,
                            border: '1px solid #adc6ff',
                            marginBottom: 20
                        }}
                    >
                        <Text type="secondary">Total Price</Text>
                        <Title level={3} style={{ margin: 0, color: '#1677ff' }}>
                            {(
                                Number(selectedCar?.price || 0) *
                                Math.max(
                                    1,
                                    dayjs(bookingData.time?.[1]).diff(
                                        dayjs(bookingData.time?.[0]),
                                        'day'
                                    ) + 1
                                )
                            ).toLocaleString()} VND
                        </Title>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div style={{ display: 'flex', gap: 12 }}>
                        <Button
                            size="large"
                            block
                            onClick={() => setStep(1)}
                        >
                            ← Back
                        </Button>

                        <Button
                            type="primary"
                            size="large"
                            block
                            style={{ fontWeight: 600 }}
                            onClick={() => setStep(3)}
                        >
                            Confirm & Continue →
                        </Button>
                    </div>

                </Card>
            )}

            {/* STEP 3: PAYMENT */}
            {step === 3 && bookingData && (
                <PaymentSection
                    bookingError={bookingError}
                    bookingData={bookingData}
                    onConfirm={handleConfirm}
                    onBack={() => setStep(2)} // 👉 quay lại confirm
                />
            )}

            {/* STEP 4: RECEIPT */}
            {step === 4 && bookingData && (
                <Receipt bookingData={bookingData} price={price} />
            )}
        </div>
    )
}

export default Booking


const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
}