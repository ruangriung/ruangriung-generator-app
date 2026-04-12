# Pollinations API Documentation

## Overview
API proxy untuk Pollinations AI yang menggunakan endpoint `/v1/chat/completions` dengan parameter standar OpenAI-compatible.

## Base URL
```
POST /api/pollinations/text
```

## Authentication
Gunakan environment variables:
- `POLLINATIONS_API_KEY` - API key untuk Pollinations
- `NEXT_PUBLIC_POLLINATIONS_TOKEN` - Alternative token

## Endpoints

### POST /api/pollinations/text
Mengirim pesan ke model AI dan mendapatkan response.

#### Request Body
```json
{
  "model": "openai",
  "messages": [
    {
      "role": "user",
      "content": "Jelaskan tentang AI"
    }
  ],
  "temperature": 0.7,
  "top_p": 0.9,
  "top_k": 40,
  "max_tokens": 2048,
  "frequency_penalty": 0,
  "presence_penalty": 0,
  "seed": 42,
  "stream": false,
  "response_format": { "type": "text" }
}
```

#### Parameter Details

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `model` | string | `"openai"` | - | Model yang digunakan (openai, mistral, grok, deepseek, dll) |
| `messages` | array | - | - | Array pesan dengan role dan content |
| `temperature` | float | `0.7` | 0-2 | Kontrol randomness/kreativitas output |
| `top_p` | float | `0.9` | 0-1 | Nucleus sampling parameter |
| `top_k` | integer | `40` | ≥1 | Top-K sampling parameter |
| `max_tokens` | integer | - | ≥1 | Maksimal token dalam response |
| `frequency_penalty` | float | `0` | -2 to 2 | Kurangi repetisi token yang sering muncul |
| `presence_penalty` | float | `0` | -2 to 2 | Dorong model menggunakan token baru |
| `seed` | integer | - | - | Random seed untuk reproducibility |
| `stream` | boolean | `false` | - | Enable streaming response |
| `response_format` | object | - | - | Format output (e.g., JSON) |

#### Response
Plain text response dari model (default behavior) atau JSON jika `return_full_response: true`

```
"Ini adalah respons dari AI model"
```

#### Response Format Lengkap (dengan `return_full_response: true`)
```json
{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "openai",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Respons dari AI"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 50,
    "total_tokens": 60
  }
}
```

### GET /api/pollinations/models/text
Mendapatkan daftar model text yang tersedia.

#### Response
```json
[
  {
    "id": "openai",
    "object": "model",
    "created": 1234567890,
    "owned_by": "pollinations"
  },
  {
    "id": "mistral",
    "object": "model",
    "created": 1234567890,
    "owned_by": "pollinations"
  }
]
```

## Usage Examples

### Basic Text Generation
```typescript
const response = await fetch('/api/pollinations/text', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'openai',
    messages: [
      {
        role: 'user',
        content: 'Hello, how are you?'
      }
    ],
    temperature: 0.7,
    max_tokens: 1024
  })
});

const text = await response.text();
console.log(text);
```

### Image Analysis
```typescript
const response = await fetch('/api/pollinations/text', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'openai',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: 'https://example.com/image.jpg' }
          },
          {
            type: 'text',
            text: 'What is in this image?'
          }
        ]
      }
    ],
    max_tokens: 500,
    temperature: 0.7
  })
});

const description = await response.text();
console.log(description);
```

### Chat Conversation
```typescript
const messages = [
  { role: 'user', content: 'What is JavaScript?' },
  { role: 'assistant', content: 'JavaScript is a programming language...' },
  { role: 'user', content: 'Can it be used for backend?' }
];

const response = await fetch('/api/pollinations/text', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'openai',
    messages,
    temperature: 0.5,
    max_tokens: 2048,
    top_p: 0.9
  })
});

const reply = await response.text();
console.log(reply);
```

### Get Full Response Object
```typescript
const response = await fetch('/api/pollinations/text', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'openai',
    messages: [
      { role: 'user', content: 'Hello' }
    ],
    return_full_response: true
  })
});

const data = await response.json();
console.log(data); // Full response with tokens usage, etc
```

## Error Handling

### Error Response Format
```json
{
  "error": {
    "message": "Error description",
    "type": "invalid_request_error",
    "param": "parameter_name",
    "code": "missing_argument"
  }
}
```

### Common Errors

| Status | Error | Solution |
|--------|-------|----------|
| 400 | missing_argument | Pastikan `messages` atau `prompt` ada |
| 401 | authentication_error | Periksa API key di environment variables |
| 429 | rate_limit_error | Tunggu sebelum request berikutnya |
| 500 | internal_error | Coba lagi nanti atau hubungi support |

## Best Practices

1. **Temperature Tuning**
   - `0.0-0.3`: Deterministic, faktual (untuk QA, translation)
   - `0.7`: Balanced (default)
   - `1.0-2.0`: Creative, diverse (untuk brainstorming)

2. **Token Management**
   - Hitung prompt tokens sebelumnya jika perlu kontrol strict
   - Set `max_tokens` yang reasonable

3. **Sampling Parameters**
   - Jangan gunakan `top_k` dan `top_p` bersamaan
   - Start dengan default, adjust sesuai kebutuhan

4. **Rate Limiting**
   - Implement exponential backoff untuk retries
   - Cache responses jika memungkinkan

5. **Error Handling**
   - Always check response.ok sebelum parse
   - Implement fallback untuk critical operations

## Rate Limits
- Check Pollinations API documentation untuk rate limits terkini

---

## Image Generation API

