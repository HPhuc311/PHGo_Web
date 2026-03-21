import { useEffect, useState } from 'react'
import AdminBookingTable from '../components/admin/AdminBookingTable'
import DashboardStats from '../components/admin/DashboardStats'

const AdminDashboard = () => {
    const [trips, setTrips] = useState([])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('trips')) || []
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTrips(data)
    }, [])

    return (
        <div style={{ padding: '20px' }}>
            <h2>Admin Dashboard</h2>

            <DashboardStats trips={trips} />

            <AdminBookingTable trips={trips} setTrips={setTrips} />
        </div>
    )
}

export default AdminDashboard