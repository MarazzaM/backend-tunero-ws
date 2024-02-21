"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import React, { useState  } from 'react'
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import { toast } from "@/components/ui/use-toast";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }).email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});
export default function SignUpForm({ onSignUpSuccess }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();


  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name:"",
      email: "",
      password: "",
    },
  });

  const { formState } = form; // Extract formState from form

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const backend = process.env.NEXT_PUBLIC_BACKEND;
  
    let responseStatus;
    let responseData;
  
    try {
      const response = await fetch(`${backend}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      responseStatus = response.status;
  
      if (!response.ok) {
        const errorResponse = await response.json();
  
        if (errorResponse.message === 'User alredy exist') {
          setError('This email is already in use. Please use a different email.');

          Toast.fire({
            icon: 'error',
            title: `${errorResponse.message}`,
          });

        } else {
          throw new Error('Failed to submit the data. Please try again.');
        }
      } else {
        responseData = await response.json();
  
        Toast.fire({
          icon: 'success',
          title: 'Registration successful',
          text: "Redirecting to login...",
        });
  
        setTimeout(() => {
          onSignUpSuccess();
        }, 2000);
  
        console.log('dataResponse', responseData);

      }
    } catch (error) {
      setError(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }

    // console.log(JSON.stringify(data, null, 2));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6 m-4">

      <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  required
                  placeholder="Panic"
                  className="text-gray-700"
                  {...field}
                />
              </FormControl>
              <FormMessage>{formState.errors.name?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="panic@thedis.co"
                  autoComplete="email"
                  required
                  className="text-gray-700"
                  {...field}
                />
              </FormControl>
              <FormMessage>{formState.errors.email?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  required
                  placeholder=""
                  className="text-gray-700"
                  {...field}
                />
              </FormControl>
              <FormMessage>{formState.errors.password?.message}</FormMessage>
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? 'Submitting...' : 'Register'}
        </Button>

        {error && <p style={{ color: 'red' }}>{error}</p>}

      </form>
    </Form>
  );
}