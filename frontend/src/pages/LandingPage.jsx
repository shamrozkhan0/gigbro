import ProblemSection from "../components/ProblemSection.jsx"
import HeroSection from "../components/HeroSection.jsx"
import HowItWorks from "../components/HowItWorks.jsx"
import Analysis from "../components/Analysis.jsx"
import Navbar from "../components/Navbar.jsx"
import Faq from "../components/Faq.jsx"
import WhyGigBro from "../components/WhyGigBro.jsx"
import CTA from "../components/CTA.jsx"
import Footer from "../components/Footer.jsx"
import BackendNotification from "../components/BackendNotification.jsx"
import Pricing from "./Pricing.jsx"
import { useAuth } from "../context/AuthContext.jsx"

const LandingPage = () => {
    const {isAuthenticated, loading} = useAuth()
    console.log(isAuthenticated);
    console.log(loading)
    return (
        <>
            <BackendNotification/>
            <Navbar/>
            <HeroSection/>
            <ProblemSection/>
            <HowItWorks/>
            <Analysis/>
            <WhyGigBro/>
            <Pricing/>
            <Faq/>
            <CTA/>
            <Footer/>
        </>
    )
}

export default LandingPage;
