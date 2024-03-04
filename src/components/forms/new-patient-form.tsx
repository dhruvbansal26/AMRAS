"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { useForm } from "react-hook-form";
import { NewPatientSchema } from "@/schemas";
import { RegisterCardWrapper } from "./register-card-wrapper";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useState } from "react";
import { Input } from "../ui/input";
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
import { cn } from "@/lib/utils";
import { CommandInput } from "@/components/ui/command";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
export const NewPatientForm = () => {
  const router = useRouter();
  const hospital = useCurrentUser();
  const hospitalId = hospital?.id;
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const form = useForm<z.infer<typeof NewPatientSchema>>({
    resolver: zodResolver(NewPatientSchema),
    defaultValues: {
      name: "",
      age: 1,
      specialCare: "" as
        | "PEDIATRIC"
        | "FIRST_RESPONDERS"
        | "SINGLE_CARETAKERS"
        | "PREGNANT_PATIENTS"
        | "SHORT_TERM_SURVIVAL"
        | undefined,
      ecmoType: "" as "PULMONARY" | "CARDIAC" | "ECPR" | undefined,
      hospitalId: hospitalId,
      coordinates: {
        lat: 0,
        lng: 0,
      },
    },
  });

  const ecmoTypes = [
    { value: "PULMONARY", label: "Pulmonary" },
    { value: "CARDIAC", label: "Cardiac" },
    { value: "ECPR", label: "ECPR" },
  ];

  const specialCareTypes = [
    { value: "PEDIATRIC", label: "Pediatric" },
    { value: "FIRST_RESPONDERS", label: "First Responders" },
    { value: "SINGLE_CARETAKERS", label: "Single-caretaker" },
    { value: "PREGNANT_PATIENTS", label: "Pregnant Patients" },
    { value: "SHORT_TERM_SURVIVAL", label: "Short-term Survival" },
  ];

  async function onSubmit(values: z.infer<typeof NewPatientSchema>) {
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await fetch("/api/auth/patient", {
        method: "POST",
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (response.status === 200) {
        setSuccessMessage(data.success);
        form.reset();
        router.refresh();
      }
      setErrorMessage(data.error);
    } catch (error) {
      console.log("Error from the server: ", error);
    }
  }

  return (
    <>
      <RegisterCardWrapper
        title="New Patient"
        // headerLabel="Add a new ECMO machine"
        backButtonLabel="Go to profile"
        backButtonHref="/profile"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-row justify-between">
              <div className="flex flex-col m-4 space-y-2 w-[250px]">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="John Doe"></Input>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          } // Convert string to number
                          value={field.value}
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
                  name="specialCare"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Special Care</FormLabel>
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
                                ? specialCareTypes.find(
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
                              {specialCareTypes.map((type) => (
                                <CommandItem
                                  value={type.label}
                                  key={type.value}
                                  onSelect={() => {
                                    form.setValue(
                                      "specialCare",
                                      type.value as any
                                    );
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
                  name="ecmoType"
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
                            <CommandEmpty>No framework found.</CommandEmpty>
                            <CommandGroup>
                              {ecmoTypes.map((type) => (
                                <CommandItem
                                  value={type.label}
                                  key={type.value}
                                  onSelect={() => {
                                    form.setValue(
                                      "ecmoType",
                                      type.value as any
                                    );
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
              </div>
            </div>

            <FormError message={errorMessage}></FormError>
            <FormSuccess message={successMessage}></FormSuccess>
            <Button type="submit" className="w-full">
              Register Patient
            </Button>
          </form>
        </Form>
      </RegisterCardWrapper>
    </>
  );
};
