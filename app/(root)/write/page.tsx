"use client"
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { useState } from 'react';

const Write: React.FC = () => {
  // Separate loading state for each button
  const [audioLoading, setAudioLoading] = useState(false);
  const [letterLoading, setLetterLoading] = useState(false);

  // Handle button click with individual loading states
  const handleButtonClick = (destination: string, type: 'audio' | 'letter') => {
    if (type === 'audio') {
      setAudioLoading(true);
    } else if (type === 'letter') {
      setLetterLoading(true);
    }

    setTimeout(() => {
      redirect(destination);
    }, 1000); // Wait for 1 second to show the loading state before redirecting
  };

  return (
    <section className='w-full h-screen flex flex-col mt-12 items-center p-5 md:px-40'>
      <h1 className="text-2xl font-semibold max-w-[800px] gap-[2px] justify-center items-center p-5">
        Write your story, express your emotion.
      </h1>
      <div className="w-full max-w-2xl p-8 rounded-lg border mt-8">
        <h4 className="text-start text-lg text-gray-800 mb-3">We understand your feelings, your emotions.</h4>
        <Button
          className="rounded-full bg-brand hover:bg-brand-100"
          onClick={() => handleButtonClick('/post-audio', 'audio')}
        >
          <Image
            src="/assets/mic.svg"
            alt="letter"
            width={20}
            height={20}
            className="invert"
          />
          {audioLoading ? "Loading..." : "Express yourself"}
        </Button>
      </div>

      <div className="w-full max-w-2xl p-8 rounded-lg border mt-3">
        <h4 className="text-start text-lg mb-3">We respect your stories, your letters. So feel free to write about anything.</h4>
        <Button
          className="rounded-full bg-brand hover:bg-brand-100"
          onClick={() => handleButtonClick('/write-letter', 'letter')}
        >
          <Image
            src="/assets/write.svg"
            alt="letter"
            width={20}
            height={20}
            className="invert"
          />
          {letterLoading ? "Loading..." : "Write your story"}
        </Button>
      </div>
    </section>
  );
};

export default Write;
