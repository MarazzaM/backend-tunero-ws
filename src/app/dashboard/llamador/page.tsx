"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import createSocket from "@/lib/websocket";
import { useStore } from "../../../../store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Page() {
  const [message, setMessage] = useState(null);
  const [queueEmpty, setQueueEmpty] = useState(false);
  const { data: session } = useSession();
  const [socket, setSocket] = useState(null);
  const store = useStore(); // Access the Zustand store

  useEffect(() => {
    const newSocket = createSocket();
    setSocket(newSocket);

    newSocket.on("calledAppointment", (data) => {
      // console.log(data);
      if (data.appointment.content === "No more people in queue") {
        setQueueEmpty(true);
        setMessage(null);
      } else {
        setMessage(data);
        setQueueEmpty(false);
      }
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const fetchNextMessage = () => {
    if (socket) {
      const position = store?.position
      const callerId = session?.user.id
      socket.emit("callAppointment", { callerId, position });
    }
  };

  const EndAppointment = () => {
    console.log("placeholder");
  };

  const FormSchema = z.object({
    position: z.string(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      position: "1",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const position = data.position; // Get the position from the form data
  
    // Update the position in the store
    useStore.setState((prevState) => ({
      ...prevState,
      position: position,
    }));
  
    // console.log(JSON.stringify(data, null, 2));
  }
  return (
    <div className="flex justify-center items-center flex-col gap-y-8">
      <div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Choose a position to call from</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Position</DialogTitle>
              <DialogDescription>
                The calls you make will be from this post number.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-2/3 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1"
                          min={1}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        {/* Show "Call the Next Person" button if message is empty */}
        {!message && (
          <Button
            className="bg-green-500 hover:bg-green-600 text-white h-auto text-lg font-semibold py-8 px-8 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300"
            onClick={fetchNextMessage}
          >
            Call the Next Person
          </Button>
        )}

        {/* Show another button if message is not empty */}
        {message && (
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white h-auto text-lg font-semibold py-8 px-8 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300"
            onClick={EndAppointment}
          >
            End Appointment
          </Button>
        )}
      </div>

      {message && (
        <div className="">
          <h2 className="text-center">
            {message.appointment.number} - {message.appointment.type}
          </h2>
        </div>
      )}

      {queueEmpty && <p>No more people in queue!</p>}
    </div>
  );
}

export default Page;
