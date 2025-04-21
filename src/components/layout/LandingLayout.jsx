import React from 'react'
import { Outlet } from 'react-router-dom';
import Header from '../header/LandingHeader';
import Footer from '../footer/LandingFooter';


const LandingLayout = () => (
    <>
        <Header />
        <main>
            <Outlet />
        </main>
        <Footer />
    </>

);

export default LandingLayout;
