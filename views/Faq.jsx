'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function Faq() {
  const ref = useRef(null);

  useEffect(() => {
    const items = ref.current.querySelectorAll('.faq-item');
    if (!('IntersectionObserver' in window)) {
      items.forEach(i => i.classList.add('visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25, rootMargin: '0px 0px -8% 0px' });
    items.forEach(i => observer.observe(i));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
       <section className="hero" style={{ padding: '3.5rem 1.5rem 3rem' }}>
                <div className="hero-inner">
                    <h1>Frequently Asked Questions</h1>
                    <p className="tagline">everything you might want to know</p>
                </div>
            </section>

            <div className="bamboo-divider"></div>

            <section>
                <div className="container">
                    <p className="faq-intro">
                        Scroll down to see each answer. If you still have questions, message us — we'd love to help.
                    </p>

                    <div className="faq-list" id="faqList">

                        <article className="faq-item">
                            <h3 className="faq-question">
                                <span className="q-mark">Q.</span>
                                <span>What are the pickup times?</span>
                            </h3>
                            <div className="faq-answer">
                                <span className="a-mark">A.</span>
                                <p>All pickup times are at 12PM PST. We can hold orders all day or overnight if needed. However, it is not recommended due to quality reasons.</p>
                            </div>
                        </article>

                        <article className="faq-item">
                            <h3 className="faq-question">
                                <span className="q-mark">Q.</span>
                                <span>Where do I pickup?</span>
                            </h3>
                            <div className="faq-answer">
                                <span className="a-mark">A.</span>
                                <p>Pickup location is located in North Salinas, California. Address is sent in the receipt via email after confirmation of order.</p>
                            </div>
                        </article>

                        <article className="faq-item">
                            <h3 className="faq-question">
                                <span className="q-mark">Q.</span>
                                <span>Are all baked goods made fresh?</span>
                            </h3>
                            <div className="faq-answer">
                                <span className="a-mark">A.</span>
                                <p>All baked goods are baked the morning of the pickup date. In more uncommon cases, goods may be baked the night before to accommodate large volumes of orders. We use no preservatives.</p>
                            </div>
                        </article>

                        <article className="faq-item">
                            <h3 className="faq-question">
                                <span className="q-mark">Q.</span>
                                <span>What is the storage life of the baked goods?</span>
                            </h3>
                            <div className="faq-answer">
                                <span className="a-mark">A.</span>
                                <p>Because our baked goods are homemade and we do not use preservatives, we recommend storing the goods in a refrigerator, which will typically last up to 1&ndash;2 weeks. If refrigeration is not possible, then storing in a cool, dark, and airtight environment will last up to 3&ndash;5 days.</p>
                            </div>
                        </article>

                        <article className="faq-item">
                            <h3 className="faq-question">
                                <span className="q-mark">Q.</span>
                                <span>Is there a recommended way to eat the goods?</span>
                            </h3>
                            <div className="faq-answer">
                                <span className="a-mark">A.</span>
                                <p>There is no correct way! The Filipino way is to eat them reheated (with an air fryer if possible) with a warm cup of coffee or tea. Non-filling Pandesals go great with butter :)</p>
                            </div>
                        </article>

                        <article className="faq-item">
                            <h3 className="faq-question">
                                <span className="q-mark">Q.</span>
                                <span>Do you deliver?</span>
                            </h3>
                            <div className="faq-answer">
                                <span className="a-mark">A.</span>
                                <p>We do not deliver at the moment. Local pickup only in Salinas, CA. Address provided at checkout. Please contact us if you lose the address.</p>
                            </div>
                        </article>

                        <article className="faq-item">
                            <h3 className="faq-question">
                                <span className="q-mark">Q.</span>
                                <span>Where can I find the allergens and ingredients?</span>
                            </h3>
                            <div className="faq-answer">
                                <span className="a-mark">A.</span>
                                <p>All ingredients and allergens will be labeled on the product's packaging. Please contact us ahead of time for allergen information.</p>
                            </div>
                        </article>

                    </div>

                    <div className="faq-still-have-questions">
                        <h3 style={{ marginBottom: '0.6rem' }}>Still have a question?</h3>
                        <p style={{ marginBottom: '1.2rem' }}>Message us on Facebook or give us a call &mdash; we're happy to help.</p>
                        <div className="btn-row">
                            <Link href="/contact" className="btn btn-primary">Contact Us</Link>
                            <Link href="/order" className="btn btn-secondary">Place an Order</Link>
                        </div>
                    </div>
                </div>
            </section>
    </div>
  );
}
