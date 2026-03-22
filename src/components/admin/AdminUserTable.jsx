import { Table } from 'antd'
import { useEffect, useState } from 'react'
import { getAllUsers } from '../../services/userService'

const AdminUserTable = () => {
    const [users, setUsers] = useState([])

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await getAllUsers()
                console.log("DATA:", res)
                setUsers(res)
            } catch (err) {
                console.error(err)
            }
        }

        fetchUsers()
    }, [])

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
        }
    ]

    return (
        <Table
            dataSource={users}
            columns={columns}
            rowKey="_id"
        />
    )
}

export default AdminUserTable