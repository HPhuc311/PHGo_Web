import HeroSection from '../components/home/HeroSection'
import SearchBox from '../components/common/SearchBox'
import PromotionSection from '../components/home/PromotionSection'
import CarList from '../components/car/CarList'
import FeatureSection from '../components/home/FeatureSection'
import HowItWorks from '../components/home/HowItWorks'

const Home = () => {
    return (
        <div style={{ background: '#f5f5f5' }}>

            <HeroSection />

            <SearchBox />

            <PromotionSection />

            <CarList />

            <FeatureSection />

            <HowItWorks />

        </div>
    )
}

export default Home