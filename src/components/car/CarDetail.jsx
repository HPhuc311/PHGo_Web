import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
    Row,
    Col,
    Card,
    Button,
    Spin,
    Tag,
    Divider
} from 'antd'
import {
    EnvironmentOutlined,
    CarOutlined,
    UserOutlined
} from '@ant-design/icons'

import { getCars } from '../../services/carService'
import { buildImageUrl } from '../../utils/image'
import fetchWithAuth from '../../services/api'

const CarDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [car, setCar] = useState(null)
    const [reviews, setReviews] = useState([])

    // ================= FETCH CAR =================
    const fetchCar = async () => {
        try {
            const data = await getCars()
            const found = data.find(c => c._id === id)
            setCar(found)
        } catch (err) {
            console.error(err)
        }
    }

    // ================= FETCH REVIEWS =================
    const fetchReviews = async () => {
        try {
            const res = await fetchWithAuth(`/api/cars/${id}/reviews`)
            setReviews(res)
        } catch (err) {
            console.error(err)
        }
    }

    // ================= EFFECT =================
    useEffect(() => {
        if (id) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchCar()
            fetchReviews()
        }
    }, [id])

    // ================= LOADING =================
    if (!car) {
        return (
            <div style={{ textAlign: 'center', marginTop: 100 }}>
                <Spin size="large" />
            </div>
        )
    }

    return (
        <div style={{ padding: '40px 80px' }}>
            <Row gutter={24}>

                {/* ================= LEFT ================= */}
                <Col md={16}>
                    <Card bordered={false}>

                        {/* IMAGE */}
                        <img
                            src={buildImageUrl(car.image)}
                            alt={car.name}
                            style={{
                                width: '100%',
                                height: '400px',
                                objectFit: 'cover',
                                borderRadius: '16px'
                            }}
                        />

                        {/* NAME */}
                        <h1 style={{ marginTop: 20 }}>{car.name}</h1>

                        {/* ⭐ RATING */}
                        <div style={{ marginBottom: 10 }}>
                            ⭐ {car.rating?.toFixed(1) || "0.0"} ({car.numReviews || 0} reviews)
                        </div>

                        {/* INFO */}
                        <div style={{ display: 'flex', gap: 20 }}>
                            <span>
                                <EnvironmentOutlined /> {car.location}
                            </span>

                            <span>
                                <CarOutlined /> {car.brand}
                            </span>

                            <span>
                                <UserOutlined /> {car.seats} seats
                            </span>
                        </div>

                        <Divider />

                        {/* TAGS */}
                        <div>
                            {car.tags?.map((tag, i) => (
                                <Tag key={i}>{tag}</Tag>
                            ))}
                        </div>

                        <Divider />

                        {/* DESCRIPTION */}
                        <h3>Description</h3>
                        <p style={{ color: '#666' }}>
                            Comfortable and reliable car for your trip.
                            Perfect for city rides and long journeys.
                        </p>

                        <Divider />

                        {/* ================= REVIEWS ================= */}
                        <h3>Customer Reviews</h3>

                        {reviews.length === 0 ? (
                            <p style={{ color: '#888' }}>No reviews yet</p>
                        ) : (
                            reviews.map((r) => (
                                <div
                                    key={r._id}
                                    style={{
                                        display: 'flex',
                                        gap: 12,
                                        padding: 12,
                                        borderBottom: '1px solid #eee'
                                    }}
                                >
                                    {/* AVATAR */}
                                    <img
                                        src={buildImageUrl(r.user?.avatar)}
                                        alt="avatar"
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            objectFit: 'cover'
                                        }}
                                    />

                                    {/* CONTENT */}
                                    <div>
                                        <b>{r.user?.name}</b>

                                        <div>⭐ {r.rating}</div>

                                        <p style={{ color: '#666', margin: 0 }}>
                                            {r.comment}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}

                    </Card>
                </Col>

                {/* ================= RIGHT ================= */}
                <Col md={8}>
                    <Card
                        style={{
                            borderRadius: 16,
                            position: 'sticky',
                            top: 100
                        }}
                    >
                        <h2 style={{ color: '#406093' }}>
                            {Number(car.price).toLocaleString()} VND/day
                        </h2>

                        <p style={{ color: '#888' }}>
                            Inclusive of basic insurance
                        </p>

                        <Divider />

                        <Button
                            type="primary"
                            size="large"
                            block
                            style={{
                                height: 50,
                                fontSize: 16,
                                borderRadius: 10
                            }}
                            onClick={() =>
                                navigate('/booking', { state: { car } })
                            }
                        >
                            Book Now
                        </Button>

                        <p style={{ marginTop: 10, color: '#999' }}>
                            No credit card required
                        </p>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default CarDetail