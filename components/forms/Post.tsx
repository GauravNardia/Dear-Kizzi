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
import { useEffect, useState } from "react";
import { sharePost } from "@/lib/actions/post.actions";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

// Validation schema for the form with audio as a required field.
const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }).max(25, {message:"Title can't be more than 25 characters." }),
  description: z.string().max(30, { message: "sub-title must be at most 30 characters." }),
  audio: z.instanceof(File, { message: "Audio file is required" }),
  accountId: z.string(),
});

interface PostFormProps {
  accountId: string;

}

export function Post({ accountId }: PostFormProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const {toast} = useToast();



  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      accountId: accountId,
    },
  });

  const router = useRouter();

  // Submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    if (!audioFile) {
      form.setError("audio", { message: "Audio file is required" });
      return;
    }
    try {
      await sharePost({ ...values, audio: audioFile });
      router.push("/");
    } catch (error) {
      console.error("Error creating document:", error);
    }

    setLoading(false);
    toast({
      variant: "default",
      title: "Voice posted.",
      className: "bg-brand text-white"
    })
  }

  const handleAudioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      form.setValue("audio", file); // Set the audio file value in the form state
    } else {
      setAudioFile(null);
    }
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col justify-start text-left mb-20">
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

        {/* Description textarea field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-2xl font-semibold text-gray-800">Sub-title</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Great moments of my life"
                  className="bg-white rounded-lg "
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Audio file upload field */}
        <FormField
      control={form.control}
      name="audio"
      render={() => (
        <FormItem className="space-y-6">
          {/* Title & Description */}
          <div className="text-center space-y-2">
            <FormLabel className="text-2xl font-semibold text-left flex text-gray-800">
              Upload Your Audio
            </FormLabel>
            <p className="text-sm flex text-left text-gray-600">
              Supported formats: <span className="font-medium">.mp3, .wav</span>
            </p>
          </div>

          {/* Input Area */}
          <FormControl>
            <div className="relative flex items-center justify-center p-6 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition">
              {audioFile ? (
                <div className="flex flex-col items-center space-y-2">
                  <Image
                    src="/assets/audio.jpg"
                    alt="Audio File Icon"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <p className="text-sm text-gray-800 font-medium">
                    {audioFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    File size: {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <label
                  htmlFor="audio-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M4 3a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V3z" />
                    <path
                      fillRule="evenodd"
                      d="M3 8a1 1 0 011-1h12a1 1 0 011 1v4a4 4 0 11-8 0H5a1 1 0 00-1 1v3a1 1 0 001 1h10a1 1 0 001-1v-3h-1a2 2 0 11-4 0H4a1 1 0 01-1-1V8z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-600 text-sm font-medium">
                    Drag & Drop or <span className="text-brand font-semibold">Browse</span>
                  </span>
                  <Input
                    id="audio-upload"
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </FormControl>

          {/* Message */}
          {audioFile && (
            <p className="text-green-600 text-sm text-center">
              🎉 Audio file "{audioFile.name}" selected successfully!
            </p>
          )}

          <FormMessage />
        </FormItem>
      )}
    />


        {/* Submit button */}
        <Button type="submit" className="rounded-full" >  
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
      <span>Share your moments</span>
    </>
  )}
  
  </Button>
      </form>
    </Form>
  );
}
