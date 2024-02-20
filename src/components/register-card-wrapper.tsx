"use client";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
interface RegisterCardWrapperProps {
  children: React.ReactNode;
  title: string;
  headerLabel?: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: string;
}
import { BackButton } from "./auth/back-button";
import { Header } from "./auth/header";

export const RegisterCardWrapper = ({
  title,
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
}: RegisterCardWrapperProps) => {
  return (
    <Card className="w-[500px] shadow-md ">
      <CardHeader>
        <Header title={title}></Header>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <BackButton label={backButtonLabel} href={backButtonHref}></BackButton>
      </CardFooter>
    </Card>
  );
};
