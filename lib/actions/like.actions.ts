"use server"

import { Query } from "node-appwrite";
import { createAdminClient } from "./appwrite";
import { randomUUID } from "crypto";
import { createNotification } from "./activity.actions";

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
const likesCollectionId = process.env.NEXT_PUBLIC_APPWRITE_LIKE_COLLECTION_ID!;
const postsCollectionId = process.env.NEXT_PUBLIC_APPWRITE_POST_COLLECTION_ID!;

export async function addLike(accountId: string, postId: string) {
  try {
    const likeId = randomUUID();
    const { databases } = await createAdminClient();

    // Check if the user has already liked the post
    const existingLikes = await databases.listDocuments(databaseId, likesCollectionId, [
      Query.equal("accountId", accountId), // Filter by accountId
    ]);

    if (existingLikes.documents.length > 0) {
      const documentId = existingLikes.documents[0].$id;

      // Step 4: Delete the document
      await databases.deleteDocument(databaseId, likesCollectionId, documentId);
    }

    // Add a new like document
    await databases.createDocument(databaseId, likesCollectionId, "unique()", {
      accountId,
      postId,
      likeId,
    });
        // Create a notification for the like action
        await createNotification(accountId, "like", postId);

    // Update likeCount in the Posts collection
    const post = await databases.getDocument(databaseId, postsCollectionId, postId);
    const updatedLikeCount = (post.likeCount || 0) + 1;

    await databases.updateDocument(databaseId, postsCollectionId, postId, {
      likeCount: updatedLikeCount,
    });


    return { success: true, message: "Post liked successfully." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getLikeStatus(accountId: string, postId: string) {
    try {
      const { databases } = await createAdminClient();
  
      // Check if the user has already liked the post
      const existingLikes = await databases.listDocuments(databaseId, likesCollectionId, 
                    [
                Query.equal('postId', postId) ,       
                Query.equal('accountId', accountId), // Filter by accountId
                Query.orderDesc("") // Sort by 'createdAt' field in descending order
              ]

      );
  
      const isLiked = existingLikes.total > 0;
      const likeCount = existingLikes.total;
  
      return { isLiked, likeCount };
    } catch (error) {
      console.error("Error fetching like status:", error);
      return { isLiked: false, likeCount: 0 };
    }
  }

  export async function removeLike(accountId: string, postId: string) {
    try {
      const { databases } = await createAdminClient();
  
      // Find the like document for the user and the post
      const existingLikes = await databases.listDocuments(databaseId, likesCollectionId, [
        Query.equal('accountId', accountId),
        Query.equal('postId', postId),
      ]);
  
      if (existingLikes.documents.length === 0) {
        return { success: false, message: 'Like not found.' };
      }
  
      const likeId = existingLikes.documents[0].$id;
  
      // Delete the like document
      await databases.deleteDocument(databaseId, likesCollectionId, likeId);
  
      // Update likeCount in the Posts collection
      const post = await databases.getDocument(databaseId, postsCollectionId, postId);
      const updatedLikeCount = (post.likeCount || 0) - 1;
  
      await databases.updateDocument(databaseId, postsCollectionId, postId, {
        likeCount: updatedLikeCount,
      });
  
      return { success: true, message: 'Post unliked successfully.' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }