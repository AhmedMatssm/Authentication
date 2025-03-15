import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from '../features/dashboard';
import Login from '../features/login';
import Register from '../features/register';
import Home from '../features/home';

function Index() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={  <Home/>} />
                    <Route path='/dashboard' element={<Dashboard/>} />
                    <Route path='/login' element={<Login/>} />
                    <Route path='/register' element={<Register/>} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default Index
