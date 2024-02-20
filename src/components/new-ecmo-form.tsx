"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FormError } from "./form-error";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Checkbox } from "./ui/checkbox";
import { ChevronsUpDown } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import usePlacesAutocomplete from "use-places-autocomplete";
import { FormSuccess } from "./form-success";
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
} from "./ui/form";
import { Libraries, useLoadScript } from "@react-google-maps/api";
import { BeatLoader } from "react-spinners";
const libraries: Libraries = ["places", "geocoding"];
export const NewEcmoForm = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: libraries,
  });
  if (!isLoaded)
    return (
      <>
        <BeatLoader></BeatLoader>
      </>
    );
  return <NewEcmoSubForm></NewEcmoSubForm>;
};

const NewEcmoSubForm = () => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("Your Location");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const form = useForm<z.infer<typeof NewEcmoSchema>>({
    resolver: zodResolver(NewEcmoSchema),
    defaultValues: {
      model: "",
      serial: "",
      type: "",
      location: "",
      inUse: false,
    },
  });
  async function onSubmit(values: z.infer<typeof NewEcmoSchema>) {
    console.log(values);
    setErrorMessage("");
    setSuccessMessage("New ECMO added successfully!");
  }

  const handleChecked = async (e: any) => {
    form.setValue("inUse", e.target.checked);
  };

  const handleSelect = async (address: any) => {
    setValue(address, false);
    form.setValue("location", address);
    clearSuggestions();
  };
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
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col space-y-4 items-center w-[50%]">
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
              <div className="flex flex-col space-y-4 items-center w-[50%]">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Pulmonary, Cardiac, ECPR"
                        ></Input>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel></FormLabel>
                      <FormControl>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={open}
                              className="max-w-[200px] justify-between overflow-hidden"
                            >
                              {title}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[400px] p-0">
                            <Command className="">
                              <Input
                                placeholder="Search place..."
                                onChange={(e) => setValue(e.target.value)}
                              />

                              <CommandEmpty>No location found.</CommandEmpty>
                              <CommandGroup>
                                {status === "OK" &&
                                  data.map(({ place_id, description }) => (
                                    <CommandItem
                                      key={place_id}
                                      value={description}
                                      className="w-[400px] h-[50px]"
                                      onSelect={(currentValue) => {
                                        setTitle(description);
                                        handleSelect(currentValue);
                                        setValue(
                                          currentValue === value
                                            ? ""
                                            : currentValue
                                        );
                                        setOpen(false);
                                      }}
                                    >
                                      {description}
                                    </CommandItem>
                                  ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex flex-row items-center justify-between w-full">
              <FormField
                control={form.control}
                name="inUse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                      <Checkbox onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>Check if currently in use</FormLabel>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormError message={errorMessage}></FormError>
            <FormSuccess message={successMessage}></FormSuccess>
            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
        </Form>
      </RegisterCardWrapper>
    </>
  );
};
