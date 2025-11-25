import { GEMINI_CONFIG } from '@/config/api';

// Attempts to generate a 3D model URL (glb/gltf) from an image URL via Gemini.
// If generation fails or no URL is returned, falls back to a generic model.
export async function generate3DModelFromImage(imageUrl: string): Promise<string | null> {
  try {
    if (!GEMINI_CONFIG.apiKey) {
      console.warn('Gemini API key missing');
      return '/models/camera-generic.glb';
    }

    // Fetch the image and convert to base64 inline data for Gemini
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const base64Data = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    const body = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text:
                'You are a 3D assistant. Analyze this product image and generate a simple GLB/GLTF model approximating its shape suitable for web preview. Respond ONLY with a direct downloadable URL ending in .glb or .gltf. If you cannot generate, respond with /models/camera-generic.glb.'
            },
            {
              inline_data: {
                mime_type: blob.type || 'image/jpeg',
                data: base64Data,
              },
            },
          ],
        },
      ],
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_CONFIG.model}:generateContent?key=${GEMINI_CONFIG.apiKey}`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      console.error('Gemini API error:', resp.status, await resp.text());
      return '/models/camera-generic.glb';
    }

    const data = await resp.json();
    const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (typeof text === 'string') {
      // Extract a URL ending with .glb or .gltf
      const match = text.match(/https?:[^\s]+\.(glb|gltf)/i);
      if (match && match[0]) {
        return match[0];
      }
      // If model suggested local fallback
      if (text.trim().endsWith('.glb') || text.trim().endsWith('.gltf')) {
        return text.trim();
      }
    }

    return '/models/camera-generic.glb';
  } catch (err) {
    console.error('Gemini generation failed:', err);
    return '/models/camera-generic.glb';
  }
}

// Generic text generation helper with optional image input
export async function generateTextContent(prompt: string, imageUrl?: string): Promise<string> {
  try {
    if (!GEMINI_CONFIG.apiKey) {
      throw new Error('Gemini API key missing');
    }

    let parts: any[] = [{ text: prompt }];

    if (imageUrl) {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const base64Data = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      parts.push({ inline_data: { mime_type: blob.type || 'image/jpeg', data: base64Data } });
    }

    const body = { contents: [{ role: 'user', parts }] };
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_CONFIG.model}:generateContent?key=${GEMINI_CONFIG.apiKey}`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!resp.ok) {
      throw new Error(await resp.text());
    }
    const data = await resp.json();
    const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || '';
  } catch (err) {
    console.error('Gemini text generation failed:', err);
    return '';
  }
}