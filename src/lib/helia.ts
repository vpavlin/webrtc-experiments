import { unixfs } from "@helia/unixfs";
import { LevelBlockstore } from "blockstore-level";
import { LevelDatastore } from "datastore-level";
import { Helia, createHelia } from "helia";
import { bootstrap } from "@libp2p/bootstrap";
import { tcp } from '@libp2p/tcp'
import { webRTC, webRTCDirect } from '@libp2p/webrtc'
import { webTransport } from '@libp2p/webtransport'
import { webSockets } from '@libp2p/websockets'
import { circuitRelayTransport } from 'libp2p/circuit-relay'
import { noise } from '@chainsafe/libp2p-noise'
import { mplex } from '@libp2p/mplex'
import { identifyService } from 'libp2p/identify'

import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { yamux } from '@chainsafe/libp2p-yamux'
import { ipniContentRouting,  } from '@libp2p/ipni-content-routing'
import { type DualKadDHT, kadDHT } from '@libp2p/kad-dht'
import { ipnsSelector } from 'ipns/selector'
import { ipnsValidator } from 'ipns/validator'
import { autoNATService } from 'libp2p/autonat'
import type { Libp2pOptions } from 'libp2p'
import { dcutrService } from 'libp2p/dcutr'



export const NODES:string[] = [
"/ip4/128.140.55.128/udp/4001/quic-v1/webtransport/certhash/uEiBG-N803swzPt1xtPVNy4nQMV7GPrF7F--RSNU2ZNfFYw/certhash/uEiAQ5PAJet1_uTHD04Tyk_HzKQkbpkHWQ5EN9xhremyYvw/p2p/12D3KooWBzbXNBrKXzGpwXacuxQwkUiFJ1rho882HZDocKfdJB8Y",
    /*"/ip4/127.0.0.1/udp/4001/quic-v1/webtransport/certhash/uEiCfuGGtgBtY3354gXZKoy31_eK8Fr5klrCIfvd3i3G9OA/certhash/uEiAbbUtWB7YW-p7sg2mCj3QisSkVdilA1xGTWd5jR9EHeg/p2p/12D3KooWLxkcF2mvb9v34j3611qwYB7c5kYDiepqCbgu6dpfS385",
/*"/ip4/149.28.94.106/udp/4001/quic-v1/p2p/12D3KooWBDT5Y3j6yipDxFHhc9WDGyuwKm7amqmZrM3siUmpiiuo/p2p-circuit/p2p/12D3KooWLxkcF2mvb9v34j3611qwYB7c5kYDiepqCbgu6dpfS385",
"/ip4/149.28.94.106/udp/4001/quic-v1/webtransport/certhash/uEiAMxjaeRdGZLRYiU4Pa1iRKjysc6QNt_LF7ttgR7ZPGxQ/certhash/uEiAV92tskgDcF-Bp05ruLhH_VzPEczl6VkbhniLXDIJMEg/p2p/12D3KooWBDT5Y3j6yipDxFHhc9WDGyuwKm7amqmZrM3siUmpiiuo/p2p-circuit/p2p/12D3KooWLxkcF2mvb9v34j3611qwYB7c5kYDiepqCbgu6dpfS385",
/*'/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
'/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
'/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
'/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt'*/

]

let helia: Helia | null = null
export const getHelia = async () => {
    if (helia) {
        return helia
    }
    const datastore = new LevelDatastore(`ipfs-experiment-datastore`);
    const blockstore = new LevelBlockstore(`ipfs-experiment-blockstore`);

    helia = await createHelia({
        start: true,
        libp2p: {
            addresses: {
                listen: ["/webrtc"],
            },
            transports: [
                webRTC(),
                webRTCDirect(),
                webTransport(),
                webSockets(),
                circuitRelayTransport({
                    discoverRelays: 1  ,
                    reservationConcurrency: 1,
                })
            ],
            streamMuxers: [mplex()],
            connectionEncryption: [noise()],
            /*peerDiscovery: [
                bootstrap({ list: NODES }),
            ],*/
            connectionGater: {
                denyDialMultiaddr: () => {return false},
                denyOutboundConnection: () => {return false}

            },
            contentRouters: [
                
            ],
            services: {
                dcutr: dcutrService(),
                identify: identifyService(),
                autoNAT: autoNATService(),
                // pubsub: gossipsub(),
                // dht: kadDHT(),
                dht: kadDHT({
                    // pingTimeout: 2000,
                    // pingConcurrency: 3,
                    // kBucketSize: 20,
                    clientMode: true,
                })
            },
        },
        datastore,
        blockstore
        })
            //await h.start()
    let f = unixfs(helia)


    return helia
}