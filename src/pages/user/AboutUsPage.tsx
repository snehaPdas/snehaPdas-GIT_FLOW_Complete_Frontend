import { useRef } from "react";
import AboutUs from "../../components/user/AboutUs";
import Footer from "../../components/user/Footer";
import Header from "../../components/user/Header";

function AboutUsPage() {
    const servicesRef = useRef<HTMLDivElement>(null);

    // const scrollToServices = () => {
    //     servicesRef.current?.scrollIntoView({ behavior: "smooth" });
    //     console.log("servicesRef", servicesRef);
    // };

    return (
        <div>
            <Header />
            <div ref={servicesRef}>
                <AboutUs />
            </div>
            <Footer />
        </div>
    );
}

export default AboutUsPage;
