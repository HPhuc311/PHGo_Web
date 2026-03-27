import { Typography, Row, Col} from 'antd'
import PromoCard from '../common/PromoCard'

const { Title, Paragraph } = Typography

const PromotionSection = () => {
    const promotions = [
        {
            title: 'Holiday Deals - Book Early for the Best Cars',
            image: '/images/1.jpg',
        },
        {
            title: 'Choose Your Style - Ride Your Mood',
            image:
                '/images/2.jpg',
        },
        {
            title: 'Book at the Right Time - Enjoy Great Discounts',
            image:
                '/images/3.jpg',
        },
    ]

    return (
        <div style={{ marginTop: '5px', textAlign: 'center' }}>

            <Title level={2}>Promotions</Title>
            <Paragraph>Enjoy many attractive offers from PHGo</Paragraph>

            <div style={{ position: 'relative', marginTop: '30px' }}>
                {/* Card list */}
                <Row gutter={20}>
                    {promotions.map((item, index) => (
                        <Col span={8} key={index}>
                            <PromoCard {...item} />
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    )
}

export default PromotionSection