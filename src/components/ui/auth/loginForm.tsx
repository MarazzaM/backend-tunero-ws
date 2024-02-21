"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import React, { useState } from "react";
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
import { signIn } from "next-auth/react";
import Swal from "sweetalert2";
import { useSearchParams, useRouter } from "next/navigation";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});
export default function LoginForm() {
  // const [isLoading, setIsLoading] = useState<boolean>(false);
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
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { formState } = form; // Extract formState from form

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const res = await signIn("credentials", {
        redirect: false,
        username: data.username,
        password: data.password,
        callbackUrl,
      });

      if (!res?.error) {

        Toast.fire({
          icon: 'success',
          title: 'Signed in successfully',
          text: "Redirecting...",
        });
        // useStore.getState().startLogin({
        //   email: res.username,
        //   accessToken: res.accessToken,
        //   refreshToken: res.refreshToken,
        // });
        setTimeout(() => {
          router.push(callbackUrl);
        }, 2000);
      } else {
        Toast.fire({
          icon: 'error',
          title: 'Invalid login credentials. Please check your email and password.',
        });
        setError("invalid email or password");
      }
    } catch (error: any) {
      setError(error);
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-2/3 space-y-6 m-4"
      >
        <FormField
          control={form.control}
          name="username"
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
              <FormMessage>{formState.errors.username?.message}</FormMessage>
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

        <Button
          className="w-full"
          type="submit"
          disabled={formState.isSubmitting}
        >
          {formState.isSubmitting ? "Submitting..." : "Submit"}
        </Button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </Form>
  );
}
