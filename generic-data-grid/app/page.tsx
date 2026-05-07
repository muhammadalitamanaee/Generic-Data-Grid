import { fetchGridData } from "@/lib/mockApi";
import ClientGridWrapper from "@/components/grid/Clientgridwrapper";

export default async function Home({ searchParams }: { searchParams: any }) {
  // Initial server-side fetch[cite: 1]
  const initialData = await fetchGridData({
    page: Number(searchParams.page) || 1,
    pageSize: 10,
    sort: searchParams.sort
      ? [
          {
            key: searchParams.sort.split(":")[0],
            order: searchParams.sort.split(":")[1],
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
