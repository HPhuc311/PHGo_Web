import { useState, useEffect } from 'react'
import TripCard from '../components/trip/TripCard'
import TripFilter from '../components/trip/TripFilter'

const MyTrips = () => {
    const [trips, setTrips] = useState([])
    const [filtered, setFiltered] = useState([])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('trips')) || []
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTrips(data)
        setFiltered(data)
    }, [])

    const handleFilter = (status) => {
        if (!status) return setFiltered(trips)

        setFiltered(trips.filter(t => t.status === status))
    }

    return (
        <div style={{ maxWidth: '800px', margin: 'auto' }}>
            <h2>My Trips</h2>

            <div style={{ marginBottom: '20px' }}>
                <TripFilter onFilter={handleFilter} />
            </div>

            {filtered.map(trip => (
                <TripCard key={trip.id} trip={trip} />
            ))}
        </div>
    )
}

export default MyTrips