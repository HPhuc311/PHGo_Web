import {
    Form,
    Input,
    DatePicker,
    Select,
    Radio,
    Button,
    message
} from 'antd'
import dayjs from 'dayjs'
import { useState, useEffect } from 'react'
import fetchWithAuth from '../../services/api'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)


const { RangePicker } = DatePicker

const BookingForm = ({ onNext, car }) => {
    const [form] = Form.useForm()
    const [serviceType, setServiceType] = useState('Local Ride')
    const [bookedDates, setBookedDates] = useState([])

    // ================= FETCH BOOKED =================
    const fetchBookedDates = async () => {
        try {
            const res = await fetchWithAuth(`/api/trips/booked/${car._id}`)
            setBookedDates(res)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        if (car?._id) {
            fetchBookedDates()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [car])

    // ================= DISABLE DATE =================
    const disabledDate = (current) => {
        if (!current) return false

        // ❌ past
        if (current < dayjs().startOf('day')) return true

        // ❌ booked range
        return bookedDates.some(trip => {
            const start = dayjs(trip.startTime).startOf('day')
            const end = dayjs(trip.endTime).endOf('day')

            return current.isBetween(start, end, null, '[]')
        })
    }

    // ================= SUBMIT =================
    const handleSubmit = (values) => {
        if (!values.time) {
            return message.error("Please select time")
        }

        onNext({
            ...values,
            car
        })
    }

    return (
        <Form layout="vertical" form={form} onFinish={handleSubmit}>

            {/* SERVICE TYPE */}
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

            {/* LOCAL */}
            {serviceType === 'Local Ride' && (
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

            {/* AIRPORT */}
            {serviceType === 'Airport Transfer' && (
                <>
                    <Form.Item
                        label="Airport"
                        name="pickup"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="Enter airport" />
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

            {/* DAILY */}
            {serviceType === 'Daily Hire' && (
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
                rules={[{ required: true, message: "Select date" }]}
            >
                <RangePicker
                    style={{ width: '100%' }}
                    disabledDate={disabledDate}
                    showTime={{
                        format: 'HH:mm',
                        minuteStep: 30
                    }}
                    format="DD-MM-YYYY HH:mm"
                />
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