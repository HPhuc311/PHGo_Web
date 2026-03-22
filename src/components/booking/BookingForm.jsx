import { Form, Input, DatePicker, InputNumber, Select, Radio, Button } from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'

const { RangePicker } = DatePicker

const BookingForm = ({ onNext }) => {
    const [form] = Form.useForm()
    const [serviceType, setServiceType] = useState('local')

    const handleSubmit = (values) => {
        onNext(values)
    }

    const disabledDate = (current) => {
        return current && current < dayjs().startOf('day')
    }

    return (
        <Form layout="vertical" form={form} onFinish={handleSubmit}>

            {/* ✅ SERVICE TYPE */}
            <Form.Item
                label="Service Type"
                name="service"
                initialValue="Local Ride"
                rules={[{ required: true }]}
            >
                <Select onChange={(value) => setServiceType(value)}>
                    <Select.Option value="Local Ride">Local Ride</Select.Option>
                    <Select.Option value="Airport Transfer">Airport Transfer</Select.Option>
                    <Select.Option value="Daily Hire">Daily Hire</Select.Option>
                </Select>
            </Form.Item>

            {/* ✅ LOCAL RIDE */}
            {serviceType === 'local' && (
                <>
                    <Form.Item
                        label="Pickup Location"
                        name="pickup"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="Enter pickup location" />
                    </Form.Item>

                    <Form.Item
                        label="Destination"
                        name="destination"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="Enter destination" />
                    </Form.Item>
                </>
            )}

            {/* ✅ AIRPORT */}
            {serviceType === 'airport' && (
                <>
                    <Form.Item
                        label="Airport"
                        name="pickup"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="Enter airport (e.g. Tan Son Nhat)" />
                    </Form.Item>

                    <Form.Item
                        label="Destination"
                        name="destination"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="Enter destination" />
                    </Form.Item>
                </>
            )}

            {/* ✅ DAILY HIRE */}
            {serviceType === 'daily' && (
                <Form.Item
                    label="Pickup Address"
                    name="pickup"
                    rules={[{ required: true }]}
                >
                    <Input placeholder="Enter pickup address" />
                </Form.Item>
            )}

            {/* DATE */}
            <Form.Item
                label="Date & Time"
                name="time"
                rules={[{ required: true }]}
            >
                <RangePicker
                    style={{ width: '100%' }}
                    disabledDate={disabledDate}
                    showTime={{
                        format: 'HH:mm',
                        minuteStep: 30, // ✅ bước 30 phút
                        hideDisabledOptions: true // ✅ ẩn các phút không hợp lệ
                    }}
                    format="DD-MM-YYYY HH:mm"
                />
            </Form.Item>

            {/* PASSENGERS */}
            <Form.Item
                label="Passengers"
                name="passengers"
                rules={[{ required: true }]}
            >
                <InputNumber min={1} max={7} style={{ width: '100%' }} />
            </Form.Item>

            {/* CAR */}
            <Form.Item
                label="Car Type"
                name="carType"
                dependencies={['passengers']}
                rules={[
                    { required: true },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            const passengers = getFieldValue('passengers')

                            if (!passengers || !value) return Promise.resolve()

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
                <Select>
                    <Select.Option value="4">4 seats</Select.Option>
                    <Select.Option value="7">7 seats</Select.Option>
                </Select>
            </Form.Item>

            {/* NOTIFICATION */}
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