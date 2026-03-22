import { useEffect, useState } from "react"
import AdminUserTable from "../components/admin/AdminUserTable"
import { getAllTrips, updateTripStatus } from "../services/tripServices"

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("users")
    const [trips, setTrips] = useState([])

    const fetchTrips = async () => {
        const data = await getAllTrips()
        setTrips(data)
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchTrips()
    }, [])

    const handleChangeStatus = async (id, status) => {
        await updateTripStatus(id, status)
        fetchTrips()
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "#facc15"
            case "confirmed":
                return "#22c55e"
            case "completed":
                return "#3b82f6"
            case "cancelled":
                return "#ef4444"
            default:
                return "#ccc"
        }
    }

    return (
        <div style={{ padding: 20, fontFamily: "Arial" }}>
            <h1>🚀 Admin Dashboard</h1>

            {/* STATS */}
            <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
                <div style={cardStyle}>
                    <h3>Total Trips</h3>
                    <p style={numberStyle}>{trips.length}</p>
                </div>

                <div style={cardStyle}>
                    <h3>Pending</h3>
                    <p style={numberStyle}>
                        {trips.filter(t => t.status === "pending").length}
                    </p>
                </div>

                <div style={cardStyle}>
                    <h3>Confirmed</h3>
                    <p style={numberStyle}>
                        {trips.filter(t => t.status === "confirmed").length}
                    </p>
                </div>
            </div>

            {/* TABS */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                <button
                    onClick={() => setActiveTab("users")}
                    style={activeTab === "users" ? activeBtn : btn}
                >
                    👤 Users
                </button>

                <button
                    onClick={() => setActiveTab("trips")}
                    style={activeTab === "trips" ? activeBtn : btn}
                >
                    🚗 Trips
                </button>
            </div>

            {/* CONTENT */}
            {activeTab === "users" && <AdminUserTable />}

            {activeTab === "trips" && (
                <div style={container}>
                    <table style={table}>
                        <thead>
                            <tr style={theadRow}>
                                <th>User</th>
                                <th>Pickup</th>
                                <th>Destination</th>
                                <th>Passengers</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {trips.map((trip) => (
                                <tr key={trip._id} style={row}>
                                    <td style={userCell}>
                                        <div style={avatar}>
                                            {trip.user?.name?.charAt(0)}
                                        </div>
                                        {trip.user?.name}
                                    </td>

                                    <td>{trip.pickup}</td>
                                    <td>{trip.destination}</td>
                                    <td>{trip.passengers}</td>

                                    <td>
                                        <span
                                            style={{
                                                ...badge,
                                                background: getStatusColor(trip.status)
                                            }}
                                        >
                                            {trip.status}
                                        </span>
                                    </td>

                                    <td>
                                        <select
                                            value={trip.status}
                                            onChange={(e) =>
                                                handleChangeStatus(trip._id, e.target.value)
                                            }
                                            style={select}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default AdminDashboard

// 🎨 STYLE

const cardStyle = {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    flex: 1
}

const numberStyle = {
    fontSize: 24,
    fontWeight: "bold"
}

const btn = {
    padding: "10px 20px",
    border: "none",
    background: "#eee",
    cursor: "pointer",
    borderRadius: 8
}

const activeBtn = {
    ...btn,
    background: "#406093",
    color: "#fff"
}

const container = {
    background: "#fff",
    padding: 20,
    borderRadius: 15,
    boxShadow: "0 5px 20px rgba(0,0,0,0.08)"
}

const table = {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 10px"
}

const theadRow = {
    textAlign: "left",
    color: "#888",
    fontSize: 14
}

const row = {
    background: "#f9fafb",
    borderRadius: 10
}

const userCell = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontWeight: 500
}

const avatar = {
    width: 35,
    height: 35,
    borderRadius: "50%",
    background: "#406093",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold"
}

const badge = {
    padding: "6px 12px",
    borderRadius: 20,
    color: "#fff",
    fontSize: 12,
    textTransform: "capitalize",
    fontWeight: 500
}

const select = {
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid #ddd",
    cursor: "pointer"
}