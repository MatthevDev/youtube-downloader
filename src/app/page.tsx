'use client'

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { MousePointerClick } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()

  return (
    <div className="w-full h-full bg-white/0 p-4 md:p-6 lg:p-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div style={{
          clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
        }} className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-2.5 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>
      
      <MaxWidthWrapper>
        <div className="my-8">
          <h1 className="text-center font-semibold text-3xl md:text-4xl lg:text-5xl">
            Download videos
          </h1>
          <p className="text-center text-zinc-700 mt-4 text-md md:text-lg lg:text-xl">
            With just{' '}
            <span className="text-blue-500 font-semibold">few clicks</span>.
          </p>
        </div>
        <div className="w-full flex justify-center items-center">
          <Button
          onClick={() => {router.push("/demo")}}>
            Try Now <MousePointerClick className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="mt-12">
          <div className="flex justify-center items-center">
            <div className="shadow-xl p-4 ring-inset ring-8 ring-zinc-400/50 rounded-xl">
              <Image
              src="/images/demo-placeholder.png"
              width={1280}
              height={671}
              alt="Demo image"
              className="w-full"
              />
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
      
    </div>
  );
}
