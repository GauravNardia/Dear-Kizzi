"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { addLike, getLikeStatus, removeLike } from "@/lib/actions/like.actions";
import { addComment, getCommentStatus } from "@/lib/actions/comment.actions";
import { redirect } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { deletePost } from "@/lib/actions/post.actions";

interface AudioPostCardProps {
  title: string;
  description: string;
  audioFileUrl: string;
  postId: string;
  user: {
    name: string;
    username: string;
    profilePhotoUrl: string;
    accountId: string;
  };
  currentUser: {
    accountId: string;
  }
}

const AudioPostCard = ({ title, description, audioFileUrl, postId, user, currentUser }: AudioPostCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      const { isLiked, likeCount } = await getLikeStatus(user.accountId, postId);
      setIsLiked(isLiked);
      setLikeCount(likeCount);
    };

    const fetchCommentStatus = async () => {
      const {commentCount} = await getCommentStatus(postId);
      setCommentCount(commentCount);
    }




    fetchLikeStatus();
    fetchCommentStatus();

  }, [user.accountId, postId]);


  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
      setCurrentAudio(audioRef.current);
    }
  };

  const handleLike = async () => {
    try {
      if (isLiked) {
        // If already liked, remove the like from the database
        const response = await removeLike(user.accountId, postId);
        if (response) {
          setIsLiked(false);
          setLikeCount((prev) => prev - 1); // Optimistically update like count
        } else {
          console.error(response);
        }
      } else {
        // If not liked, add the like to the database
        const response = await addLike(user.accountId, postId);
        if (response) {
          setIsLiked(true);
          setLikeCount((prev) => prev + 1); // Optimistically update like count
        } else {
          console.error(response);
        }
      }
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };
  

  const handleComment = async () => {
   redirect(`/post/${postId}`)
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null); // Reset error message before trying to delete
    try {
      const response = await deletePost(postId); // Call your deletePost function
      console.log('Post deleted:', response);
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };



  return (
    <section className="w-full bg-white flex justify-center items-center sm:px-5 ">
      <section className="max-w-md w-full border-b border-gray-200 overflow-hidden">
       <div className="flex ">
       <Link
      href={`/user/${user.accountId}/profile`}
      className="flex relative items-center gap-4 dark:text-white text-gray-800 px-5 py-3 rounded-lg hover:bg-pink-700 transition-all duration-300"
      >
  {/* Profile Photo */}
  <div className=" w-10 h-10 sm:w-14 sm:h-14 flex-shrink-0 rounded-full overflow-hidden border border-white dark:border-gray-500">
    <Image
      src={user.profilePhotoUrl || "/assets/placeholder-profile.jpg"}
      alt="Profile photo"
      width={56}
      height={56}
      className="object-cover w-full h-full"
    />
  </div>

  {/* User Information */}
  <div className="flex flex-col justify-between flex-grow">
    <h2 className="text-base font-semibold lowercase truncate">{user.username}</h2>
  </div>

  {/* More Options */}
      </Link>
  <div className="flex items-center ml-auto -mt-2">
   
   <DropdownMenu>
    <DropdownMenuTrigger asChild className="border-none">
    <Button
    variant="link"
      onClick={(e) => {
        e.preventDefault(); // Prevent the parent `Link` navigation
        alert("Button clicked!");
      }}
      className="text-lg font-semibold bg-transparent border-none focus:outline-none cursor-pointer px-10 "
    >
      ...
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent >
    <DropdownMenuGroup>
          <DropdownMenuItem>
            {
              // @ts-ignore
            user.accountId === currentUser
             ?
             <Button         
             onClick={handleDelete}
             disabled={isDeleting}
             variant="link" className="text-red">
              Delete voice
             </Button>
             : <span className="text-sm text-red">Can't delete others voice</span>
               }
          </DropdownMenuItem>
        </DropdownMenuGroup>
    </DropdownMenuContent>
   </DropdownMenu>
     
  </div>
       </div>



        <div className="flex p-5 space-y-2">
          <div className="w-full -mt-3">
            <h2 className="text-md sm:text-xl font-semibold text-gray-800 dark:text-white">{title}</h2>
            <p className="text-[13px] sm:text-sm w-60 sm:w-80 font-medium text-gray-600 dark:text-gray-100">{description}</p>
          </div>

          <div className="flex justify-end items-center w-full">
            <Button
              onClick={toggleAudio}
              className="w-10 h-10 -mt-5 bg-brand rounded-full flex justify-center items-center shadow-lg hover:bg-brand-100 transition-all"
            >
              {isPlaying ? (
                <Image src="/assets/pause.svg" alt="pause-icon" width={25} height={25} />
              ) : (
                <Image src="/assets/play.svg" alt="play-icon" width={25} height={25} />
              )}
            </Button>
            <audio ref={audioRef} src={audioFileUrl} onEnded={() => setIsPlaying(false)} />
          </div>
        </div>

        <div className="p-2 -mt-5 flex items-center -space-x-5 ">
          <Button variant="link" onClick={handleLike}>
            <Image
              src={isLiked ? "/assets/heart-filled.svg" : "/assets/heart.svg"}
              alt="like"
              width={20}
              height={20}
              className="dark:invert"
            />
            <span className="ml-1">{likeCount}</span>
          </Button>

          <Button variant="link" onClick={handleComment} >
            <Image src="/assets/comment.svg" alt="comment" width={20} height={20} className="dark:invert" />
            <span className="ml-1">{commentCount}</span>
          </Button>
        </div>

      </section>
    </section>
  );
};

export default AudioPostCard;
