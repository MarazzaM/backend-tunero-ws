"use client"
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import createSocket from '@/lib/websocket'; // Ensure you have a utility to create WebSocket connections


import { zodResolver } from "@hookform/resolvers/zod"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"


const services = [
  { label: "Particular", value: "pa" },
  { label: "Social", value: "so" },
  { label: "German", value: "de" },
] as const
 
const FormSchema = z.object({
  service: z.string({
    required_error: "Please select a service.",
  }),
})

function Page() {
  const [message, setMessage] = useState(null);
  const [queueEmpty, setQueueEmpty] = useState(false);
  const { data: session } = useSession();
  const [socket, setSocket] = useState(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })
 
  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  useEffect(() => {

    const newSocket = createSocket(); 
    setSocket(newSocket);

    newSocket.on('calledAppointment', (data) => {
      console.log(data)
      if (data.content === "No more people in queue") {
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
      socket.emit('callAppointment', { callerId: session?.user.id });
    }
  };

  const EndAppointment = () => {
   console.log('placeholder')
  };

  return (
    <div className='flex justify-center items-center flex-col gap-y-8'>
      <div>
    {/* Show "Call the Next Person" button if message is empty */}
    {!message && (
      <Button
        className='bg-green-500 hover:bg-green-600 text-white h-auto text-lg font-semibold py-8 px-8 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300'
        onClick={fetchNextMessage}
      >
        Call the Next Person
      </Button>
    )}

    {/* Show another button if message is not empty */}
    {message && (
      <Button
        className='bg-blue-500 hover:bg-blue-600 text-white h-auto text-lg font-semibold py-8 px-8 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300'
        onClick={EndAppointment}
      >
        End Appointment
      </Button>
    )}
  </div>

      {message && (
        <div className=''>
          <h2>{message.number} - {message.type}</h2>

          <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="service"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Service</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? services.find(
                            (service) => service.value === field.value
                          )?.label
                        : "Select service"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search service..."
                      className="h-9"
                    />
                    <CommandEmpty>No service found.</CommandEmpty>
                    <CommandGroup>
                      {services.map((service) => (
                        <CommandItem
                          value={service.label}
                          key={service.value}
                          onSelect={() => {
                            form.setValue("service", service.value)
                          }}
                        >
                          {service.label}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              service.value === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              {/* <FormDescription>
                This is the service that will be used in the dashboard.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
        </div>
      )}

      {queueEmpty && (
        <p>No more people in queue!</p>
      )}
    </div>
  );
}

export default Page;
