import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate()
  const handleSubmit = (e)=>{
    e.preventDefault();
    window.localStorage.removeItem('ID_user');
    window.localStorage.removeItem('JWT_user');
    navigate('/login');

  }
  useEffect(()=>{
    const token = window.localStorage.removeItem('JWT_user');
    if(!token){
      navigate('/login');
    }
  }, [] )
  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <button type="submit" className='w-[150px] h-[40px] p-2 rounded-xl bg-black text-gray-50'onClick={handleSubmit}>LOG OUT</button>
    </div>
  )
}

export default Dashboard;
