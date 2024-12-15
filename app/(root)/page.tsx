import AudioPostCard from "@/components/cards/AudioPostCard";
import { fetchAllPosts } from "@/lib/actions/post.actions";
import ChallengesPage from '@/components/shared/challenges'
import { fetchUserByAccountId, getCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import Link from "next/link";
import { Suspense } from "react";

// Helper function to fetch posts with user data
const fetchPostsWithUsers = async () => {
  const posts = await fetchAllPosts();
  const postsWithUsers = await Promise.all(
    posts.map(async (post: any) => {
      const user = await fetchUserByAccountId(post.accountId);
      return { ...post, user };
    })
  );
  return postsWithUsers;
};


// Skeleton loader for posts
const PostSkeleton = () => (
  <div className="animate-pulse flex flex-col gap-3">
    {[...Array(5)].map((_, index) => (
      <div
        key={index}
        className="h-20 w-full bg-gray-200 dark:bg-gray-800 rounded"
      ></div>
    ))}
  </div>
);



// Optimized Home Component
const Home = async () => {
  // Fetch current user server-side
  const currentUser = await getCurrentUser();

  // Redirect to sign-up if not logged in
  if (!currentUser) {
    return redirect("/sign-up");
  }

  // Fetch posts with user data
  const postsWithUsersPromise = fetchPostsWithUsers();

  return (
    <Tabs defaultValue="foryou" className="w-full max-w-3xl mx-auto dark:bg-black">
      <TabsList className="grid w-full grid-cols-2 fixed sm:relative top-16 sm:top-0 z-10 sm:z-auto">
        <TabsTrigger value="foryou">For You</TabsTrigger>
        <TabsTrigger value="challenges">Challenges</TabsTrigger>
      </TabsList>
      <TabsContent value="foryou" className="mt-[120px] sm:mt-0">
        <section className="w-full bg-white dark:bg-black flex flex-col gap-3 py-5">
          {/* Use Suspense for lazy loading */}
          <Suspense fallback={<PostSkeleton />}>
            <PostsList postsWithUsersPromise={postsWithUsersPromise} />
          </Suspense>
        </section>
      </TabsContent>
      <TabsContent
        value="challenges"
        className="flex flex-col min-h-screen w-full justify-center items-center"
      >
    <section className='flex flex-col justify-center items-center w-full h-screen mt-3'>
     <ChallengesPage/>     
    </section>
      </TabsContent>
    </Tabs>
  );
};

// Component to render posts
const PostsList = async ({
  postsWithUsersPromise,
}: {
  postsWithUsersPromise: Promise<any[]>;
}) => {
  const postsWithUsers = await postsWithUsersPromise;
  const currentUser = await getCurrentUser();

  return (
    <section className="flex w-full py-5 justify-center">
      {postsWithUsers.length > 0 ? (
        <div className="w-full flex flex-wrap justify-center gap-4 -mt-20 sm:mt-0 ">
          {postsWithUsers.map((post) => (
            <AudioPostCard
              key={post.$id}
              title={post.title}
              description={post.description}
              audioFileUrl={post.audioFileUrl}
              user={post.user}
              currentUser={currentUser.accountId}
              postId={post.postId}
              createdAt={post.$createdAt}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 p-4 flex flex-col items-center">
          <h1 className="text-xl" >No voices available!</h1>
          <p className="text-md">Be the first one to share</p>

          <Link
            href="/write"
            className="text-brand text-xl mt-3 hover:underline mt-2 text-sm"
          >
           Click here +
          </Link>
        </div>
      )}
    </section>
  );
};

export default Home;
