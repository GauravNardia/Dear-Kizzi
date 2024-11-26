import Image from 'next/image';
import React from 'react';

interface Props {
  letter: string; 
  title: string; 
  name: string;
}

const LetterPage = ({ letter, title, name }: Props) => {
  return (
    <div className="min-h-screen w-full mb-16">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-xl">
        <div className="text-center mb-6 border-b-2 pb-3">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        </div>

        <div className="mt-12">
          <div className="text-lg text-gray-700">

            <p className="mb-6 font-handwritten">{letter}</p>

            <div className="text-right text-lg font-handwritten text-gray-800 border-b-2 pb-3 ">
              <p>Sincerely,</p>
              <p>{name}</p>
            </div>
            <div className='flex justify-start items-center w-full mt-3'>
             <Image
             src="/logo.svg"
             width={45}
             height={45}
             alt='logo'
             /> 
             <span className='text-brand font-semibold'>Dear Kizzi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LetterPage;
