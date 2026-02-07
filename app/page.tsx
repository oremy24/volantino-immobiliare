"use client";
import { useState } from 'react';

export default function Home() {
  const [data, setData] = useState({
    titolo: '', desc: '', prezzo: '', mq: '', localita: '', 
    classe: 'G', 
    immagine: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716'
  });
  const [localUrl, setLocalUrl] = useState(data.immagine);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // 1. COMPRESSIONE FOTO
  const handleFile = async (e: any) => { // NOTA: Ho aggiunto : any qui
    const file = e.target.files[0];
    if (!file) return;

    setIsCompressing(true);
    setLocalUrl(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event: any) => { // NOTA: e anche qui
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
            setData(prev => ({ ...prev, immagine: compressedDataUrl }));
        }
        setIsCompressing(false);
      };
    };
  };

  // 2. DOWNLOAD VIA POST
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch('/api/flyer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Errore generazione");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `volantino-${data.localita || 'immobile'}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      alert("Errore nel download. Riprova con una foto più leggera.");
    } finally {
      setIsDownloading(false);
    }
  };

  // 3. COPIA TESTO
  const copyCaption = () => {
    const text = `🏠 *NUOVA OPPORTUNITÀ A ${data.localita.toUpperCase() || 'ZONA...'}*\n\n${data.titolo}\n${data.desc}\n\n📏 ${data.mq} mq | ⚡ Classe ${data.classe}\n💰 Prezzo: ${data.prezzo}\n\nContattami per info!`;
    navigator.clipboard.writeText(text);
    alert("Testo copiato!");
  };

  return (
    <div style={{ backgroundColor: '#111', minHeight: '100vh', color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', gap: '10px' }}>
          <div style={{ background: '#d97706', padding: '5px 12px', borderRadius: '8px', fontSize: '20px' }}>⚡</div>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>FlashAgent Tool</h1>
        </div>
        
        {/* PREVIEW */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', marginBottom: '25px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
          <div style={{ position: 'relative', height: '300px', backgroundColor: '#eee' }}>
            <img src={localUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '15px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
               <span style={{ backgroundColor: '#d97706', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                 {data.prezzo || 'PREZZO'}
               </span>
            </div>
          </div>
          <div style={{ padding: '20px', color: '#333' }}>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', fontWeight: 'bold' }}>{data.titolo || 'Titolo Immobile'}</h3>
            <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.4', margin: 0 }}>{data.desc || 'Descrizione breve...'}</p>
            <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', color: '#888' }}>
              <span>📍 {data.localita || 'Città'}</span>
              <span>📏 {data.mq || '0'} mq</span>
              <span>⚡ Cl. {data.classe}</span>
            </div>
          </div>
        </div>

        {/* INPUT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          <label style={fileLabelStyle}>
            <span style={{fontSize: '20px'}}>📷</span>
            <span>{isCompressing ? 'Compressione in corso...' : 'Carica Foto (Auto-Resize)'}</span>
            <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
          </label>

          <input style={inputStyle} type="text" placeholder="Titolo" value={data.titolo} onChange={(e: any) => setData({...data, titolo: e.target.value})} />
          <textarea style={{...inputStyle, height: '70px', resize: 'none'}} placeholder="Descrizione..." value={data.desc} onChange={(e: any) => setData({...data, desc: e.target.value})} />
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <input style={{...inputStyle, flex: 1}} type="text" placeholder="€ Prezzo" value={data.prezzo} onChange={(e: any) => setData({...data, prezzo: e.target.value})} />
            <input style={{...inputStyle, flex: 1}} type="text" placeholder="MQ" value={data.mq} onChange={(e: any) => setData({...data, mq: e.target.value})} />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <input style={{...inputStyle, flex: 2}} type="text" placeholder="Zona / Città" value={data.localita} onChange={(e: any) => setData({...data, localita: e.target.value})} />
            <select style={{...inputStyle, flex: 1}} value={data.classe} onChange={(e: any) => setData({...data, classe: e.target.value})}>
              <option value="A4">A4</option><option value="A">A</option><option value="B">B</option>
              <option value="G">G</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button onClick={copyCaption} style={{ ...actionBtnStyle, backgroundColor: '#333' }}>
              <span>📋</span> <span style={{fontSize: '14px'}}>Copia Testo</span>
            </button>
            
            <button onClick={handleDownload} disabled={isDownloading || isCompressing} style={{ ...actionBtnStyle, backgroundColor: '#d97706', flex: 2, opacity: isDownloading ? 0.7 : 1 }}>
              <span>{isDownloading ? '⏳ Generazione...' : '⬇️ SCARICA HD'}</span>
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}

const inputStyle = { padding: '14px', borderRadius: '12px', border: '1px solid #333', background: '#222', color: 'white', fontSize: '15px', outline: 'none' };
const fileLabelStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '15px', background: '#222', border: '1px dashed #666', borderRadius: '12px', color: '#ccc', cursor: 'pointer', fontSize: '14px' };
const actionBtnStyle = { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', borderRadius: '12px', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'none' };
