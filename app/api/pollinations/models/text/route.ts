import { NextResponse } from 'next/server';
import { fetch } from 'undici';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const POLLINATIONS_API_KEY = process.env.POLLINATIONS_API_KEY || process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN;

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        
        if (POLLINATIONS_API_KEY) {
            headers['Authorization'] = `Bearer ${POLLINATIONS_API_KEY}`;
        }

        // Gunakan endpoint khusus text models untuk menghindari tercampurnya dengan model gambar
        let response = await fetch('https://gen.pollinations.ai/text/models', {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`Gagal mengambil daftar model: ${response.statusText}`);
        }

        const data = await response.json() as any;
        
        // Normalisasi response menjadi array of model objects
        let models = Array.isArray(data) ? data : data.data || data.models || [];
        
        // Pastikan format konsisten { id, object, ... }
        models = models.map((model: any) => {
            if (typeof model === 'string') {
                return {
                    id: model,
                    object: 'model',
                    created: Math.floor(Date.now() / 1000),
                    owned_by: 'pollinations',
                };
            }
            return model;
        });

        return NextResponse.json(models);
    } catch (error: any) {
        console.error('Error fetching text models:', error);
        
        // Kembalikan fallback model jika terjadi error
        const fallbackModels = [
            { id: 'openai', object: 'model', created: 0, owned_by: 'pollinations' },
            { id: 'mistral', object: 'model', created: 0, owned_by: 'pollinations' },
            { id: 'grok', object: 'model', created: 0, owned_by: 'pollinations' },
            { id: 'deepseek', object: 'model', created: 0, owned_by: 'pollinations' },
        ];
        
        return NextResponse.json(fallbackModels, { status: 200 });
    }
}
