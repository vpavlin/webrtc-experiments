import { Helia } from "helia"
import { useEffect, useState } from "react"
import { getHelia } from "../lib/helia"
import { multiaddr } from '@multiformats/multiaddr'
import { useHelia } from "../hooks/useHelia"


const DEFAULT_ADDR=""//"/dns4/ipfs.myrandomdemos.online/udp/4001/quic-v1/webtransport/certhash/uEiBG-N803swzPt1xtPVNy4nQMV7GPrF7F--RSNU2ZNfFYw/certhash/uEiAQ5PAJet1_uTHD04Tyk_HzKQkbpkHWQ5EN9xhremyYvw/p2p/12D3KooWBzbXNBrKXzGpwXacuxQwkUiFJ1rho882HZDocKfdJB8Y"
const Dial = () => {
    const {helia} = useHelia()
    const [err, setERR] = useState<string>()

    const [maStr, setMA] = useState<string>(DEFAULT_ADDR)
    const [dialing, setDialing] = useState(false)

    const dial = async () => {
        if (!helia || !maStr) return
        const ma = multiaddr(maStr)
        console.log("dialing")
        setDialing(true)
        try {  
            setERR(undefined)
            await helia.libp2p.dial(ma)
            console.log("Dialed " + maStr)
            setERR(undefined)

        } catch (e:any) {
            console.error(e)
            setERR(e.toString())
        } finally {
            setDialing(false)
        }
    }

    return (
        <div>
        { helia &&
            <div>
                <div className="m-2">
                    <input className="input input-bordered w-full" type="text"  size={100} onChange={(e) => setMA(e.target.value)} defaultValue={DEFAULT_ADDR} />
                    <button className="btn" disabled={dialing} onClick={() => dial()}>{ dialing ? "Dialing..." : "Dial"}</button>
                </div>
                { err &&
                    <div className="bg-error text-error-content p-4 w-fit m-auto my-3">
                        {err}
                    </div>
                }
            </div>
        }
        </div>
    )
}

export default Dial