import { useState } from 'react'
import { Card } from 'antd'
import BookingForm from '../components/booking/BookingForm'
import PaymentSection from '../components/booking/PaymentSection'
import Receipt from '../components/booking/Receipt'

const Booking = () => {
    const [step, setStep] = useState(1)
    const [bookingData, setBookingData] = useState(null)
    const [price, setPrice] = useState(0)
    const user = JSON.parse(localStorage.getItem('user'))

    const handleConfirm = (price) => {
        if (!bookingData) return
        const newTrip = {
            id: Date.now(),
            user: user,
            car: 'Selected Car',
            pickup: bookingData?.pickup,
            destination: bookingData?.destination,
            date: new Date().toLocaleDateString(),
            passengers: bookingData?.passengers,
            price: price + ' VND',
            status: 'pending'
        }

        const oldTrips = JSON.parse(localStorage.getItem('trips')) || []

        localStorage.setItem('trips', JSON.stringify([newTrip, ...oldTrips]))

        setPrice(price)
        setStep(3)
    }

    return (
        <div style={{ maxWidth: '700px', margin: 'auto' }}>

            {step === 1 && (
                <Card title="Book Your Ride">
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

            {step === 3 && (
                <Receipt bookingData={bookingData} price={price} />
            )}
        </div>
    )
}

export default Booking