### GET /api/pollinations/image
Generate gambar menggunakan Pollinations image API dengan parameter terbaru.

#### Request Parameters (Query String)
```
GET /api/pollinations/image?prompt=...&model=flux&width=1024&height=1024&...
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `prompt` | string | **required** | Deskripsi gambar yang ingin dibuat |
| `model` | string | `"flux"` | Model yang digunakan (flux, nanobanana, seedream, kontext, dll) |
| `width` | integer | `1024` | Lebar gambar dalam pixel (min: 256, max: 2048) |
| `height` | integer | `1024` | Tinggi gambar dalam pixel (min: 256, max: 2048) |
| `seed` | string/integer | `"0"` | Random seed untuk reproducibility |
| `quality` | string | `"medium"` | Kualitas gambar (medium, high, ultra) |
| `enhance` | string | `"false"` | Enhance quality dengan upscaling (true/false) |
| `negative_prompt` | string | - | Deskripsi apa yang ingin dihindari dalam gambar |
| `safe` | string | `"true"` | Filter konten tidak aman (true/false) |
| `transparent` | string | `"false"` | Buat background transparent (true/false) |
| `nologo` | string | `"false"` | Hapus watermark logo Pollinations (true/false) |
| `aspectRatio` | string | - | Aspect ratio (e.g., "16:9", "3:2", auto-calculated dari width/height) |
| `duration` | integer | - | Duration untuk video (seconds, optional) |
| `audio` | string | `"false"` | Include audio untuk video (true/false) |
| `image` | string | - | Base64 atau URL gambar untuk image-to-image generation |

#### Response
- **Content-Type**: `image/jpeg` atau format sesuai API
- **Cache-Control**: `public, max-age=31536000, immutable`
- **Body**: Binary image data

#### Usage Examples

**Basic Image Generation**
```typescript
const params = new URLSearchParams({
  prompt: 'A serene Japanese garden with cherry blossoms',
  model: 'flux',
  width: '1024',
  height: '1024',
  seed: '42',
  quality: 'medium',
  enhance: 'true',
  nologo: 'true',
  negative_prompt: 'worst quality, blurry, watermark'
});

const response = await fetch(`/api/pollinations/image?${params.toString()}`);
if (!response.ok) throw new Error('Failed to generate image');

const blob = await response.blob();
const imageUrl = URL.createObjectURL(blob);
```

**High Quality Image**
```typescript
const params = new URLSearchParams({
  prompt: 'Cyberpunk city at night with neon signs',
  model: 'flux',
  width: '1792',
  height: '1024',
  quality: 'ultra',
  enhance: 'true',
  safe: 'true',
  negative_prompt: 'distorted, blurry, low quality'
});

const response = await fetch(`/api/pollinations/image?${params.toString()}`);
const blob = await response.blob();
```

**Image-to-Image Generation**
```typescript
const params = new URLSearchParams({
  prompt: 'Make it more vibrant and colorful',
  image: 'base64_encoded_image_or_url',
  model: 'nanobanana',
  width: '1024',
  height: '1024',
  quality: 'high'
});

const response = await fetch(`/api/pollinations/image?${params.toString()}`);
const blob = await response.blob();
```

**Transparent Background**
```typescript
const params = new URLSearchParams({
  prompt: 'A red apple isolated',
  model: 'flux',
  width: '512',
  height: '512',
  transparent: 'true',
  quality: 'high'
});

const response = await fetch(`/api/pollinations/image?${params.toString()}`);
const blob = await response.blob();
```

### Model Selection Guide

| Model | Use Case | Speed | Quality | Best For |
|-------|----------|-------|---------|----------|
| **flux** | General purpose | Fast | High | Most use cases, detailed scenes |
| **nanobanana** | Fast generation | Very Fast | Medium | Quick previews, iterations |
| **seedream** | Creative | Medium | High | Artistic, stylized images |
| **kontext** | Image-to-image | Medium | High | Variations, refinements |

### Quality Presets

- **medium** (default): Balanced quality & speed
- **high**: Better quality, slightly slower
- **ultra**: Highest quality, slowest generation

### Negative Prompts Examples

```
// Untuk menghindari kualitas rendah
"worst quality, blurry, distorted, low quality"

// Untuk fotografi realistis
"cartoon, drawing, illustration, artistic"

// Untuk menghindari artefak
"duplicate, text, watermark, signature, glitch"

// Kombinasi
"worst quality, blurry, watermark, duplicate, text, low resolution"
```

### Best Practices for Image Generation

1. **Seed Management**
   - Gunakan seed yang sama untuk reproducibility
   - Variasi seed untuk explore berbagai output

2. **Aspect Ratio**
   - Landscape: 16:9 (1792x1024)
   - Portrait: 9:16 (1024x1792)
   - Square: 1:1 (1024x1024)

3. **Prompting Tips**
   - Lebih detail = hasil lebih akurat
   - Sebutkan gaya (photorealistic, oil painting, etc)
   - Spesifikkan lighting dan mood
   - Gunakan negative prompts untuk hasil lebih baik

4. **Performance**
   - Cache hasil gambar di client
   - Gunakan nologo=true untuk hasil cleaner
   - Compress gambar untuk storage/transmission

5. **Error Handling**
```typescript
try {
  const response = await fetch(`/api/pollinations/image?${params}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Image generation failed');
  }
  // Process image
} catch (error) {
  console.error('Image generation error:', error);
  // Fallback atau retry logic
}
```

---

## Support
Untuk issues atau pertanyaan, cek:
- https://pollinations.ai/docs
- Repository issues
