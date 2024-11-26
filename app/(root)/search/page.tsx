import UserCard from "@/components/cards/UserCard";
import Searchbar from "@/components/forms/Searchbar";
import Pagination from "@/components/shared/Pagination";
import { fetchUsers, getCurrentUser } from "@/lib/actions/user.actions";

async function Page({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchParams = await searchParamsPromise;

  const user = await getCurrentUser();
  if (!user) return null;

  const result = await fetchUsers({
    searchString: searchParams.q || "",
    pageNumber: searchParams.page ? +searchParams.page : 1,
    pageSize: 25,
  });

  return (
    <section className="w-full h-screen md:px-40 p-5 mx-auto">
      <h1 className="text-3xl font-bold mb-8">Search Users</h1>

      <Searchbar routeType="search" />

      <div className="mt-8 grid gap-4">
        {result.users.length > 0 ? (
          result.users.map((user) => (
            <UserCard
              key={user.$id}
              name={user.name}
              username={user.username}
              id={user.accountId}
              imgUrl={user.profilePhotoUrl}
            />
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>

      <Pagination
        path="search"
        pageNumber={searchParams.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </section>
  );
}

export default Page;
