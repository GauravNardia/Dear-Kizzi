import ProfilePage from "@/components/shared/ProfilePage";
import { fetchUserByAccountId, getCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { FC } from "react";

const Profile = async ({ params }: { params: Promise<{ accountId: string }> }) => {
  const accountId  = (await params).accountId;
  const user = await fetchUserByAccountId(accountId);
  const currentUser = await getCurrentUser();
  
  if(!user){
    redirect('/onboarding');
  }


  return (
    <section className="md:px-40 px-5 mt-20">
       {/* @ts-ignore */}
      <ProfilePage user={user} accountId={currentUser.accountId} />
    </section>
  );
};

export default Profile;
