import {
    Card,
    Button,
    Tag,
    Modal,
    Space,
    message
} from 'antd'
import {
    EnvironmentOutlined,
    UserOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    CarOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined
} from '@ant-design/icons'

import { cancelTrip } from '../../services/tripServices'
import dayjs from 'dayjs'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ReviewForm from './ReviewForm'
import fetchWithAuth from '../../services/api'

const TripCard = ({ trip, onCancelSuccess }) => {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const [openReview, setOpenReview] = useState(false)
    const [reviewed, setReviewed] = useState(false)

    // ================= CHECK REVIEW =================
    const checkReview = async () => {
        try {
            const res = await fetchWithAuth(`/api/trips/review/${trip._id}`)
            setReviewed(res.reviewed)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        if (trip.status === 'completed') {
            checkReview()
        }
    }, [trip._id, trip.status])

    // ================= CANCEL =================
    const handleCancel = () => {
        Modal.confirm({
            title: 'Cancel Trip?',
            content: 'Are you sure you want to cancel this trip?',
            okText: 'Yes',
            cancelText: 'No',
            okType: 'danger',
            onOk: async () => {
                try {
                    setLoading(true)
                    await cancelTrip(trip._id)
                    onCancelSuccess(trip._id)
                    message.success("Trip cancelled")
                } catch (err) {
                    console.log('err:', err)
                    message.error("Cancel failed")
                } finally {
                    setLoading(false)
                }
            }
        })
    }

    // ================= STATUS UI =================
    const getStatusUI = () => {
        switch (trip.status) {
            case 'pending':
                return { color: 'gold', text: 'Waiting Payment' }
            case 'paid':
                return { color: 'blue', text: 'Paid' }
            case 'confirmed':
                return { color: 'cyan', text: 'Driver Assigned' }
            case 'on_the_way':
                return { color: 'purple', text: 'Driver Coming' }
            case 'in_progress':
                return { color: 'processing', text: 'On Trip' }
            case 'completed':
                return { color: 'green', text: 'Completed' }
            case 'cancelled':
                return { color: 'red', text: 'Cancelled' }
            default:
                return { color: 'default', text: 'Unknown' }
        }
    }

    const statusUI = getStatusUI()

    return (
        <>
            {/* ================= REVIEW MODAL ================= */}
            <Modal
                open={openReview}
                onCancel={() => setOpenReview(false)}
                footer={null}
                title="Rate your trip"
            >
                <ReviewForm
                    tripId={trip._id}
                    onSuccess={() => {
                        setOpenReview(false)
                        setReviewed(true)
                        message.success("Thanks for your review")
                    }}
                />
            </Modal>

            {/* ================= CARD ================= */}
            <Card
                hoverable
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
                    alignItems: 'center'
                }}>
                    <Space>
                        <CarOutlined style={{ fontSize: 18 }} />
                        <h3 style={{ margin: 0 }}>{trip.carName}</h3>
                    </Space>

                    <Tag color={statusUI.color}>
                        {statusUI.text}
                    </Tag>
                </div>

                {/* ROUTE */}
                <div style={{ marginTop: 10 }}>
                    <Space direction="vertical" size={2}>
                        <span>
                            <EnvironmentOutlined style={{ color: "red" }} /> {trip.pickup}
                        </span>

                        {trip.destination && (
                            <span>
                                <EnvironmentOutlined style={{ color: "#406093" }} /> {trip.destination}
                            </span>
                        )}
                    </Space>
                </div>

                {/* INFO */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 12,
                    flexWrap: 'wrap'
                }}>
                    <span>
                        <UserOutlined /> {trip.passengers} pax
                    </span>

                    <span>
                        <ClockCircleOutlined />{' '}
                        {dayjs(trip.startTime).format('DD/MM HH:mm')} -{' '}
                        {dayjs(trip.endTime).format('DD/MM HH:mm')}
                    </span>

                    <span style={{ fontWeight: 600 }}>
                        <DollarOutlined />{' '}
                        {trip.price
                            ? `${Number(trip.price).toLocaleString()} VND`
                            : 'Not paid yet'}
                    </span>
                </div>

                {/* ACTION */}
                <div style={{
                    marginTop: 16,
                    display: 'flex',
                    gap: 10,
                    flexWrap: 'wrap'
                }}>

                    {/* PAY */}
                    {trip.status === 'pending' && (
                        <Button
                            type="primary"
                            icon={<DollarOutlined />}
                            onClick={() =>
                                navigate('/booking', { state: { trip } })
                            }
                        >
                            Pay Now
                        </Button>
                    )}

                    {/* DRIVER */}
                    {trip.status === 'confirmed' && (
                        <Button icon={<UserOutlined />}>
                            View Driver
                        </Button>
                    )}

                    {/* TRACK */}
                    {trip.status === 'on_the_way' && (
                        <Button type="primary" icon={<EnvironmentOutlined />}>
                            Track
                        </Button>
                    )}

                    {/* ⭐ REVIEW */}
                    {trip.status === 'completed' && (
                        reviewed ? (
                            <Button disabled icon={<CheckCircleOutlined />}>
                                Reviewed
                            </Button>
                        ) : (
                            <Button
                                icon={<CheckCircleOutlined />}
                                onClick={() => setOpenReview(true)}
                            >
                                Review
                            </Button>
                        )
                    )}

                    {/* CANCEL */}
                    {['pending', 'paid', 'confirmed'].includes(trip.status) && (
                        <Button
                            danger
                            loading={loading}
                            icon={<CloseCircleOutlined />}
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                    )}
                </div>
            </Card>
        </>
    )
}

export default TripCard