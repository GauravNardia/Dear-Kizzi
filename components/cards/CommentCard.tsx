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
        <section className="flex flex-col gap-6 sm:p-6 w-full h-auto bg-white overflow-auto">
            {comments.map((comment, index) => (
                <div
                    key={index}
                    className="flex flex-col gap-3 p-5  rounded-md"
                >
                    {/* User Info */}
                    <Link
                        href={`/user/${userInfo.accountId}/profile`}
                        className="flex items-center gap-3 max-w-60"
                    >
                        <div className="relative h-8 w-8 rounded-full overflow-hidden ">
                            {userInfo.profilePhotoUrl ? (
                                <Image
                                    src={userInfo.profilePhotoUrl}
                                    alt={`${userInfo.name}'s profile`}
                                    width={1000}
                                    height={1000}
                                    className="object-cover rounded-full h-full w-full "
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
                    <p className="text-gray-800 text-md text-left px-5">
                        {comment.comment}
                    </p>
                </div>
            ))}
        </section>
    );
};

export default CommentCard;
