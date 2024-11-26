"use client";

import { registerUserWithPhoto } from "@/lib/actions/user.actions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

interface Props {
  user: {
    name: string;
    username: string;
    bio: string;
    profilePhoto: string;
    profilePhotoUrl: string;
    accountId: string;
  };
}

const AccountProfile = ({ user }: Props) => {
  const router = useRouter();
  const [preview, setPreview] = useState<string>(user.profilePhotoUrl || "/assets/profile.svg");
  const [profileFile, setProfileFile] = useState<File | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      profilePhoto: user.profilePhotoUrl || "",
      name: user.name,
      username: user.username,
      bio: user.bio,
    },
  });

  const onSubmit = async (data: any) => {
    if (!profileFile) {
      console.log("No profile photo selected.");
      return;
    }

    try {
      const updatedUser = await registerUserWithPhoto({
        name: data.name,
        username: data.username,
        bio: data.bio,
        profileFile,
      });

      console.log("User updated successfully:", updatedUser);
      router.push(`/user/${user.accountId}/profile`);
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setProfileFile(file);

      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    } else {
      setPreview(user.profilePhotoUrl || "/assets/profile.svg");
      setProfileFile(null);
    }
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Profile Photo Section */}
      <div className="flex flex-col items-center space-y-4">
        <label htmlFor="profilePhoto" className="text-lg font-semibold text-gray-700">
          Profile Photo
        </label>
        <div className="relative group">
          {preview ? (
            <img
              src={preview}
              alt="Profile Preview"
              className="rounded-full object-cover w-24 h-24 border-2 border-gray-300 shadow-md hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <Image
              src="/assets/profile.png"
              alt="Default Profile"
              width={96}
              height={96}
              className="rounded-full object-cover border-2 border-gray-300 shadow-md hover:scale-105 transition-transform duration-300"
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-white text-sm font-medium">Change Photo</span>
          </div>
        </div>
        <input
          id="profilePhoto"
          type="file"
          accept="image/*"
          className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
          onChange={handleImageChange}
        />
      </div>

      {/* Name Input */}
      <div>
        <label htmlFor="name" className="text-lg font-semibold text-gray-700">Name</label>
        <Input
          id="name"
          {...register("name", { required: true })}
          placeholder="John Doe"
          className={`rounded-full p-3 ${errors.name ? "border-red-500" : ""}`}
        />
        {errors.name && <p className="text-red text-sm mt-1">Name is required.</p>}
      </div>

      {/* Username Input */}
      <div>
        <label htmlFor="username" className="text-lg font-semibold text-gray-700">Username</label>
        <Input
          id="username"
          {...register("username", { required: true })}
          placeholder="JohnDoe123"
          className={`rounded-full p-3 ${errors.username ? "border-red-500" : ""}`}
        />
        {errors.username && <p className="text-red text-sm mt-1">Username is required.</p>}
      </div>

      {/* Bio Input */}
      <div>
        <label htmlFor="bio" className="text-lg font-semibold text-gray-700">Bio</label>
        <Textarea
          id="bio"
          {...register("bio")}
          placeholder="Tell us about yourself"
          className="rounded-lg p-3"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className={`rounded-full bg-brand hover:bg-brand-100 text-white w-full p-5 ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit and Continue"}
      </Button>
    </form>
  );
};

export default AccountProfile;
