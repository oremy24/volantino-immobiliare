"use client";
import { useState } from 'react';

export default function Home() {
  const [data, setData] = useState({
    titolo: 'Splendido Bilocale',
    prezzo: '185.000 €',
    mq: '75',
    immagine: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa'
  });

  const query = new URLSearchParams(data).toString();
  const previewUrl = `/api/flyer?${query}`;

  return (
    <div style={{ display: 'flex', padding: '40px', fontFamily: 'sans-serif', gap: '40px' }}>
      <div style={{ width: '350px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <h2>Configura Volantino</h2>
        <input style={{padding:'8px'}} type="text" placeholder="Titolo" onChange={e => setData({...data, titolo: e.target.value})} value={data.titolo} />
        <input style={{padding:'8px'}} type="text" placeholder="Prezzo" onChange={e => setData({...data, prezzo: e.target.value})} value={data.prezzo} />
        <input style={{padding:'8px'}} type="text" placeholder="MQ" onChange={e => setData({...data, mq: e.target.value})} value={data.mq} />
        <input style={{padding:'8px'}} type="text" placeholder="URL Immagine" onChange={e => setData({...data, immagine: e.target.value})} value={data.immagine} />
        
        <a href={previewUrl} download="volantino.png" style={{ background: '#0070f3', color: 'white', padding: '12px', textAlign: 'center', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold', marginTop: '20px' }}>
          SCARICA IMMAGINE
        </a>
      </div>

      <div style={{ flex: 1, background: '#f0f0f0', padding: '20px', display: 'flex', justifyContent: 'center' }}>
        <img src={previewUrl} style={{ maxWidth: '400px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }} alt="Preview" />
      </div>
    </div>
  );
}
