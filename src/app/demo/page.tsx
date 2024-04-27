'use client'
import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import UrlForm from "@/components/downloader/UrlForm"
import { Button } from "@/components/ui/button"

const Page = () => {
    return (
        <div className="my-8">
            <MaxWidthWrapper>
                <h1 className="w-full text-center font-bold text-4xl mb-8">
                    Downloader
                </h1>
                <UrlForm />
            </MaxWidthWrapper>
        </div>
    )
}

export default Page