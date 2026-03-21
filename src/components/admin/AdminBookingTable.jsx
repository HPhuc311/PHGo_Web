import { Table, Select, Button, Input } from 'antd'
import { useState } from 'react'
import UserModal from '../auth/UserModal'

const AdminBookingTable = ({ trips, setTrips }) => {
    const [search, setSearch] = useState('')
    const [selectedUser, setSelectedUser] = useState(null)

    const updateStatus = (id, status) => {
        const updated = trips.map(t =>
            t.id === id ? { ...t, status } : t
        )

        setTrips(updated)
        localStorage.setItem('trips', JSON.stringify(updated))
    }

    const filtered = trips.filter(t =>
        t.car?.toLowerCase().includes(search.toLowerCase())
    )

    const columns = [
        {
            title: 'Car',
            dataIndex: 'car'
        },
        {
            title: 'Route',
            render: (_, r) => `${r.pickup} → ${r.destination}`
        },
        {
            title: 'Customer',
            render: (_, r) => (
                <Button onClick={() => setSelectedUser(r.user || {})}>
                    View
                </Button>
            )
        },
        {
            title: 'Status',
            render: (_, r) => (
                <Select
                    value={r.status}
                    style={{ width: 140 }}
                    onChange={(val) => updateStatus(r.id, val)}
                >
                    <Select.Option value="pending">Pending</Select.Option>
                    <Select.Option value="processing">Processing</Select.Option>
                    <Select.Option value="confirmed">Confirmed</Select.Option>
                    <Select.Option value="paid">Paid</Select.Option>
                    <Select.Option value="completed">Completed</Select.Option>
                    <Select.Option value="cancelled">Cancelled</Select.Option>
                </Select>
            )
        },
        {
            title: 'Price',
            dataIndex: 'price'
        }
    ]

    return (
        <>
            <Input
                placeholder="Search car..."
                style={{ marginBottom: '10px', width: 300 }}
                onChange={(e) => setSearch(e.target.value)}
            />

            <Table dataSource={filtered} columns={columns} rowKey="id" />

            <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
        </>
    )
}

export default AdminBookingTable