"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { proofSubmission } from "@/lib/actions/proof.actions";

// Ensure that accountId is passed as a prop or retrieved from the context/session
const ProofForm = ({ accountId }: { accountId: string }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [profileFile, setProfileFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileFile(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!profileFile) {
      toast({
        title: "Error",
        description: "Please select a profile photo to upload.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await proofSubmission({ profileFile, accountId }); // Call the backend function
      toast({
        title: "Success",
        description: "Profile photo updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile photo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 flex flex-col justify-start text-left mb-20">
      <div>
        <label className="block text-sm font-medium">Profile Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
        />
      </div>
      <Button type="submit" disabled={loading} className="bg-brand hover:bg-brand-100">
        {loading ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
};

export default ProofForm;
