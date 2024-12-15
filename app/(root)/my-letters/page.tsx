import Letters from '@/components/shared/Letters'
import React from 'react'

const page = () => {
  return (
    <section className=' mb-10 px-5'>
      <h1 className='text-2xl font-bold text-gray-800 py-5 mb-10'>My precious memories</h1>
       <div className='mt-5' >
       <Letters/>
       </div>
    </section>
  )
}

export default page