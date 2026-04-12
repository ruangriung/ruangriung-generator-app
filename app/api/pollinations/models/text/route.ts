
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const POLLINATIONS_API_KEY = process.env.POLLINATIONS_API_KEY || process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN;

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        
        if (POLLINATIONS_API_KEY) {
            headers['Authorization'] = `Bearer ${POLLINATIONS_API_KEY}`;
        }

        // Try new v1 endpoint first
        let response = await fetch('https://gen.pollinations.ai/v1/models', {
            method: 'GET',
            headers: headers,
        });

        // Fallback to old endpoint if new one doesn't work
        if (!response.ok) {
            response = await fetch('https://gen.pollinations.ai/text/models', {
                headers: headers,
            });
        }

        if (!response.ok) {
            throw new Error(`Failed to fetch models: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Normalize response to array of model objects
        let models = Array.isArray(data) ? data : data.data || data.models || [];
        
        // Ensure consistent format
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
        
        // Return fallback models on error
        const fallbackModels = [
            { id: 'openai', object: 'model', created: 0, owned_by: 'pollinations' },
            { id: 'mistral', object: 'model', created: 0, owned_by: 'pollinations' },
            { id: 'grok', object: 'model', created: 0, owned_by: 'pollinations' },
            { id: 'deepseek', object: 'model', created: 0, owned_by: 'pollinations' },
        ];
        
        return NextResponse.json(fallbackModels, { status: 200 });
    }
}
