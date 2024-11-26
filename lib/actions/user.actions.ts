"use server";

import { Query, ID } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { appwriteConfig } from "./appwrite/config";
import { createAdminClient, createSessionClient } from "./appwrite";

const { databases, storage } = await createAdminClient();

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
const collectionId = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION!;


const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("email", [email])],
  );

  return result.total > 0 ? result.documents[0] : null;
};

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);

    return session.userId;
  } catch (error) {
    handleError(error, "Failed to send email OTP");
  }
};

export const createAccount = async ({
  name,
  email,
}: {
  name: string;
  email: string;
}) => {
  const existingUser = await getUserByEmail(email);

  const accountId = await sendEmailOTP({ email });
  if (!accountId) throw new Error("Failed to send an OTP");

  if (!existingUser) {
    const { databases } = await createAdminClient();

    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        name,
        email,
        accountId,
      },
    );
  }
  return parseStringify({ accountId });
};

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createSession(accountId, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "Failed to verify OTP");
  }
};

export const getCurrentUser = async () => {
  try {
    const { databases, account } = await createSessionClient();

    const result = await account.get();

    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", result.$id)],
    );

    if (user.total <= 0) return null;

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

export const signOutUser = async () => {
  const { account } = await createSessionClient();

  try {
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    handleError(error, "Failed to sign out user");
  } finally {
    redirect("/sign-in");
  }
};

export const signInUser = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email);

    // User exists, send OTP
    if (existingUser) {
      await sendEmailOTP({ email });
      return parseStringify({ accountId: existingUser.accountId });
    }

    return parseStringify({ accountId: null, error: "User not found" });
  } catch (error) {
    handleError(error, "Failed to sign in user");
  }
};

export const fetchUserByAccountId = async (accountId: string) => {
  try {
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
    const collectionId = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION!;

    const users = await databases.listDocuments(
      databaseId,
      collectionId,
      [Query.equal('accountId', accountId)]
    );

    // Return the first user document if it exists, otherwise return null
    return users.documents.length > 0 ? users.documents[0] : null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const registerUserWithPhoto = async ({
  name,
  username,
  bio,
  profileFile,  // The profile file you want to upload
}: {
  name: string;
  username: string;
  bio: string;
  profileFile: File;  // The profile photo to upload
}) => {
  try {
    const user = await getCurrentUser()
    const accountId = user.accountId;
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
    const collectionId = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION!;
    const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET!;

    // Step 1: Find user by accountId
    const searchResult = await databases.listDocuments(databaseId, collectionId, [
      Query.equal("accountId", accountId),  // Search by accountId field
    ]);

    if (searchResult.documents.length === 0) {
      throw new Error("User not found");
    }

    const userDocument = searchResult.documents[0];  // Assuming there's only one user with the given accountId

    // Step 2: Upload profile photo to Appwrite storage
    const uploadResponse = await storage.createFile(bucketId, ID.unique(), profileFile);

    const profilePhotoUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${uploadResponse.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;

    // Step 3: Update user document in Appwrite database with new fields
    const updatedUser = await databases.updateDocument(
      databaseId,
      collectionId,
      userDocument.$id,  // Use the existing user document ID
      {
        name,  // Update name
        username,  // Update username
        bio,  // Update bio
        profilePhotoUrl,  // Update profile photo URL
        onboarded: true
      }
    );
    
    return parseStringify(updatedUser);
  } catch (error) {
    console.error("Error in updateUserByAccountId:", error);
    throw new Error("Failed to update user with new fields.");
  }
};

export const fetchAllUsers = async () => {
  try {
    const { databases } = await createAdminClient();
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
      process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION!
    );

    // Return plain user data
    return response.documents.map((doc: any) => ({
      accountId: doc.accountId,
      name: doc.name,
      username: doc.username,
      imgUrl: doc.profilePhotoUrl,
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const fetchUsers = async ({
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
}: {
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
}) => {
  try {
    const { databases } = await createAdminClient();
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
    const collectionId = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION!;

    // Calculate the offset for pagination
    const offset = (pageNumber - 1) * pageSize;

    // Build query
    const queries: string[] = [];
    if (searchString.trim()) {
      queries.push(Query.search("name", searchString));
    }
  // @ts-ignore
    const response = await databases.listDocuments(databaseId, collectionId, queries, pageSize, offset);

    // Check if there is a next page
    const isNext = response.total > offset + response.documents.length;

    return { users: response.documents, isNext };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
};

