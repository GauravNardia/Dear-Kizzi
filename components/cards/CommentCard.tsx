import { getProfilePhotoUrl } from '@/lib/actions/appwrite';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface Comment {
    comment: string;
}

interface User {
    profilePhotoUrl: string;
    accountId: string;
    name: string;
}

interface Props {
    comments: Comment[]; // Expecting an array of comments
    userInfo: User;
}

const CommentCard: React.FC<Props> = ({ comments, userInfo }) => {
    return (
        <section className="flex flex-col gap-6 sm:p-6 w-full h-auto overflow-auto">
            {comments.map((comment, index) => (
                <div
                    key={index}
                    className="flex flex-col gap-3 p-5 bg-gray-50 rounded-md border border-gray-200"
                >
                    {/* User Info */}
                    <Link
                        href={`/user/${userInfo.accountId}/profile`}
                        className="flex items-center gap-3 max-w-60"
                    >
                        <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                            {userInfo.profilePhotoUrl ? (
                                <Image
                                    src={userInfo.profilePhotoUrl}
                                    alt={`${userInfo.name}'s profile`}
                                    width={40}
                                    height={40}
                                    className="object-cover"
                                />
                            ) : (
                                <span className="flex h-full w-full items-center justify-center text-gray-400">
                                    U
                                </span>
                            )}
                        </div>
                        <p className="text-gray-800 font-medium text-sm sm:text-base">
                            {userInfo.name}
                        </p>
                    </Link>

                    {/* Comment */}
                    <p className="text-gray-700 text-sm sm:text-base px-2">
                        {comment.comment}
                    </p>
                </div>
            ))}
        </section>
    );
};

export default CommentCard;
