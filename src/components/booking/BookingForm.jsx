import { Form, Input, DatePicker, InputNumber, Select, Radio, Button } from 'antd'


const { RangePicker } = DatePicker

const BookingForm = ({ onNext }) => {
    const [form] = Form.useForm()

    const handleSubmit = (values) => {
        onNext(values)
    }

    return (
        <Form layout="vertical" form={form} onFinish={handleSubmit}>

            <Form.Item label="Pickup Location" name="pickup" rules={[{ required: true }]}>
                <Input placeholder="Enter pickup location" />
            </Form.Item>

            <Form.Item label="Destination" name="destination" rules={[{ required: true }]}>
                <Input placeholder="Enter destination" />
            </Form.Item>

            <Form.Item label="Date & Time" name="time" rules={[{ required: true }]}>
                <RangePicker showTime style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="Passengers" name="passengers">
                <InputNumber min={1} max={7} />
            </Form.Item>

            <Form.Item label="Car Type" name="carType">
                <Select>
                    <Select.Option value="4">4 seats</Select.Option>
                    <Select.Option value="7">7 seats</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item label="Service Type" name="service">
                <Select>
                    <Select.Option value="local">Local Ride</Select.Option>
                    <Select.Option value="airport">Airport Transfer</Select.Option>
                    <Select.Option value="daily">Daily Hire</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item label="Notification" name="notification">
                <Radio.Group>
                    <Radio value="email">Email</Radio>
                    <Radio value="sms">SMS</Radio>
                </Radio.Group>
            </Form.Item>

            <Button type="primary" htmlType="submit" block>
                Continue to Payment
            </Button>
        </Form>
    )
}

export default BookingForm