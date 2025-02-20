"use client"; // Error components must be Client Components

import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <DefaultLayout>
      <main
        style={{
          backgroundImage: "url(/images/logo/bgimagedark.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className=" flex h-full min-h-screen items-center justify-center"
      >
        <div className="text-center">
          <p className="text-base font-semibold text-white dark:text-emerald-500">
            There was an error: 
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-50 dark:text-zinc-50 sm:text-sm">
            {error.message || "Something went wrong"}
          </h1>
          <p className="mt-6 text-base leading-7 text-zinc-100 dark:text-zinc-100">
            Please try again later or contact support if the problem persists
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button onClick={reset}>Try again</Button>
            <Link
              href={"/"}
              className={buttonVariants({ variant: "secondary" })}
            >
              Go back home
            </Link>
          </div>
        </div>
      </main>
    </DefaultLayout>
  );
}
