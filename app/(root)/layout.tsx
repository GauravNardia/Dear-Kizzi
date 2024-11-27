import React from "react";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import Sidebar from "@/components/shared/sidebar";
import Topbar from "@/components/shared/topbar";
import BottomBar from "@/components/shared/bottombar";
import RightSidebar from "@/components/shared/rightsidebar";

export const dynamic = "force-dynamic";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) return redirect("/sign-in");

  return (
    <main className="flex min-h-screen bg-white">
      {/* Left Sidebar */}
      <Sidebar {...currentUser} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Topbar */}
        <Topbar userId={currentUser.$id} accountId={currentUser.accountId} />

        {/* Center Content */}
        <div className="flex justify-center items-start flex-grow overflow-auto remove-scrollbar mt-12">
          <div className="w-full max-w-4xl py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md rounded-xl">
            {children}
          </div>
        </div>

        {/* Bottom Bar */}
        <BottomBar accountId={currentUser.accountId} />
      </div>

      {/* Right Sidebar */}
      <RightSidebar />
    </main>
  );
};

export default Layout;
