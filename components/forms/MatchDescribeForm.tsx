"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { createMatch } from "@/lib/actions/activity.actions";
import { getCurrentUser } from "@/lib/actions/user.actions";

// Validation schema for the form
const formSchema = z.object({
  describe: z.string().min(1, "Please provide a description."),
});

interface Props {
  name: string;
  username: string;
  imgUrl: string;
  id: string; // Receiver's ID
  taskId: string; // Task ID
  taskName: string; // Task name
  taskDuration: number;
}

export function MatchDescribeForm({ id, taskId, taskName, taskDuration }: Props) {
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    accountId: string;
    name: string;
  } | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      describe: "",
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setCurrentUser(user);
        } else {
          throw new Error("User not found");
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
        toast({
          title: "Error",
          description: "Failed to fetch user data.",
          variant: "destructive",
        });
      }
    };

    fetchUser();
  }, [toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to match.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      senderId: currentUser.accountId,
      receiverId: id,
      taskId,
      message: `wants to go on ${taskName}`,
      describe: values.describe,
      duration: taskDuration,
    };

    setLoading(true);

    try {
      await createMatch(payload);
      toast({
        title: "Success",
        description: "Request sent successfully.",
        variant: "default",
      });
      router.push("/challenges");
    } catch (error: any) {
      const errorMessage =
        error.message || "Failed to send the request. Please try again.";
      console.error("Error creating match:", error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex flex-col justify-start text-left mb-20"
      >
        <FormField
          control={form.control}
          name="describe"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="ex: Starbucks for coffee date, Seven Seas Theatre for movie night at this time, etc."
                  className="bg-white rounded-lg"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="rounded-full bg-brand hover:bg-brand-100" disabled={loading}>
          {loading ? (
            "Sharing..."
          ) : (
            <>
              <Image
                src="/assets/share02.svg"
                alt="Moments Icon"
                width={20}
                height={20}
                className="invert"
              />
              <span>Send request</span>
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
