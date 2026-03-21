import { Typography } from 'antd'
import FeatureCard from './FeatureCard'

const { Title, Paragraph } = Typography

const FeatureSection = () => {
    const features = [
        {
            icon: '🛡️',
            title: 'Safe Driving',
            description:
                'All vehicles are fully insured, ensuring maximum safety for your journey.',
        },
        {
            icon: '📍',
            title: 'Easy Booking',
            description:
                'Book a car quickly in just a few simple steps anytime, anywhere.',
        },
        {
            icon: '📄',
            title: 'Simple Procedures',
            description:
                'Only ID and a valid driver’s license are required to rent a car.',
        },
        {
            icon: '💳',
            title: 'Convenient Payment',
            description:
                'Supports multiple payment methods: Visa, Momo, ZaloPay, etc.',
        },
        {
            icon: '🚗',
            title: 'Doorstep Delivery',
            description:
                'Save time with our convenient car delivery service to your location.',
        },
        {
            icon: '🚙',
            title: 'Wide Vehicle Selection',
            description:
                'A wide range of vehicles from economy to premium classes.',
        },
    ]

    return (
        <div style={{ marginTop: '60px' }}>

            <div style={{ textAlign: 'center' }}>
                <Title>Why Choose Us</Title>
                <Paragraph>
                    Features that make your car rental experience easier and better
                </Paragraph>
            </div>

            <div className="row mt-4">
                {features.map((item, index) => (
                    <div className="col-md-4 mb-4" key={index}>
                        <FeatureCard {...item} />
                    </div>
                ))}
            </div>

        </div>
    )
}

export default FeatureSection