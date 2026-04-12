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

## Support
Untuk issues atau pertanyaan, cek:
- https://pollinations.ai/docs
- Repository issues
