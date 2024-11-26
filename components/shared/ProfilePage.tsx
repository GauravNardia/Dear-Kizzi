"use client";

import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface Props {
  user: {
    name: string;
    username: string;
    bio: string;
    profilePhotoUrl: string;
    followers: number;
    websiteUrl?: string;
    accountId: string;
  };
  accountId: string;
}

const ProfilePage = ({ user, accountId }: Props) => {
  const router = useRouter();

  return (
    <section className="w-full h-screen">
      {/* Header */}
      <header className="flex items-center flex-row justify-between items-center text-left ">
        {/* Profile Info */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <span>{user.name}</span>
          </h1>
          <p className="text-sm text-gray-500">@{user.username}</p>
          <p className="text-gray-600 font-semibold text-sm mt-4">{user.bio || "No bio available."}</p>

          {/* Followers & Website */}
          {/* <div className="flex items-center space-x-2 text-gray-400 text-sm mt-3">
            <p>{user.followers} followers</p>
            {user.websiteUrl && (
              <a
                href={user.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-blue-500"
              >
                {user.websiteUrl}
              </a>
            )}
          </div> */}
        </div>

        {/* Profile Image */}
        <div className="relative w-20 h-20 rounded-full overflow-hidden">
          <Image
            src={user.profilePhotoUrl}
            alt={`${user.name}'s Profile`}
            width={80}
            height={80}
            className="object-cover w-full h-full"
          />
        </div>
      </header>

      {/* Edit Button */}
      {user.accountId === accountId && (
        <div className="mt-4 flex justify-center sm:justify-start">
          <Button
            onClick={() => router.push(`/user/${user.accountId}/profile/edit`)}
            className="w-full bg-brand text-white px-4 py-2 rounded-full text-sm hover:bg-brand-100 transition"
          >
            Edit Profile
          </Button>
        </div>
      )}

      {/* Navigation Tabs */}
      {/* <nav className="mt-6 border-t border-gray-700 pt-3 flex justify-around text-gray-400 text-sm">
        <button className="flex-1 text-center py-2 hover:text-white focus:text-white">
          Threads
        </button>
        <button className="flex-1 text-center py-2 hover:text-white focus:text-white">
          Replies
        </button>
        <button className="flex-1 text-center py-2 hover:text-white focus:text-white">
          Reposts
        </button>
      </nav> */}

      {/* Post Section */}
      {/* <div className="mt-4 bg-gray-800 p-4 rounded-lg">
        <textarea
          placeholder="What's new?"
          className="w-full bg-transparent text-white placeholder-gray-400 border-none outline-none resize-none"
        ></textarea>
        <div className="flex justify-end mt-2">
          <Button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-500 transition">
            Post
          </Button>
        </div>
      </div> */}

      {/* Complete Profile Section */}
      {/* <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <p className="text-white font-medium mb-3">Finish your profile</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center text-gray-400">
            <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
              <Image
                src="/icons/thread.svg"
                alt="Create Thread"
                width={24}
                height={24}
              />
            </div>
            <p className="mt-2 text-sm">Create Thread</p>
            <button className="mt-1 text-blue-500 text-sm hover:underline">
              Create
            </button>
          </div>
          <div className="flex flex-col items-center text-gray-400">
            <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
              <Image
                src="/icons/photo.svg"
                alt="Add Profile Photo"
                width={24}
                height={24}
              />
            </div>
            <p className="mt-2 text-sm">Add Profile Photo</p>
            <p className="text-green-500 mt-1">Done</p>
          </div>
          <div className="flex flex-col items-center text-gray-400">
            <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
              <Image
                src="/icons/follow.svg"
                alt="Follow Profiles"
                width={24}
                height={24}
              />
            </div>
            <p className="mt-2 text-sm">Follow 5 Profiles</p>
            <p className="text-green-500 mt-1">Done</p>
          </div>
        </div>
      </div> */}
    </section>
  );
};

export default ProfilePage;
