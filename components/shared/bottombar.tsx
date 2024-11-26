"use client";

import Link from "next/link";
import Image from "next/image";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  accountId: string;
}

const BottomBar = ({ accountId }: Props) => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 w-full dark:bg-gray-900 z-10 bg-white sm:hidden">
      <ul className="flex justify-around items-center py-2">
        {sidebarLinks
          .filter(({ route }) => route !== "/my-letters") // Hide 'My Letters'
          .map(({ route, label, imgURL }) => {
            const isActive =
              pathname === route || (route === "/profile" && pathname.startsWith(`/user/${accountId}/profile`));

            return (
              <li key={label} className="flex flex-col items-center">
                <Link
                  href={route === "/profile" ? `/user/${accountId}/profile` : route}
                  className="flex flex-col items-center group"
                  prefetch
                >
                  {/* Icon */}
                  <Image
                    src={imgURL}
                    alt={label}
                    width={28}
                    height={28}
                    className={cn(
                      "transition-transform duration-300 opacity-40 dark:invert",
                      isActive ? "scale-110 opacity-100" : "group-hover:scale-110 group-hover:opacity-100"
                    )}
                    priority
                  />
                  {/* Label */}
                  {/* <span
                    className={cn(
                      "text-xs mt-1 transition-colors duration-200 text-gray-500 dark:text-gray-400",
                      isActive && "text-black dark:text-white font-medium"
                    )}
                  >
                    {label}
                  </span> */}
                </Link>
              </li>
            );
          })}
      </ul>
    </nav>
  );
};

export default BottomBar;
