import { useState, useEffect } from 'react'
import TripCard from '../components/trip/TripCard'
import TripFilter from '../components/trip/TripFilter'
import { getMyTrips } from '../services/tripServices'


const MyTrips = () => {
    const [trips, setTrips] = useState([])
    const [filtered, setFiltered] = useState([])

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const res = await getMyTrips()

                // ✅ FIX QUAN TRỌNG
                const data = Array.isArray(res) ? res : []

                setTrips(data)
                setFiltered(data)

            } catch (err) {
                console.error(err)
                setTrips([])
                setFiltered([])
            }
        }

        fetchTrips()
    }, [])

    const handleFilter = (status) => {
        if (!status) return setFiltered(trips)
        setFiltered(trips.filter(t => t.status === status))
    }

    return (
        <div style={{ maxWidth: '800px', margin: 'auto' }}>
            <h2>My Trips</h2>

            <TripFilter onFilter={handleFilter} />

            {Array.isArray(filtered) && filtered.map(trip => (
                <TripCard key={trip._id} trip={trip} />
            ))}
        </div>
    )
}

export default MyTrips