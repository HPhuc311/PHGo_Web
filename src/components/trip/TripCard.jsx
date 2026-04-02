import { Card, Button, Tag, Modal } from 'antd'
import { cancelTrip } from '../../services/tripServices'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TripCard = ({ trip, onCancelSuccess }) => {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleCancel = () => {
        Modal.confirm({
            title: 'Cancel Trip?',
            content: 'Are you sure you want to cancel this trip?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: async () => {
                setLoading(true)
                await cancelTrip(trip._id)
                onCancelSuccess(trip._id)
                setLoading(false)
            }
        })
    }

    // 🔥 STATUS UI
    const getStatusUI = () => {
        switch (trip.status) {
            case 'pending':
                return { color: 'gold', text: 'Waiting Payment', desc: 'Please complete payment' }

            case 'paid':
                return { color: 'blue', text: 'Paid', desc: 'Waiting for driver' }

            case 'confirmed':
                return { color: 'cyan', text: 'Driver Assigned', desc: 'Driver will arrive soon' }

            case 'on_the_way':
                return { color: 'purple', text: 'Driver Coming', desc: 'Driver is on the way' }

            case 'in_progress':
                return { color: 'processing', text: 'On Trip', desc: 'Enjoy your ride' }

            case 'completed':
                return { color: 'green', text: 'Completed', desc: 'Trip finished' }

            case 'cancelled':
                return { color: 'red', text: 'Cancelled', desc: 'Trip cancelled' }

            default:
                return { color: 'default', text: 'Unknown', desc: '' }
        }
    }

    const statusUI = getStatusUI()

    return (
        <Card
            style={{
                marginBottom: 16,
                borderRadius: 16,
                boxShadow: '0 6px 20px rgba(0,0,0,0.06)'
            }}
        >
            {/* HEADER */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 8
            }}>
                <h3 style={{ margin: 0 }}>{trip.carName}</h3>
                <Tag color={statusUI.color}>{statusUI.text}</Tag>
            </div>

            <p style={{ color: '#888', marginBottom: 10 }}>
                {statusUI.desc}
            </p>

            {/* ROUTE */}
            <div style={{ marginBottom: 10 }}>
                <p style={{ margin: 0 }}>📍 {trip.pickup}</p>
                {trip.destination && (
                    <p style={{ margin: 0 }}>➡️ {trip.destination}</p>
                )}
            </div>

            {/* INFO */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                marginBottom: 10
            }}>
                <span>👤 {trip.passengers} pax</span>
                <span>
                    🕒 {dayjs(trip.startTime).format("DD/MM HH:mm")}
                </span>
                <span style={{ fontWeight: 'bold' }}>
                    💰 {Number(trip.price).toLocaleString()} VND
                </span>
            </div>

            {/* ACTION */}
            <div style={{ display: 'flex', gap: 10 }}>

                {trip.status === 'pending' && (
                    <Button type="primary" onClick={() => navigate('/booking', { state: { trip } })}>
                        Pay Now
                    </Button>
                )}

                {trip.status === 'confirmed' && (
                    <Button>
                        View Driver
                    </Button>
                )}

                {trip.status === 'on_the_way' && (
                    <Button type="primary">
                        Track
                    </Button>
                )}

                {trip.status === 'completed' && (
                    <Button>
                        Review
                    </Button>
                )}

                {['pending', 'paid', 'confirmed'].includes(trip.status) && (
                    <Button
                        danger
                        loading={loading}
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                )}

            </div>
        </Card>
    )
}

export default TripCard