"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { createMatch } from "@/lib/actions/activity.actions";


interface Props {
  id: string; // Receiver's ID
  name: string; // Receiver's name
  username: string; // Receiver's username
  imgUrl: string; // Receiver's profile image URL
  taskId: string; // Task ID
  taskName: string; // Task name
}

function MatchingCard({ id, name, username, imgUrl, taskId, taskName }: Props) {
  const [currentUser, setCurrentUser] = useState<{ accountId: string; name: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
    };

    fetchUser();
  }, []);

  const handleMatch = async () => {
    if (!currentUser) {
      alert("You must be logged in to match.");
      return;
    }

    try {
      // Prepare the message for the receiver
      const message = `${currentUser.name} wants to go on ${taskName}`;

      // Call createMatch with the current user's ID, receiver's ID (id), and task details
      await createMatch({
        senderId: currentUser.accountId, // Current user's account ID
        receiverId: id, // Receiver's account ID
        taskId, // Task ID
        message,
      });

      alert("Notification sent!");
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Failed to send notification.");
    }
  };

  return (
    <article className="flex w-full">
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

      <Button
        className="bg-brand rounded-full hover:bg-brand-100"
        onClick={handleMatch}
      >
        Match
      </Button>
    </article>
  );
}

export default MatchingCard;
