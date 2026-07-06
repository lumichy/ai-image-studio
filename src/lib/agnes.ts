import { buildPrompt, getDimensions } from './constants';

const API_BASE_URL = process.env.AGNES_API_BASE_URL ?? 'https://apihub.agnes-ai.com/v1';
const API_KEY = process.env.AGNES_API_KEY;

export async function generateTextToImage(
  prompt: string,
  styleId: string,
  sizeId: string,
): Promise<string> {
  const fullPrompt = buildPrompt(prompt, styleId);
  const size = getDimensions(sizeId);

  const body: Record<string, unknown> = {
    model: 'agnes-image-2.1-flash',
    prompt: fullPrompt,
    extra_body: { response_format: 'url' },
  };
  if (size) body.size = size;

  const response = await fetch(`${API_BASE_URL}/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Agnes API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.data[0].url;
}

export async function generateImageToImage(
  prompt: string,
  referenceImage: string,
  styleId: string,
  sizeId: string,
): Promise<string> {
  const fullPrompt = buildPrompt(prompt, styleId);
  const size = sizeId === 'none'
    ? await detectImageDimensions(referenceImage)
    : getDimensions(sizeId);

  // Upload the base64 image to a temp host to get a public URL
  const imageUrl = await uploadImageToTempHost(referenceImage);

  // Agnes API: image-to-image uses /images/generations with extra_body.image array
  const body: Record<string, unknown> = {
    model: 'agnes-image-2.1-flash',
    prompt: fullPrompt,
    extra_body: {
      response_format: 'url',
      image: [imageUrl],
    },
  };
  if (size) body.size = size;

  const response = await fetch(`${API_BASE_URL}/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Agnes API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.data[0].url;
}

// ─── Infographic ───────────────────────────────────────────────────────────────

const ASPECT_DIMENSIONS: Record<string, string> = {
  landscape: '1024x576',
  portrait: '576x1024',
  square: '1024x1024',
};

const LAYOUT_LABELS: Record<string, string> = {
  'bento-grid': 'Bento Grid (multiple topics overview)',
  'linear-progression': 'Linear Progression (timeline/process)',
  'binary-comparison': 'Binary Comparison (A vs B)',
  'comparison-matrix': 'Comparison Matrix (multi-factor)',
  'hierarchical-layers': 'Hierarchical Layers (pyramid/priority)',
  'tree-branching': 'Tree Branching (categories/taxonomy)',
  'hub-spoke': 'Hub and Spoke (central concept + related)',
  'structural-breakdown': 'Structural Breakdown (exploded view)',
  'iceberg': 'Iceberg Model (surface vs hidden)',
  'bridge': 'Bridge (problem-solution)',
  'funnel': 'Funnel (conversion/filtering)',
  'isometric-map': 'Isometric Map (spatial relationships)',
  'dashboard': 'Dashboard (metrics/KPIs)',
  'periodic-table': 'Periodic Table (categorized collection)',
  'comic-strip': 'Comic Strip (narrative sequence)',
  'story-mountain': 'Story Mountain (plot/tension arc)',
  'jigsaw': 'Jigsaw (interconnected parts)',
  'venn-diagram': 'Venn Diagram (overlapping concepts)',
  'winding-roadmap': 'Winding Roadmap (journey/milestones)',
  'circular-flow': 'Circular Flow (cycles/recurring processes)',
  'dense-modules': 'Dense Modules (high-density data-rich guide)',
};

const STYLE_LABELS: Record<string, string> = {
  'craft-handmade': 'hand-drawn paper craft style with visible textures, cut-paper collage aesthetic',
  'claymation': '3D claymation style with visible fingerprints and stop-motion aesthetic',
  'kawaii': 'Japanese kawaii style with pastel colors and cute simplified shapes',
  'storybook-watercolor': 'soft watercolor painting style with whimsical storybook feel',
  'chalkboard': 'chalkboard style with white and colored chalk on dark matte blackboard',
  'cyberpunk-neon': 'cyberpunk neon style with glowing lights and futuristic dark atmosphere',
  'bold-graphic': 'bold comic book graphic style with halftone dots and thick outlines',
  'aged-academia': 'vintage academic style with sepia tones and aged scientific journal feel',
  'corporate-memphis': 'corporate Memphis style with flat vector shapes and vibrant colors',
  'technical-schematic': 'technical schematic blueprint style with grid lines and engineering precision',
  'origami': 'origami style with folded paper geometry and clean creased surfaces',
  'pixel-art': 'retro 8-bit pixel art style with limited color palette',
  'ui-wireframe': 'UI wireframe style with grayscale boxes and placeholder elements',
  'ikea-manual': 'IKEA manual style with minimal line art and simple pictograms',
  'knolling': 'knolling style with objects organized in neat flat-lay from above',
  'lego-brick': 'LEGO brick style with toy brick construction aesthetic',
  'pop-laboratory': 'pop laboratory style with blueprint grid, coordinate markers, and lab precision',
  'morandi-journal': 'hand-drawn doodle journal style with warm Morandi color tones',
  'retro-pop-grid': '1970s retro pop art style with Swiss grid layout and thick outlines',
  'hand-drawn-edu': 'hand-drawn educational style with macaron pastels and wobbly lines',
  'retro-popup-pop': 'retro popup collage style with vintage UI and thick outlines on flat pop colors',
};

export async function generateInfographic(
  prompt: string,
  layoutId: string,
  styleId: string,
  aspectId: string,
): Promise<string> {
  const layoutDesc = LAYOUT_LABELS[layoutId] ?? layoutId;
  const styleDesc = STYLE_LABELS[styleId] ?? styleId;
  const dimensions = ASPECT_DIMENSIONS[aspectId] ?? '1024x576';

  const fullPrompt = [
    `Create a professional infographic about: ${prompt}`,
    '',
    `Layout: ${layoutDesc}`,
    `Visual Style: ${styleDesc}`,
    '',
    'Requirements:',
    '- Professional infographic with clear visual hierarchy',
    '- All text must be clear and readable',
    '- Use ample whitespace for visual clarity',
    '- Highlight key concepts and keywords visually',
    '- Maintain consistent style throughout',
    '- All text labels in the same language as the prompt',
  ].join('\n');

  const body: Record<string, unknown> = {
    model: 'agnes-image-2.1-flash',
    prompt: fullPrompt,
    size: dimensions,
    extra_body: { response_format: 'url' },
  };

  const response = await fetch(`${API_BASE_URL}/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Agnes API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.data[0].url;
}

/**
 * Upload a base64 image to a temporary host and return the public URL.
 * Tries uguu.se first (Agnes can reliably fetch it), then tmpfiles.org as fallback.
 * URLs are temporary (~48h on uguu, ~1h on tmpfiles).
 */
async function uploadImageToTempHost(base64Data: string): Promise<string> {
  // Strip data URL prefix if present
  const base64 = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
  const buffer = Buffer.from(base64, 'base64');
  const blob = new Blob([buffer], { type: 'image/png' });

  // Try uguu.se first
  try {
    const formData = new FormData();
    formData.append('files[]', blob, 'reference.png');

    const response = await fetch('https://uguu.se/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      // uguu.se response: { files: [{ url: "https://..." }] }
      const url = data.files?.[0]?.url;
      if (url) return url;
    }
  } catch {
    // Fall through to tmpfiles.org
  }

  // Fallback: tmpfiles.org
  const formData2 = new FormData();
  const blob2 = new Blob([buffer], { type: 'image/png' });
  formData2.append('file', blob2, 'reference.png');

  const response2 = await fetch('https://tmpfiles.org/api/v1/upload', {
    method: 'POST',
    body: formData2,
  });

  if (!response2.ok) {
    throw new Error(`Failed to upload image to all temp hosts`);
  }

  const data2 = await response2.json();
  // tmpfiles.org response: { data: { url: "https://tmpfiles.org/xxx" } }
  // Convert viewer URL to direct download URL
  const viewerUrl: string = data2.data?.url ?? '';
  const directUrl = viewerUrl.replace('tmpfiles.org/', 'tmpfiles.org/dl/');

  if (!directUrl) {
    throw new Error('Failed to get URL from tmpfiles.org response');
  }

  return directUrl;
}

/**
 * Detect image dimensions from a base64 data URL.
 * Reads PNG/JPEG/GIF header bytes to extract width/height.
 * Returns dimensions as "WxH" string, or null if detection fails.
 */
async function detectImageDimensions(base64Data: string): Promise<string | null> {
  try {
    const base64 = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
    const buffer = Buffer.from(base64, 'base64');

    // PNG: bytes 16-19 = width, 20-23 = height (big-endian)
    if (buffer.length >= 24 && buffer[0] === 0x89 && buffer[1] === 0x50) {
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      if (width > 0 && height > 0) return `${width}x${height}`;
    }

    // JPEG: scan SOF0/SOF2 marker (0xFFC0/0xFFC2) to find width/height
    if (buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0xd8) {
      let offset = 2;
      while (offset < buffer.length - 9) {
        if (buffer[offset] !== 0xff) { offset++; continue; }
        const marker = buffer[offset + 1];
        // SOF0 (0xC0) or SOF2 (0xC2)
        if (marker === 0xc0 || marker === 0xc2) {
          const height = buffer.readUInt16BE(offset + 5);
          const width = buffer.readUInt16BE(offset + 7);
          if (width > 0 && height > 0) return `${width}x${height}`;
        }
        // Skip to next marker
        const segmentLength = buffer.readUInt16BE(offset + 2);
        offset += 2 + segmentLength;
      }
    }

    // GIF: bytes 6-7 = width, 8-9 = height (little-endian)
    if (buffer.length >= 10 && buffer[0] === 0x47 && buffer[1] === 0x49) {
      const width = buffer.readUInt16LE(6);
      const height = buffer.readUInt16LE(8);
      if (width > 0 && height > 0) return `${width}x${height}`;
    }

    // WebP: check RIFF header
    if (buffer.length >= 30 && buffer.slice(0, 4).toString('ascii') === 'RIFF') {
      const chunkType = buffer.slice(12, 16).toString('ascii');
      if (chunkType === 'VP8 ') {
        const width = buffer.readUInt16LE(26) & 0x3fff;
        const height = buffer.readUInt16LE(28) & 0x3fff;
        if (width > 0 && height > 0) return `${width}x${height}`;
      } else if (chunkType === 'VP8X') {
        const width = (buffer.readUInt32LE(24) & 0xffffff) + 1;
        const height = (buffer.readUInt32LE(27) & 0xffffff) + 1;
        if (width > 0 && height > 0) return `${width}x${height}`;
      } else if (chunkType === 'VP8L') {
        const b0 = buffer[21];
        const b1 = buffer[22];
        const b2 = buffer[23];
        const b3 = buffer[24];
        const width = 1 + ((b1 & 0x3f) << 8 | b0);
        const height = 1 + ((b3 & 0x0f) << 10 | b2 << 2 | (b1 & 0xc0) >> 6);
        if (width > 0 && height > 0) return `${width}x${height}`;
      }
    }
  } catch {
    // Detection failed, return null
  }

  return null;
}
