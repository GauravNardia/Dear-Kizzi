"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { createMatch } from "@/lib/actions/activity.actions";
import {useToast} from "@/hooks/use-toast"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { MatchDescribeForm } from "../forms/MatchDescribeForm";
import { getCurrentUser } from "@/lib/actions/user.actions";

interface Props {
  id: string; // Receiver's ID
  name: string; // Receiver's name
  username: string; // Receiver's username
  imgUrl: string; // Receiver's profile image URL
  taskId: string; // Task ID
  taskName: string; // Task name
  taskduration: number;
}

function MatchingCard({ id, name, username, imgUrl, taskId, taskName, taskduration }: Props) {
  const [currentUser, setCurrentUser] = useState<{ accountId: string; name: string } | null>(null);
  const { toast } = useToast();


  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
    };

    fetchUser();
  }, []);

  // const handleMatch = async () => {
  //   if (!currentUser) {
  //     alert("You must be logged in to match.");
  //     return;
  //   }

  //   try {
  //     // Prepare the message for the receiver
  //     const message = `wants to go on ${taskName}`;

  //     // Call createMatch with the current user's ID, receiver's ID (id), and task details
  //     await createMatch({
  //       senderId: currentUser.accountId, // Current user's account ID
  //       receiverId: id, // Receiver's account ID
  //       taskId, // Task ID
  //       message,
  //     });

  //     toast({
  //       variant: "default",
  //       title: "Match request sent",
  //       className: "bg-brand text-white"
  //     });
  //   } catch (error) {
  //     console.error("Error sending notification:", error);
      
  //     toast({
  //       variant: "default",
  //       title: "Match request failed, Try again!",
  //       className: "bg-red text-white"
  //     });
  //   }
  // };

  return (
    <section className="flex w-full">
      <div className="flex gap-3 w-full my-3">
        <div className="relative h-12 w-12">
          <Image
            src={imgUrl}
            alt="user_logo"
            fill
            className="rounded-full object-cover"
          />
        </div>

        <div className="flex-1 text-ellipsis">
          <h4 className="text-lg font-semibold text-gray-800">{name}</h4>
          <p className="text-sm text-gray-600 -mt-1">@{username}</p>
        </div>
      </div>

   <AlertDialog>
   <AlertDialogTrigger asChild>
          <Button
            className="bg-brand text-white px-6 py-2 rounded-full font-semibold text-sm shadow-md hover:bg-brand-100 hover:text-white focus:ring-4 focus:ring-indigo-300 transition"
            variant="outline"
          >
            Match
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="rounded-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex justify-between items-center">
              Where do you wanna go for this challenge ?
              <AlertDialogCancel className="bg-none border-none text-gray-400">X</AlertDialogCancel>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-md text-gray-600">
              Describe briefly 
             </AlertDialogDescription>
          </AlertDialogHeader>
            <MatchDescribeForm 
             id={id}
             name={name}
             username={username}
             imgUrl={imgUrl} 
             taskId={taskId} 
             taskName={taskName}
             taskDuration={taskduration}
            />
          </AlertDialogContent>
   </AlertDialog>
    </section>
  );
}

export default MatchingCard;
