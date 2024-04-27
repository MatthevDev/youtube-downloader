type VideoIdResponse = {
    success: boolean,
    reason?: string,
    id?: string
}

type VideoQuality = "144p" | "240p" | "360p" | "480p" | "720p" | "1080p"