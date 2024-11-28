import Link from 'next/link'
import React from 'react'

const Challenges = () => {
  return (
    <div className='w-full flex flex-col justify-center items-center h-screen'>
        <h1 className="text-black dark:text-white text-lg font-semibold">
          Coming Soon
        </h1>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Until then, enjoy the voices and letters.
        </span>
        <Link href="/write" className="text-brand mt-3 hover:underline">
          Express yourself :)
        </Link>
    </div>
  )
}

export default Challenges