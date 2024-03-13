"use client"
import Image from "next/image";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import useSWR from 'swr';
import { useSession } from "next-auth/react";
import { Backend_URL as backend} from "@/lib/Constants";

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
  const { data, error, mutate } = useSWR(token ? [apiUrl, token] : null, () => fetcher(apiUrl, token));

  const updateData = (updatedRowData) => {
    // Update the data here, assuming `data` is an array of objects
    const updatedData = data.map(item => {
      if (item.id === updatedRowData.id) {
        return updatedRowData;
      }
      return item;
    });

    // Trigger a re-render by mutating the data
    mutate(updatedData, false);
  };

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
      <DataTable data={data} columns={columns(updateData)} />
      </div>
    </>
  );
}
