import Letters from '@/components/shared/Letters'
import React from 'react'

const page = () => {
  return (
    <section className='md:px-40 px-5 h-screen'>
      <h1 className='text-2xl font-bold text-gray-800 my-5'>My precious memories</h1>
        <Letters/>
    </section>
  )
}

export default page