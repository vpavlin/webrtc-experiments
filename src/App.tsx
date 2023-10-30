import { useState } from 'react';
import './App.css';
import Upload from './components/upload';
import Download from './components/download';
import { Tech } from './lib/types';
import Helia from './components/helia';

function App() {
  const [tech, setTech] = useState<Tech>(Tech.WebTorrent)

  return (
    <div className="App text-center">
      <div className="my-2 w-[800px] p-4 border shadow mx-auto">
        <label className="label">
            <input className="p-3 radio"type="radio" name="tech" value={Tech.Helia} onChange={(e) => setTech(Tech.Helia)} checked={tech == Tech.Helia} /><span className="label-text">{Tech.Helia}</span>
        </label>
        <label className="label">
            <input className="p-3 radio" type="radio" name="tech" value={Tech.WebTorrent} onChange={(e) => setTech(Tech.WebTorrent)} checked={tech == Tech.WebTorrent} /><span className="label-text">{Tech.WebTorrent}</span>                 
        </label>
      </div>
      <div>
        <Upload tech={tech}/>
        <Download tech={tech}/>
      </div>
      {tech == Tech.Helia  && <Helia />
      
    }
    </div>
  );
}

export default App;
