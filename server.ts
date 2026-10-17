import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// =========================================================================
// API ENDPOINTS FOR VIDEO AND AUDIO
// =========================================================================

const STOCK_VIDEOS = [
  {
    id: 'stock-subway-hud',
    title: 'Cybernetic Subway AR HUD & Commuter Motion Blur',
    sourceProvider: 'Pexels Cinema 8K Stream',
    resolution: '4K UHD',
    fps: 24,
    durationSec: 9.0,
    tags: ['#4K', '#Minimal', '#Glitch-SFX', '#Cyberpunk'],
    imageUrl: '/src/assets/images/broll_cybernetic_subway_hud_1792172077884.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    aspect: '16:9',
  },
  {
    id: 'stock-watchmaker-macro',
    title: 'Master Horologist Micro Chronograph Assembly',
    sourceProvider: 'Geneva Studio 6K RAW',
    resolution: '4K UHD',
    fps: 60,
    durationSec: 6.4,
    tags: ['#4K', '#Minimal', '#Macro', '#Precision'],
    imageUrl: '/src/assets/images/broll_cinematic_watchmaker_1792096174273.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    aspect: '16:9',
  },
  {
    id: 'stock-alpine-monolith',
    title: 'Swiss Brutalist Alpine Pavilion & Twilight Mist',
    sourceProvider: 'High-Altitude Aerial Unit',
    resolution: '4K UHD',
    fps: 24,
    durationSec: 7.2,
    tags: ['#Drone', '#4K', '#Minimal', '#Architecture'],
    imageUrl: '/src/assets/images/broll_architectural_monolith_1792096175650.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    aspect: '16:9',
  },
  {
    id: 'stock-quantum-datacenter',
    title: 'Obsidian Fiber Array & Quantum Server Corridor',
    sourceProvider: 'Zurich Tech Archive',
    resolution: '1080p',
    fps: 24,
    durationSec: 5.8,
    tags: ['#Minimal', '#4K', '#Glitch-SFX', '#Hardware'],
    imageUrl: '/src/assets/images/broll_quantum_datacenter_1792096176482.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    aspect: '16:9',
  },
  {
    id: 'stock-narrator-speaker',
    title: 'Studio A-Roll Dialogue Stage & Keylight Reflection',
    sourceProvider: 'Stage 04 Documentary Unit',
    resolution: '1080p',
    fps: 24,
    durationSec: 8.0,
    tags: ['#Minimal', '#Documentary', '#Interview'],
    imageUrl: '/src/assets/images/broll_editorial_studio_speaker_1792096178294.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    aspect: '16:9',
  },
];

const STOCK_AUDIO = [
  {
    id: 'sfx-whoosh-01',
    name: 'Anamorphic Cinema Whoosh',
    category: 'whoosh',
    durationSec: 0.8,
    tags: ['#Whoosh', '#4K', '#Fast-Transition'],
    frequencyHz: 3200,
  },
  {
    id: 'sfx-whoosh-02',
    name: 'Sub-Bass Atmospheric Air Pass',
    category: 'whoosh',
    durationSec: 1.2,
    tags: ['#Whoosh', '#Minimal', '#Drone'],
    frequencyHz: 1200,
  },
  {
    id: 'sfx-impact-01',
    name: 'Cinematic Sub-Bass Braam Impact',
    category: 'impact',
    durationSec: 1.5,
    tags: ['#Impact', '#4K', '#Heavy-Drop'],
    frequencyHz: 45,
  },
  {
    id: 'sfx-impact-02',
    name: 'Precision Titanium Latch Thud',
    category: 'impact',
    durationSec: 0.9,
    tags: ['#Impact', '#Minimal', '#Mechanical'],
    frequencyHz: 80,
  },
  {
    id: 'sfx-glitch-01',
    name: 'Neural Hologram Pulse Glitch',
    category: 'glitch',
    durationSec: 0.6,
    tags: ['#Glitch-SFX', '#Cyberpunk', '#Fast'],
    frequencyHz: 2200,
  },
  {
    id: 'sfx-glitch-02',
    name: 'Anamorphic Tape Head Static',
    category: 'glitch',
    durationSec: 0.45,
    tags: ['#Glitch-SFX', '#Minimal', '#Analog'],
    frequencyHz: 1800,
  },
  {
    id: 'sfx-riser-01',
    name: 'Tension String & Sub Riser',
    category: 'riser',
    durationSec: 2.2,
    tags: ['#Drone', '#4K', '#Build-Up'],
    frequencyHz: 4500,
  },
  {
    id: 'sfx-minimal-01',
    name: 'Swiss Studio Timecode Beep',
    category: 'minimal',
    durationSec: 0.35,
    tags: ['#Minimal', '#Clean', '#UI-Click'],
    frequencyHz: 840,
  },
];

