import React from 'react'
import Image from 'next/image'

const loading = () => {
  return (
    <section className='w-full h-screen flex justify-center items-center'>
            <Image
            src="/assets/loader.gif"
            alt='loading'
            width={300}
            height={300}
            />
    </section>
  )
}

export default loading