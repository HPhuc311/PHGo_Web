import { useEffect, useState } from "react"
import AdminUserTable from "../components/admin/AdminUserTable"
import { deleteTrip, getAllTrips, updateTripStatus } from "../services/tripServices"
import { createCar, getCars, deleteCar, updateCar } from "../../src/services/carService"
import { Form, Input, InputNumber, Upload, Button, message, Modal, Tabs, Spin} from "antd"
import { buildImageUrl } from "../utils/image"
import {
    UserOutlined,
    CarOutlined,
    ProfileOutlined,
    PlusOutlined,
    DashboardOutlined,
} from '@ant-design/icons'
import AdminTripTable from "../components/admin/AdminTripTable"

const AdminDashboard = () => {
    const [trips, setTrips] = useState([])
    const [cars, setCars] = useState([])
    const [editingCar, setEditingCar] = useState(null)
    const [loading, setLoading] = useState(false)
    const [antdForm] = Form.useForm()

    const [openModal, setOpenModal] = useState(false)


    // 🔥 STATUS FLOW FIXED (NO CANCEL AFTER START)
    const statusFlow = {
        pending: ['paid', 'cancelled'],
        paid: ['confirmed', 'cancelled'],
        confirmed: ['on_the_way', 'cancelled'],
        on_the_way: ['in_progress'],
        in_progress: ['completed'],
        completed: [],
        cancelled: []
    }

    // ================= TRIPS =================
    const fetchTrips = async () => {
        const data = await getAllTrips()
        setTrips(data)
    }

    const handleChangeStatus = async (id, status) => {

        const currentTrip = trips.find(t => t._id === id)

        // 🔥 CHẶN cancel sai (đang chạy)
        if (
            status === "cancelled" &&
            ['on_the_way', 'in_progress'].includes(currentTrip?.status)
        ) {
            return message.error("Cannot cancel ongoing trip 🚫")
        }

        try {
            const updatedTrip = await updateTripStatus(id, status)

            message.success("Status updated ✅")

            setTrips(prev =>
                prev.map(t =>
                    t._id === id ? updatedTrip : t
                )
            )

        } catch (err) {
            console.log(err)
            message.error("Update failed ❌")
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "pending": return "#facc15"
            case "paid": return "#3b82f6"
            case "confirmed": return "#22c55e"
            case "on_the_way": return "#a855f7"
            case "in_progress": return "#0ea5e9"
            case "completed": return "#16a34a"
            case "cancelled": return "#ef4444"
            default: return "#ccc"
        }
    }

    // ================= CARS =================
    const fetchCars = async () => {
        try {
            setLoading(true)
            const data = await getCars()
            setCars(data)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTrips()
        fetchCars()
    }, [])

    const handleSubmitCar = async (values) => {
        const formData = new FormData()

        Object.keys(values).forEach(key => {
            if (key !== "image") {
                formData.append(key, values[key])
            }
        })

        if (values.image?.[0]?.originFileObj) {
            formData.append("image", values.image[0].originFileObj)
        }

        try {
            if (editingCar) {
                const updatedCar = await updateCar(editingCar._id, formData)

                setCars(prev =>
                    prev.map(c =>
                        c._id === editingCar._id ? updatedCar : c
                    )
                )

                message.success("Car updated 🚗")
            } else {
                const newCar = await createCar(formData)

                setCars(prev => [newCar, ...prev])
                message.success("Car created 🚀")
            }

            antdForm.resetFields()
            setEditingCar(null)

        } catch (err) {
            message.error(err.message || "Error ❌")
        }
    }

    const handleDeleteCar = (id) => {
        Modal.confirm({
            title: "Delete Car",
            okType: "danger",

            onOk: async () => {
                try {
                    setCars(prev => prev.filter(car => car._id !== id))
                    await deleteCar(id)
                    message.success("Deleted 🗑")
                } catch {
                    fetchCars()
                }
            }
        })
    }

    const handleDeleteTrip = (trip) => {

        // ❌ chặn trước
        if (!['completed', 'cancelled'].includes(trip.status)) {
            return message.error("Only completed or cancelled trips can be deleted 🚫")
        }

        Modal.confirm({
            title: "Delete this trip?",
            content: "This action cannot be undone ⚠️",
            okText: "Delete",
            okType: "danger",
            cancelText: "Cancel",

            onOk: async () => {
                try {
                    await deleteTrip(trip._id)

                    // 🔥 update UI ngay (optimistic)
                    setTrips(prev =>
                        prev.filter(t => t._id !== trip._id)
                    )

                    message.success("Trip deleted successfully ✅")

                } catch (err) {
                    console.error(err)
                    message.error("Delete failed ❌")
                }
            }
        })
    }

    


    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: 100 }}>
                <Spin size="large" />
            </div>
        )
    }

    return (
        <div style={{ padding: 20, fontFamily: "Arial" }}>
            <h1> <DashboardOutlined /> Admin Dashboard</h1>

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
                        label: (
                            <span>
                                <UserOutlined style={{ color: '#1677ff' }} /> Users
                            </span>
                        ),
                        children: <AdminUserTable />
                    },

                    {
                        key: "trips",
                        label: (
                            <span>
                                <ProfileOutlined style={{ color: '#722ed1' }} /> Trips
                            </span>
                        ),
                        children: (
                            <AdminTripTable
                                trips={trips}
                                statusFlow={statusFlow}
                                handleChangeStatus={handleChangeStatus}
                                handleDeleteTrip={handleDeleteTrip}
                                getStatusColor={getStatusColor}
                            />
                        )
                    },
                    {
                        key: "cars",
                        label: (
                            <span>
                                <CarOutlined style={{ color: '#406093' }} /> Cars
                            </span>
                        ),
                        children: (
                            <div style={{ padding: 10 }}>

                                {/* HEADER */}
                                <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
                                    <h2>Car Management</h2>

                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={() => {
                                            setEditingCar(null)
                                            antdForm.resetFields()
                                            setOpenModal(true)
                                        }}
                                    >
                                        Add Car
                                    </Button>
                                </div>

                                {/* GRID LIST */}
                                <div style={carGrid}>
                                    {cars.map(car => (
                                        <div key={car._id} style={carItem}>

                                            <img
                                                src={buildImageUrl(car.image)}
                                                style={carImage}
                                            />

                                            <div style={{ padding: 10 }}>

                                                <h4 style={carName}>
                                                    {car.name}
                                                </h4>

                                                <p style={carText}>{car.brand}</p>
                                                <p style={carText}>{car.location}</p>

                                                <p style={price}>
                                                    {Number(car.price).toLocaleString()}₫/day
                                                </p>

                                                <div style={actionRow}>
                                                    <Button
                                                        size="small"
                                                        onClick={() => {
                                                            setEditingCar(car)
                                                            setOpenModal(true)

                                                            antdForm.setFieldsValue({
                                                                ...car,
                                                                image: []
                                                            })
                                                        }}
                                                    >
                                                        Edit
                                                    </Button>

                                                    <Button
                                                        size="small"
                                                        danger
                                                        onClick={() => handleDeleteCar(car._id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>

                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* MODAL */}
                                <Modal
                                    title={editingCar ? "Edit Car" : "Add Car"}
                                    open={openModal}
                                    onCancel={() => setOpenModal(false)}
                                    footer={null}
                                    destroyOnHidden
                                >
                                    <Form
                                        form={antdForm}
                                        layout="vertical"
                                        onFinish={(values) => {
                                            handleSubmitCar(values)
                                            setOpenModal(false)
                                        }}
                                    >

                                        <Form.Item name="name" rules={[{ required: true }]}>
                                            <Input placeholder="Car name" />
                                        </Form.Item>

                                        <Form.Item name="brand" rules={[{ required: true }]}>
                                            <Input placeholder="Brand" />
                                        </Form.Item>

                                        <Form.Item name="location" rules={[{ required: true }]}>
                                            <Input placeholder="Location" />
                                        </Form.Item>

                                        <Form.Item name="price" rules={[{ required: true }]}>
                                            <InputNumber style={{ width: "100%" }} placeholder="Price" />
                                        </Form.Item>

                                        <Form.Item name="seats" rules={[{ required: true }]}>
                                            <InputNumber style={{ width: "100%" }} placeholder="Seats" />
                                        </Form.Item>

                                        <Form.Item
                                            name="image"
                                            valuePropName="fileList"
                                            getValueFromEvent={(e) => e?.fileList}
                                        >
                                            <Upload beforeUpload={() => false} maxCount={1}>
                                                <Button>Upload Image</Button>
                                            </Upload>
                                        </Form.Item>

                                        <Button type="primary" htmlType="submit" block>
                                            {editingCar ? "Update Car" : "Create Car"}
                                        </Button>

                                    </Form>
                                </Modal>

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

// const tripContainer = {
//     background: "#fff",
//     padding: 20,
//     borderRadius: 16,
//     boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
// }

// const table = {
//     width: "100%",
//     borderCollapse: "collapse",
//     tableLayout: "fixed"
// }

// const theadRow = {
//     color: "#666",
//     fontSize: 13,
//     borderBottom: "2px solid #eee"
// }

// const row = {
//     // textAlign: "center",
//     borderBottom: "1px solid #eee",
//     height: 60
// }

// const cell = {
//     verticalAlign: "middle",
//     whiteSpace: "nowrap",
//     overflow: "hidden",
//     textOverflow: "ellipsis"
// }

/* ===== CAR ===== */

const carGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)", // 🔥 5 cột cố định
    gap: 16
}

const carItem = {
    background: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    height: 290,
    display: "flex",
    flexDirection: "column"
}

const carImage = {
    width: "100%",
    height: 120,
    objectFit: "cover"
}

const carName = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginBottom: 4
}

const carText = {
    fontSize: 13,
    color: "#666",
    marginBottom: 2
}

const price = {
    color: "#406093",
    fontWeight: "bold",
    marginTop: 6
}

const actionRow = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 10
}