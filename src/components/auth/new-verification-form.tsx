"use client";
import { useSearchParams } from "next/navigation";
import { CardWrapper } from "./card-wrapper";
import { BeatLoader } from "react-spinners";
import { useCallback, useState } from "react";
import { useEffect } from "react";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";

const NewVerificationForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const onSubmit = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/new-verification", {
        method: "POST",
        body: JSON.stringify({ token: token }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(data.success);
        setErrorMessage("");
      }
      setErrorMessage(data.error);
    } catch (error) {
      console.log("Error from the server: ", error);
    }
  }, [token]);
  useEffect(() => {
    onSubmit();
  }, []);
  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center w-full justify-center m-10">
        {!successMessage && !errorMessage && <BeatLoader />}
      </div>
      <FormError message={errorMessage}></FormError>
      <FormSuccess message={successMessage}></FormSuccess>
    </CardWrapper>
  );
};
export default NewVerificationForm;
