import { Form, Input, Button, Rate } from 'antd'

const ReviewForm = () => {
    return (
        <Form layout="vertical">
            <Form.Item label="Rating">
                <Rate />
            </Form.Item>

            <Form.Item label="Review">
                <Input.TextArea rows={4} />
            </Form.Item>

            <Button type="primary">Submit</Button>
        </Form>
    )
}

export default ReviewForm