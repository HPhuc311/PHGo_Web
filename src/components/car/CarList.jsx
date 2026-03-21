import CarCard from './CarCard'

const cars = [
    {
        id: 1,
        name: 'Vinfast Lux SA 2021',
        location: 'Tân Bình',
        price: '1.3M',
        rating: 5.0,
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70',
        tags: ['Tự động', '7 chỗ'],
    },
    {
        id: 2,
        name: 'Mazda 3 2018',
        location: 'Quận 1',
        price: '900K',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8',
        tags: ['5 chỗ'],
    },
    {
        id: 3,
        name: 'Kia Sorento 2021',
        location: 'Phú Nhuận',
        price: '1.5M',
        rating: 5.0,
        image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c',
        tags: ['7 chỗ'],
    },
]

const CarList = () => {
    return (
        <div style={{ marginTop: '40px' }}>
            <h2 style={{ textAlign: 'center' }}>Xe Dành Cho Bạn</h2>

            <div className="row mt-4">
                {cars.map((car) => (
                    <div className="col-md-3 mb-4" key={car.id}>
                        <CarCard car={car} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CarList