"use client";

import { useEffect, useState } from "react";
import {
  getNotifications,
  getMatch,
  confirmMatch,
} from "@/lib/actions/activity.actions";
import { getCurrentUser } from "@/lib/actions/user.actions";
import Image from "next/image";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { convertToRelativeTime } from "@/lib/utils";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";



const Page = () => {
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          setLoading(false);
          return;
        }

        setUser(currentUser);

        const [fetchedNotifications, fetchedMatches] = await Promise.all([
          getNotifications(currentUser.accountId),
          getMatch(currentUser.accountId),
        ]);


        const updatedMatches = fetchedMatches.map((match: any) => {
          const isConfirmed = localStorage.getItem(`match_${match.$id}`);
          return isConfirmed ? { ...match, confirmed: true } : match;
        });

        setNotifications(fetchedNotifications || []);
        setMatches(updatedMatches || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleConfirm = async (match: any) => {
    try {
      await confirmMatch({
        receiverId: match.senderId,
        senderId: user.accountId,
        taskName: match.message,
        status: "confirmed",
      });

      toast({
        variant: "default",
        title: "You confirmed the request",
        className: "bg-brand text-white"
      })

      setMatches((prevMatches) =>
        prevMatches.map((m) =>
          m.$id === match.$id ? { ...m, confirmed: true } : m
        )
      );

      localStorage.setItem(`match_${match.$id}`, "confirmed");
    } catch (error) {
      console.error("Failed to confirm match request:", error);
      alert("Unable to confirm the match request. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div>
          <Image
            src="/assets/loader.gif"
            alt='loading'
            width={300}
            height={300}
            />
        </div>
            <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">You need to log in to see this page.</p>
      </div>
    );
  }

  return (
    <Tabs defaultValue="activity" className="w-full h-screen md:px-40 mx-auto">

    <TabsList className="grid w-full grid-cols-2 fixed sm:relative top-16 sm:top-0 z-10 sm:z-auto">
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="matches">Matches</TabsTrigger>
    </TabsList>

    <TabsContent value="activity" className=" mt-14 sm:mt-0">
      {/* Notifications Section */}
      <section className="mt-6 w-full px-3">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Activity
        </h2>
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Link
              href={`/post/${notification.postId}`}
                key={notification.$id}
                className="flex items-center gap-2 px-3 pt-2 rounded-lg bg-white"
              >
                <div className="h-8 w-8 relative md:h-14 md:w-14 rounded-full overflow-hidden">
                  <Image
                    src={notification.userProfilePicture || "/default-avatar.png"}
                    alt={`${notification.userName}'s Profile Picture`}
                    width={48}
                    height={48}
                    className="object-cover rounded-full w-full h-full"
                  />
                </div>
                <p className="text-gray-700 text-[13px] sm:text-base">
                  <span className="font-medium text-blue-600">
                    {notification.userName || "Unknown User"}
                  </span>{" "}
                  {notification.type === "like" ? "liked" : "commented on"} your
                  voice.
                </p>

                <span className="text-[13px] text-right">{convertToRelativeTime(notification.$createdAt)}</span>
              </Link>
            ))}

          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p>No notifications to display.</p>
          </div>
        )}
      </section>
      </TabsContent>

      <TabsContent
        value="matches"
        className=" mt-14 sm:mt-0"
      >
      {/* Matches Section */}
      <section className=" mt-6  w-full px-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Matches
        </h2>
        {matches.length > 0 ? (
          <div className="space-y-4">
            {matches.map((match: any) => (
              <article
                key={match.$id}
                className="flex items-center gap-4 py-2 rounded-lg bg-white"
              >
                <div className="h-8 w-8 md:h-14 md:w-14 rounded-full overflow-hidden">
                  <Image
                    src={
                      match.senderDetails?.profilePhotoUrl ||
                      "/default-avatar.png"
                    }
                    alt={`${match.senderDetails?.name || "Unknown Sender"}'s Profile Picture`}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1 flex-col text-gray-700 text-sm md:text-base">
                  <span className="font-medium text-blue-600">
                    {match.senderDetails?.name || "Unknown Sender"}{" "}
                  <span className=" text-[13px] text-gray-500">{match.message}</span>
                  </span>{" "}
                </div>
                  <span className="text-[13px] text-right">{convertToRelativeTime(match.$createdAt)}</span>

            <AlertDialog>
             <AlertDialogTrigger asChild>
             {match.status === "pending" ? (
                 <Button className="bg-brand text-white hover:bg-brand-100" >
                   Confirm
                 </Button>
               ) : (
                 <p className="text-brand text-[14px] sm:base ">Matched</p>
               )}
           </AlertDialogTrigger>
           <AlertDialogContent className="rounded-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex justify-between items-center">
              Detailes.
              <AlertDialogCancel className="bg-none border-none text-gray-400">X</AlertDialogCancel>
            </AlertDialogTitle>
          </AlertDialogHeader>
          <span className=" text-[13px] text-gray-500">{match.describe}</span>
          {match.status === "pending" ? (
                 <Button className="bg-brand text-white hover:bg-brand-100"  onClick={() => handleConfirm(match)}>
                   Confirm
                 </Button>
               ) : (
                 <p className="text-brand text-[14px] sm:base ">Matched</p>
               )}
          </AlertDialogContent>
           </AlertDialog>

              </article>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <h1 className="text-xl font-semibold text-gray-800">No matches to display</h1>
            <p className="text-gray-600 text-sm">participate in challenges to match.</p>
            <Link href="/challenges">
            <Button  className="bg-brand hover:bg-brand-100 text-white mt-5">
              Click here
            </Button>
            </Link>
          </div>
        )}
      </section>
      </TabsContent>


    </Tabs>
  );
};

export default Page;