import { fetchGridData } from "@/lib/mockApi";
import ClientGridWrapper from "@/src/components/grid/Clientgridwrapper";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: PageProps) {
  // we can use the hooks of the nextjs if it was a client side (useSearchParams) 
  const resolvedParams = await searchParams;

  const page = Number(resolvedParams.page) || 1;
  const sortParam =
    typeof resolvedParams.sort === "string" ? resolvedParams.sort : "";
  console.log("page from the params ", page);
  // Initial server-side fetch
  const initialData = await fetchGridData({
    page: page,
    pageSize: 10,
    sort: sortParam
      ? [
          {
            key: sortParam.split(":")[0],
            order: sortParam.split(":")[1] as "asc" | "desc",
          },
        ]
      : [],
    filters: [],
  });

  return (
    <main className="p-8 max-w-6xl mx-auto" dir="rtl">
      <ClientGridWrapper initialData={initialData} />
    </main>
  );
}
