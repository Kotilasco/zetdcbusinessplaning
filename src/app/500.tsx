// pages/500.js
import Link from "next/link";

export default function Custom500() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600">500 - Server Error</h1>
      <p className="mt-4 text-gray-700">
        Oops! Something went wrong on our end. Please try again later.
      </p>
      <Link href="/">
        <a className="mt-6 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Go back to Home
        </a>
      </Link>
    </div>
  );
}
