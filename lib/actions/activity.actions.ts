"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "./appwrite";
import { fetchUserByAccountId } from "./user.actions";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
const ACTIVITY_ID = process.env.NEXT_PUBLIC_APPWRITE_ACTIVITY_COLLECTION_ID!;
const USER_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION!;
const MATCH_ID = process.env.NEXT_PUBLIC_APPWRITE_MATCHING_COLLECTION_ID!;

const { databases } = await createAdminClient();

/**
 * Create a notification for a user.
 */
export async function createNotification(accountId: string, type: "like" | "comment", postId: string) {
  try {
    const userResponse = await databases.listDocuments(DATABASE_ID, USER_ID, [
      Query.equal("accountId", accountId),
    ]);

    if (userResponse.documents.length === 0) throw new Error("User not found.");

    const user = userResponse.documents[0];

    await databases.createDocument(DATABASE_ID, ACTIVITY_ID, "unique()", {
      accountId,
      type,
      postId,
      userName: user.name,
      userProfilePicture: user.profilePhotoUrl,
      userEmail: user.email,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
}

/**
 * Create a match notification.
 */
export async function createMatch({
  senderId,
  receiverId,
  taskId,
  message,
  describe,
}: {
  senderId: string;
  receiverId: string;
  taskId: string;
  message: string;
  describe: string;
}) {
  try {
    console.log({
      DATABASE_ID,
      MATCH_ID,
      payload: {
        senderId,
        receiverId,
        taskId,
        message,
        describe,
      },
    });

    const response = await databases.createDocument(DATABASE_ID, MATCH_ID, ID.unique(), {
      senderId,
      receiverId,
      taskId,
      message,
      describe,
      status: "pending"
    });
    return response; // Return the response if needed in the caller
  } 
    catch (error:any) {
      console.error("Full Error Object:", error);
      console.error("Error message:", error.message);
      console.error("Error response:", error.response);
      if (error.response) {
        console.error("Response details:", JSON.stringify(error.response, null, 2));
      }
 
      throw error;
    }
  }


/**
 * Fetch all matches for a specific receiver.
 */
export async function getMatch(receiverId: string) {
  try {
    const response = await databases.listDocuments(DATABASE_ID, MATCH_ID, [
      Query.equal("receiverId", receiverId),
      Query.orderDesc("")
    ]);



    if (response.documents.length === 0) return [];

    return Promise.all(
      response.documents.map(async (match) => {
        const senderDetails = await fetchUserByAccountId(match.senderId);
        return { ...match, senderDetails };
      })
    );

  } catch (error) {
    console.error("Error fetching matches:", error);
    return [];
  }
}

/**
 * Update the status of a match.
 */
export async function confirmMatch({
  receiverId,
  senderId,
  taskName,
  status,
}: {
  receiverId: string;
  senderId: string;
  taskName: string;
  status: "pending" | "confirmed" | "cancel";
}) {
  try {
    const documents = await databases.listDocuments(DATABASE_ID, MATCH_ID, [
      Query.equal("receiverId", receiverId),
      Query.equal("senderId", senderId),
    ]);

    if (documents.total > 0) {
      const documentId = documents.documents[0].$id;
      const message =
        status === "confirmed"
          ? `is ready for ${taskName.slice(15,40)}`
          : `is not ready for ${taskName}`;

      await databases.updateDocument(DATABASE_ID, MATCH_ID, documentId, {
        status,
        message,
      });
    } else {
      console.log("No matching document found.");
    }
  } catch (error) {
    console.error("Error confirming match:", error);
    throw error;
  }
}

/**
 * Fetch notifications for a specific user.
 */
export async function getNotifications(accountId: string) {
  try {
    const notifications = await databases.listDocuments(DATABASE_ID, ACTIVITY_ID, [
      Query.equal("accountId", accountId),
      Query.orderDesc("")
    ]);
    return notifications.documents;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}
