import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";
import { SparklesCore } from "@/components/ui/sparkles";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import Image from "next/image";

// Content for the scrolling component
const content = [
  {
    title: "Intelligent Automation",
    description:
      "Our app simplifies the ECMO allocation process, ensuring timely support for those in critical need.",
    content: (
      <div className="h-full w-full  flex items-center justify-center text-white">
        <Image
          src="/automation.png"
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
  {
    title: "Real time changes",
    description:
      "See changes as they happen. With our platform, you can track every modification in real time.",
    content: (
      <div className="h-full w-full  flex items-center justify-center text-white">
        <Image
          src="/real-time.png"
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
  {
    title: "User-friendly interface",
    description:
      "Ease of use is at the heart of our design. Manage ECMO allocations with a few clicks, allowing you to focus on what truly matters - patient care.",
    content: (
      <div className="h-full w-full  flex items-center justify-center text-white">
        <Image
          src="/user-friendly.png"
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
  {
    title: "Secure and Compliant",
    description:
      "Compliant with healthcare regulations, our platform guarantees the confidentiality and integrity of patient information.",
    content: (
      <div className="h-full w-full  flex items-center justify-center text-white">
        <Image
          src="/secure.png"
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
];
export default function Home() {
  return (
    <SparklesCore
      background="transparent"
      minSize={0.4}
      maxSize={1}
      particleDensity={1200}
      className="w-full h-full flex-col items-center justify-center"
      particleColor="#7DD1FF"
    >
      {" "}
      <div className="flex flex-row items-center h-full">
        <div className="space-y-4 ml-8 w-1/2 text-left">
          <h1 className="font-sans font-bold text-7xl">
            Revolutionizing patient care.
          </h1>
          <p className="text-lg">
            Designed to optimize patient outcomes, our platform ensures the most
            critical cases receive priority, automating the decision-making
            process with precision and care.
          </p>
          <div className="flex flex-row space-x-4">
            <LoginButton>
              <Button variant="outline">Get started</Button>
            </LoginButton>
          </div>
        </div>
        <div className="space-y-4 ml-8 w-1/2 text-left">
          <StickyScroll content={content} />
        </div>
      </div>
    </SparklesCore>
  );
}
