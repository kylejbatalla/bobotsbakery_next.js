'use client';

import Link from 'next/link';
import { PRODUCTS, ITEM_BY_KEY, fmt } from '@/lib/menu';
import { useCart } from '@/components/CartContext';
import QtyStepper from '@/components/QtyStepper';

function VariantRow({ itemKey, productName }) {
  const { cart, add, setQty } = useCart();
  const item = ITEM_BY_KEY[itemKey];
  const qty = cart[itemKey] || 0;

  return (
    <div className="variant-row">
      <div className="variant-info">
        <span className="price-amount">{fmt(item.price)}</span>
        <span className="price-unit">{item.unit}</span>
      </div>
      {qty === 0 ? (
        <button type="button" className="btn btn-primary btn-small" onClick={() => add(itemKey)}
                aria-label={`Add ${item.name} to cart`}>
          Add to cart
        </button>
      ) : (
        <QtyStepper value={qty} onChange={(n) => setQty(itemKey, n)} label={item.name || productName} />
      )}
    </div>
  );
}

export default function Order() {
  const { count, total } = useCart();

  return (
    <div className={count > 0 ? 'has-cart-bar' : undefined}>

      <section className="hero" style={{ padding: '3.5rem 1.5rem 3rem' }}>
        <div className="hero-inner">
          <h1>Place an Order</h1>
          <p className="tagline">pick your favorites, then check out from your cart</p>
        </div>
      </section>

      <div className="bamboo-divider"></div>

      <section>
        <div className="container">
          <h2 className="section-title">Bread &amp; Pastries</h2>
          <p className="order-intro">
            Local pickup only in Salinas, Ca. Up to 5 of each item per order — for bigger orders,{' '}
            <Link href="/contact">message us directly</Link>.
          </p>

          <div className="menu-grid">
            {PRODUCTS.map(p => (
              <article className="menu-item" key={p.name}>
                <div className="menu-item-img">
                  <img src={p.img} alt={p.name} />
                </div>
                <div className="menu-item-body">
                  <h3>{p.name}</h3>
                  <p className="menu-item-desc">{p.desc}</p>
                  <div className="menu-variants">
                    {p.variants.map(key => <VariantRow key={key} itemKey={key} productName={p.name} />)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-alt">
          <div className="container">
              <h2 className="section-title">Want to order through phone?</h2>
              <p style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.05rem' }}>
                  Message us on Facebook, or give us a call/text.
              </p>

              <div className="contact-grid">

                  <div className="contact-card">
                      <h3>&#128104;&#8205;&#127859; Marnold Batalla</h3>

                      <div className="contact-method">
                          <div className="contact-icon">&#9742;</div>
                          <div>
                              <div className="contact-method-label">Phone</div>
                              <a href="tel:+18313208673" className="contact-method-value">(831) 320-8673</a>
                          </div>
                      </div>

                      <div className="contact-method">
                          <div className="contact-icon">f</div>
                          <div>
                              <div className="contact-method-label">Facebook</div>
                              <a href="https://www.facebook.com/" target="_blank" rel="noopener" className="contact-method-value">Marnold Batalla</a>
                          </div>
                      </div>
                  </div>

                  <div className="contact-card">
                      <h3>&#128105;&#8205;&#127859; Normita D. Batalla</h3>

                      <div className="contact-method">
                          <div className="contact-icon">&#9742;</div>
                          <div>
                              <div className="contact-method-label">Phone</div>
                              <a href="tel:+18312616136" className="contact-method-value">(831) 261-6136</a>
                          </div>
                      </div>

                      <div className="contact-method">
                          <div className="contact-icon">f</div>
                          <div>
                              <div className="contact-method-label">Facebook</div>
                              <a href="https://www.facebook.com/" target="_blank" rel="noopener" className="contact-method-value">Normita Delos Santos Batalla</a>
                          </div>
                      </div>
                  </div>

              </div>
          </div>
      </section>

      {count > 0 && (
        <div className="cart-bar" role="region" aria-label="Cart summary">
          <span className="cart-bar-summary">{count} {count === 1 ? 'item' : 'items'} &middot; {fmt(total)}</span>
          <Link href="/cart" className="btn btn-primary">View Cart &amp; Check Out</Link>
        </div>
      )}
    </div>
  );
}
