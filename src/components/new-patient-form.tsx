"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";
import { useForm } from "react-hook-form";
import { NewPatientSchema } from "@/schemas";
import { RegisterCardWrapper } from "./register-card-wrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useState } from "react";
import { BeatLoader } from "react-spinners";
import { Input } from "./ui/input";
import { ChevronsUpDown } from "lucide-react";
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
import usePlacesAutocomplete from "use-places-autocomplete";
import { Libraries, useLoadScript } from "@react-google-maps/api";
import { Button } from "./ui/button";

const libraries: Libraries = ["places", "geocoding"];

export const NewPatientForm = () => {
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
  return <NewPatientSubForm></NewPatientSubForm>;
};

const NewPatientSubForm = () => {
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

  const form = useForm<z.infer<typeof NewPatientSchema>>({
    resolver: zodResolver(NewPatientSchema),
    defaultValues: {
      name: "",
      age: 1,
      category: "",
      ecmoType: "",
      location: "",
    },
  });
  async function onSubmit(values: z.infer<typeof NewPatientSchema>) {
    console.log(values);
    setErrorMessage("");
    setSuccessMessage("New patient added successfully!");
  }

  const handleSelect = async (address: any) => {
    setValue(address, false);
    form.setValue("location", address);
    clearSuggestions();
  };

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
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col space-y-4 items-center w-[50%]">
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
                        <Input {...field} placeholder="18"></Input>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col space-y-4 items-center w-[50%]">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Care</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Pediatric, Single-caretaker"
                        ></Input>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ecmoType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ECMO Type</FormLabel>
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
              </div>
            </div>
            <div className="flex flex-col items-center">
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
