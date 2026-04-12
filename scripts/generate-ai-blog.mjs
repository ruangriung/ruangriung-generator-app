import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARTICLES_DIR = path.join(__dirname, '../content/articles-md');

async function generateBlog() {
  const topics = [
    "Tutorial AI: Cara membuat prompt desain interior yang terlihat nyata",
    "Berita Teknologi: Perkembangan terbaru chip AI dan dampaknya ke gadget kita",
    "Inspirasi Kreatif: Bagaimana AI membantu seniman menemukan gaya unik mereka",
    "Berita AI Terbaru: Terobosan model bahasa besar di tahun 2026",
    "Tutorial AI: Maksimalkan workflow kreatif dengan bantuan Chatbot",
    "Inspirasi Kreatif: Menciptakan dunia fantasi dengan AI Storyteller"
  ];

  const selectedTopic = topics[Math.floor(Math.random() * topics.length)];
  const apiKey = process.env.POLLINATIONS_API_KEY;

  if (!apiKey) {
    console.error("Error: POLLINATIONS_API_KEY is missing!");
    process.exit(1);
  }

  const prompt = `
    Tulis sebuah artikel blog mendalam dalam Bahasa Indonesia untuk situs "RuangRiung".
    Topik spesifik: ${selectedTopic}
    
    Target pembaca: Kreator konten, peminat teknologi, dan pengguna umum di Indonesia.
    
    Format output HARUS JSON murni (tanpa markdown backticks) dengan struktur berikut:
    {
      "title": "Judul artikel yang menarik dan SEO friendly",
      "summary": "Ringkasan singkat artikel (max 200 karakter)",
      "category": "Kategori (Pilih salah satu: Tutorial, Berita, atau Inspirasi)",
      "tags": ["min 3 tag terkait"],
      "content": "Konten artikel lengkap dalam format Markdown. Gunakan heading (##), list, dan penekanan teks yang baik. Minimal 500 kata."
    }
    
    Ketentuan Konten:
    - Gaya bahasa: Edukatif, Inspiratif, dan Ramah (Indonesian).
    - Berikan tips praktis atau pandangan masa depan yang menarik.
    - Sebutkan fitur RuangRiung sesekali jika relevan.
    - Jangan sertakan teks apapun di luar struktur JSON tersebut.
  `;

  const models = ['gemini', 'openai', 'mistral', 'mistral-large', 'deepseek', 'searchgpt'];
  let responseText = '';
  let lastError = null;

  for (const model of models) {
    try {
      console.log(`Generating content using model: ${model}...`);
      const response = await fetch('https://gen.pollinations.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: prompt }],
          jsonFallback: true
        })
      });

      if (response.ok) {
        const data = await response.json();
        responseText = data.choices[0].message.content;
        if (responseText) break;
      } else {
        lastError = await response.text();
        console.warn(`Model ${model} returned status ${response.status}: ${lastError}`);
      }
    } catch (err) {
      lastError = err.message;
      console.error(`Error with model ${model}:`, err.message);
    }
  }

  if (!responseText) {
    console.error("Failed to generate content with all available models.");
    if (lastError) console.error("Last error:", lastError);
    process.exit(1);
  }

  // Clean up code blocks if the AI included them despite the prompt
  let cleanJson = responseText.trim();
  if (cleanJson.startsWith('```')) {
    cleanJson = cleanJson.replace(/^```json|```$/g, '').trim();
  }

  try {
    const result = JSON.parse(cleanJson);
    const slug = result.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    const date = new Date().toISOString();

    const fileContent = `---
title: "${result.title}"
date: "${date}"
author: "RuangRiung AI"
summary: "${result.summary.replace(/"/g, '\\"')}"
image: "/assets/ruangriung.png"
category: "${result.category}"
tags: ${JSON.stringify(result.tags)}
---

${result.content}
`;

    if (!fs.existsSync(ARTICLES_DIR)) {
      fs.mkdirSync(ARTICLES_DIR, { recursive: true });
    }

    const filePath = path.join(ARTICLES_DIR, `${slug}.md`);
    fs.writeFileSync(filePath, fileContent);
    console.log(`\nSUCCESS: Blog post generated!`);
    console.log(`Title: ${result.title}`);
    console.log(`Path: ${filePath}`);
    
  } catch (err) {
    console.error("Failed to parse AI response as JSON.");
    console.error("Raw response:", responseText);
    process.exit(1);
  }
}

generateBlog();
