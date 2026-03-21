import { Card, Tag, Button } from 'antd'

const getStatusColor = (status) => {
    switch (status) {
        case 'pending': return 'orange'
        case 'processing': return 'blue'
        case 'confirmed': return 'cyan'
        case 'unpaid': return 'red'
        case 'paid': return 'green'
        case 'completed': return 'success'
        default: return 'default'
    }
}

const TripCard = ({ trip }) => {

    const handleCancel = () => {
        const trips = JSON.parse(localStorage.getItem('trips')) || []

        const updated = trips.map(t =>
            t.id === trip.id ? { ...t, status: 'cancelled' } : t
        )

        localStorage.setItem('trips', JSON.stringify(updated))
        window.location.reload()
    }

    return (
        <Card style={{ marginBottom: '15px', borderRadius: '16px' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3>{trip.car}</h3>
                <Tag color={getStatusColor(trip.status)}>
                    {trip.status.toUpperCase()}
                </Tag>
            </div>

            <p>📍 {trip.pickup} → {trip.destination}</p>
            <p>🕒 {trip.date}</p>

            <p>👥 {trip.passengers} passengers</p>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>💰 <b>{trip.price}</b></span>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button size="small">View</Button>

                    {trip.status !== 'completed' && (
                        <Button size="small" danger onClick={handleCancel}>
                            Cancel
                        </Button>
                    )}

                    {trip.status === 'completed' && (
                        <Button size="small" type="primary">Review</Button>
                    )}
                </div>
            </div>

        </Card>
    )
}

export default TripCard