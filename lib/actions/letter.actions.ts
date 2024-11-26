"use server"
import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import { createAdminClient } from "./appwrite";
import { v4 as uuidv4 } from 'uuid';  // Import uuid


interface Props {
  title: string;
  letter: string;
  mood: string;
  accountId: string;
}

interface Letter {
  letterId: string;
  letter: any;
  $id: string;
  title: string;
  content: string;
  sender: string;
}

const { databases } = await createAdminClient();

export const SubmitLetter = async ({
  title,
  letter,
  mood,
  accountId,
}: Props): Promise<{
  id: string;
  title: string;
  letter: string;
  mood: string;
  accountId: string;
  createdAt: string;
}> => {
  try {
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
    const collectionId = process.env.NEXT_PUBLIC_APPWRITE_LETTERS_COLLECTION_ID!;

    if (!databaseId || !collectionId) {
      throw new Error("Appwrite database or collection ID is not set in environment variables.");
    }

    // Generate a unique letterId using uuid
    const letterId = uuidv4(); // Generate a unique UUID

    // Create the document in Appwrite database
    const document = await databases.createDocument(
      databaseId,
      collectionId,
      letterId,  // Use the unique letterId here
      { title, letter, mood, accountId, letterId } // Include the letterId in the document data
    );

    // Return only the plain fields we need, removing any Appwrite-specific methods or complex objects
    return {
      id: document.$id,
      title: document.title,
      letter: document.letter,
      mood: document.mood,
      accountId: document.accountId,
      createdAt: document.$createdAt,
    };

  } catch (error) {
    console.error("Error creating document:", error);
    throw new Error("Failed to submit the letter. Please try again later.");
  }
};



export const fetchLettersByAccountId = async (accountId: string): Promise<Letter[]> => {
  try {
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
    const collectionId = process.env.NEXT_PUBLIC_APPWRITE_LETTERS_COLLECTION_ID!;

    // Correct query format with Query.equal and adding sorting by 'createdAt' in descending order (-1)
    const letters = await databases.listDocuments(
      databaseId, // Your actual database ID
      collectionId, // Your actual collection ID
      [
        Query.equal('accountId', accountId), // Filter by accountId
        Query.orderDesc("") // Sort by 'createdAt' field in descending order
      ]
    );

    return parseStringify(letters.documents); // Ensure you're accessing the documents correctly
  } catch (error) {
    console.error("Error fetching letters:", error);
    return [];
  }
};


export const fetchLettersByLetterId = async (letterId: string): Promise<Letter[]> => {
  try {
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
    const collectionId = process.env.NEXT_PUBLIC_APPWRITE_LETTERS_COLLECTION_ID!;

    // Correct query format with Query.equal
    const letters = await databases.listDocuments(
      databaseId, // Replace with your actual database ID
      collectionId, // Replace with your actual collection ID
      [
        Query.equal('letterId', letterId) // Correct query format
      ]
    );

    return parseStringify(letters.documents); // Ensure you're accessing the documents
  } catch (error) {
    console.error("Error fetching letters:", error);
    return [];
  }
};