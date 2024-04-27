import { readFile, stat } from "fs/promises"
import path from "path"

export const POST = async (req: Request) => {
    const {id} = await req.json()
    if(!id) {
        return Response.json({
            success: false,
            reason: "no id provided"
        })
    }

    const filePath = process.cwd() + `/src/storage/${id}.mp3`
    const stats = await stat(filePath)
    const fileContent = await readFile(filePath)

    console.log("downloading file: " + filePath)

    return new Response(fileContent, {
        status: 200,
        headers: new Headers({
            "Content-Type": "audio/mpeg",
            "Content-Length": stats.size.toString(),
            "constent-disposition": "attachment; filename=" + path.basename(filePath),
        })
    })
}