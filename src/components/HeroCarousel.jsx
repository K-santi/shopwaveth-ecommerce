import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * สไลด์: { eyebrow, title, subtitle, cta, to, image, bg }
 * bg เป็นคลาส gradient ของ Tailwind แบบเต็ม เช่น 'from-indigo-950 to-blue-600'
 */
export default function HeroCarousel({ slides, interval = 6000 }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (paused || reduce || count < 2) return undefined;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), interval);
    return () => clearInterval(timer);
  }, [paused, count, interval]);

  const go = (next) => setIndex((next + count) % count);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="โปรโมชั่นแนะนำ"
      className="relative h-full min-h-72 overflow-hidden rounded-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.title}
          aria-hidden={i !== index}
          className={`absolute inset-0 bg-gradient-to-br ${slide.bg} transition-opacity duration-500 ${
            i === index ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <div className="relative z-10 flex h-full max-w-[60%] flex-col justify-center gap-3 p-6 text-white sm:p-10">
            {slide.eyebrow && <p className="text-xs font-medium text-white/80 sm:text-sm">{slide.eyebrow}</p>}
            <h2 className="line-clamp-3 text-xl font-semibold leading-tight sm:text-3xl">{slide.title}</h2>
            {slide.subtitle && <p className="line-clamp-2 text-xs text-white/80 sm:text-sm">{slide.subtitle}</p>}
            <Link
              to={slide.to}
              tabIndex={i === index ? 0 : -1}
              className="mt-2 w-fit rounded-full bg-brand-950 px-6 py-2.5 text-sm font-medium text-white ring-1 ring-white/30 transition hover:bg-black"
            >
              {slide.cta ?? 'ช้อปเลย'}
            </Link>
          </div>
          <img
            src={slide.image}
            alt=""
            className="absolute bottom-0 right-4 h-[82%] max-w-[48%] object-contain drop-shadow-2xl sm:right-10"
          />
        </div>
      ))}

      {count > 1 && (
        <>
          <button
            onClick={() => go(index - 1)}
            aria-label="สไลด์ก่อนหน้า"
            className="absolute left-3 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/40 sm:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => go(index + 1)}
            aria-label="สไลด์ถัดไป"
            className="absolute right-3 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/40 sm:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute inset-x-0 bottom-3 z-20 flex justify-center gap-1.5">
            {slides.map((slide, i) => (
              <button
                key={slide.title}
                onClick={() => setIndex(i)}
                aria-label={`ไปที่สไลด์ ${i + 1}`}
                aria-current={i === index}
                className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
