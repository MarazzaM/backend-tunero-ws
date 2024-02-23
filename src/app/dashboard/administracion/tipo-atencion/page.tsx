import { promises as fs } from "fs"
import path from "path"
import { Metadata } from "next"
import Image from "next/image"
import { z } from "zod"

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
// import { UserNav } from "./components/user-nav"
import { tipoAtencionSchema } from "./data/schema"

export const metadata: Metadata = {
  title: "Tipos de atencion",
  description: "Datatable with tipos de atencion",
}

// Simulate a database read for tasks.
async function getTasks() {
  const data = 
  [
    {
      "id": 1,
      "type": "normal",
      "priority": 0,
      "displayName": "normal",
      "active": false
    },
    {
      "id": 2,
      "type": "normal2",
      "priority": 1,
      "displayName": "normal2",
      "active": true
    }
  ]


  return z.array(tipoAtencionSchema).parse(data);
}

export default async function TaskPage() {
  const tasks = await getTasks()

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
        {/* <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <UserNav />
          </div>
        </div> */}
        <DataTable data={tasks} columns={columns} />
      </div>
    </>
  )
}
