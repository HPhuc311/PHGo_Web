import { Form, Input, DatePicker, InputNumber, Select, Radio, Button } from 'antd'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

const BookingForm = ({ onNext }) => {
    const [form] = Form.useForm()

    const handleSubmit = (values) => {
        onNext(values)
    }

    // ❌ Disable ngày quá khứ
    const disabledDate = (current) => {
        return current && current < dayjs().startOf('day')
    }

    return (
        <Form layout="vertical" form={form} onFinish={handleSubmit}>

            <Form.Item
                label="Pickup Location"
                name="pickup"
                rules={[{ required: true, message: 'Please enter pickup location' }]}
            >
                <Input placeholder="Enter pickup location" />
            </Form.Item>

            <Form.Item
                label="Destination"
                name="destination"
                rules={[{ required: true, message: 'Please enter destination' }]}
            >
                <Input placeholder="Enter destination" />
            </Form.Item>

            <Form.Item
                label="Date & Time"
                name="time"
                rules={[{ required: true, message: 'Please select date and time' }]}
            >
                <RangePicker
                    showTime={{ format: 'HH:mm' }}
                    style={{ width: '100%' }}
                    disabledDate={disabledDate}
                />
            </Form.Item>

            <Form.Item
                label="Passengers"
                name="passengers"
                rules={[{ required: true, message: 'Please enter passengers' }]}
            >
                <InputNumber min={1} max={7} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                label="Car Type"
                name="carType"
                dependencies={['passengers']}
                rules={[
                    { required: true, message: 'Please select car type' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            const passengers = getFieldValue('passengers')

                            if (!passengers || !value) return Promise.resolve()

                            // ❌ Nếu >=5 người mà chọn xe 4 chỗ → lỗi
                            if (passengers >= 5 && value === '4') {
                                return Promise.reject(
                                    new Error('5-7 passengers must choose 7-seat car')
                                )
                            }

                            return Promise.resolve()
                        }
                    })
                ]}
            >
                <Select placeholder="Select car type">
                    <Select.Option value="4">4 seats</Select.Option>
                    <Select.Option value="7">7 seats</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item label="Service Type" name="service">
                <Select placeholder="Select service">
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