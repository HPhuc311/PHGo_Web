import { useState } from 'react'
import { Card } from 'antd'
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

    const handleConfirm = async () => {
        if (!bookingData || !selectedCar) return

        try {
            const [start, end] = bookingData.time || []

            const newTrip = {
                car: selectedCar._id, // lưu id
                carName: selectedCar.name, // ✅ lưu tên để hiển thị

                pickup: bookingData.pickup,
                destination: bookingData.destination,

                date: `${start?.format('DD-MM-YYYY HH:mm')} - ${end?.format('DD-MM-YYYY HH:mm')}`,

                passengers: bookingData.passengers,
                price: selectedCar.price, // lấy từ xe
                service: bookingData.service,
            }

            await createTrip(newTrip)

            setPrice(selectedCar.price)
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
                            setBookingData({
                                ...data,
                                passengers: selectedCar.seats, // ✅ tự set
                                car: selectedCar 
                            })
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