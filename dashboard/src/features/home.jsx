import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div>
       <div className='w-full h-screen flex flex-col gap-20 justify-center items-center'>
      <Link to='/login' className='w-[150px] h-[40px] p-2 rounded-xl bg-green-950 text-gray-50 text-center'>login</Link>
      <Link to='/register' className='w-[150px] h-[40px] p-2 rounded-xl bg-cyan-950 text-gray-50 text-center'>sign up</Link>
    </div>
    </div>
  )
}

export default Home
