"use server"

import { Query } from "node-appwrite";
import { createAdminClient } from "./appwrite";
import { parseStringify } from "../utils";
import { fetchUserByAccountId } from "./user.actions";



const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_POST_COLLECTION_ID!;
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_POST_BUCKET!;
const  ACTIVITY_ID = process.env.NEXT_PUBLIC_APPWRITE_ACTIVITY_COLLECTION_ID!
const USER_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION!
const MATCH_ID = process.env.NEXT_PUBLIC_APPWRITE_MATCHING_COLLECTION_ID!

const {storage, databases} =  await createAdminClient();

export const createNotification = async (
  accountId: string,
  type: "like" | "comment",
  postId: string
) => {
  try {
    const { databases } = await createAdminClient();

    // Step 1: Fetch user details by accountId
    const userResponse = await databases.listDocuments(DATABASE_ID, USER_ID, [
      Query.equal("accountId", accountId) // Fetch the user by accountId
    ]);

    if (userResponse.documents.length === 0) {
      throw new Error("User not found.");
    }

    const user = userResponse.documents[0]; // Assuming the accountId is unique, we take the first user

    // Step 2: Create the notification document with user info
    await databases.createDocument(
      DATABASE_ID,
      ACTIVITY_ID,
      "unique()", // Generate a unique ID for the notification
      {
        accountId,
        type,
        postId,
        userName: user.name, // Add the user's name
        userProfilePicture: user.profilePhotoUrl, // Add the user's profile picture (if available)
        userEmail: user.email, // Optionally add the user's email or other details
      }
    );

    console.log("Notification created successfully.");
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

export const createMatch = async ({
  senderId,
  receiverId,
  taskId,
  message,
}: {
  senderId: string;
  receiverId: string;
  taskId: string;
  message: string;
}) => {
  try {
    // Add notification to the receiver's activity section
    await databases.createDocument(
      DATABASE_ID,
      MATCH_ID, // Replace with your Activity collection ID
      "unique()", // Generate a unique ID
      {
        senderId,
        receiverId,
        taskId,
        message,
        status: "pending", // Notification status
      }
    );

    console.log("Match notification created successfully");
  } catch (error) {
    console.error("Error creating match notification:", error);
    throw error;
  }
};


export const matchNotification = async (notificationId: string) => {
  const { databases } = await createAdminClient();

  try {
    const response = await databases.updateDocument(
      DATABASE_ID,
      MATCH_ID,
      notificationId,
      { status: "confirmed" }
    );

    return response;
  } catch (error) {
    console.error("Error confirming notification:", error);
    throw error;
  }
};


export const getMatch = async (receiverId: string) => {
  try {
    // Ensure environment variables are defined
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE;
    const collectionId = process.env.NEXT_PUBLIC_APPWRITE_MATCHING_COLLECTION_ID;

    if (!databaseId || !collectionId) {
      throw new Error("Database ID or Collection ID is missing in environment variables");
    }

    // Query the database for matches where the current user is the receiver
    const response = await databases.listDocuments(
      databaseId,
      collectionId,
      [
        Query.equal('receiverId', receiverId),
        Query.orderDesc("")
      ]
    );

    if (!response || response.total === 0) {
      console.warn(`No matches found for receiverId: ${receiverId}`);
      return [];
    }

    // Optionally, enhance the response with additional sender details
    const matchesWithSenderDetails = await Promise.all(
      response.documents.map(async (match) => {
        const senderDetails = await fetchUserByAccountId(match.senderId);
        return {
          ...match,
          senderDetails,
        };
      })
    );

    return matchesWithSenderDetails;
  } catch (error) {
    console.error("Error fetching matches:", error);
    return [];
  }
};

export const confirmMatch = async ({
  receiverId,
  senderId,
  taskName,
  status,
}: {
  receiverId: string;
  senderId: string;
  taskName: string;
  status: "pending" | "confirmed" | "cancel"; // Use "confirmed" instead of "confirm"
}) => {
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
  const notificationsCollectionId = process.env.NEXT_PUBLIC_APPWRITE_MATCHING_COLLECTION_ID!;

  // Fetch sender's name dynamically (or pass it directly if already available)
  const senderName = await fetchUserByAccountId(senderId); // A function that fetches the sender's name using their ID
    const name = senderName!.name
  const message =
    status === "confirmed"
      ? `is ready to go on ${taskName} with you.`
      : `doesn't want to go on ${taskName} with you.`;

  try {
    await databases.createDocument(
      databaseId,
      notificationsCollectionId,
      "unique()",
      {
        receiverId,
        senderId,
        message,
        status,
      }
    );
    console.log("Notification sent successfully!");
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};



  
  
export const getNotifications = async (accountId: string) => {
  try {

    const notifications = await databases.listDocuments(
      DATABASE_ID,
      ACTIVITY_ID,
      [
        Query.equal("accountId", accountId), // Ensure the field name matches
        Query.orderDesc("")
      ]

    );

    return notifications.documents;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};


  