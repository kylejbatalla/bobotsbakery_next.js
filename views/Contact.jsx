
export default function Contact() {
    return (
        <>

            <section className="hero" style={{ padding: '3.5rem 1.5rem 3rem' }}>
                <div className="hero-inner">
                    <h1>About &amp; Contact</h1>
                    <p className="tagline">a little about us — and how to reach us</p>
                </div>
            </section>

            <div className="bamboo-divider"></div>

            <section>
                <div className="container">
                    <h2 className="section-title">Our Story</h2>
                    <div className="about-text" style={{ maxWidth: '760px', margin: '0 auto' }}>
                        <p>
                            Bobot's Bakery is a small at-home bakery ran by Marnold (Bobot) Batalla, dedicated to bringing authentic
                            Filipino breads to our community. Every loaf, roll, and ensaymada is shaped
                            and baked by hand, using recipes developed by Marnold (Bobot) himself.
                        </p>
                        <p>
                            We bake the way our parents and grandparents did — slowly, with care,
                            and with the kind of attention that only family kitchens know. From the
                            soft, slightly sweet pandesal that defines a Filipino breakfast, to the
                            buttery ensaymada that crowns merienda time, our breads are made to
                            taste like home.
                        </p>
                        <p>
                            Whether you grew up with these flavors or you're discovering them for
                            the first time, we'd love to share a little piece of the Philippines
                            with you. Salamat for stopping by.
                        </p>
                    </div>
                </div>
            </section>

            <section className="section-alt">
                <div className="container">
                    <h2 className="section-title">Get in Touch</h2>
                    <p style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.05rem' }}>
                        Message us on Facebook, or give us a call/text if you have any questions.
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
        </>
    );
}
