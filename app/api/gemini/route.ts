// ruangriung/ruangriung-generator-app/ruangriung-generator-app-3a68b1c6536b7de1915cdc5d286c7ce19bf9481e/app/api/gemini/route.ts
import { NextResponse } from 'next/server';

interface Message {
  role: 'user' | 'assistant' | 'model';
  content: any;
}

function transformMessagesToGemini(messages: Message[]) {
  return messages.map(msg => {
    const role = msg.role === 'assistant' ? 'model' : 'user';
    // Hanya mendukung konten teks untuk chat
    const text = typeof msg.content === 'string' ? msg.content : (msg.content?.text || '');
    return { role, parts: [{ text }] };
  }).filter(msg => msg.parts[0].text.trim() !== '');
}

export async function POST(request: Request) {
  try {
    const { messages, apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json({ message: 'API key Gemini tidak ditemukan.' }, { status: 400 });
    }
    if (!messages || messages.length === 0) {
      return NextResponse.json({ message: 'Pesan tidak boleh kosong.' }, { status: 400 });
    }
    
    // Model yang bagus untuk chat
    const model = 'gemini-1.5-pro-latest';
    const geminiContents = transformMessagesToGemini(messages);

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: geminiContents,
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ message: `Error dari Gemini API: ${errorData.error.message}` }, { status: response.status });
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      const blockReason = data.promptFeedback?.blockReason || 'Tidak diketahui';
      return NextResponse.json({ text: `Maaf, respons diblokir karena alasan keamanan: ${blockReason}.` });
    }

    const text = data.candidates[0]?.content?.parts[0]?.text || "Maaf, saya tidak dapat memberikan respons saat ini.";
    
    return NextResponse.json({ text });

  } catch (error: any) {
    return NextResponse.json({ message: 'Terjadi kesalahan internal pada server.', error: error.message }, { status: 500 });
  }
}