import { Post } from '@/components/forms/Post'
import { getCurrentUser } from '@/lib/actions/user.actions'
import React from 'react'

const PostAudio = async() => {
  const user = await getCurrentUser();
  const accountId = user.accountId;
  return (
    <section className='w-full flex flex-col justify-center md:px-60 p-5'>
      <div className='flex flex-col md:p-5'>
      <h1 className='text-2xl font-semibold'>Share a audio post with your personal touch.</h1>
      <p className='text-md py-2'>express emotions to make your mental health better.</p>
      </div>

      <div className='w-full flex flex-col justify-center text-center mt-12  '>
      <Post accountId={accountId}/>
      </div>

    </section>
  )
}

export default PostAudio