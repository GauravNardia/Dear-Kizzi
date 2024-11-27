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

const Page = () => {
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

      alert(`You confirmed the match request from ${match.senderDetails?.name}.`);

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
    <main className="w-full h-screen md:px-40 mx-auto p-4 ">
      {/* Notifications Section */}
      <section className="mt-6 w-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Notifications
        </h2>
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Link
              href={`/post/${notification.postId}`}
                key={notification.$id}
                className="flex items-center gap-2 px-3 pt-2 rounded-lg bg-white"
              >
                <div className="h-12 w-12 relative md:h-14 md:w-14 rounded-full overflow-hidden">
                  <Image
                    src={notification.userProfilePicture || "/default-avatar.png"}
                    alt={`${notification.userName}'s Profile Picture`}
                    width={48}
                    height={48}
                    className="object-cover rounded-full"
                  />
                </div>
                <p className="text-gray-700 text-sm md:text-base">
                  <span className="font-medium text-blue-600">
                    {notification.userName || "Unknown User"}
                  </span>{" "}
                  {notification.type === "like" ? "liked" : "commented on"} your
                  voice.
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p>No notifications to display.</p>
          </div>
        )}
      </section>

      {/* Matches Section */}
      {/* <section className="mt-10 w-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Matches</h2>
        {matches.length > 0 ? (
          <div className="space-y-4">
            {matches.map((match: any) => (
              <article
                key={match.$id}
                className="flex items-center gap-4 p-4 rounded-lg bg-white"
              >
                <div className="h-10 w-10 md:h-20 md:w-20 rounded-full overflow-hidden">
                  <Image
                    src={
                      match.senderDetails?.profilePhotoUrl ||
                      "/default-avatar.png"
                    }
                    alt={`${match.senderDetails?.name || "Unknown Sender"}'s Profile Picture`}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                <p className="flex-1 text-gray-700 text-sm md:text-base">
                  <span className="font-medium text-blue-600">
                    {match.senderDetails?.name || "Unknown Sender"}
                  </span>{" "}
                  <span className=" text-[13px]">{match.message}</span>
                </p>
                {!match.confirmed && (
                  <Button
                    className="bg-blue-600 text-black text-sm md:text-base hover:bg-blue-700"
                    variant="link"
                    onClick={() => handleConfirm(match)}
                  >
                    Confirm
                  </Button>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p>No matches to display.</p>
          </div>
        )}
      </section> */}
    </main>
  );
};

export default Page;
