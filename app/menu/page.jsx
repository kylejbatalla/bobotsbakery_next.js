'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Old /menu URL now lives at /order.
export default function MenuRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/order'); }, [router]);
  return null;
}
