import { useEffect, useState } from "react";
import { useHelia } from "../hooks/useHelia";
import { CID } from 'multiformats/cid'
import { useWebTorrent } from "../hooks/useWebTorrent";
import { IProps, Tech } from "../lib/types";


const Download = ({tech}: IProps) => {
    const [link, setLink] = useState<string>()

    return (
        <div className="my-2 w-[800px] p-4 border shadow mx-auto">
            <div>Paste content link</div>
            <input className="input input-bordered" size={45} onChange={(e) => setLink(e.target.value)} />

            {tech == Tech.Helia && <DownloadHelia cid={link}  />}
            {tech == Tech.WebTorrent && <DownloadWebTorrent magnetUri={link} />}
        </div>
    )
}

interface IHeliaProps {
    cid: string | undefined
}
const DownloadHelia = ({cid}: IHeliaProps) => {
    const {helia, json} = useHelia()
    const [data, setData] = useState<any>()


    useEffect(() => {
        if (!helia || !json || !cid) return

        (async () => {            
            const c = CID.parse(cid)
            console.log("Getting "+ cid)
            for await (const provider of helia.libp2p.contentRouting.findProviders(c)) {
                console.log(provider.id, provider.multiaddrs)
            }       
            json.get(c).then((data) => {
                setData(data)
                console.log("Done! "+ cid)
            }).finally(() => console.log("Done?"))
        })()

    }, [helia, json, cid])
            
    return (<div>{data}</div>)
}

interface IWebTorrentProps {
    magnetUri: string | undefined
}

const DownloadWebTorrent = ({magnetUri}: IWebTorrentProps) => {
    const [blobUrl, setBlobUrl] = useState<string>()
    const [blobType, setBlobType] = useState<string>()
    const [elem, setElem] = useState(<div></div>)
    const {download, torrent} = useWebTorrent()
    const [downlaoding, setDownloading] = useState(false)


    const downloadLocal = async () => {  
        setDownloading(true) 
        download(magnetUri!, async (torrent: any) => {
            console.log(torrent.files[0])
            // Torrents can contain many files. Let's use the .mp4 file
            const files:File[] = torrent.files
            const b = await files[0].arrayBuffer()
            setBlobUrl(URL.createObjectURL(new Blob([b], { type: files[0].type } /* (1) */)))
            const bloburl = URL.createObjectURL(new Blob([b], { type: files[0].type }))
            setBlobType(files[0].type)
            setDownloading(false)
            switch (files[0].type) {
                case "image/png":
                    setElem(<img src={bloburl} className="max-w-[300px] m-auto" />)
                    break;
                case "application/octet-stream":
                case "video/mp4":
                    setElem(<video controls={true} src={bloburl}></video>)
                    break;
                default:
                    setElem(<a href={bloburl} target="_blank">{files[0].name}</a>)
                    break;
            }
        })
    }

    useEffect(() => {
        if (!magnetUri) return

        downloadLocal()
    }, [magnetUri])

    return (<div>
        {
            downlaoding ? 
                <div>{torrent && <div>
                    <progress className="progress w-120" value={torrent.downloaded} max={torrent.length}></progress>
                    <div>{torrent.progress * 100}%</div>
                </div>}</div>
                :
                <div className="my-4">{elem}</div>               
        }
    </div>)
}


export default Download;