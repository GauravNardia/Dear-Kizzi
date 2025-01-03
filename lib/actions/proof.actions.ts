"use server";

import { createAdminClient } from "./appwrite";
import { ID, Query } from "node-appwrite";

const { databases, storage } = await createAdminClient();

export const proofSubmission = async ({
  profileFile,
  accountId,
}: {
  profileFile: File;
  accountId: string;
}) => {
  try {
    // Validate accountId format (it should follow UID format)
    if (!/^[a-zA-Z0-9_]{1,36}$/.test(accountId)) {
      throw new Error("Invalid account ID format.");
    }

    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
    const collectionId = process.env.NEXT_PUBLIC_APPWRITE_PROOF_COLLECTION_ID!;
    const bucketId = process.env.NEXT_PUBLIC_APPWRITE_PROOF_BUCKET!;

    // Step 1: Upload profile photo to Appwrite storage
    const uploadResponse = await storage.createFile(bucketId, ID.unique(), profileFile);

    // Step 2: Construct the profile photo URL
    const profilePhotoUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${uploadResponse.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;

    // Step 3: Update the user's document with the new profile photo URL
    const updatedUser = await databases.createDocument(
      databaseId,
      collectionId,
      bucketId,
      {
        accountId: accountId,
        proofUrl: profilePhotoUrl
      }
    );

    updateCoins(accountId);

    return updatedUser;  // Return the updated user document
  } catch (error) {
    console.error("Error in proofSubmission:", error);
    throw new Error("Failed to update profile with new photo.");
  }
};


// Assuming the coins are stored in a collection, and each user has a document with their ID.
export const updateCoins = async (accountId: string) => {
  try {
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
    const collectionId = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION!;

    // Step 1: Retrieve the user's document from the database
    const userDoc = await databases.listDocuments(databaseId, collectionId, [
      Query.equal("accountId", accountId),  // Search by accountId field
    ]);
    
    if (userDoc.documents.length === 0) {
      throw new Error("User document not found.");
    }

    console.log("User Document:", userDoc);

    // Step 2: Check if the user already has coins (otherwise initialize them to 0)
    const currentCoins = userDoc.documents[0].coin || 0;  // Ensure the field name is 'coins'

    // Step 3: Add 100 coins to the current balance
    const updatedCoins = currentCoins + 100;

    // Step 4: Update the user's coin balance in the database
    const updatedUser = await databases.updateDocument(
      databaseId,
      collectionId,
      userDoc.documents[0].$id,  // Use the correct document ID
      {
        coin: updatedCoins,  // Update the coin balance (ensure the field name is 'coins')
      }
    );

    return updatedUser;  // Return the updated user document
  } catch (error) {
    console.error("Error updating coins:", error);
    throw new Error("Failed to update coins.");
  }
};
