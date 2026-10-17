import { ExportPipelinePayload } from '../types';

/**
 * Generates an FCPXML (Final Cut Pro XML v1.9) document compatible with
 * Final Cut Pro, DaVinci Resolve, and Premiere Pro NLE suites.
 */
export function generateFCPXML(payload: ExportPipelinePayload): string {
  const { projectName, resolution, fps, totalDurationSec, tracks, subtitleStyle } = payload;
  const is4K = resolution.includes('4K');
  const width = is4K ? 3840 : 1920;
  const height = is4K ? 2160 : 1080;
  const frameDuration = fps === 60 ? '1001/60000s' : '100/3000s';
  const totalDurationStr = `${Math.round(totalDurationSec * fps)}/${fps}s`;

  // Build asset list
  const assetElements = tracks.videoClips
    .map((clip, idx) => {
      const assetDuration = `${Math.round(clip.durationSec * fps)}/${fps}s`;
      return `        <asset id="r${idx + 2}" name="${escapeXml(clip.title)}" src="${escapeXml(
        clip.imageUrl
      )}" start="0s" duration="${assetDuration}" hasVideo="1" format="r1" />`;
    })
    .join('\n');

  // Build timeline spine video clips
  const clipElements = tracks.videoClips
    .map((clip, idx) => {
      const startStr = `${Math.round(clip.startSec * fps)}/${fps}s`;
      const durStr = `${Math.round(clip.durationSec * fps)}/${fps}s`;
      return `                    <video ref="r${idx + 2}" offset="${startStr}" name="${escapeXml(
        clip.title
      )}" duration="${durStr}" start="0s">
                        <adjust-transform position="0 0" scale="1 1"/>
                    </video>`;
    })
    .join('\n');

  // Build caption markers/titles
  const titleElements = tracks.captions
    .map((cap) => {
      const offsetStr = `${Math.round(cap.startSec * fps)}/${fps}s`;
      const durStr = `${Math.round(cap.durationSec * fps)}/${fps}s`;
      return `                    <title offset="${offsetStr}" duration="${durStr}" name="${escapeXml(
        cap.text.slice(0, 30)
      )}" start="0s">
                        <text>
                            <text-style ref="ts1">${escapeXml(cap.text)}</text-style>
                        </text>
                    </title>`;
    })
    .join('\n');

  // Build audio SFX triggers
  const sfxElements = tracks.sfx
    .map((sfx) => {
      const offsetStr = `${Math.round(sfx.startSec * fps)}/${fps}s`;
      const durStr = `${Math.round(sfx.durationSec * fps)}/${fps}s`;
      return `                    <audio offset="${offsetStr}" duration="${durStr}" name="${escapeXml(
        sfx.name
      )}" lane="-1" role="effects" />`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE fcpxml>
<fcpxml version="1.9">
    <resources>
        <format id="r1" name="FFVideoFormat${height}p${fps}" frameDuration="${frameDuration}" width="${width}" height="${height}"/>
${assetElements}
        <effect id="r_lut" name="${escapeXml(payload.lutName)}" />
    </resources>
    <library>
        <event name="B-Roll Flow Exports">
            <project name="${escapeXml(projectName)}">
                <sequence format="r1" duration="${totalDurationStr}" tcStart="0s" tcFormat="NDF">
                    <spine>
${clipElements}
                    </spine>
                    <!-- Kinetic Caption Overlays -->
${titleElements}
                    <!-- SFX Audio Trigger Stems -->
${sfxElements}
                </sequence>
            </project>
        </event>
    </library>
    <!-- Subtitle Engine: ${escapeXml(subtitleStyle.preset)} (${escapeXml(subtitleStyle.fontFamily)}, ${escapeXml(subtitleStyle.animationMode)}) -->
</fcpxml>`;
}

/**
 * Generates standard CMX 3600 Edit Decision List (EDL) file
 * compatible with Adobe Premiere Pro, Avid Media Composer, and DaVinci Resolve.
 */
export function generateEDL(payload: ExportPipelinePayload): string {
  const { projectName, fps, tracks } = payload;
  const lines: string[] = [
    `TITLE: ${projectName.toUpperCase().replace(/[^A-Z0-9_]/g, '_')}`,
    'FCM: NON-DROP FRAME',
    '',
  ];

  let eventNumber = 1;

  tracks.videoClips.forEach((clip) => {
    const srcIn = formatTimecodeFrames(0, fps);
    const srcOut = formatTimecodeFrames(clip.durationSec, fps);
    const recIn = formatTimecodeFrames(clip.startSec, fps);
    const recOut = formatTimecodeFrames(clip.startSec + clip.durationSec, fps);

    const numStr = String(eventNumber).padStart(3, '0');
    // Format: 001  AX       V     C        00:00:00:00 00:00:04:15 00:00:00:00 00:00:04:15
    lines.push(`${numStr}  AX       V     C        ${srcIn} ${srcOut} ${recIn} ${recOut}`);
    lines.push(`* FROM CLIP NAME: ${clip.title.replace(/\s+/g, '_')}.mp4`);
    lines.push(`* RESOLUTION: ${clip.resolution} | LOCKED: ${clip.isLocked ? 'YES' : 'NO'}`);
    lines.push('');
    eventNumber++;
  });

  tracks.sfx.forEach((sfx) => {
    const srcIn = formatTimecodeFrames(0, fps);
    const srcOut = formatTimecodeFrames(sfx.durationSec, fps);
    const recIn = formatTimecodeFrames(sfx.startSec, fps);
    const recOut = formatTimecodeFrames(sfx.startSec + sfx.durationSec, fps);

    const numStr = String(eventNumber).padStart(3, '0');
    lines.push(`${numStr}  AX       A     C        ${srcIn} ${srcOut} ${recIn} ${recOut}`);
    lines.push(`* AUDIO TRIGGER: ${sfx.name} (${sfx.category.toUpperCase()})`);
    lines.push('');
    eventNumber++;
  });

  return lines.join('\n');
}

/**
 * Generates Remotion & Cloud FFmpeg frame schema JSON payload
 */
export function generateRemotionJson(payload: ExportPipelinePayload): string {
  const { projectName, resolution, fps, totalDurationSec, lutName, tracks, subtitleStyle } =
    payload;
  const is4K = resolution.includes('4K');
  const width = is4K ? 3840 : 1920;
  const height = is4K ? 2160 : 1080;
  const durationInFrames = Math.round(totalDurationSec * fps);

  const formattedPayload = {
    schemaVersion: '2.4.0',
    generator: 'B-Roll Flow Autonomous Engine',
    exportedAt: payload.exportedAt,
    composition: {
      id: 'BRollFlowMasterSequence',
      projectName,
      width,
      height,
      fps,
      durationInFrames,
      durationInSeconds: totalDurationSec,
      colorGrading: {
        lut: lutName,
        gamma: 'Rec.709',
      },
    },
    subtitleEngine: {
      preset: subtitleStyle.preset,
      fontFamily: subtitleStyle.fontFamily,
      fontSize: subtitleStyle.fontSize,
      highlightColor: subtitleStyle.highlightColor,
      baseTextColor: subtitleStyle.baseTextColor,
      animationMode: subtitleStyle.animationMode,
      strokeWidth: subtitleStyle.strokeWidth,
      shadowOffset: subtitleStyle.shadowOffset,
      isUppercase: subtitleStyle.isUppercase,
      boxOpacity: subtitleStyle.boxOpacity,
    },
    tracks: {
      video: tracks.videoClips.map((clip) => ({
        id: clip.id,
        clipId: clip.clipId,
        title: clip.title,
        src: clip.imageUrl,
        fromFrame: Math.round(clip.startSec * fps),
        durationInFrames: Math.round(clip.durationSec * fps),
        startSec: clip.startSec,
        durationSec: clip.durationSec,
        resolution: clip.resolution,
        transform: {
          scale: 1.0,
          pan: 'center',
          animation: 'ken-burns-subtle',
        },
      })),
      captions: tracks.captions.map((cap) => ({
        id: cap.id,
        text: cap.text,
        fromFrame: Math.round(cap.startSec * fps),
        durationInFrames: Math.round(cap.durationSec * fps),
        startSec: cap.startSec,
        durationSec: cap.durationSec,
        coordinates: {
          x: width / 2,
          y: height - 180,
          anchor: 'center',
        },
      })),
      audioSfx: tracks.sfx.map((sfx) => ({
        id: sfx.id,
        sfxId: sfx.sfxId,
        name: sfx.name,
        category: sfx.category,
        fromFrame: Math.round(sfx.startSec * fps),
        durationInFrames: Math.round(sfx.durationSec * fps),
        startSec: sfx.startSec,
        volume: 0.85,
      })),
    },
  };

  return JSON.stringify(formattedPayload, null, 2);
}

/**
 * Triggers a browser file download directly
 */
export function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Helpers
function formatTimecodeFrames(seconds: number, fps: number): string {
  const totalFrames = Math.round(seconds * fps);
  const hours = Math.floor(totalFrames / (fps * 3600));
  const minutes = Math.floor((totalFrames % (fps * 3600)) / (fps * 60));
  const secs = Math.floor((totalFrames % (fps * 60)) / fps);
  const frames = totalFrames % fps;

  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}:${pad(frames)}`;
}

function pad(num: number): string {
  return String(num).padStart(2, '0');
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '\'':
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}
