"use client";

import { useState } from "react";
import { z } from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { CommentValidation } from "@/lib/validations/post";
import { addComment } from "@/lib/actions/comment.actions";
import Link from "next/link";

interface CommentProps {
  id: string;
  comment: string;
  accountId: string;
  userImg: string;
}

interface Props {
  postId: string;
  name: string;
  currentUserImg: string;
  accountId: string;
}

function Comment({ postId, currentUserImg, accountId, name }: Props) {
  const [comments, setComments] = useState<CommentProps[]>([]);
  console.log("accid", accountId)


  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      comment: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    const newComment = {
      id: crypto.randomUUID(),
      comment: values.comment,
      accountId,
      userImg: currentUserImg,
    };

    // Optimistically update the UI
    setComments((prevComments) => [newComment, ...prevComments]);
    form.reset();

    try {
      // Call server to add the comment
      await addComment(accountId, postId, values.comment);
    } catch (error) {
      console.error("Failed to add comment:", error);
      // Rollback optimistic update if the server request fails
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== newComment.id)
      );
    }
  };

  return (
    <div>
      {/* Form to Add a Comment */}
      <Form {...form}>
        <form
          className="flex items-center gap-4 dark:bg-gray-800 p-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* User Avatar */}
          <div className="relative w-12 h-12 flex-shrink-0">
            <Image
              src={currentUserImg}
              alt="current_user"
              fill
              className="rounded-full object-cover"
            />
          </div>

          {/* Comment Input Field */}
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    placeholder="Write a comment..."
                    className="bg-transparent border-none focus:ring-0 focus:outline-none placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="bg-brand text-white hover:bg-brand-100 rounded-full px-4 py-2"
          >
            Reply
          </Button>
        </form>
      </Form>

      {/* Render Comments */}
      <h1 className="text-xl font-semibold mt-10">Comments</h1>
      <ul className="mt-4 space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex flex-col gap-3 p-5  rounded-md">
            {/* User Avatar */}
            
            <div className=" flex items-center gap-3 max-w-60">
            <Link href={`/user/${accountId}/profile`} className="relative w-10 h-10">
              <Image
                src={comment.userImg}
                alt="user_avatar"
                fill
                className="rounded-full object-cover"
              />

            </Link>
                <Link href={`/user/${accountId}/profile`} className="text-gray-800 font-medium text-sm sm:text-base">
                   {name}
                 </Link>
            </div>

            {/* Comment Content */}
            <div className="flex-1 dark:bg-gray-700 p-3 rounded-lg">
              <p className="text-sm text-gray-800 dark:text-gray-100">
                {comment.comment}
              </p>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default Comment;
