import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PathScape | Next.js, FastAPI, Three.js, Python',
  description: 'AI-powered accessibility planning with personalized routes, 3D visualization, and pathfinding.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
