"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { cn } from "@/lib/utils";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { CheckIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormSuccess } from "../form-success";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { NewEcmoSchema } from "@/schemas";
import { RegisterCardWrapper } from "./register-card-wrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useCurrentUser } from "@/hooks/use-current-user";
const ecmoTypes = [
  { value: "PULMONARY", label: "Pulmonary" },
  { value: "CARDIAC", label: "Cardiac" },
  { value: "ECPR", label: "ECPR" },
];
import { CommandInput } from "@/components/ui/command";

export const NewEcmoForm = () => {
  const hospital = useCurrentUser();
  const hospitalId = hospital?.id;
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const form = useForm<z.infer<typeof NewEcmoSchema>>({
    resolver: zodResolver(NewEcmoSchema),
    defaultValues: {
      model: "",
      serial: "",
      type: "" as "PULMONARY" | "CARDIAC" | "ECPR" | undefined,
      hospitalId: hospitalId,
      inUse: false,
      coordinates: {
        lat: 0,
        lng: 0,
      },
    },
  });
  async function onSubmit(values: z.infer<typeof NewEcmoSchema>) {
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await fetch("/api/auth/ecmo", {
        method: "POST",
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (response.status === 200) {
        setSuccessMessage(data.success);
      }
      setErrorMessage(data.error);
    } catch (error) {
      console.log("Error from the server: ", error);
    }
  }
  return (
    <>
      <RegisterCardWrapper
        title="New ECMO"
        // headerLabel="Add a new ECMO machine"
        backButtonLabel="Go to profile"
        backButtonHref="/profile"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-row  justify-between">
              <div className="flex flex-col m-4 space-y-2 w-[250px]">
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="ECMO-1234X"></Input>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="serial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serial</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="NXJS-2024-000123"
                        ></Input>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col m-4 space-y-2 w-[250px]">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>ECMO Type</FormLabel>
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
                                ? ecmoTypes.find(
                                    (type) => type.value === field.value
                                  )?.label
                                : "Select type"}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search type..."
                              className="h-9"
                            />
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup>
                              {ecmoTypes.map((type) => (
                                <CommandItem
                                  value={type.label}
                                  key={type.value}
                                  onSelect={() => {
                                    form.setValue("type", type.value as any);
                                  }}
                                >
                                  {type.label}
                                  <CheckIcon
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      type.value === field.value
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="inUse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-[200px] justify-between",
                                field.value === undefined &&
                                  "text-muted-foreground"
                              )}
                            >
                              {field.value === true
                                ? "In Use"
                                : field.value === false
                                ? "Vacant"
                                : "Select Type"}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search status..."
                              className="h-9"
                            />
                            <CommandGroup>
                              <CommandItem
                                value="Vacant"
                                onSelect={() => {
                                  form.setValue("inUse", false);
                                }}
                              >
                                Vacant
                                <CheckIcon
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    field.value === false
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                              <CommandItem
                                value="In Use"
                                onSelect={() => {
                                  form.setValue("inUse", true);
                                }}
                              >
                                In Use
                                <CheckIcon
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    field.value === true
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormError message={errorMessage}></FormError>
            <FormSuccess message={successMessage}></FormSuccess>
            <Button type="submit" className="w-full">
              Register ECMO
            </Button>
          </form>
        </Form>
      </RegisterCardWrapper>
    </>
  );
};
