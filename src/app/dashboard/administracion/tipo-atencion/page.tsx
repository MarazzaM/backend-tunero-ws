"use client"
import Image from "next/image";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import useSWR from 'swr';
import { useSession } from "next-auth/react";

const backend = process.env.NEXT_PUBLIC_BACKEND;

const fetcher = async (url, token) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  return response.json();
};

export default function TaskPage() {
  const { data: session } = useSession();
  const token = session?.backendTokens?.accessToken;
  const apiUrl = `${backend}/tipo-atencion`;
  const { data, error } = useSWR(token ? [apiUrl, token] : null, () => fetcher(apiUrl, token));

  if (!token) {
    return <div>Loading...</div>; // Render loading indicator until session is loaded
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/tasks-light.png"
          width={1280}
          height={998}
          alt="Playground"
          className="block dark:hidden"
        />
        <Image
          src="/examples/tasks-dark.png"
          width={1280}
          height={998}
          alt="Playground"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <DataTable data={data} columns={columns} />
      </div>
    </>
  );
}
