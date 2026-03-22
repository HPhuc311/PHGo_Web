import { useState } from 'react'
import { Card } from 'antd'
import BookingForm from '../components/booking/BookingForm'
import PaymentSection from '../components/booking/PaymentSection'
import Receipt from '../components/booking/Receipt'
import { createTrip } from '../services/tripServices'


const Booking = () => {
    const [step, setStep] = useState(1)
    const [bookingData, setBookingData] = useState(null)
    const [price, setPrice] = useState(0)

    const handleConfirm = async (price) => {
        if (!bookingData) return

        try {
            const newTrip = {
                car: 'Selected Car',
                pickup: bookingData.pickup,
                destination: bookingData.destination,
                date: new Date().toLocaleDateString(),
                passengers: bookingData.passengers,
                price: price + ' VND',
                // ✅ ADD
                service: bookingData.service,
            }
            await createTrip(newTrip) // ✅ dùng API

            setPrice(price)
            setStep(3)

        } catch (err) {
            console.error(err)
            alert('Booking failed')
        }
    }

    return (
        <div style={{ maxWidth: '700px', margin: 'auto' }}>
            {step === 1 && (
                <Card title="Book Your Ride" variant="outlined">
                    <BookingForm
                        onNext={(data) => {
                            setBookingData(data)
                            setStep(2)
                        }}
                    />
                </Card>
            )}

            {step === 2 && bookingData && (
                <PaymentSection
                    bookingData={bookingData}
                    onConfirm={handleConfirm}
                />
            )}

            {step === 3 && bookingData && (
                <Receipt bookingData={bookingData} price={price} />
            )}
        </div>
    )
}

export default Booking