import FeedbackForm from '@/components/forms/FeedbackForm'
import React from 'react'

const Feedback = () => {
  return (
    <section>
        <div>
            <h1 className='font-semibold text-left text-xl'>
                Share your feedback
            </h1>
            <p className='text-gray-600 text-[15px]'>
                your feedback help us to improve our system.
            </p>
        </div>
        <div className='mt-8'>
        <FeedbackForm/>
        </div>
    </section>
  )
}

export default Feedback