# Pollinations API Update Summary

## Overview
Semua API calls untuk text dan image generation telah diperbarui menggunakan parameter endpoint terbaru dari Pollinations API dengan format standar OpenAI-compatible.

## Files yang Telah Diperbarui

### Text API (Chat Completions)
- ✅ `/app/api/pollinations/text/route.ts` - Updated ke `/v1/chat/completions` endpoint
- ✅ `/app/api/pollinations/models/text/route.ts` - Updated untuk support v1 endpoint

### Image API
- ✅ `/app/api/pollinations/image/route.ts` - Updated menggunakan `undici` library dengan parameter terbaru

### Components yang Menggunakan Text API
- ✅ `/components/ControlPanel.tsx` - Updated untuk menggunakan `messages` format dan parameter standar
- ✅ `/components/StorytellerClient.tsx` - Updated semua image prompts, descriptions, titles generation
- ✅ `/components/PromptAssistant.tsx` - Updated ke format `messages` dengan parameter terbaru
- ✅ `/components/chatbot/useChatManager.ts` - Updated image analysis dan text chat dengan parameter terbaru

### Components yang Menggunakan Image API
- ✅ `/app/id-card-generator/IdCardGeneratorClient.tsx` - Updated background generation dengan internal API proxy

### Documentation
- ✅ `/API_DOCUMENTATION.md` - Updated dengan parameter terbaru untuk text dan image endpoints

## Key Changes

### Text API (Chat Completions)
```typescript
// OLD: fetch('https://text.pollinations.ai/openai?token=...')
// NEW: fetch('/api/pollinations/text')

// OLD: { prompt: "...", temperature: 0.5, json: false }
// NEW: { 
//   messages: [{ role: 'user', content: '...' }],
//   temperature: 0.5,
//   top_p: 0.9,
//   max_tokens: 1024,
//   frequency_penalty: 0,
//   presence_penalty: 0
// }
```

### Image API (Undici)
```typescript
// OLD: fetch('https://image.pollinations.ai/prompt/...?...')
// NEW: fetch('/api/pollinations/image?prompt=...&model=flux&...')

// Using undici request() instead of fetch():
// const { statusCode, body, headers } = await request(url, { headers })
```

## Parameter Support

### Text API Parameters
- `model` - Model selection (openai, mistral, grok, deepseek, etc)
- `messages` - Array of {role, content} messages
- `temperature` - 0-2 (creativity control)
- `top_p` - 0-1 (nucleus sampling)
- `top_k` - ≥1 (top-K sampling)
- `max_tokens` - Maximum response length
- `frequency_penalty` - -2 to 2 (reduce repetition)
- `presence_penalty` - -2 to 2 (encourage novelty)
- `seed` - For reproducibility
- `stream` - Enable streaming
- `response_format` - JSON or text format
- `tools` - For tool calling
- `tool_choice` - Tool selection strategy

### Image API Parameters
- `prompt` - **Required**, image description
- `model` - flux, nanobanana, seedream, kontext, etc
- `width` - 256-2048px
- `height` - 256-2048px
- `seed` - For reproducibility
- `quality` - medium, high, ultra
- `enhance` - true/false (upscaling)
- `negative_prompt` - What to avoid
- `safe` - Content filtering
- `transparent` - Transparent background
- `nologo` - Remove watermark
- `aspectRatio` - Auto-calculated or manual
- `duration` - For video generation
- `audio` - Include audio in video
- `image` - For image-to-image generation

## Error Handling

### Text API Errors
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

### Image API Errors
```json
{
  "message": "Pollinations API Error: 400",
  "error": "Error details"
}
```

## Best Practices Implemented

1. **Parameter Validation**
   - Temperature clamped to 0-2 range
   - Token counts validated
   - Aspect ratios auto-calculated

2. **Error Handling**
   - Proper HTTP status codes
   - Descriptive error messages
   - Fallback mechanisms

3. **Performance**
   - Image caching with immutable headers
   - Blob conversion for client-side handling
   - Efficient request/response handling

4. **Security**
   - API key from environment variables
   - Authorization headers for all requests
   - Parameter sanitization

## Testing Recommendations

### Text API
```typescript
// Test basic message
fetch('/api/pollinations/text', {
  method: 'POST',
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'Hello' }],
    model: 'openai'
  })
})

// Test with all parameters
fetch('/api/pollinations/text', {
  method: 'POST',
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'Creative prompt' }],
    model: 'openai',
    temperature: 0.9,
    top_p: 0.95,
    max_tokens: 500,
    seed: 42
  })
})
```

### Image API
```typescript
// Basic image generation
fetch('/api/pollinations/image?prompt=sunset&model=flux&width=1024&height=1024')

// With quality and enhancement
fetch('/api/pollinations/image?prompt=sunset&model=flux&width=1024&height=1024&quality=ultra&enhance=true&nologo=true')

// With negative prompt
fetch('/api/pollinations/image?prompt=sunset&negative_prompt=blurry,watermark&quality=high')
```

## Migration Guide for Other Components

Jika ada component lain yang masih menggunakan endpoint lama:

### From Old To New Format

**Text Generation:**
```typescript
// OLD
fetch('https://text.pollinations.ai/openai?token=...', {
  method: 'POST',
  body: JSON.stringify({
    model: 'openai',
    prompt: 'Your prompt here',
    temperature: 0.7
  })
})

// NEW
fetch('/api/pollinations/text', {
  method: 'POST',
  body: JSON.stringify({
    model: 'openai',
    messages: [{ role: 'user', content: 'Your prompt here' }],
    temperature: 0.7,
    top_p: 0.9,
    max_tokens: 1024
  })
})
```

**Image Generation:**
```typescript
// OLD
fetch('https://image.pollinations.ai/prompt/sunset?model=flux&width=1024&height=1024')

// NEW
const params = new URLSearchParams({
  prompt: 'sunset',
  model: 'flux',
  width: '1024',
  height: '1024',
  quality: 'medium',
  enhance: 'true',
  nologo: 'true'
});
fetch(`/api/pollinations/image?${params}`)
```

## Environment Variables Required

```
POLLINATIONS_API_KEY=your_api_key_here
# OR
NEXT_PUBLIC_POLLINATIONS_TOKEN=your_token_here
```

## Notes

- Image API menggunakan `undici` library untuk performa optimal di server-side
- Semua text API calls sekarang konsisten menggunakan `messages` format
- Parameter bersifat backward-compatible dengan sensible defaults
- Cache headers untuk image responses sudah optimal untuk production

## Support & Documentation

- Pollinations Docs: https://pollinations.ai/docs
- API_DOCUMENTATION.md: Lengkap dengan examples
- Check console logs untuk debugging (format: `[v0] ...`)
