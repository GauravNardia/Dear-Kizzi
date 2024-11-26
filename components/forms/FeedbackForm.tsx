"use client";

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
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { shareFeedback } from "@/lib/actions/share.actions";

// Validation schema for the form with audio as a required field.
const formSchema = z.object({
  feedback: z.string().min(2, { message: "Title must be at least 2 characters." })
});



const  FeedbackForm = () => {
  const [loading, setLoading] = useState(false);



  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      feedback: ""
    },
  });

  const router = useRouter();

  // Submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    try {
      await shareFeedback(values);
      router.push("/");
    } catch (error) {
      console.error("Error creating feedback:", error);
    }

    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col justify-start text-left mb-20">
        {/* Title input field */}

        {/* Description textarea field */}
        <FormField
          control={form.control}
          name="feedback"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-2xl font-semibold text-gray-800">Feedback</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your feedback."
                  className="bg-white rounded-lg "
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />



        {/* Submit button */}
        <Button type="submit" className="rounded-full" >  
      {loading ? (
      "Submitting..."
  ) : (
    <>
      <Image
        src="/assets/share02.svg"
        alt="Moments Icon"
        width={20}
        height={20}
        className="invert"
      />
      <span>Submit</span>
    </>
  )}
  
  </Button>
      </form>
    </Form>
  );
}

export default FeedbackForm