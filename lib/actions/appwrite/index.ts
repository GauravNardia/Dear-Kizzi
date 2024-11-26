"use server";

import { Account, Avatars, Client, Databases, Storage } from "node-appwrite";
import { cookies } from "next/headers";
import { appwriteConfig } from "./config";
import { redirect } from "next/navigation";


export const createSessionClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId);

  const session = (await cookies()).get("appwrite-session");

  if (!session || !session.value) redirect('/sign-in')

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
  };
};

export const createAdminClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId)
    .setKey(appwriteConfig.secretKey);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get avatars() {
      return new Avatars(client);
    },
  };
};


export async function uploadProfilePhoto(file: any) {
  try {
    const { storage } = await createAdminClient();

    const response = await storage.createFile(
      appwriteConfig.bucketId, // Bucket ID
      'unique()',       // Use `unique()` to auto-generate a unique ID
      file              // The file object from input
    );
    return response; // Returns the file metadata, including file ID
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

export async function getProfilePhotoUrl(fileId: any) {
  const { storage } = await createAdminClient();

  return storage.getFileView('profile-photos', fileId).href;
}