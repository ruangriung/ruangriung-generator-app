
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const POLLINATIONS_API_KEY = process.env.POLLINATIONS_API_KEY || process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN;

        const headers: HeadersInit = {};
        if (POLLINATIONS_API_KEY) {
            headers['Authorization'] = `Bearer ${POLLINATIONS_API_KEY}`;
        }

        const response = await fetch('https://gen.pollinations.ai/text/models', {
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch models: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error fetching text models:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
