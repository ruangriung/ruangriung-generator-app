// app/video-prompt/page.tsx
import { redirect } from 'next/navigation';

export default function VideoPromptPage() {
  // Mengarahkan pengguna ke halaman HTML statis
    redirect('/v1/video-prompt/index.html');
      return null; // Mengembalikan null karena pengguna akan diarahkan segera
      }