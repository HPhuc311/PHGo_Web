import { useEffect, useState } from "react"
import { Form, Input, Button, message, Table, Tag, Tabs } from "antd"
import fetchWithAuth from "../services/api"
import { useAuth } from "../context/AuthContext"

const SupportPage = () => {
    const [form] = Form.useForm()
    const [data, setData] = useState([])
    const { user } = useAuth()

    // ================= FETCH =================
    const fetchData = async () => {
        try {
            const res = await fetchWithAuth("/api/support/my")
            setData(res)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData()
    }, [])

    // ================= SUBMIT =================
    const handleSubmit = async (values) => {
        try {
            await fetchWithAuth("/api/support", {
                method: "POST",
                body: JSON.stringify(values)
            })

            message.success("Request sent 🎉")
            form.resetFields()
            fetchData()

        } catch (err) {
            message.error(err.message)
        }
    }

    // ================= TABLE =================
    const columns = [
        {
            title: "Your Issue",
            dataIndex: "message"
        },
        {
            title: "Reply",
            render: (record) => record.reply || "—"
        },
        {
            title: "Status",
            render: (record) => (
                <Tag color={record.status === "pending" ? "orange" : "green"}>
                    {record.status === "pending" ? "Waiting" : "Replied"}
                </Tag>
            )
        }
    ]

    // ================= TAB CONTENT =================

    const sendTab = (
        <Form
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
            initialValues={{ email: user?.email }}
            style={{
                maxWidth: 500,
                background: "#fff",
                padding: 20,
                borderRadius: 12,
                boxShadow: "0 5px 20px rgba(0,0,0,0.05)"
            }}
        >
            <Form.Item
                name="email"
                label="Your Email"
                rules={[{ required: true }]}
            >
                <Input disabled />
            </Form.Item>

            <Form.Item
                name="message"
                label="Describe your issue"
                rules={[{ required: true }]}
            >
                <Input.TextArea rows={4} />
            </Form.Item>

            <Button type="primary" htmlType="submit" block>
                Send Request
            </Button>
        </Form>
    )

    const listTab = (
        <Table
            dataSource={data}
            columns={columns}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
        />
    )

    return (
        <div style={{ maxWidth: 900, margin: "40px auto" }}>
            <h2>Customer Support</h2>

            <Tabs
                defaultActiveKey="1"
                items={[
                    {
                        key: "1",
                        label: "📝 Send Request",
                        children: sendTab
                    },
                    {
                        key: "2",
                        label: "📋 My Requests",
                        children: listTab
                    }
                ]}
            />
        </div>
    )
}

export default SupportPage