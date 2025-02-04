// "use client";
import CardWrapper, { Card } from "@/app/ui/dashboard/cards";
import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import LatestInvoices from "@/app/ui/dashboard/latest-invoices";
import { lusitana } from "@/app/ui/fonts";
import {
  fetchCardData,
  fetchLatestInvoices,
  fetchRevenue,
} from "../../lib/data";
import { Suspense } from "react";
import {
  CardSkeleton,
  CardsSkeleton,
  RevenueChartSkeleton,
} from "@/app/ui/skeletons";
import { LatestInvoiceRaw } from "@/app/lib/definitions";
import { formatCurrency } from "@/app/lib/utils";

export default async function Page() {
  const latestInvoices = await fetchLatestInvoices();

  // const latestInvoices = await new Promise<LatestInvoiceRaw[]>((res) => {
  //   setTimeout(() => {
  //     res([
  //       {
  //         amount: 100,
  //         name: "Customer",
  //         image_url:
  //           "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTONvusf0zDT91WJPM7D6rR8ZV0S5gVwCb0XQ&s",
  //         email: "",
  //         id: "1",
  //       },
  //     ]);
  //   }, 5000);
  // });

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<p>Loading...</p>}>
          <LatestInvoices latestInvoices={latestInvoices} />
        </Suspense>
      </div>
    </main>
  );
}
