import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function POST(request) {
  // Ora leggiamo i dati dal "corpo" del messaggio, non dall'URL
  const body = await request.json();
  
  const { 
    titolo = 'Titolo', 
    desc = '', 
    prezzo = '', 
    mq = '', 
    localita = '', 
    classe = '', 
    immagine 
  } = body;

  const imgUrl = immagine || 'https://images.unsplash.com/photo-1582407947304-fd86f028f716';

  return new ImageResponse(
    (
      <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'white', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', height: '55%', width: '100%', position: 'relative' }}>
          <img src={imgUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {prezzo && (
            <div style={{ position: 'absolute', bottom: 30, left: 0, backgroundColor: '#d97706', color: 'white', padding: '15px 30px', fontSize: 38, fontWeight: 'bold' }}>
              {prezzo}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', padding: '40px', flex: 1 }}>
          {localita && <span style={{ color: '#d97706', fontSize: 22, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 5 }}>{localita}</span>}
          {titolo && <h1 style={{ fontSize: 44, margin: 0, color: '#1f2937', lineHeight: 1.1, fontWeight: 'bold' }}>{titolo}</h1>}
          
          {desc && (
            <p style={{ fontSize: 24, color: '#4b5563', marginTop: '10px', lineHeight: '1.4', maxHeight: '70px', overflow: 'hidden' }}>
              {desc}
            </p>
          )}
          
          <div style={{ display: 'flex', marginTop: 'auto', gap: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            {mq && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 16, color: '#6b7280' }}>Superficie</span>
                <span style={{ fontSize: 24, fontWeight: 'bold' }}>{mq} mq</span>
              </div>
            )}
            {classe && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 16, color: '#6b7280' }}>Classe Energ.</span>
                <span style={{ fontSize: 24, fontWeight: 'bold', color: '#059669' }}>{classe}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    { width: 800, height: 1100 }
  );
}