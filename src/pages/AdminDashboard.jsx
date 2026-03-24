import { useEffect, useState } from "react"
import AdminUserTable from "../components/admin/AdminUserTable"
import { getAllTrips, updateTripStatus } from "../services/tripServices"
import { createCar, getCars, deleteCar, updateCar } from "../../src/services/carService"
import { message, Modal, Select, Tabs } from "antd"
import { buildImageUrl } from "../utils/image"

const AdminDashboard = () => {
    const [trips, setTrips] = useState([])
    const [cars, setCars] = useState([])
    const [editingCar, setEditingCar] = useState(null)
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        name: '',
        brand: '',
        location: '',
        price: '',
        seats:'',
    })

    const [image, setImage] = useState(null)

    // ================= TRIPS =================
    const fetchTrips = async () => {
        const data = await getAllTrips()
        setTrips(data)
    }

    const handleChangeStatus = async (id, status) => {
        await updateTripStatus(id, status)
        fetchTrips()
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "pending": return "#facc15"
            case "confirmed": return "#22c55e"
            case "completed": return "#3b82f6"
            case "cancelled": return "#ef4444"
            default: return "#ccc"
        }
    }

    // ================= CARS =================
    const fetchCars = async () => {
        const data = await getCars()
        setCars(data)
    }

    useEffect(() => {
        fetchTrips()
        fetchCars()
    }, [])

    useEffect(() => {
        if (editingCar) {
            setForm(editingCar)
        }
    }, [editingCar])

    const handleSubmitCar = async () => {
        const formData = new FormData()

        Object.keys(form).forEach(key => {
            formData.append(key, form[key])
        })

        if (image) {
            formData.append("image", image)
        }

        try {
            if (editingCar) {
                await updateCar(editingCar._id, formData)
                message.success("Car updated successfully 🚗")
            } else {
                await createCar(formData)
                message.success("Car created successfully 🚀")
            }

            setForm({ name: '', brand: '', location: '', price: '', seats: '' })
            setImage(null)
            setEditingCar(null)
            fetchCars()
        } catch (err) {
            console.log('err:', err)
            message.error("Something went wrong ❌")
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteCar = (id) => {
        Modal.confirm({
            title: "Delete Car",
            content: "Are you sure you want to delete this car?",
            okText: "Yes",
            cancelText: "Cancel",
            okType: "danger",
            onOk: async () => {
                try {
                    await deleteCar(id)
                    message.success("Deleted successfully 🗑")
                    fetchCars()
                } catch {
                    message.error("Delete failed ❌")
                }
            }
        })
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
            <Tabs
                defaultActiveKey="users"
                size="large"
                type="line"
                items={[
                    {
                        key: "users",
                        label: "👤 Users",
                        children: <AdminUserTable />
                    },

                    {
                        key: "trips",
                        label: "🚗 Trips",
                        children: (
                            <div style={tripContainer}>
                                <table style={table}>
                                    <thead>
                                        <tr style={theadRow}>
                                            <th>User</th>
                                            <th>Pickup</th>
                                            <th>Destination</th>
                                            <th>Passengers</th>
                                            <th style={{ textAlign: "center" }}>Status</th>
                                            <th style={{ textAlign: "center" }}>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {trips.map((trip) => (
                                            <tr key={trip._id} style={row}>
                                                <td style={cell}>{trip.user?.name}</td>
                                                <td style={cell}>{trip.pickup}</td>
                                                <td style={cell}>{trip.destination}</td>
                                                <td style={cell}>{trip.passengers}</td>

                                                <td style={{ ...cell, textAlign: "center" }}>
                                                    <span style={{
                                                        ...badge,
                                                        background: getStatusColor(trip.status)
                                                    }}>
                                                        {trip.status}
                                                    </span>
                                                </td>

                                                <td style={{ ...cell, textAlign: "center" }}>
                                                    <Select
                                                        value={trip.status}
                                                        style={{ width: 130 }}
                                                        onChange={(value) =>
                                                            handleChangeStatus(trip._id, value)
                                                        }
                                                        options={[
                                                            { value: "pending", label: "Pending" },
                                                            { value: "confirmed", label: "Confirmed" },
                                                            { value: "completed", label: "Completed" },
                                                            { value: "cancelled", label: "Cancelled" },
                                                        ]}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    },

                    {
                        key: "cars",
                        label: "🚘 Cars",
                        children: (
                            <div style={carWrapper}>
                                {/* FORM */}
                                <div style={carFormCard}>
                                    <h2 style={carTitle}>
                                        {editingCar ? "✏️ Edit Car" : "Add New Car"}
                                    </h2>

                                    <div style={carForm}>
                                        <input
                                            placeholder="Car name"
                                            value={form.name}
                                            onChange={e => setForm({ ...form, name: e.target.value })}
                                            style={carInput}
                                        />

                                        <input
                                            placeholder="Brand"
                                            value={form.brand}
                                            onChange={e => setForm({ ...form, brand: e.target.value })}
                                            style={carInput}
                                        />

                                        <input
                                            placeholder="Location"
                                            value={form.location}
                                            onChange={e => setForm({ ...form, location: e.target.value })}
                                            style={carInput}
                                        />

                                        <input
                                            placeholder="Price / day"
                                            value={form.price}
                                            onChange={e => setForm({ ...form, price: e.target.value })}
                                            style={carInput}
                                        />

                                        <input
                                            placeholder="Seats"
                                            value={form.seats}
                                            onChange={e => setForm({ ...form, seats: e.target.value })}
                                            style={carInput}
                                        />

                                        <label style={uploadBox}>
                                            📷 Upload Image
                                            <input
                                                type="file"
                                                hidden
                                                onChange={e => setImage(e.target.files[0])}
                                            />
                                        </label>

                                        {image && (
                                            <div style={previewBox}>
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    style={previewImg}
                                                />
                                            </div>
                                        )}

                                        <button style={carSubmit} onClick={handleSubmitCar} disabled={loading}>
                                            {loading ? "Processing..." : editingCar ? "Update Car" : "+ Add Car"}
                                        </button>
                                    </div>
                                </div>

                                {/* LIST */}
                                <div style={carListCard}>
                                    <h2 style={carTitle}>Car List</h2>

                                    <div style={carGrid}>
                                        {cars.map(car => (
                                            <div key={car._id} style={carItem}>
                                                <img
                                                    src={buildImageUrl(car.image)}
                                                    style={carImage}
                                                />

                                                <h4>{car.name}</h4>
                                                <p>{car.brand}</p>
                                                <p>{car.location}</p>
                                                <p style={price}> {Number(car.price).toLocaleString()}/day</p>

                                                <div style={actionRow}>
                                                    <button style={editBtn} onClick={() => setEditingCar(car)}>
                                                        Edit
                                                    </button>

                                                    <button style={deleteBtn} onClick={() => handleDeleteCar(car._id)}>
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    }
                ]}
            />
        </div>
    )
}

export default AdminDashboard

// ===== STYLE =====

const cardStyle = { background: "#fff", padding: 20, borderRadius: 10 }
const numberStyle = { fontSize: 24, fontWeight: "bold" }

const tripContainer = {
    background: "#fff",
    padding: 20,
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
}

const table = {
    width: "100%",
    borderCollapse: "collapse"
}

const theadRow = {
    textAlign: "left",
    color: "#666",
    fontSize: 13,
    borderBottom: "2px solid #eee"
}

const row = {
    borderBottom: "1px solid #eee"
}

const cell = {
    padding: "14px 16px",
    verticalAlign: "middle"
}

const badge = {
    padding: "6px 14px",
    borderRadius: 20,
    color: "#fff",
    fontSize: 12,
    fontWeight: 500
}

/* ===== CAR ===== */

const carWrapper = {
    display: "grid",
    gridTemplateColumns: "350px 1fr",
    gap: 20
}

const carFormCard = {
    background: "#fff",
    padding: 20,
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
}

const carListCard = {
    background: "#fff",
    padding: 20,
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
}

const carTitle = {
    marginBottom: 15
}

const carForm = {
    display: "flex",
    flexDirection: "column",
    gap: 12
}

const carInput = {
    padding: "10px",
    borderRadius: 10,
    border: "1px solid #ddd"
}

const uploadBox = {
    padding: "10px",
    background: "#406093",
    color: "#fff",
    textAlign: "center",
    borderRadius: 10,
    cursor: "pointer"
}

const previewBox = {
    marginTop: 10
}

const previewImg = {
    width: "100%",
    borderRadius: 10
}

const carSubmit = {
    padding: "12px",
    background: "#22c55e",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontWeight: "bold",
    cursor: "pointer"
}

const carGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: 20
}

const carItem = {
    background: "#f9fafb",
    padding: 15,
    borderRadius: 12,
    textAlign: "center"
}

const carImage = {
    width: "100%",
    height: 120,
    objectFit: "cover",
    borderRadius: 10,
    marginBottom: 10
}

const price = {
    color: "#22c55e",
    fontWeight: "bold"
}

const actionRow = {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    marginTop: 10
}

const editBtn = {
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: 8,
    cursor: "pointer"
}

const deleteBtn = {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: 8,
    cursor: "pointer"
}