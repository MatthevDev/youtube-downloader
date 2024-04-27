'use client'

import { DownloadCloud, MousePointerClickIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"

const NavBar = () => {
    const router = useRouter()
    const pathname = usePathname()

    return (
        <nav className="flex justify-between items-center h-20 bg-zinc-200/25 backdrop-blur-lg sticky inset-x-0 top-0 left-0 border-b-2 border-zinc-300/75">
            <div className="w-full max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link href="/" className="flex items-center">
                    <DownloadCloud className="h-8 w-8 mr-4" />
                    <span className="self-center text-2xl font-bold whitespace-nowrap dark:text-white">
                        YTdown
                        <span
                        className="animate-dot -ml-1">.</span>
                    </span>
                </Link>
                {pathname !== "/demo" ? (
                    <Button
                    onClick={() => router.push("/demo")}>
                        Start Now <MousePointerClickIcon className="ml-2 h-4 w-4" />
                    </Button>
                ) : null}
            </div>
        </nav>
    )
}

export default NavBar