import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImageSlider from './AppComponent/ImageSlider';
import HeroSection from './AppComponent/HeroSection';

function App() {
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith('/Admin');
    const isHomePage = location.pathname === '/';
    return (
        <div>
            {!isAdminPage && <Header /> }
            {isHomePage && <HeroSection />}
            {isHomePage && <HeroSection />}
            {isHomePage && <HeroSection />}
            {/* {isHomePage && <ImageSlider />} */}
            <Main />
            {!isAdminPage && <Footer /> }
        </div>
    );
}

export default App;
