import { Button, Form, Input, message, Rate } from 'antd'
import fetchWithAuth from '../../services/api'
import { useState } from 'react'

const ReviewForm = ({ tripId, onSuccess }) => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (values) => {
        try {
            setLoading(true)

            await fetchWithAuth('/api/trips/review', {
                method: 'POST',
                body: JSON.stringify({
                    tripId,
                    rating: values.rating,
                    comment: values.comment
                })
            })

            message.success("Review submitted ⭐")

            form.resetFields() // 🔥 reset form

            onSuccess()

        } catch (err) {
            message.error(err.message || "Submit failed ❌")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
        >
            {/* ⭐ RATING */}
            <Form.Item
                name="rating"
                label="Rating"
                rules={[
                    { required: true, message: "Please select rating" }
                ]}
            >
                <Rate />
            </Form.Item>

            {/* 📝 COMMENT */}
            <Form.Item
                name="comment"
                label="Your Review"
                rules={[
                    { max: 300, message: "Max 300 characters" }
                ]}
            >
                <Input.TextArea
                    rows={4}
                    placeholder="Share your experience..."
                />
            </Form.Item>

            {/* 🚀 SUBMIT */}
            <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                style={{
                    height: 40,
                    borderRadius: 8,
                    fontWeight: 500
                }}
            >
                Submit Review
            </Button>
        </Form>
    )
}

export default ReviewForm