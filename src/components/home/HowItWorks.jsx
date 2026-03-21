import { Typography } from 'antd'
import StepCard from '../booking/StepCard'

const { Title, Paragraph } = Typography

const HowItWorks = () => {
    const steps = [
        {
            step: '01',
            icon: '📱',
            title: 'Book Your Car',
            description:
                'Search and book your preferred car easily via our website or mobile app.',
        },
        {
            step: '02',
            icon: '📍',
            title: 'Pick Up the Car',
            description:
                'Meet the owner or choose delivery to receive your car at your location.',
        },
        {
            step: '03',
            icon: '🚗',
            title: 'Enjoy Your Trip',
            description:
                'Start your journey and enjoy a comfortable and safe driving experience.',
        },
        {
            step: '04',
            icon: '⭐',
            title: 'Return & Review',
            description:
                'Return the car and leave a rating to help improve our service.',
        },
    ]

    return (
        <div style={{ marginTop: '60px' }}>

            <div style={{ textAlign: 'center' }}>
                <Title>How It Works</Title>
                <Paragraph>
                    Just 4 simple steps to start your car rental journey quickly
                </Paragraph>
            </div>

            <div className="row mt-4">
                {steps.map((item, index) => (
                    <div className="col-md-3 mb-4" key={index}>
                        <StepCard {...item} />
                    </div>
                ))}
            </div>

        </div>
    )
}

export default HowItWorks