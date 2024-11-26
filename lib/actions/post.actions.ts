"use server"

// Import types and necessary components from Appwrite
import { ID } from "appwrite";
import { createAdminClient } from "./appwrite";
import { parseStringify } from "../utils";
import { Query } from "node-appwrite";
import { randomUUID } from "crypto";
import { redirect } from "next/navigation";

// Define the props for sharePost
interface SharePostProps {
  title: string;
  description: string;
  audio: File; // Accept File for uploading or URL if already uploaded
  accountId: string;
}

// Define the Appwrite database and storage IDs
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_POST_COLLECTION_ID!;
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_POST_BUCKET!;

const {storage, databases} =  await createAdminClient();

export async function sharePost({ title, description, audio, accountId }: SharePostProps) {
  try {

    // Check if `audio` is a File object to upload it to Appwrite

      const response = await storage.createFile(BUCKET_ID, ID.unique(), audio);
      const audioFileUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!}/storage/buckets/${BUCKET_ID}/files/${response.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
     const postId = randomUUID();
     

    // Now create the document in the database with audio URL and other details
    const document = await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        title,
        description,
         audioFileUrl, // Change this to match the field name in your schema
        accountId,
        postId
      });

    return document;
  } catch (error) {
    console.error("Error sharing post:", error);
    throw error;
  }
}


export const fetchAllPosts = async () => {
  try {
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
    const collectionId = process.env.NEXT_PUBLIC_APPWRITE_POST_COLLECTION_ID!;

    // Correct query format with Query.equal and adding sorting by 'createdAt' in descending order (-1)
    const posts = await databases.listDocuments(
      databaseId, // Your actual database ID
      collectionId, // Your actual collection ID
      [
        Query.orderDesc("")
      ]
    );
    return parseStringify(posts.documents); // Ensure you're accessing the documents correctly
  
  } catch (error) {
    console.error("Error fetching letters:", error);
    return [];
  }
};

export const fetchPostByPostId = async (postId: string) => {
  try {
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
    const collectionId = process.env.NEXT_PUBLIC_APPWRITE_POST_COLLECTION_ID!;

    // Correct query format with Query.equal and adding sorting by 'createdAt' in descending order (-1)
    const post = await databases.listDocuments(
      databaseId, // Your actual database ID
      collectionId, // Your actual collection ID
      [
        Query.equal('postId', postId), // Filter by accountId
        Query.orderDesc("") // Sort by 'createdAt' field in descending order
      ]
    );

    return post.documents[0]; // Ensure you're accessing the documents correctly
  } catch (error) {
    console.error("Error fetching post:", error);
    return [];
  }
};

export const deletePost = async (postId: string) => {
  try {
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
    const postCollectionId = process.env.NEXT_PUBLIC_APPWRITE_POST_COLLECTION_ID!;
    const notificationCollectionId = process.env.NEXT_PUBLIC_APPWRITE_ACTIVITY_COLLECTION_ID!;

    // Fetch the post document by filtering by postId
    const postList = await databases.listDocuments(
      databaseId,
      postCollectionId,
      [
        Query.equal("postId", postId), // Filter by postId
        Query.limit(1), // We only need one document with this postId
      ]
    );

    // Check if the post exists
    if (postList.documents.length === 0) {
      console.error("Post not found");
      throw new Error("Post not found");
    }

    // Get the document ID of the first (and only) document
    const documentId = postList.documents[0].$id;

    // Delete the post document
    const deletePostResponse = await databases.deleteDocument(databaseId, postCollectionId, documentId);
    console.log("Post deleted successfully:", deletePostResponse);

    // Delete all notifications related to this post
    await deleteNotificationsByPostId(postId);

    return deletePostResponse;

  } catch (error) {
    console.error("Error deleting post:", error);
    throw new Error("Failed to delete post");
  }
};

// Helper function to delete notifications related to the postId
const deleteNotificationsByPostId = async (postId: string) => {
  try {
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
    const notificationCollectionId = process.env.NEXT_PUBLIC_APPWRITE_ACTIVITY_COLLECTION_ID!;

    // Fetch all notifications related to the postId
    const notifications = await databases.listDocuments(
      databaseId,
      notificationCollectionId,
      [
        Query.equal("postId", postId), // Filter notifications by postId
      ]
    );

    // Loop through all notifications and delete them
    for (const notification of notifications.documents) {
      await databases.deleteDocument(databaseId, notificationCollectionId, notification.$id);
      console.log("Deleted notification:", notification.$id);
    }

  } catch (error) {
    console.error("Error deleting notifications:", error);
    throw new Error("Failed to delete notifications");
  }
};