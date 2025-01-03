"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import DropDownMenu from "./DropDownMenu";

const Topbar = ({
  userId,
  accountId,
}: {
  userId: string;
  accountId: string;
}) => {
  return (
    <header className="w-full fixed z-10 flex items-center justify-between px-4 py-2 border-b bg-white dark:bg-black sm:hidden shadow-sm">

      {/* Center Section (Logo) */}
      <Link href="/" className="flex items-start justify-start">
        <Image
          src="/logo.svg"
          alt="logo"
          width={50}
          height={50}
          className="sm:block"
        />
      </Link>

      {/* Right Section */}
      <div className="flex items-center justify-end w-1/3">
        <DropDownMenu/>
      </div>
    </header>
  );
};

export default Topbar;