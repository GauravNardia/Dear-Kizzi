"use client";

import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

const RightSidebar = () => {
  const router = useRouter();

  return (
    <aside className="remove-scrollbar hidden z-10 h-screen w-full flex-col overflow-auto bg-white dark:bg-black px-5 py-7 md:flex lg:w-[280px] xl:w-[325px]">
      {/* Header Section */}
      <div className="flex flex-col items-center justify-center mt-16">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Let's Challenge You</h1>
        <p className="mt-2 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
          Participate in exciting challenges with compatible partners and push your limits.
        </p>
      </div>

      {/* Challenge Section */}
      <div className="flex flex-col items-center mt-8">
        <Button
          onClick={() => router.push("/challenges")}
          className="w-full rounded-full bg-brand px-6 py-3 text-white hover:bg-brand-100"
        >
          Participate in Challenge
        </Button>
      </div>

      {/* Additional Section */}
      <div className="mt-12 space-y-6">
        {/* Activity Summary */}
        <div className="flex items-center gap-4 p-4 bg-white dark:bg-black rounded-md shadow-sm">
          <div className="h-12 w-12 rounded-full flex items-center justify-center text-lg font-semibold text-gray-700">
            🎯
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-white">Your Progress</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Track your latest challenges and goals.</p>
          </div>
        </div>

        {/* Discover New Challenges */}
        <div className="flex items-center gap-4 p-4 bg-white dark:bg-black rounded-md shadow-sm">
          <div className="h-12 w-12 rounded-full flex items-center justify-center text-lg font-semibold text-gray-700">
            🌟
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-white">Discover Challenges</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Find curated challenges just for you.</p>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="mt-auto flex flex-col items-center text-center">
        <p className="text-xs font-medium text-gray-500">
          Ready to level up? Let's make it happen together!
        </p>
      </footer>
    </aside>
  );
};

export default RightSidebar;
