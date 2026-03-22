import { Card, Button, Tag } from 'antd'
import { cancelTrip } from '../../services/tripServices'


const TripCard = ({ trip }) => {

    const handleCancel = async () => {
        try {
            await cancelTrip(trip._id)
            window.location.reload()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Card variant="outlined" style={{ marginBottom: 10 }}>
            <h3>{trip.car}</h3>
            <Tag>{trip.status}</Tag>

            <p>{trip.pickup} → {trip.destination}</p>

            <Button danger onClick={handleCancel}>
                Cancel
            </Button>
        </Card>
    )
}

export default TripCard