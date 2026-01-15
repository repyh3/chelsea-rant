import { NextResponse } from 'next/server';
import { getChelseaResult } from '@/lib/fpl';
import { getRandomRant } from '@/lib/engine';
import { getTeamColor } from '@/lib/colors';

export const runtime = 'edge';

export async function GET() {
  try {
    const match = await getChelseaResult();
    const rant = getRandomRant(match.outcome);

    const themes: Record<string, { accent: string; label: string; scribble: string }> = {
      win: {
        accent: '#fbbf24',
        label: 'GET IN!',
        scribble: 'M10,240 Q50,200 100,230 T200,210 T300,240 T400,220 T500,240'
      },
      draw: {
        accent: '#9ca3af',
        label: 'WHATEVER.',
        scribble: 'M0,120 L600,125 M50,130 L550,110'
      },
      loss: {
        accent: '#ef4444',
        label: 'PAIN.',
        scribble: 'M10,10 L50,50 M550,10 L590,50 M10,180 L50,230 M550,180 L590,230'
      }
    };

    const theme = themes[match.outcome];
    const chelseaColor = '#034694';
    const opponentColor = getTeamColor(match.opponentName);
    const logoUrl = `https://resources.premierleague.com/premierleague/badges/t${match.opponentCode}.png`;

    let logoBase64 = '';
    try {
      const logoRes = await fetch(logoUrl);
      const logoBuffer = await logoRes.arrayBuffer();
      const logoType = logoRes.headers.get('content-type') || 'image/png';
      logoBase64 = `data:${logoType};base64,${Buffer.from(logoBuffer).toString('base64')}`;
    } catch (e) {
      console.error('Logo Fetch Error:', e);
    }

    const svg = `
<svg width="600" height="250" viewBox="0 0 600 250" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.1"/>
      </feComponentTransfer>
      <feBlend mode="overlay" in2="SourceGraphic"/>
    </filter>
  </defs>

  <rect width="600" height="250" fill="${opponentColor}"/>
  <path d="M0,0 H600 L0,250 Z" fill="${chelseaColor}"/>
  
  <path d="M-50,80 Q150,-30 350,120 T650,40" stroke="white" stroke-width="60" stroke-opacity="0.1" fill="none" />
  
  <line x1="0" y1="250" x2="600" y2="0" stroke="white" stroke-width="8" stroke-opacity="0.2" />

  <path d="M10,10 L590,5 L585,80 L15,85 Z" fill="black" fill-opacity="0.3" stroke="white" stroke-opacity="0.1" stroke-width="2" />
  
  <text x="35" y="40" fill="${theme.accent}" font-family="Impact, sans-serif" font-size="12" font-weight="900" letter-spacing="4" transform="rotate(-1, 35, 40)">${theme.label}</text>
  <text x="30" y="72" fill="white" font-family="Impact, sans-serif" font-size="36" font-weight="900" transform="rotate(-1.5, 30, 72)">vs ${match.opponentName.toUpperCase()}</text>

  <g transform="rotate(5, 520, 45)">
    <image href="${logoBase64}" x="480" y="10" width="70" height="70" opacity="0.6" />
  </g>

  <g transform="translate(300, 125)">
    <text text-anchor="middle" dominant-baseline="middle" fill="white" font-family="Impact, sans-serif" font-size="120" font-weight="900" style="text-shadow: 8px 8px 0px black;">${match.chelseaGoals}-${match.opponentGoals}</text>
  </g>
  
  <foreignObject x="30" y="180" width="540" height="70">
    <div xmlns="http://www.w3.org/1999/xhtml" style="color: white; font-family: 'Arial Black', sans-serif; font-size: 20px; font-weight: 900; line-height: 1; text-transform: uppercase; text-align: center; text-shadow: 2px 2px 0px black;">
      "${rant}"
    </div>
  </foreignObject>

  <path d="${theme.scribble}" stroke="white" stroke-width="3" stroke-linecap="round" stroke-opacity="0.4" />

  <rect width="600" height="250" filter="url(#noise)" opacity="0.4" pointer-events="none" />
</svg>
`.trim();

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
      },
    });
  } catch (error) {
    console.error('SVG V2 Error:', error);
    return new NextResponse(
      `<svg width="600" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#111"/>
        <text x="50%" y="50%" text-anchor="middle" fill="white" font-family="sans-serif">FPL API Error or No Matches</text>
      </svg>`,
      { status: 200, headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
}
