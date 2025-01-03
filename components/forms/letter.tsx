"use client"; // This is necessary for client-side redirection

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { useRouter } from "next/navigation";
import { SubmitLetter } from "@/lib/actions/letter.actions";
import Image from "next/image";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import MDEditor from '@uiw/react-md-editor';
import { Textarea } from "../ui/textarea";

// Validation schema for the form.
const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  letter: z.string().min(1, { message: "Letter content cannot be empty." }),
  mood: z.string().nonempty({ message: "Please select your mood." }),
  accountId: z.string(),
});

interface LetterFormProps {
  accountId: string;
}

export function LetterForm({ accountId }: LetterFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Define the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      letter: "",
      mood: "",
      accountId: accountId,
    },
  });

  const router = useRouter();

  // Define the submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      // Submit the form data
      await SubmitLetter(values);

      // Redirect to the home page after successful form submission
      router.push("/my-letters");
      toast({
        variant: "default",
        title: "Letter saved.",
        className: "bg-brand text-white",
      });
    } catch (error) {
      console.error("Error creating document:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your letter. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mb-40 mt-20">
        {/* Title input field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-2xl font-semibold text-gray-800">Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="The moments"
                  className="bg-white p-5 py-6 rounded-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Mood select field */}
        <FormField
          control={form.control}
          name="mood"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-2xl font-semibold text-gray-800">How's your mood?</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-[180px] bg-transparent border-black text-gray-800 border-gray-300 rounded-full text-md">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Mood</SelectLabel>
                      <SelectItem value="happy">Happy</SelectItem>
                      <SelectItem value="sad">Sad</SelectItem>
                      <SelectItem value="angry">Angry</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Letter editor field */}
        <FormField
          control={form.control}
          name="letter"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-2xl font-semibold text-gray-800">Write your thoughts</FormLabel>
              <FormControl>
              <Textarea
                  {...field}
                  placeholder="Write your letter"
                  rows={8}
                  className="w-full p-4 border border-gray-300 rounded-xl bg-white focus:ring focus:ring-brand focus:outline-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit button */}
        <Button type="submit" className="rounded-full bg-brand hover:bg-brand-100" disabled={loading}>
          {loading ? (
            "Saving..."
          ) : (
            <>
              <Image
                src="/assets/save.svg"
                alt="Moments Icon"
                width={20}
                height={20}
                className="invert"
              />
              <span>Save your moments</span>
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
