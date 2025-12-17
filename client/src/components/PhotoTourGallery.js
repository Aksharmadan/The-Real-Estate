import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaExpand, FaTimes } from 'react-icons/fa';
import './PhotoTourGallery.css';

export default function PhotoTourGallery({ items, title = 'Photo Tour' }) {
  const normalized = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return items
      .filter((x) => x && typeof x.url === 'string' && x.url.trim())
      .map((x) => ({ url: x.url.trim(), label: x.roomName || x.label || 'Photo' }));
  }, [items]);

  const [active, setActive] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setActive(0);
    setIsOpen(false);
  }, [normalized.length]);

  const canPrev = active > 0;
  const canNext = active < normalized.length - 1;

  const prev = useCallback(() => setActive((i) => Math.max(0, i - 1)), []);
  const next = useCallback(() => setActive((i) => Math.min(normalized.length - 1, i + 1)), [normalized.length]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, prev, next]);

  if (normalized.length === 0) {
    return (
      <div className="ptg-empty">
        <h3>Photo Tour Not Available</h3>
        <p>This property doesn’t have tour photos yet.</p>
      </div>
    );
  }

  const current = normalized[active];

  return (
    <div className="ptg">
      <div className="ptg-header">
        <div className="ptg-title">
          <h3>{title}</h3>
          <p>
            {active + 1} / {normalized.length} • {current.label}
          </p>
        </div>
        <button className="ptg-open" onClick={() => setIsOpen(true)} type="button">
          <FaExpand /> Fullscreen
        </button>
      </div>

      <div className="ptg-hero">
        <button className="ptg-nav left" onClick={prev} disabled={!canPrev} type="button" aria-label="Previous photo">
          <FaChevronLeft />
        </button>
        <img className="ptg-hero-img" src={current.url} alt={current.label} loading="lazy" />
        <button className="ptg-nav right" onClick={next} disabled={!canNext} type="button" aria-label="Next photo">
          <FaChevronRight />
        </button>
      </div>

      <div className="ptg-thumbs" role="list">
        {normalized.map((x, idx) => (
          <button
            key={`${x.url}-${idx}`}
            type="button"
            className={`ptg-thumb ${idx === active ? 'active' : ''}`}
            onClick={() => setActive(idx)}
            title={x.label}
          >
            <img src={x.url} alt={x.label} loading="lazy" />
            <span>{x.label}</span>
          </button>
        ))}
      </div>

      {isOpen && (
        <div className="ptg-modal" role="dialog" aria-modal="true">
          <div className="ptg-modal-bar">
            <div className="ptg-modal-meta">
              <strong>{title}</strong>
              <span>
                {active + 1}/{normalized.length} • {current.label}
              </span>
            </div>
            <button className="ptg-close" onClick={() => setIsOpen(false)} type="button" aria-label="Close">
              <FaTimes />
            </button>
          </div>

          <div className="ptg-modal-body">
            <button className="ptg-nav left" onClick={prev} disabled={!canPrev} type="button" aria-label="Previous photo">
              <FaChevronLeft />
            </button>
            <img className="ptg-modal-img" src={current.url} alt={current.label} />
            <button className="ptg-nav right" onClick={next} disabled={!canNext} type="button" aria-label="Next photo">
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


