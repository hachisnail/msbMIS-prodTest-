import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../header/AdminHeader';

const AdminLayout = ({ children }) => {
    return (
        <>
            <Header />
            <main>
                 <Outlet />
            </main>
        </>
    );
};

export default AdminLayout;
