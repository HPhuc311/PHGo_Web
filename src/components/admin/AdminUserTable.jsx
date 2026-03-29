import { Table, Button, Space, Modal, message, Input } from 'antd'
import { useEffect, useState } from 'react'
import { getAllUsers, deleteUser } from '../../services/userService'
import UserModal from '../auth/UserModal'


const AdminUserTable = () => {
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [searchText, setSearchText] = useState('')
    const [filteredUsers, setFilteredUsers] = useState([])
    const [viewUser, setViewUser] = useState(null)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await getAllUsers()
                setUsers(res)
                setFilteredUsers(res)
            } catch (err) {
                console.error(err)
            }
        }

        fetchUsers()
    }, [])

    // handle Search

    const handleSearch = (value) => {
        const keyword = value.toLowerCase()

        const filtered = users.filter(user =>
            user.name?.toLowerCase().includes(keyword) ||
            user.email?.toLowerCase().includes(keyword)
        )

        setFilteredUsers(filtered)
    }

    // 🔥 DELETE USER
    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Delete user?',
            content: 'Are you sure you want to delete this user?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await deleteUser(id)
                    message.success('Deleted successfully')

                    setUsers(prev => prev.filter(u => u._id !== id))
                } catch (err) {
                    console.log('err:', err)
                    message.error('Delete failed')
                }
            }
        })
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name'
        },
        {
            title: 'Email',
            dataIndex: 'email'
        },
        {
            title: 'Role',
            dataIndex: 'role'
        },
        // 🔥 ACTIONS
        {
            title: 'Actions',
            render: (_, record) => (
                <Space>
                    <Button onClick={() => setViewUser(record)}>
                        View
                    </Button>

                    <Button onClick={() => setSelectedUser(record)}>
                        Edit
                    </Button>

                    <Button danger onClick={() => handleDelete(record._id)}>
                        Delete
                    </Button>
                </Space>
            )
        }
    ]

    return (
        <>
            <Input.Search
                placeholder="Search user..."
                value={searchText}
                onChange={(e) => {
                    const value = e.target.value
                    setSearchText(value)

                    if (!value) {
                        setFilteredUsers(users)
                    }
                }}
                onSearch={handleSearch}
                allowClear
                style={{ marginBottom: 16, maxWidth: 400 }}
            />

            <Table
                dataSource={filteredUsers}
                columns={columns}
                rowKey="_id"
            />

            <Modal
                open={!!viewUser}
                title="👤 User Details"
                onCancel={() => setViewUser(null)}
                footer={null}
            >
                {viewUser && (
                    <div style={{
                        background: "#f9fafb",
                        padding: 16,
                        borderRadius: 12
                    }}>
                        <p><b>Name:</b> {viewUser.name}</p>
                        <p><b>Email:</b> {viewUser.email}</p>
                        <p><b>Phone:</b> {viewUser.phone || 'N/A'}</p>
                        <p><b>Address:</b> {viewUser.address || 'N/A'}</p>
                        <p><b>Role:</b> {viewUser.role}</p>
                    </div>
                )}
            </Modal>

            {/* 🔥 MODAL EDIT */}
                <UserModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onUpdated={(updatedUser) => {
                        setUsers(prev =>
                            prev.map(u =>
                                u._id === updatedUser._id ? updatedUser : u
                            )
                        )
                    }}
                />
            </>
            )
}

            export default AdminUserTable