import { useEffect, useState } from "react";
import { useHelia } from "../hooks/useHelia";
import { useFilePicker } from "use-file-picker";
import { NODES } from "../lib/helia";
import { useSeed, useWebTorrent } from "../hooks/useWebTorrent";
import { IProps, Tech } from "../lib/types";

const DEFAULT_OBJECT = '{"hello": "world"}'

const Upload = ({tech}: IProps) => {
    const { openFilePicker, filesContent, loading, plainFiles } = useFilePicker({readAs: "BinaryString",});
    const [link, setLink] = useState<string>()

    const {seed} = useSeed()

    useEffect(() => {

        (async () => {
            for (const f of plainFiles) {
                 
                if (tech == Tech.WebTorrent) {
                    console.log(f)
                    seed(f, (torrent) => {
                        console.log(torrent)
                        setLink(torrent.magnetURI)
                    })
                }
            }
        })()
    }, [filesContent])

    return (
        <div className="my-2 w-[800px] p-4 border shadow mx-auto">
            <div>
                <button className="btn" disabled={loading} onClick={() => openFilePicker()}> Upload File</button>
            </div>
            {tech == Tech.Helia && <UploadHelia files={plainFiles} setCID={setLink}/>}
            <div>{<div>{link}</div>}</div>
        </div>
    )
}

export default Upload;

interface IHeliaProps {
    files: File[] | undefined
    setCID: React.Dispatch<React.SetStateAction<string | undefined>>
}
const UploadHelia = ({files, setCID}: IHeliaProps) => {
    const {json, helia} = useHelia()

    useEffect(() => {
        if (!files || !helia || !json) return

        for (const f of files) {

            json.add(f).then(async (cid) => {
                setCID(cid.toString())
                await helia.libp2p.contentRouting.provide(cid);
            })
        }
    }, [json, helia, files])
    return (<></>)
}