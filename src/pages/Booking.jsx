import { useState } from 'react'
import { Card, message } from 'antd'
import BookingForm from '../components/booking/BookingForm'
import PaymentSection from '../components/booking/PaymentSection'
import Receipt from '../components/booking/Receipt'
import { createTrip } from '../services/tripServices'
import { useLocation } from 'react-router-dom'


const Booking = () => {
    const [step, setStep] = useState(1)
    const [bookingData, setBookingData] = useState(null)
    const [price, setPrice] = useState(0)
    const location = useLocation()
    const selectedCar = location.state?.car
    const [bookingError, setBookingError] = useState(null)

    const handleConfirm = async (totalPrice) => {
        if (!bookingData || !selectedCar) return

        try {
            const [start, end] = bookingData.time || []

            if (!start || !end) {
                alert("Please select date & time ❌")
                return
            }

            const newTrip = {
                car: selectedCar._id,
                carName: selectedCar.name,

                pickup: bookingData.pickup,
                destination: bookingData.destination,

                // 🔥 QUAN TRỌNG
                startTime: start.toISOString(),
                endTime: end.toISOString(),

                passengers: bookingData.passengers,
                price: totalPrice,
                service: bookingData.service,
            }

            setBookingError(null)
            await createTrip(newTrip)
            setPrice(totalPrice)
            setStep(3)
            
        } catch (err) {
            setBookingError(err.message)
            message.error(
                err?.message || "This time slot is already booked ❌"
            )
        }
    }

    const handleBack = () => {
        setStep(1)
    }

    return (
        <div style={{ maxWidth: '700px', margin: 'auto' }}>
            {step === 1 && (
                <Card title="Book Your Ride" variant="outlined">
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

            {step === 2 && bookingData && (
                <PaymentSection
                    bookingError={bookingError}
                    bookingData={bookingData}
                    onConfirm={handleConfirm}
                    onBack={handleBack}
                />
            )}

            {step === 3 && bookingData && (
                <Receipt bookingData={bookingData} price={price} />
            )}
        </div>
    )
}

export default Booking