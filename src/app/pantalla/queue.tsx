"use client"
import React from 'react'
import useSWR from 'swr';
import { useSession } from "next-auth/react";
import { Backend_URL as backend} from "@/lib/Constants";

function queue() {

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

      const { data: session } = useSession();
      const token = session?.backendTokens?.accessToken;
      const apiUrl = `${backend}/tipo-atencion`;
      const { data, error, mutate } = useSWR(token ? [apiUrl, token] : null, () => fetcher(apiUrl, token));

  return (
    <div>queue</div>
  )
}

export default queue