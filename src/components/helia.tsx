import { useHelia } from "../hooks/useHelia";
import Dial from "./dial";
import {useState} from "react";

const Helia = () => {
    const {json, helia, addrs, conns} = useHelia()

    return (
        <div>
            { helia ?
            <div>
                <Dial />

                Listen Addrs
                <div className='m-3 border'>
                {addrs.map((a) => <div className="border-b-2 cursor-pointer tooltip w-full" data-tip="Copy to clipboard" onClick={() => {navigator.clipboard.writeText(a.toString())}}>{a.toString()}</div>)}
                </div>
                Connected to
                <div className="m-3 border">
                {conns.map((v) => <div className="border-b-2">{v.toString()}</div>)}
                </div>

            </div>
            :
            <div>Loading...</div>
            }
         </div>
    )
}

export default Helia;