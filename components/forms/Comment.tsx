"use client";

import { z } from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { CommentValidation } from "@/lib/validations/post";
import { addComment } from "@/lib/actions/comment.actions";

interface Props {
  postId: string;
  currentUserImg: string;
  accountId: string;
}

function Comment({ postId, currentUserImg, accountId }: Props) {
  const pathname = usePathname();

  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      comment: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addComment(accountId, postId, values.comment);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        className="flex items-center gap-4  dark:bg-gray-800 p-4 "
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
  );
}

export default Comment;
