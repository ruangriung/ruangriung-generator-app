import { ImageResponse } from 'next/og';
import type { CSSProperties } from 'react';


export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

const backgroundStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '64px 72px',
  color: '#f8fafc',
  backgroundColor: '#050505',
  backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(180, 255, 120, 0.15), transparent 80%)',
};

const titleStyle: CSSProperties = {
  display: 'flex',
  textTransform: 'uppercase',
  letterSpacing: '0.4em',
  fontSize: 32,
  fontWeight: 600,
  marginBottom: 24,
  color: '#cbd5f5',
};

const igniteStyle: CSSProperties = {
  display: 'flex',
  fontSize: 184,
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '-0.04em',
  color: '#9ef01a',
};

const friendshipStyle: CSSProperties = {
  textTransform: 'uppercase',
  fontSize: 72,
  letterSpacing: '0.6em',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: 24,
};

const badgeStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '18px 28px',
  borderRadius: 999,
  backgroundColor: 'rgba(15, 23, 42, 0.65)',
  border: '1px solid rgba(165, 243, 252, 0.2)',
  fontSize: 24,
  letterSpacing: '0.4em',
  textTransform: 'uppercase',
};

const scheduleStyle: CSSProperties = {
  display: 'flex',
  fontSize: 32,
  fontWeight: 500,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: '#bfdbfe',
};

const stagesStyle: CSSProperties = {
  display: 'flex',
  gap: 24,
  fontSize: 20,
  letterSpacing: '0.25em',
  textTransform: 'uppercase',
  color: '#9ca3af',
};

const ribbonStyle: CSSProperties = {
  display: 'flex',
  position: 'absolute',
  inset: '0 0 auto 0',
  height: 220,
  background: 'linear-gradient(92deg, rgba(15, 118, 110, 0.4) 0%, transparent 100%)',
};

const containerStyle: CSSProperties = {
  display: 'flex',
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  borderRadius: 48,
};

const cornerAccent: CSSProperties = {
  display: 'flex',
  position: 'absolute',
  width: 280,
  height: 280,
  borderRadius: '50%',
  opacity: 0.25,
};

const cornerAccents = [
  {
    style: {
      ...cornerAccent,
      backgroundColor: '#bef264',
      top: -80,
      right: -60,
    } as CSSProperties,
  },
  {
    style: {
      ...cornerAccent,
      backgroundColor: '#22d3ee',
      bottom: -60,
      left: -60,
    } as CSSProperties,
  },
];

const participantNames = [
  'Ayu Dian',
  'Saka Mbarep',
  'Winda A.',
  'Aluh Gemoy',
  'Elena M.',
  'Ismail A.R',
  'Rudi H.',
  'Code Z',
];

const participantsContainer: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  marginTop: 32,
};

const participantCard: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: '16px 20px',
  width: '100%',
  marginBottom: 12,
  borderRadius: 24,
  backgroundColor: 'rgba(15, 23, 42, 0.55)',
  border: '1px solid rgba(74, 222, 128, 0.18)',
  fontSize: 24,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
};

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#050505',
          color: '#9ef01a',
          fontSize: 80,
          fontWeight: 800,
          textTransform: 'uppercase',
        }}
      >
        <div style={{ marginBottom: 20 }}>Battle Ignite</div>
        <div style={{ color: '#ffffff', fontSize: 40 }}>Friendship Edition</div>
      </div>
    ),
    {
      ...size,
    },
  );
}
