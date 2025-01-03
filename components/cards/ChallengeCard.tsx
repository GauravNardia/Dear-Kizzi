"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import MatchingCard from "./MatchingCard";
import { fetchAllUsers } from "@/lib/actions/user.actions";


type TaskProps = {
  task: {
    id: string;
    name: string;
    description: string;
    duration: number;
  };
};

interface User {
  id: string;
  accountId:string;
  name: string;
  username: string;
  imgUrl: string;
}

const ChallengeCard = ({ task }: TaskProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const handleParticipate = async () => {
    setLoading(true);
    try {
      const fetchedUsers = await fetchAllUsers(); // Fetch users from Server Action
      // @ts-ignore
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col items-center border rounded-xl shadow-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:shadow-xl transition duration-300 transform hover:-translate-y-1 p-6 space-y-2 max-w-sm ">
      <h2 className="text-2xl font-bold text-gray-800">{task.name}</h2>
      <p className="text-sm text-gray-600 text-center leading-relaxed">
        {task.description}
      </p>
      <div className="text-sm text-gray-500 font-medium">
        ⏳ Duration: <span className="font-semibold">{task.duration / 3600} hours</span>
      </div>

      <AlertDialog>
  <AlertDialogTrigger asChild>
    <Button
      onClick={handleParticipate}
      className="bg-brand text-white px-6 py-2 rounded-full font-semibold text-sm shadow-md hover:bg-brand-100 hover:text-white focus:ring-4 focus:ring-indigo-300 transition"
      variant="outline"
    >
      Participate
    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent className="rounded-md">
    <AlertDialogHeader>
      <AlertDialogTitle className="flex justify-between items-center">
        Matched partners.
        <AlertDialogCancel className="bg-none border-none text-gray-400">
          X
        </AlertDialogCancel>
      </AlertDialogTitle>
      <AlertDialogDescription className="text-md text-gray-600">
        Once they confirm your request, complete the challenge!
      </AlertDialogDescription>
    </AlertDialogHeader>
    {/* Scrollable Section */}
    <div className="max-h-[450px] overflow-y-auto px-2">
      {loading ? (
        <div className="w-full flex justify-center">Loading matches...</div>
      ) : users.length > 0 ? (
        users.map((user) => (
          <MatchingCard
            key={user.accountId}
            id={user.accountId}
            name={user.name}
            username={user.username}
            imgUrl={user.imgUrl}
            taskId={task.id}
            taskName={task.name}
            taskduration={task.duration}
          />
        ))
      ) : (
        <p>No matches found. See other challenges!</p>
      )}
    </div>
  </AlertDialogContent>
</AlertDialog>

    </div>
  );
};

export default ChallengeCard;
