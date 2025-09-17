import { ImageResponse } from 'next/og';
import type { CSSProperties } from 'react';

export const runtime = 'edge';

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
  backgroundImage:
    'radial-gradient(circle at 20% 20%, rgba(180, 255, 120, 0.18), transparent 55%), radial-gradient(circle at 80% 15%, rgba(82, 246, 170, 0.16), transparent 50%), radial-gradient(circle at 10% 90%, rgba(56, 189, 248, 0.12), transparent 45%)',
};

const titleStyle: CSSProperties = {
  textTransform: 'uppercase',
  letterSpacing: '0.4em',
  fontSize: 32,
  fontWeight: 600,
  marginBottom: 24,
  color: '#cbd5f5',
};

const igniteStyle: CSSProperties = {
  fontSize: 184,
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '-0.04em',
  color: '#9ef01a',
  textShadow: '0 20px 48px rgba(148, 255, 94, 0.35)',
};

const friendshipStyle: CSSProperties = {
  textTransform: 'uppercase',
  fontSize: 72,
  letterSpacing: '0.6em',
  fontWeight: 600,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 24,
};

const badgeStyle: CSSProperties = {
  display: 'inline-flex',
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
  fontSize: 32,
  fontWeight: 500,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: '#bfdbfe',
};

const stagesStyle: CSSProperties = {
  display: 'flex',
  gap: 24,
  flexWrap: 'wrap',
  fontSize: 20,
  letterSpacing: '0.25em',
  textTransform: 'uppercase',
  color: '#9ca3af',
};

const ribbonStyle: CSSProperties = {
  position: 'absolute',
  inset: '0 0 auto 0',
  height: 220,
  background:
    'linear-gradient(92deg, rgba(15, 118, 110, 0.65) 0%, rgba(21, 128, 61, 0.0) 75%), linear-gradient(245deg, rgba(59, 130, 246, 0.18) 0%, rgba(22, 163, 74, 0.08) 60%)',
};

const containerStyle: CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  borderRadius: 48,
};

const cornerAccent: CSSProperties = {
  position: 'absolute',
  width: 280,
  height: 280,
  borderRadius: '50%',
  filter: 'blur(60px)',
  opacity: 0.45,
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
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: 16,
  marginTop: 32,
};

const participantCard: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: '16px 20px',
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
      <div style={containerStyle}>
        <div style={ribbonStyle} />
        {cornerAccents.map((accent, index) => (
          <div key={index} style={accent.style} />
        ))}
        <div style={backgroundStyle}>
          <div>
            <div style={titleStyle}>Battle ignite friendship</div>
            <div style={igniteStyle}>ignite</div>
            <div style={friendshipStyle}>
              friendship
              <span
                style={{
                  display: 'inline-block',
                  width: 120,
                  height: 6,
                  backgroundColor: '#bef264',
                }}
              />
            </div>
            <div style={participantsContainer}>
              {participantNames.map((name) => (
                <div key={name} style={participantCard}>
                  <span style={{ fontSize: 18, color: '#a5b4fc', letterSpacing: '0.45em' }}>
                    Lolos 8 Besar
                  </span>
                  <span style={{ fontWeight: 600 }}>{name}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={badgeStyle}>RuangRiung vs Timun-AI</div>
            <div style={scheduleStyle}>17 – 21 September 2025</div>
            <div style={stagesStyle}>
              <span>16 Besar</span>
              <span>Perempat Final</span>
              <span>Semifinal</span>
              <span>Final</span>
              <span>3rd Place</span>
            </div>
            <div style={{ fontSize: 20, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#94a3b8' }}>
              RuangRiung AI Image • 19.00 WIB
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
