import { redirect } from "next/navigation";

import { fetchUserByAccountId, getCurrentUser } from "@/lib/actions/user.actions";
import AccountProfile from "@/components/forms/AccountProfile";


async function Page() {
  const user = await getCurrentUser();
  if (!user) return null;

  const userInfo = await fetchUserByAccountId(user.accountId);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const userData = {
    accountId: user.accountId,
    username: userInfo ? userInfo?.username : user.username,
    name: userInfo ? userInfo?.name : user.firstName ?? "",
    bio: userInfo ? userInfo?.bio : "",
    profilePhotoUrl: userInfo ? userInfo?.profilePhotoUrl : user.profilePhotoUrl,
  };

  return (
    <section className="mt-8 sm:mt-0 p-5 sm:p-10">
      <h1 className='text-2xl font-bold text-gray-800'>Edit Profile</h1>
      <p className=' text-base-regular text-light-2'>Make any changes and keep your profile up to date.</p>

      <section className='mt-12'>
        {/* @ts-ignore */}
        <AccountProfile user={userData} />
      </section>
    </section>
  );
}

export default Page;
