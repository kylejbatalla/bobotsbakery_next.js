import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
        <div className="footer-grid">
        <div className="footer-brand">
            <img src="/images/logo.png" alt="Bobot's Bakery"/>
            <p style={{ fontFamily: 'var(--font-accent)', fontSize: '1.3rem', color: 'var(--flag-yellow)', marginBottom: '0.4rem' }}>based in Salinas, Ca</p>
            <p style={{ fontSize: '0.95rem', opacity: '0.85' }}>Authentic Filipino breads baked with love — pandesal, ensaymada, pan de coco, and more.</p>
        </div>
        <div>
            <h4>Quick Links</h4>
            <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/order">Order</Link></li>
            <li><Link href="/contact">About &amp; Contact</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/admin" rel="nofollow" style={{ fontSize: '0.85rem', opacity: 0.6 }}>Admin Login</Link></li>
            </ul>
        </div>

        </div>
        <div className="footer-bottom">
        &copy; <span>{new Date().getFullYear()}</span> Bobot's Bakery.<br />All rights reserved.
        <br />Developed and maintained by <a href="https://big-sur.digital/"><u>Big Sur Digital</u></a>
        </div>
    </footer>
  );
}
