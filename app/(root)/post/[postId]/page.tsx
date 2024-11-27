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

async function page({ params }: { params: Promise<{ postId: string }> }) {
  const postId = (await params).postId;

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
  const comments: Comment[] = (await fetchCommentsByPostId(postId)) || [];

  return (
    <section className="sm:mt-0 h-screen flex flex-col justify-start px-5 py-8 bg-gray-50">
      {/* Post Section */}
      <div className="w-full max-w-4xl mx-auto">
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
      <div className="mt-10 w-full max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Leave a Comment</h2>
        <Comment
          postId={postId}
          currentUserImg={user.profilePhotoUrl || ""}
          accountId={user.accountId}
        />
      </div>

      {/* Separator */}
      <div className="bg-gray-300 w-full max-w-4xl mx-auto my-6 h-px" />

      {/* Comments Section */}
      <div className="w-full max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        {comments.length > 0 ? (
          <CommentCard
            // @ts-ignore
            comments={comments}
            // @ts-ignore
            userInfo={user} // Current user info
          />
        ) : (
          <p className="text-center text-gray-500">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </section>
  );
}

export default page;
