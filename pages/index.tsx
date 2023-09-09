import fsPromises from 'fs/promises';
import path from 'path'
import {useEffect} from "react";

export default function Home() {
  useEffect(() => {
    (async () => {
      const response = await fetch('/api/read_review');
        const data = await response.json();
        const test = JSON.parse(data.file);

      console.log(test);

    })();


  }, []);
  return (
    <>
      <button onClick={async () => {
        const response = await fetch('/api/write_review?comment=test');
        const data = await response.json();
        console.log("test", data);
      }}>Test</button>

      <button onClick={async () => {
        const response = await fetch('/api/clear');
      }}>Test</button>
    </>
  )
}
