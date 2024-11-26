import ProfilePage from "@/components/shared/ProfilePage";
import { fetchUserByAccountId } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { FC } from "react";

const Profile = async ({ params }: { params: Promise<{ accountId: string }> }) => {
  const accountId  = (await params).accountId;
  const user = await fetchUserByAccountId(accountId);
  
  if(!user){
    redirect('/onboarding');
  }


  return (
    <section className="md:px-40 px-5 mt-20">
       {/* @ts-ignore */}
      <ProfilePage user={user} accountId={accountId} />
    </section>
  );
};

export default Profile;
