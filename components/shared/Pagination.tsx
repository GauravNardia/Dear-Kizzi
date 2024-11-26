"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

interface Props {
  pageNumber: number;
  isNext: boolean;
  path: string;
}

function Pagination({ pageNumber, isNext, path }: Props) {
  const router = useRouter();

  const handleNavigation = (type: string) => {
    const nextPageNumber = type === "prev" ? pageNumber - 1 : pageNumber + 1;

    if (nextPageNumber > 1) {
      router.push(`/${path}?page=${nextPageNumber}`);
    } else {
      router.push(`/${path}`);
    }
  };

  if (!isNext && pageNumber === 1) return null;

  return (
    <div className="pagination flex items-center gap-4">
      <Button onClick={() => handleNavigation("prev")} disabled={pageNumber === 1}>
        Prev
      </Button>
      <p>{pageNumber}</p>
      <Button onClick={() => handleNavigation("next")} disabled={!isNext}>
        Next
      </Button>
    </div>
  );
}

export default Pagination;
