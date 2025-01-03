import { redirect } from "next/navigation";
import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUserByAccountId, getCurrentUser } from "@/lib/actions/user.actions";

async function Page() {
  const user = await getCurrentUser();
  if (!user) return redirect('/sign-up'); 

  const userInfo = await fetchUserByAccountId(user.accountId);

  // Redirect if the user is already onboarded
  if (userInfo?.onboarded === true) return redirect("/");

  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="text-3xl font-bold">Onboarding</h1>
      <p className="mt-3 text-lg font-semibold text-light-2">
        Complete your profile to use Dear Kizzi.
      </p>

      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfile user={user} />
      </section>
    </main>
  );
}

export default Page;