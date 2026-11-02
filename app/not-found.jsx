'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Unknown URLs go back to the home page (same as the old React app).
export default function NotFound() {
  const router = useRouter();
  useEffect(() => { router.replace('/'); }, [router]);
  return (
    <section style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
      <p>Page not found. <Link href="/">Back to home</Link></p>
    </section>
  );
}
