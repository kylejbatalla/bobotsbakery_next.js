import Link from 'next/link';

export default function Home() {
  return (
    <>

      <section className="hero hero-home">
        <div className="hero-inner">
          <img src="/images/logo.png" alt="Bobot's Bakery" className="hero-logo" />
          <h1>Bobot's Bakery</h1>
          <p className="tagline">homemade, baked fresh</p>
          <p className="lead">
            A taste of home, baked with love. We bring traditional Filipino breads
            and dessert straight from our kitchen to yours, soft pandesal, sweet ensaymada,
            and the pan de coco you remember from lola's table.
            <br /><br />
            Based in Salinas, Ca. Local pickup only.
          </p>
          <div className="btn-row">
            <Link href="/order" className="btn btn-secondary">Order Now</Link>
          </div>
        </div>
      </section>
      <div className="bamboo-divider"></div>

      <section className="section-alt">
        <div className="container">
          <h2 className="section-title">Why Bobot's?</h2>
          <div className="featured-grid">
            <div className="feature-card">
              <div className="feature-icon">&#9995;</div>
              <h3>Made by Hand</h3>
              <p>Every loaf is shaped, proofed, and baked by hand — no shortcuts, no preservatives.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">&#127838;</div>
              <h3>Family Recipes</h3>
              <p>Our pandesal and ensaymada follow family kept receipes — kept true to their roots.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">&#9728;&#65039;</div>
              <h3>Baked Fresh Daily</h3>
              <p>Pick-up orders are baked the morning of pickup so you taste them at their best — warm, soft, and golden. Large orders may be made the night before. Please see FAQ.</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <h2 className="section-title">Featured Favorites</h2>
          <div className="menu-grid">

            <article className="menu-item">
              <div className="menu-item-img">
                <img src="/images/ubepandesal2.png" alt="Ube Pandesal placeholder" />
              </div>
              <div className="menu-item-body">
                <h3>Ube Pandesal</h3>
                <p className="menu-item-desc">Pillowy purple yam pandesal — one of our most-requested products.</p>
                <div className="menu-item-price">
                  <span className="price-amount">$8</span>
                  <span className="price-unit">per dozen</span>
                </div>
              </div>
            </article>

            <article className="menu-item">
              <div className="menu-item-img">
                <img src="/images/spanish2.png" alt="Spanish Bread placeholder" />
              </div>
              <div className="menu-item-body">
                <h3>Spanish Bread</h3>
                <p className="menu-item-desc">Sweet, buttery breadcrumb-coated rolls with a soft brown-sugar swirl tucked inside.</p>
                <div className="menu-item-price">
                  <span className="price-amount">$8</span>
                  <span className="price-unit">/ 6 pcs &nbsp;·&nbsp; $15 / dozen</span>
                </div>
              </div>
            </article>

            <article className="menu-item">
              <div className="menu-item-img">
                <img src="/images/coco2.png" alt="Pan de coco placeholder" />
              </div>
              <div className="menu-item-body">
                <h3>Pan de Coco</h3>
                <p className="menu-item-desc">Soft golden bread rolls with a sweet shredded coconut filling — a beloved Filipino breakfast staple.</p>
                <div className="menu-item-price">
                  <span className="price-amount">$8</span>
                  <span className="price-unit">/ 6 pcs &nbsp;·&nbsp; $15 / dozen</span>
                </div>
              </div>
            </article>

            <article className="menu-item">
              <div className="menu-item-img">
                <img src="/images/mal3.png" alt="Malunggay placeholder" />
              </div>
              <div className="menu-item-body">
                <h3>Malunggay Pandesal</h3>
                <p className="menu-item-desc">Pandesal enriched with malunggay (moringa) leaves — a nutritious, lightly herbal twist on the classic.</p>
                <div className="menu-item-price">
                  <span className="price-amount">$10</span>
                  <span className="price-unit">per dozen</span>
                </div>
              </div>
            </article>

          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link href="/order" className="btn btn-primary">See Full Menu</Link>
          </div>
        </div>
      </section>

      <section className="section-alt">
        <div className="container" style={{ textAlign: 'center', maxWidth: '700px' }}>
          <h2 className="section-title">Ready to Order?</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '1.8rem' }}>
            Start an order below, or feel free to contact us too.<br />(English, Tagalog, & Ilocano fluent!)
          </p>
          <div className="btn-row">
            <Link href="/order" className="btn btn-secondary">Order</Link>
            <Link href="/contact" className="btn btn-secondary">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
