import { Card, Button, Tag, Modal } from 'antd'
import { cancelTrip } from '../../services/tripServices'
import dayjs from 'dayjs'

const TripCard = ({ trip }) => {

    const handleCancel = () => {
        Modal.confirm({
            title: 'Cancel Trip?',
            content: 'Are you sure you want to cancel this trip?',
            okText: '  Yes, Cancel',
            cancelText: 'No',
            onOk: async () => {
                await cancelTrip(trip._id)
                window.location.reload()
            }
        })
    }

    const getStatusTag = () => {
        switch (trip.status) {
            case 'pending':
                return <Tag color="gold">Waiting</Tag>
            case 'confirmed':
                return <Tag color="green">Confirmed</Tag>
            case 'cancelled':
                return <Tag color="red">Cancelled</Tag>
            default:
                return <Tag>Unknown</Tag>
        }
    }

    return (
        <Card
            variant="outlined"
            style={{
                marginBottom: 15,
                borderRadius: 12,
                border:
                    trip.status === 'cancelled'
                        ? '1px solid #ff4d4f'
                        : trip.status === 'confirmed'
                            ? '1px solid #52c41a'
                            : '1px solid #faad14',
                background:
                    trip.status === 'cancelled'
                        ? '#fff1f0'
                        : '#fff'
            }}
        >
            <h3>{trip.carName}</h3>

            {getStatusTag()}

            <p><b>From:</b> {trip.pickup}</p>

            {trip.destination && (
                <p><b>To:</b> {trip.destination}</p>
            )}

            <p><b>Passengers:</b> {trip.passengers}</p>

            <p>
                <b>Price:</b>{" "}
                {Number(trip.price).toLocaleString()} VND
            </p>

            <p>
                <b>Date:</b>{" "}
                {dayjs(trip.startTime).format("DD/MM/YYYY HH:mm")}
                {" → "}
                {dayjs(trip.endTime).format("DD/MM/YYYY HH:mm")}
            </p>

            <p><b>Service:</b> {trip.service}</p>

            {/* ❌ Không cho cancel nếu đã huỷ */}
            {trip.status !== 'cancelled' && (
                <Button danger onClick={handleCancel}>
                    Cancel Trip
                </Button>
            )}
        </Card>
    )
}

export default TripCard