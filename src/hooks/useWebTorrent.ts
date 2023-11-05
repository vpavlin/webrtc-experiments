import { useEffect, useMemo, useState } from "react"

import WebTorrent from 'webtorrent/dist/webtorrent.min.js'
import {WebTorrent as TWebtorrent} from "webtorrent"

export const useWebTorrent = () => {
    const client = new WebTorrent()
    const [torrent, setTorrent] = useState<any>()

    const download = (magnetUri: string | Uint8Array, cb: (torrent: any) => void) => {
        console.log(magnetUri)
        setTorrent({progress: 0})
        const torrent = client.add(magnetUri, cb)
        torrent.on('download', (bytes:any) => {
            console.log(torrent)
            console.log(torrent.length +" / "+torrent.downloaded)
            setTorrent({progress: Math.floor(torrent.progress *100), lenght: torrent.length, downloaded: torrent.downloaded})
        }) 
        return torrent       
    }    

    return useMemo(() => ({
        torrent,
        download
    }), [
        torrent,
        download
    ])
}
export const useSeed = () => {
    const client = new WebTorrent()

    const [magnetUri, setMagnetUri] = useState<string>()

    const seed = async (data: File, callback: ((torrent: any) => any)) => {
 
        console.log(data)
        client.seed(data, callback)
    }

    return useMemo(() => ({seed, magnetUri}), [seed, magnetUri])
}