import { redirect } from "next/navigation";

import { fetchUserByAccountId, getCurrentUser } from "@/lib/actions/user.actions";
import { fetchPostByPostId } from "@/lib/actions/post.actions";
import AudioPostCard from "@/components/cards/AudioPostCard";
import Comment from "@/components/forms/Comment";
import { fetchCommentsByPostId } from "@/lib/actions/comment.actions";
import CommentCard from "@/components/cards/CommentCard";

export const revalidate = 0;

// Define types for better safety
interface User {
  accountId: string;
  profilePhotoUrl: string;
}

interface Post {
  $id: string;
  postId: string;
  title: string;
  description: string;
  audioFileUrl: string;
  accountId: string;
}

interface Comment {
  $id: string;
  text: string;
  createdAt: string;
}

async function page({ params }: { params: Promise<{ postId: string }>  }) {
  const  postId  = (await params).postId;

  if (!postId) return null;

  // Get the current user
  const user: User | null = await getCurrentUser();
  if (!user) {
    console.error("User not found");
    return null;
  }

  // Fetch the post
  // @ts-ignore
  const post: Post | null = await fetchPostByPostId(postId);
  if (!post) {
    console.error("Post not found!");
    return null;
  }

  // Get the author's account ID
  const AuthorId = post.accountId;
  if (!AuthorId) {
    console.error("AuthorId not found in post!");
    return null;
  }

  // Fetch user information for the author
  const userInfo = await fetchUserByAccountId(AuthorId);
  if (!userInfo) {
    console.error("Author userInfo not found!");
    return null;
  }

  // Redirect if the user is not onboarded
  if (!userInfo.onboarded) {
    redirect("/onboarding");
  }

  // Fetch comments for the post
  const comments: Comment[] = await fetchCommentsByPostId(postId) || [];

  return (
    <section className="relative mt-20 sm:mt-0 h-screen flex flex-col justify-center   px-40">
      {/* Post Section */}
      <div>
        <AudioPostCard
          key={post.$id}
          title={post.title}
          description={post.description}
          audioFileUrl={post.audioFileUrl}
        // @ts-ignore
          user={userInfo}
          postId={post.postId}
        />
      </div>

      {/* Comment Form */}
      <div className="mt-7">
        <Comment
          postId={postId}
          currentUserImg={user.profilePhotoUrl || ""}
          accountId={user.accountId}
        />
      </div>

      {/* Separator */}
      <div className="h-[1px] bg-gray-400 w-full my-5" />

      {/* Comments Section */}
      <CommentCard
        // @ts-ignore
        comments={comments}
        // @ts-ignore
        userInfo={user} // Current user info
      />
    </section>
  );
}

export default page;
