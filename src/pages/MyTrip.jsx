import { useState, useEffect } from 'react'
import { Tabs, Empty, Spin, Button } from 'antd'
import { getMyTrips } from '../services/tripServices'
import TripCard from '../components/trip/TripCard'
import { useNavigate } from 'react-router-dom'

const MyTrips = () => {
    const [trips, setTrips] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const res = await getMyTrips()

                const data = Array.isArray(res)
                    ? res
                    : res?.trips || []

                // 🔥 sort mới nhất lên trên
                const sorted = data.sort(
                    (a, b) => new Date(b.startTime) - new Date(a.startTime)
                )

                setTrips(sorted)

            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchTrips()
    }, [])

    // 🔥 update sau khi cancel
    const handleCancelSuccess = (id) => {
        setTrips(prev =>
            prev.map(t =>
                t._id === id ? { ...t, status: 'cancelled' } : t
            )
        )
    }

    // 🔥 group theo UX
    const getTripsByGroup = (group) => {
        if (group === 'upcoming') {
            return trips.filter(t =>
                ['pending', 'paid', 'confirmed', 'on_the_way', 'in_progress']
                    .includes(t.status || 'pending')
            )
        }

        if (group === 'history') {
            return trips.filter(t => t.status === 'completed')
        }

        if (group === 'cancelled') {
            return trips.filter(t => t.status === 'cancelled')
        }

        return []
    }

    const renderList = (list) => {
        if (list.length === 0) {
            return (
                <Empty description="No trips here 🚗">
                    <Button
                        type="primary"
                        onClick={() => navigate('/cars-list')}
                    >
                        Book Now
                    </Button>
                </Empty>
            )
        }

        return list.map(trip => (
            <TripCard
                key={trip._id}
                trip={trip}
                onCancelSuccess={handleCancelSuccess}
            />
        ))
    }

    const items = [
        {
            key: 'upcoming',
            label: '🚗 Upcoming',
            children: renderList(getTripsByGroup('upcoming'))
        },
        {
            key: 'history',
            label: '📜 History',
            children: renderList(getTripsByGroup('history'))
        },
        {
            key: 'cancelled',
            label: '❌ Cancelled',
            children: renderList(getTripsByGroup('cancelled'))
        }
    ]

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: 100 }}>
                <Spin size="large" />
            </div>
        )
    }

    return (
        <div style={{
            maxWidth: 800,
            margin: 'auto',
            padding: '20px'
        }}>
            <h2 style={{ marginBottom: 20 }}>My Trips</h2>

            <Tabs
                defaultActiveKey="upcoming"
                items={items}
            />
        </div>
    )
}

export default MyTrips