"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";

interface Props {
  routeType: string;
}

const Searchbar = ({ routeType }: Props) => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = query.trim() ? `?q=${query}` : "";
    router.push(`/${routeType}${params}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="p-5 rounded-full"
      />
      <Button type="submit" className="bg-brand p-2 rounded-full flex items-center hover:bg-brand-100">
        <Image
        src="/assets/search.svg"
        alt="search"
        width={25}
        height={25}
        className="invert object-cover "
        />
      </Button>
    </form>
  );
};

export default Searchbar;
