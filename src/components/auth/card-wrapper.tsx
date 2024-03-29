"use client";
import { Card, CardContent, CardHeader, CardFooter } from "../ui/card";
interface CardWrapperProps {
  children: React.ReactNode;
  title: string;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: string;
}
import { BackButton } from "./back-button";
import { Header } from "./header";
import { Social } from "./social";

export const CardWrapper = ({
  title,
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
}: CardWrapperProps) => {
  return (
    <Card className="w-[400px] shadow-md ">
      <CardHeader>
        <Header label={headerLabel} title={title}></Header>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <Social></Social>
        </CardFooter>
      )}
      <CardFooter>
        <BackButton label={backButtonLabel} href={backButtonHref}></BackButton>
      </CardFooter>
    </Card>
  );
};
