import Link from "next/link";
import Image from "next/image";
import React from "react";

export default function HomePage() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen gap-6">
            <Image width={395} height={262} src="/images/world.svg" alt="world" />
            <h1 className="text-2xl font-bold">Welcome!</h1>
            <p className="text-gray-600">
                Choose where to go:</p>

            <div className="flex gap-4">
                <Link
                    href="/companies"
                    className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                    Companies
                </Link>

                <Link
                    href="/dashboard"
                    className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
                >
                    Dashboard
                </Link>
            </div>
        </main>
    );
}

