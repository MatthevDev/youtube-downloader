'use client'

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Download, Loader2 } from "lucide-react"
import { useToast } from "../ui/use-toast"
import { deleteDownloadedFile, downloadVideo } from "@/lib/actions"
import { Progress } from "../ui/progress"
import { useRef, useState } from "react"
import { Label } from "../ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select"

const urlFormSchema = z.object({
    url: z.string().min(5)
})

const validUrlSchema = z.object({
    url: z.string().url()
})

const videoQualitySchema = z.union([
    z.literal("144p"),
    z.literal("240p"),
    z.literal("360p"),
    z.literal("480p"),
    z.literal("720p"),
    z.literal("1080p"),
])

const UrlForm = () => {
    const { toast } = useToast()
    const progressRef = useRef<null | HTMLDivElement>(null)
    const [url, setUrl] = useState<string>("")
    const [vid, setVid] = useState<string>("")
    const [title, setTitle] = useState<string>("")
    const [progressValue, setProgressValue] = useState<number>(0)
    const [isDownloading, setIsDownloading] = useState<boolean>(false)

    const [type, setType] = useState<string>("audio")
    const [videoQuality, setVideoQuality] = useState<VideoQuality>("480p")

    const form = useForm<z.infer<typeof urlFormSchema>>({
        resolver: zodResolver(urlFormSchema),
        defaultValues: {
            url: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof urlFormSchema>) => {
        try {
            const {url} = validUrlSchema.parse(values)
            const vid = url.split("=")[1]
            if(!vid) {
                toast({
                    title: "Invalid Url",
                    description: "Make sure you provide valid url",
                    variant: "destructive",
                    duration: 3000,
                })
                return
            }
            setUrl(url)
            setVid(vid)
            const res = await fetch("https://www.youtube.com/oembed?format=json&url="+url)
            const data = await res.json()
            setTitle(data.title)
            toast({
                title: "Successfully Loaded",
                variant: "default",
                duration: 2000,
                className: "bg-green-500 text-white",
            })
        } catch (err) {
            toast({
                title: "Invalid Url",
                description: "Make sure you provide valid url",
                variant: "destructive",
                duration: 3000,
            })
            setUrl("")
            setVid("")
        }
    }

    const startProgress = async () => {
        setProgressValue(0)
        const interval = setInterval(() => {
                setProgressValue((prevValue) => {
                    if(prevValue >= 90) {
                        clearInterval(interval)
                        return prevValue
                    }
                    return prevValue + 5
                })
        }, 1000)

        return interval
    }
    const endProgress = async () => {
        setProgressValue(100) 
        await new Promise(resolve => setTimeout(resolve, 500))
        progressRef.current?.classList.remove("opacity-100")
        progressRef.current?.classList.add("opacity-0")
    }

    const getDownloadLink = async () => {
        if(!url || !vid) {
            toast({
                title: "Invalid Url",
                description: "Make sure you provide valid url",
                variant: "destructive",
                duration: 3000,
            })
            return
        }

        if(type == "video") {
            if(!videoQuality) {
                toast({
                    title: "Provide all information",
                    description: "Please specify the video quality",
                    variant: "destructive",
                    duration: 3000,
                })
                return
            }

            toast({
                title: "Downloading Video",
                description: "This function is not yet implemented!",
                variant: "default",
                duration: 3000,
            })
            return
        }

        try {
            const {url: _} = validUrlSchema.parse({url: url})
            progressRef.current?.classList.remove('opacity-0')
            progressRef.current?.classList.add("opacity-100")
            toast({
                title: "Started download process",
                variant: "default",
                duration: 2000,
            })

            setIsDownloading(true)
            startProgress()
            const vidId: VideoIdResponse = await downloadVideo(url)
            setIsDownloading(false)
            if(!vidId || vidId.success == false || !vidId.id) {
                if(vidId.reason === "timeout") {
                    toast({
                        title: "Connection Timeout",
                        description: "Make sure you provide valid url",
                        variant: "destructive",
                        duration: 3000,
                    })
                } else {
                    toast({
                        title: "Something went wrong",
                        description: "Make sure you provide valid url",
                        variant: "destructive",
                        duration: 3000,
                    })
                }
            } else {
                endProgress()
                toast({
                    title: "Downloaded",
                    description: vidId.id,
                    variant: "default",
                    duration: 3000,
                })

                try {
                    const response = await fetch(`/api/download`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ id: vidId.id }),
                    })
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(new Blob([blob]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `${title}_${vidId.id}.mp3`);
                    document.body.appendChild(link);
                    link.click();
                    await deleteDownloadedFile(vidId.id)
                } catch (error) {
                    console.error('Error downloading file:', error);
                }
            }
        } catch (err) {
            toast({
                title: "Invalid Url",
                description: "Please provide valid url",
                variant: "destructive",
                duration: 3000,
            })
        }
    }

    return (
        <div className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                className="w-full px-24 flex justify-stretch space-x-6">
                    <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                        <FormItem
                        className="w-full">
                            <FormControl>
                                <Input placeholder="Youtube Video Url..." {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                    <Button type="submit" variant={"default"}>Load <Download className="ml-2 h-4 w-4" /></Button>
                </form>
            </Form>
            <div>
                <Progress
                ref={progressRef}
                className="opacity-0 transition-all duration-500 my-4 h-1 w-2/3 mx-auto"
                value={progressValue} />
            </div>
            {(vid && url) ? (
                <div className="grid grid-cols-6 gap-8">
                    <div className="col-span-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                        src={`https://img.youtube.com/vi/${vid}/maxresdefault.jpg`}
                        alt="youtube thumbnail"
                        className="rounded-2xl shadow-2xl block"
                        />
                        {title ? (
                            <h1 className="text-2xl font-semibold mt-8">
                                {title}
                            </h1>
                        ) : (
                            <h1 className="text-2xl font-semibold mt-8 text-slate-300 bg-slate-300 rounded-lg">
                                xxxxxxxxxxxxxxxxxxx
                            </h1>
                        )}
                    </div>
                    <div className="col-span-3 grid grid-cols-1">
                        <div className="flex flex-col justify-start items-center">
                            <h2 className="font-semibold text-2xl text-center mb-4">
                                Options
                            </h2>
                            <div className="w-full grid grid-cols-1 px-12">
                                <div className="grid grid-cols-2 items-center text-lg">
                                    <Label className="">
                                        Media type:
                                    </Label>
                                    <Select
                                    defaultValue="audio"
                                    onValueChange={(value) => setType(value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Download type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="audio">
                                                Audio
                                            </SelectItem>
                                            <SelectItem value="video">
                                                Video
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {type === "video" ? (
                                    <div className="mt-4 grid grid-cols-2 items-center text-lg">
                                        <Label>
                                            Video quality:
                                        </Label>
                                            <Select
                                            defaultValue="480p"
                                            onValueChange={(value) => {
                                                try{
                                                    videoQualitySchema.parse(value)
                                                    setVideoQuality(value as VideoQuality)
                                                } catch(err) {
                                                    toast({
                                                        title: "Invalid quality",
                                                        description: "Please provide valid quality",
                                                        variant: "destructive",
                                                        duration: 3000,
                                                    })
                                                }
                                            }}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Quality" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="144p">
                                                        144p
                                                    </SelectItem>
                                                    <SelectItem value="240p">
                                                        240p
                                                    </SelectItem>
                                                    <SelectItem value="360p">
                                                        360p
                                                    </SelectItem>
                                                    <SelectItem value="480p">
                                                        480p
                                                    </SelectItem>
                                                    <SelectItem value="720p">
                                                        720p
                                                    </SelectItem>
                                                    <SelectItem value="1080p">
                                                        1080p
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <div className="w-full h-0.5 bg-slate-300" />
                        <div className="w-full flex justify-center items-center">
                            <Button
                            size="lg"
                            className="text-2xl py-8 px-12"
                            aria-label="download"
                            onClick={() => {
                                getDownloadLink()
                            }} 
                            disabled={isDownloading}
                            >
                                {isDownloading ? (
                                    <>
                                        Downloading <Loader2 className="ml-4 h-6 w-6 animate-spin" /> 
                                    </>
                                ) : (
                                    <>
                                        Download <Download className="ml-4 h-6 w-6" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>    
            ) : (
                <div className="h-64 flex justify-center items-center">
                    <h1 className="font-medium text-2xl text-zinc-600">
                        Provide youtube url
                    </h1>
                </div>
            )}
            
        </div>
    )
}

export default UrlForm
