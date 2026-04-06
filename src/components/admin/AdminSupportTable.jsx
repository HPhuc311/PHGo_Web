import { useEffect, useState } from "react"
import { Table, Button, Modal, Input, Tag, Select, message, Popconfirm } from "antd"
import fetchWithAuth from "../../services/api"

const AdminSupportTable = () => {
    const [data, setData] = useState([])
    const [selected, setSelected] = useState(null)
    const [reply, setReply] = useState("")

    const fetchData = async () => {
        const res = await fetchWithAuth("/api/support")
        setData(res)
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData()
    }, [])

    const handleReply = async () => {
        await fetchWithAuth(`/api/support/${selected?._id}/reply`, {
            method: "PUT",
            body: JSON.stringify({ reply })
        })
        message.destroy()
        message.success("Replied ✅")
        setSelected(null)
        setReply("")
        fetchData()
    }

    const handleStatus = async (id, status) => {
        await fetchWithAuth(`/api/support/${id}/status`, {
            method: "PUT",
            body: JSON.stringify({ status })
        })
        message.destroy()
        message.success("Updated status")
        fetchData()
    }

    const handleDelete = async (id) => {
        await fetchWithAuth(`/api/support/${id}`, {
            method: "DELETE"
        })
        message.destroy()
        message.success("Deleted")
        fetchData()
    }

    const columns = [
        { title: "Email", dataIndex: "email" },
        { title: "Message", dataIndex: "message" },

        {
            title: "Status",
            render: (record) => (
                <Select
                    value={record.status}
                    onChange={(v) => handleStatus(record._id, v)}
                    style={{ width: 120 }}
                >
                    <Select.Option value="pending">pending</Select.Option>
                    <Select.Option value="replied">replied</Select.Option>
                </Select>
            )
        },

        {
            title: "Action",
            render: (_, record) => (
                <>
                    <Button onClick={() => setSelected(record)}>
                        Reply
                    </Button>

                    <Popconfirm
                        title="Delete this request?"
                        onConfirm={() => handleDelete(record._id)}
                    >
                        <Button danger style={{ marginLeft: 8 }}>
                            Delete
                        </Button>
                    </Popconfirm>
                </>
            )
        }
    ]

    return (
        <>
            <Table dataSource={data} columns={columns} rowKey="_id" />

            <Modal
                open={!!selected}
                onCancel={() => setSelected(null)}
                onOk={handleReply}
                title="Reply Support"
            >
                <p><b>Email:</b> {selected?.email}</p>
                <p><b>Message:</b> {selected?.message}</p>

                <Input.TextArea
                    rows={4}
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                />
            </Modal>
        </>
    )
}

export default AdminSupportTable