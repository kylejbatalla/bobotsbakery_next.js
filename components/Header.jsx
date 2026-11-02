'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/components/CartContext';

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M2.5 3h2.6l2.4 12.2a1.6 1.6 0 0 0 1.6 1.3h8.7a1.6 1.6 0 0 0 1.6-1.2L21.5 7H6.2" />
    </svg>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const pathname = (usePathname() || '/').replace(/\/+$/, '') || '/';
  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const cls = (href) => (isActive(href) ? 'active' : undefined);
  const { count } = useCart();

  return (
    <header className="site-header">
      <div className="nav-container">
        <Link href="/" className="brand" onClick={close}>
          <img src="/images/logo.png" alt="Bobot's Bakery logo" />
          <div className="brand-text">
            <span className="brand-name">Bobot's Bakery</span>
            <span className="brand-sub">based in Salinas, Ca</span>
          </div>
        </Link>
        <div className="nav-right">
          <ul className={`nav-links${open ? ' open' : ''}`}>
            <li><Link href="/" className={cls('/')} onClick={close}>Home</Link></li>
            <li><Link href="/order" className={cls('/order')} onClick={close}>Order</Link></li>
            <li><Link href="/contact" className={cls('/contact')} onClick={close}>About &amp; Contact</Link></li>
            <li><Link href="/faq" className={cls('/faq')} onClick={close}>FAQ</Link></li>
          </ul>
          <button className="nav-toggle" aria-label="Toggle navigation" aria-expanded={open}
                  onClick={() => setOpen(o => !o)}>&#9776;</button>
          <Link href="/cart" onClick={close}
                   className={`cart-button${isActive('/cart') ? ' active' : ''}`}
                   aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}>
            <CartIcon />
            <span className="cart-label">Cart</span>
            {count > 0 && <span className="cart-badge">{count}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}
