"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarLinks } from "@/constants";
import { Suspense, lazy, memo } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Lazy load DropDownMenu
const DropDownMenu = lazy(() => import("./DropDownMenu"));

interface Props {
  accountId: string;
}

const Sidebar = memo(({ accountId }: Props) => {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col justify-between h-screen w-20 dark:bg-gray-900 hidden sm:flex ">
      {/* Logo */}
      <div className="flex justify-center mb-6 mt-4">
        <Link href="/" prefetch>
          <Image
            src="/logo.svg" // Replace with your logo path
            alt="Logo"
            width={40}
            height={40}
            className="cursor-pointer dark:invert"
            priority
          />
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col items-center gap-8">
        {sidebarLinks.map(({ route, imgURL, label }) => {
          const isActive = pathname === route || (route === "/profile" && pathname.startsWith(`/user/${accountId}/profile`));
          return (
            <Link
              key={label}
              href={route === "/profile" ? `/user/${accountId}/profile` : route}
              prefetch
              className="flex flex-col items-center group"
            >
              <Image
                src={imgURL}
                alt={label}
                width={25}
                height={25}
                className={cn(
                  "cursor-pointer opacity-40 group-hover:opacity-100 transition duration-200",
                  isActive && "opacity-100"
                )}
                priority
              />
              {/* <span
                className={cn(
                  "text-xs mt-1 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white",
                  isActive && "text-gray-900 dark:text-white"
                )}
              >
                {label}
              </span> */}
            </Link>
          );
        })}
      </nav>

      {/* Floating Action Button */}
      <div className="mt-4 mb-6">
        <Suspense fallback={<div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>}>
          <DropDownMenu />
        </Suspense>
      </div>
    </aside>
  );
});

export default Sidebar;
