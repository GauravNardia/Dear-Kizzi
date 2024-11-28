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
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { useRouter } from "next/navigation"; // Import useRouter for client-side navigation
import { SubmitLetter } from "@/lib/actions/letter.actions";
import Image from "next/image";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Validation schema for the form.
const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  letter: z.string().min(10, { message: "Letter must be at least 10 characters." }),
  mood: z.string().nonempty({ message: "Please select your mood." }),
  accountId: z.string()
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
      accountId: accountId
    },
  });

  const router = useRouter(); // Initialize useRouter

  // Define the submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      // Submit the form data to Appwrite
      await SubmitLetter(values);

      // Redirect to the home page after successful form submission
      router.push('/my-letters'); // Use router.push() for redirection
    } catch (error) {
      console.error("Error creating document:", error);
    }finally{
      setLoading(false);
      toast({
        variant: "default",
        title: "Letter saved.",
        className: "bg-brand text-white"
      })
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
              <FormLabel className="text-2xl font-semibold  text-gray-800">How's your mood?</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-[180px] bg-transparent border-black text-gray-800 border-gray-300 rounded-full text-md">
                    <SelectValue placeholder="select" />
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

        {/* Letter textarea field */}
        <FormField
          control={form.control}
          name="letter"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-2xl font-semibold text-gray-800">Write your thoughts</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="The moments"
                  className="bg-white h-60 rounded-lg "
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit button */}
        <Button type="submit" className="rounded-full">
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
