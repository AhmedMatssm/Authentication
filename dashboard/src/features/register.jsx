import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom'
import { PARAMS, api, setAuthHeader } from '../common/utils/apiUrl';
import bg from './../assets/images/bg.jpg';
import logo from './../assets/images/logo.png';
import './../assets/styles/index.css';

function Register() {
    const navigate = useNavigate()
    const [data, setData] = useState([]);
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(username === '' || email === '' || password === ''){
            console.log('error date not find')
        }else{
            const allData = {
                username,
                email,
                password
            };
    
            setAuthHeader();
    
            try {
                const response = await api.post('/users/signup',allData);
                navigate('/login')
            } catch (error) {
                if (error.response) {
                    // الخطأ من الخادم
                    console.error('Server Error:', error.response.data);
                } else if (error.request) {
                    // لم يتم استلام رد من الخادم
                    console.error('No response from server:', error.request);
                } else {
                    // خطأ في إعداد الطلب
                    console.error('Request Error:', error.message);
                }
            }

        }
        setUserName('');
        setEmail('');
        setPassword('');
    };
    
    return (
        <div className='w-full h-screen max-sm:w-full max-sm:h-screen'>
            <div className="bg-content w-full h-screen flex  justify-end p-5 bg-no-repeat bg-cover bg-center max-sm:rounded-full max-sm:bg-none max-sm:p-0 max-sm:w-full max-sm:h-screen  max-sm:justify-between" >
                <div className='w-[500px] h-[580px] p-5 fixed flex flex-col justify-start items-center gap-5 bg-white opacity-80 rounded-[20px] max-sm:bg-transparent max-sm:p-0 max-sm:w-full max-sm:gap-2 max-sm:justify-between'>
                    <div>
                        <img src={bg} alt="bg" width='640px' className='hidden max-sm:block max-sm:bg-cover max-sm:h-[270px] max-sm:z-50' style={{clipPath: 'circle(67% at 50% 10%)'}}/>
                    </div>
                    <div>
                        <img src={logo} alt="logo" width='200px' className='max-sm:hidden'/>
                    </div>
                    <div className='flex flex-col justify-center items-center gap-5'>
                        <div className='mb-5 relative '>
                            <h1 className='text-4xl text-black before:absolute before:top-[40px] before:left-[70px] before:h-[2px] before:w-[170px] before:rounded-full before:bg-black max-sm:text-3xl max-sm:before:left-[50px]'>Create an account</h1>
                        </div>
                        <div className='flex flex-col justify-center items-center gap-5 max-sm:gap-4 '>
                            <form className='flex flex-col justify-center items-center gap-5  max-sm:gap-4'>
                                <input className='w-[400px] h-[50px] rounded-full outline-none border-[1px] border-solid border-[#707070] bg-[#eeeeee30] p-5 max-sm:w-[350px] max-sm:h-[40px] max-sm:py-0 ' type="text" placeholder='Username' required name='username'  value={username} onChange={e=>setUserName(e.target.value)}/>
                                <input className='w-[400px] h-[50px] rounded-full outline-none border-[1px] border-solid border-[#707070] bg-[#eeeeee30] p-5 max-sm:w-[350px] max-sm:h-[40px] max-sm:py-0 ' type="email" placeholder='Email'  required name='email'  value={email} onChange={e=>setEmail(e.target.value)}/>
                                <input className='w-[400px] h-[50px] rounded-full outline-none border-[1px] border-solid border-[#707070] bg-[#eeeeee30] p-5 max-sm:w-[350px] max-sm:h-[40px] max-sm:py-0 ' type="password" placeholder='Password' required name='password'  value={password} onChange={e=>setPassword(e.target.value)}/>
                                <button className='w-[400px] h-[50px] rounded-full outline-none bg-[#2E2A65] p-3  text-white text-[22px] hover:bg-[#1e1a5e] max-sm:w-[350px] max-sm:h-[40px] max-sm:text-[18px] max-sm:p-0' type="submit" onClick={handleSubmit}>Continue</button>
                            </form>
                            <p className='mb-8 text-lg max-sm:mb-0 '>Have an account ? <Link to="/login" className='text-[#2E2A65] hover:underline '>Log in</Link></p>
                        </div>
                    </div>
                    <div className='flex justify-end max-md:hidden'>
                        <p>All Rights Reserved By <b>DriveShare</b></p>
                    </div>
                </div>
            </div>
                    <div className='hidden max-md:flex max-md:justify-center max-md:mb-2 '>
                        <p>All Rights Reserved By <b>DriveShare</b></p>
                    </div>
        </div>
    )
}

export default Register;
