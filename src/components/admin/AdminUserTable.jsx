import { Table, Button, Space, Modal, message } from 'antd'
import { useEffect, useState } from 'react'
import { getAllUsers, deleteUser } from '../../services/userService'
import UserModal from '../auth/UserModal'


const AdminUserTable = () => {
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null) // ✅ THÊM

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await getAllUsers()
                setUsers(res)
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
            title: 'Phone',
            dataIndex: 'phone'
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
            <Table
                dataSource={users}
                columns={columns}
                rowKey="_id"
            />

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