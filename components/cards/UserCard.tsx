"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";

interface Props {
  id: string;
  name: string;
  username: string;
  imgUrl: string;
}

function UserCard({ id, name, username, imgUrl }: Props) {
  const router = useRouter();

  return (
    <article className='flex w-full'>
      <div className='flex gap-3 w-full my-3'>
        <div className='relative h-12 w-12'>
          <Image
            src={imgUrl}
            alt='user_logo'
            fill
            className='rounded-full object-cover'
          />
        </div>

        <div className='flex-1 text-ellipsis'>
          <h4 className=' text-lg font-semibold text-gray-800'>{name}</h4>
          <p className='text-sm text-gray-600 -mt-1'>@{username}</p>
        </div>
      </div>

      <Button
        className='bg-brand rounded-full hover:bg-brand-100'
        onClick={() => {
         
            router.push(`/user/${id}/profile`);

        }}
      >
        View
      </Button>
    </article>
  );
}

export default UserCard;
