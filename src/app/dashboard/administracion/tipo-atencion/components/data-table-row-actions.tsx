"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { labels } from "../data/data";
import { tipoAtencionSchema } from "../data/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";

export const FormSchema = z.object({
  type: z.string().min(1, {
    message: "Type is required.",
  }),
  priority: z.coerce.number(),
  displayName: z.string().min(1, {
    message: "Display name is required.",
  }),
  active: z.boolean(),
  color: z.string().min(1, {
    message: "A color needs to be at least one char.",
  }),
  colorBg: z.string().min(1, {
    message: "A color needs to be at least one char.",
  }),
});

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  let task = tipoAtencionSchema.parse(row.original);
  const [color, setColor] = useState(task.color || "#ffffff");
  const [colorBg, setColorBg] = useState(task.colorBg || "#ffffff");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: task.type,
      priority: parseFloat(task.priority),
      displayName: task.displayName,
      active: task.active,
      color: task.color,
      colorBg: task.colorBg,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(JSON.stringify(data, null, 2));
  }

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Edit
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent
            className={"lg:max-w-screen-lg overflow-y-scroll max-h-screen"}
          >
            <DialogHeader>
              <DialogTitle>Edit item</DialogTitle>
              <DialogDescription>
                Make changes here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-2/3 space-y-6 m-auto"
              >
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Input placeholder="normal" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the type of attention.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the priority. Default is 0.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Normal" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Active</FormLabel>
                        <FormDescription>
                          Make this item appear on the totem
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex flex-row justify-around items-center">
                  <FormField
                    name="color"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <div className="flex flex-col justify-center items-center gap-4">
                            {/* Use field.onChange to update the form state */}
                            <HexColorPicker
                              color={color}
                              onChange={(newColor) => {
                                setColor(newColor);
                                field.onChange(newColor); // This line updates React Hook Form's state
                              }}
                            />
                            <HexColorInput
                              color={color}
                              onChange={(newColor) => {
                                setColor(newColor);
                                field.onChange(newColor); // This line updates React Hook Form's state
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Choose a color for this item.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="colorBg"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color Background</FormLabel>
                        <FormControl>
                          <div className="flex flex-col justify-center items-center gap-4">
                            {/* Use field.onChange to update the form state */}
                            <HexColorPicker
                              color={colorBg}
                              onChange={(newColorBg) => {
                                setColorBg(newColorBg);
                                field.onChange(newColorBg); // This line updates React Hook Form's state
                              }}
                            />
                            <HexColorInput
                              color={colorBg}
                              onChange={(newColorBg) => {
                                setColorBg(newColorBg);
                                field.onChange(newColorBg); // This line updates React Hook Form's state
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Choose a background color.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
          <DropdownMenuItem>Make a copy</DropdownMenuItem>
          <DropdownMenuItem>Favorite</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={task.label}>
                {labels.map((label) => (
                  <DropdownMenuRadioItem key={label.value} value={label.value}>
                    {label.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Dialog>
  );
}
