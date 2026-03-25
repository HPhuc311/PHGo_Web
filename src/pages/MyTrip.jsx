import { useState, useEffect } from 'react'
import { Tabs, Empty, Spin } from 'antd'
import { getMyTrips } from '../services/tripServices'
import TripCard from '../components/trip/TripCard'

const MyTrips = () => {
    const [trips, setTrips] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const res = await getMyTrips()
                setTrips(Array.isArray(res) ? res : [])
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchTrips()
    }, [])

    const renderTrips = (status) => {
        const filtered = trips.filter(t => t.status === status)

        if (filtered.length === 0) {
            return <Empty description="No trips found" />
        }

        return filtered.map(trip => (
            <TripCard key={trip._id} trip={trip} />
        ))
    }

    const items = [
        {
            key: 'pending',
            label: 'Waiting',
            children: renderTrips('pending')
        },
        {
            key: 'confirmed',
            label: 'Confirmed',
            children: renderTrips('confirmed')
        },
        {
            key: 'cancelled',
            label: 'Cancelled',
            children: renderTrips('cancelled')
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
        <div style={{ maxWidth: '900px', margin: 'auto' }}>
            <h2>My Trips</h2>

            <Tabs defaultActiveKey="pending" items={items} />
        </div>
    )
}

export default MyTrips