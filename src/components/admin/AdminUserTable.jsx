import { Table, Button, Space, Modal, message } from 'antd'
import { useEffect, useState } from 'react'
import { getAllUsers, deleteUser } from '../../services/userService'
import UserModal from '../auth/UserModal'
import SearchBox from '../common/SearchBox'

const AdminUserTable = () => {
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [filteredUsers, setFilteredUsers] = useState([])
    const [viewUser, setViewUser] = useState(null)

    // 🔥 FETCH USERS
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

                    setUsers(prev => prev.filter(u => u._id !== id))
                    message.success('Deleted successfully')

                } catch (err) {
                    console.log('err:', err)
                    message.error('Delete failed')
                }
            }
        })
    }

    const columns = [
        { title: 'Name', dataIndex: 'name' },
        { title: 'Email', dataIndex: 'email' },
        { title: 'Role', dataIndex: 'role' },
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
            <SearchBox
                data={users}
                fields={['name', 'email']}
                onFiltered={setFilteredUsers}
                placeholder="Search users..."
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
