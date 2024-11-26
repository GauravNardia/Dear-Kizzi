"use server"
import { randomUUID } from "crypto";
import { createAdminClient } from "./appwrite";
import { Query } from "node-appwrite";
import { parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import { createNotification } from "./activity.actions";

const commentsCollectionId = process.env.NEXT_PUBLIC_APPWRITE_COMMENT_COLLECTION_ID!;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
const postsCollectionId = process.env.NEXT_PUBLIC_APPWRITE_POST_COLLECTION_ID!;


const {databases} = await createAdminClient();

export async function addComment(accountId: string, postId: string, comment: string) {
    try {

        const commentId = randomUUID()
        // Add a new comment document
       const comments = await databases.createDocument(databaseId, commentsCollectionId, 'unique()', {
            commentId,
            postId,
            accountId,
            comment,
        });

                // Create a notification for the like action
                await createNotification(accountId, "comment", postId);

        // Update commentCount in the Posts collection
        const post = await databases.getDocument(databaseId, postsCollectionId, postId);
        const updatedCommentCount = (post.commentCount || 0) + 1;

        await databases.updateDocument(databaseId, postsCollectionId, postId, {
            commentCount: updatedCommentCount,
        });

   return revalidatePath("/")

    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export const fetchCommentsByPostId = async (postId: string) => {
    try {
      const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
      const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COMMENT_COLLECTION_ID!;
  
      // Correct query format with Query.equal
      const comments = await databases.listDocuments(
        databaseId, 
        collectionId,
        [
          Query.equal('postId', postId), // Correct query format
          Query.orderDesc("")
        ]
      );
  
      return parseStringify(comments.documents); // Ensure you're accessing the documents
    } catch (error) {
      console.error("Error fetching comment:", error);
      return [];
    }
  };

  export async function getCommentStatus(postId: string) {
    try {
      const { databases } = await createAdminClient();
  
      // Check if the user has already liked the post
      const existingComment = await databases.listDocuments(databaseId, commentsCollectionId, 
                    [
                Query.equal('postId', postId) ,       
              ]

      );
  
      const isCommented = existingComment.total > 0;
      const commentCount = existingComment.total;
  
      return { isCommented, commentCount };
    } catch (error) {
      console.error("Error fetching comment status:", error);
      return { isCommented: false, commentCount: 0 };
    }
  }