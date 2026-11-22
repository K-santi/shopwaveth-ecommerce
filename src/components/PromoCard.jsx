import { Link } from 'react-router-dom';

/** การ์ดแบนเนอร์โปรโมชั่น: ข้อความซ้าย รูปสินค้าขวา */
export default function PromoCard({
  to,
  eyebrow,
  title,
  cta = 'ช้อปเลย',
  image,
  className = '',
  imageClass = 'right-2 bottom-2 h-3/4',
  dark = true,
  ctaClass = 'bg-white text-neutral-900',
}) {
  return (
    <Link
      to={to}
      className={`group relative flex min-h-40 overflow-hidden rounded-2xl p-5 ${
        dark ? 'text-white' : 'text-neutral-900'
      } ${className}`}
    >
      <div className="relative z-10 flex max-w-[58%] flex-col items-start justify-between gap-3">
        <div>
          {eyebrow && <p className="text-xs font-medium opacity-80">{eyebrow}</p>}
          <h3 className="mt-1 text-lg font-semibold leading-tight sm:text-xl">{title}</h3>
        </div>
        <span className={`rounded-full px-4 py-1.5 text-xs font-medium transition group-hover:scale-105 ${ctaClass}`}>
          {cta}
        </span>
      </div>
      {image && (
        <img
          src={image}
          alt=""
          loading="lazy"
          className={`absolute object-contain drop-shadow-xl transition-transform duration-300 group-hover:scale-105 ${imageClass}`}
        />
      )}
    </Link>
  );
}
