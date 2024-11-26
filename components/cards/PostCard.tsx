"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface PostCardProps {
  title: string;
  snippet: string; // Short preview of the letter content
  writer: string;
  letterId: string; // ID to route to the full letter page
  currentUser: {
    name: string;
    accountId: string;
  };
}

const PostCard = ({ title, snippet, writer, letterId }: PostCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/letters/${letterId}`); 
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden cursor-pointer hover:shadow-2xl transform hover:scale-105 transition-transform duration-300"
    >
      {/* Header with Title */}
      <div className="text-black p-4 text-center">
        <h2 className="text-xl font-bold">{title}</h2>
      </div>

      {/* Content Snippet */}
      <div className="p-6 flex flex-col space-y-4">
        <p className="text-gray-700 font-handwritten text-sm leading-relaxed line-clamp-3">
          {snippet}...
        </p>

        {/* Footer with Sender and Read More */}
        <div className="flex items-center justify-between border-t-2 pt-3">
          <span className="text-gray-500 font-medium">— {writer}</span>
          <button className="text-brand font-semibold hover:underline">Read More</button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
