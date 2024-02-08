"use client";
import { CardWrapper } from "./card-wrapper";
import { ResetSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
export const ResetForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof ResetSchema>) {
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await fetch("/api/auth/reset", {
        method: "POST",
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(data.success);
      }
      setErrorMessage(data.error);
    } catch (error) {
      console.log("Error from the server: ", error);
    }
  }

  return (
    <CardWrapper
      headerLabel="Forgot your password?"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="johndoe@example.com"
                      type="email"
                    ></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={errorMessage}></FormError>
          <FormSuccess message={successMessage}></FormSuccess>
          <Button type="submit" className="w-full">
            Confirm
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
