'use server'

import YTDlpWrap from "yt-dlp-wrap"
import {v4 as uuid} from "uuid"
import { unlink } from "fs/promises"
import { existsSync } from "fs"

export async function downloadVideo(url: string): Promise<VideoIdResponse> {
    const id = uuid()

    const controller = new AbortController()
    const ytdlp = new YTDlpWrap(process.cwd()+'/bin/yt-dlp_macos')

    return new Promise(resolve => {
        let ytDlpEventEmmiter = ytdlp.exec([
            url,
            '--quiet',
            '-x',
            '--audio-format',
            'mp3',
            '-o',
            process.cwd()+`/src/storage/${id}.mp3`,
        ], {}, controller.signal)
        .on('error', (error) => {
            console.log('error:', error)
            resolve({success: false, reason: "error"})
        })
        .on('close', () => {
            console.log('all done')
            resolve({success: true, id: id})
        })

        setTimeout(() => {
            controller.abort();
            resolve({success: false, reason: "timeout"})
        }, 30000);
    })

}

export async function getThumbnailUrl(url: string) {
    return `https://img.youtube.com/vi/${url}/0.jpg`
}

export async function deleteDownloadedFile(id: string) {
    if(!id) return
    if(!existsSync(process.cwd()+`/src/storage/${id}.mp3`)) return

    try{
        await unlink(process.cwd()+`/src/storage/${id}.mp3`)
    } catch (error) {
        return false
    }
    return true
}