// GET /api/media/videos: search & filter videos
app.get('/api/media/videos', (req: Request, res: Response) => {
  const query = (req.query.q as string || '').toLowerCase();
  const tag = (req.query.tag as string || '').toLowerCase();

  let results = STOCK_VIDEOS;
  if (query) {
    results = results.filter(
      (v) =>
        v.title.toLowerCase().includes(query) ||
        v.tags.some((t) => t.toLowerCase().includes(query))
    );
  }
  if (tag) {
    results = results.filter((v) =>
      v.tags.some((t) => t.toLowerCase() === tag || t.toLowerCase() === `#${tag}`)
    );
  }

  res.json({
    total: results.length,
    items: results,
  });
});

// GET /api/media/audio: search & filter SFX
app.get('/api/media/audio', (req: Request, res: Response) => {
  const query = (req.query.q as string || '').toLowerCase();
  const category = (req.query.category as string || '').toLowerCase();

  let results = STOCK_AUDIO;
  if (query) {
    results = results.filter(
      (a) =>
        a.name.toLowerCase().includes(query) ||
        a.tags.some((t) => t.toLowerCase().includes(query))
    );
  }
  if (category) {
    results = results.filter((a) => a.category.toLowerCase() === category);
  }

  res.json({
    total: results.length,
    items: results,
  });
});

// POST /api/export/fcpxml: generates standard FCPXML sequence
app.post('/api/export/fcpxml', (req: Request, res: Response) => {
  const payload = req.body;
  const projectName = payload?.projectName || 'B_ROLL_FLOW_SEQUENCE';
  const fps = payload?.fps || 24;

  const fcpxml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE fcpxml>
<fcpxml version="1.10">
  <resources>
    <format id="r1" name="FFVideoFormat3840x2160p${fps}" frameDuration="100/${fps * 100}s" width="3840" height="2160"/>
  </resources>
  <library>
    <event name="B-Roll Flow Master Cuts">
      <project name="${projectName}">
        <sequence format="r1" tcStart="0s" tcFormat="NDF">
          <spine>
            ${(payload?.tracks?.videoClips || [])
              .map(
                (clip: { title: string; durationSec: number; startSec: number }, i: number) =>
                  `<clip name="${clip.title}" offset="${clip.startSec}s" duration="${clip.durationSec}s" start="0s">
                    <video offset="0s" ref="r1" duration="${clip.durationSec}s"/>
                   </clip>`
              )
              .join('\n            ')}
          </spine>
        </sequence>
      </project>
    </event>
  </library>
</fcpxml>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Content-Disposition', `attachment; filename="${projectName}.fcpxml"`);
  res.send(fcpxml);
});

// POST /api/export/edl: generates standard CMX 3600 EDL
app.post('/api/export/edl', (req: Request, res: Response) => {
  const payload = req.body;
  const projectName = payload?.projectName || 'B_ROLL_FLOW_EDL';

  let edlText = `TITLE: ${projectName}\nFCM: NON-DROP FRAME\n\n`;
  (payload?.tracks?.videoClips || []).forEach(
    (clip: { title: string; durationSec: number; startSec: number }, i: number) => {
      const editNum = String(i + 1).padStart(3, '0');
      const startSec = Math.floor(clip.startSec);
      const endSec = Math.floor(clip.startSec + clip.durationSec);
      edlText += `${editNum}  AX       V     C        00:00:${String(startSec).padStart(2, '0')}:00 00:00:${String(endSec).padStart(2, '0')}:00 00:00:${String(startSec).padStart(2, '0')}:00 00:00:${String(endSec).padStart(2, '0')}:00\n`;
      edlText += `* FROM CLIP NAME: ${clip.title}\n\n`;
    }
  );

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', `attachment; filename="${projectName}.edl"`);
  res.send(edlText);
});

// POST /api/export/render: mock client/cloud render pipeline
app.post('/api/export/render', (req: Request, res: Response) => {
  const payload = req.body;
  const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  res.json({
    jobId,
    status: 'completed',
    format: payload?.resolution || '4K @ 30fps',
    estimatedFrames: Math.round((payload?.totalDurationSec || 30) * 30),
    downloadUrl: `https://brollflow.atelier-cinema.ch/exports/${jobId}.mp4`,
    renderedAt: new Date().toISOString(),
  });
});

// =========================================================================
// VITE DEV SERVER OR STATIC PRODUCTION SERVING
// =========================================================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[B-Roll Flow Engine] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
