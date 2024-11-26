"use server"

import { createAdminClient } from "./appwrite";


export const shareFeedback = async (values: { feedback: string }) => {
    try {
      const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
      const collectionId = process.env.NEXT_PUBLIC_APPWRITE_FEEDBACK_COLLECTION_ID!;
      const {databases} = await createAdminClient();
      // Create the feedback document
      const response = await databases.createDocument(
        databaseId,
        collectionId,
        "unique()", // Document ID (use unique to auto-generate an ID)
        values // Pass the feedback data
      );
  
      return response;
    } catch (error) {
      console.error("Error submitting feedback:", error);
      throw new Error("Failed to submit feedback");
    }
  };
