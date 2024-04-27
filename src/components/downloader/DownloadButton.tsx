import { Download } from "lucide-react"
import { Button } from "../ui/button"

interface Props {
    url: string
}

const DownloadButton = ({url}: Props) => {

    const download = async () => {
        try {
            const response = await fetch('/api/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: 'test' }),
            });
            if (!response.ok) {
                throw new Error('Failed to download file');
            }
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'test.mp3'; // Update with the desired filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    }

    return (
        <div>
            <Button
            className=""
            onClick={() => {
                console.log("Downloading")
            }}>
                Download
                <Download className="ml-2 h-6 w-6" />
            </Button>
        </div>
    )
}

export default DownloadButton