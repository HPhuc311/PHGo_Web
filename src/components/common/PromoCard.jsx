import { Card } from 'antd'

const PromoCard = ({ image, title }) => {
    return (
        <Card
            hoverable
            cover={
                <img
                    alt="promo"
                    src={image}
                    style={{
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '12px',
                    }}
                />
            }
            style={{
                borderRadius: '16px',
                overflow: 'hidden',
            }}
        >
            <h4>{title}</h4>
        </Card>
    )
}

export default PromoCard