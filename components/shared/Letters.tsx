
import { fetchLettersByAccountId } from "@/lib/actions/letter.actions";
import { getCurrentUser } from "@/lib/actions/user.actions";
import Link from "next/link";
import { redirect } from "next/navigation";
import PostCard from "../cards/PostCard";

interface Letter {
  letterId: string;
  title: string;
  snippet: string; // Shortened version of content
  writer: string;
}

const MyLetters = async () => {
  // Fetch current user
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return redirect('/sign-up'); // Handle case where no user is found
  }

  // Fetch letters by accountId
  const fetchedLetters = await fetchLettersByAccountId(currentUser.accountId);

  // Check if there are no letters
  if (fetchedLetters.length === 0) {
    return (
      <div className="p-4 flex flex-col justify-center items-center w-full mt-20 ">
        <h1 className="text-3xl text-pink-500 font-bold">How was your day <span className="text-brand">{currentUser.name} ?</span> </h1> {/* Display message when there are no letters */}
        <Link href="/write-letter" className="font-bold text-white bg-brand p-3 rounded-full mt-5">Click here to write</Link>
      </div>
    );
  }

  return (
    <div className=" grid grid-cols-1 sm:grid-cols-2 gap-3">
      {fetchedLetters.map((letter) => (
        <PostCard
          key={letter.$id}
          title={letter.title}
          snippet={letter.letter.substring(0, 100)} // Limit the snippet to 100 characters
          writer={currentUser.name} // Correct the writer reference
          letterId={letter.letterId}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
};

export default MyLetters;
