import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, CreditCard, Headphones, RotateCcw, Truck } from 'lucide-react';
import useProducts from '../hooks/useProducts';
import { GROUPS } from '../data/catalog';
import { useRecentStore } from '../store/recentStore';
import { useToastStore } from '../store/toastStore';
import HeroCarousel from '../components/HeroCarousel';
import CategoryCircles from '../components/CategoryCircles';
import BrandStores from '../components/BrandStores';
import ProductRow from '../components/ProductRow';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import PromoCard from '../components/PromoCard';
import Countdown from '../components/Countdown';
import ErrorState from '../components/ErrorState';
import { formatPrice } from '../utils/format';

const byRating = (a, b) => b.rating - a.rating || b.ratingCount - a.ratingCount;
const byDiscount = (a, b) => b.discount - a.discount || b.rating - a.rating;
const inCategory = (products, slug) => products.filter((p) => p.category === slug);
const inGroup = (products, id) => {
  const slugs = GROUPS.find((g) => g.id === id)?.slugs ?? [];
  return products.filter((p) => slugs.includes(p.category));
};
const best = (list, sorter = byRating) => [...list].sort(sorter)[0];

function Section({ title, to, children }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight sm:text-xl">{title}</h2>
        {to && (
          <Link to={to} className="flex items-center gap-0.5 text-xs font-medium text-brand-700 hover:underline">
            ดูทั้งหมด <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function HomeSkeleton() {
  return (
    <div className="space-y-10">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="h-72 animate-pulse rounded-3xl bg-tile lg:col-span-2 lg:h-96" />
        <div className="hidden h-96 animate-pulse rounded-3xl bg-tile lg:block" />
      </div>
      <div className="flex gap-4">
        {Array.from({ length: 5 }, (_, i) => (
          <ProductCardSkeleton key={i} className="w-1/2 shrink-0 sm:w-1/3 lg:w-1/5" />
        ))}
      </div>
    </div>
  );
}

const SERVICES = [
  { icon: Truck, title: 'ส่งฟรีเมื่อครบ ฿999', text: 'จัดส่งทั่วประเทศ' },
  { icon: RotateCcw, title: 'คืนสินค้าได้ใน 30 วัน', text: 'ไม่ต้องอธิบายเหตุผล' },
  { icon: CreditCard, title: 'ชำระเงินปลอดภัย', text: 'พร้อมเพย์ บัตร เก็บเงินปลายทาง' },
  { icon: Headphones, title: 'ดูแลลูกค้าทุกวัน', text: 'ตอบไวภายใน 10 นาที' },
];

export default function Home() {
  const { data: products, loading, error, reload } = useProducts();
  const recentIds = useRecentStore((state) => state.ids);
  const showToast = useToastStore((state) => state.show);

  const sections = useMemo(() => {
    if (!products) return null;

    const phone = best(inCategory(products, 'smartphones'), (a, b) => b.price - a.price);
    const laptop = best(inCategory(products, 'laptops'), (a, b) => b.price - a.price);
    const bag = best(inCategory(products, 'womens-bags'));
    const shoe = best(inCategory(products, 'mens-shoes'), byDiscount);
    const grocery = best(inCategory(products, 'groceries'));
    const decor = best(inCategory(products, 'home-decoration'));
    const furniture = best(inCategory(products, 'furniture'));
    const skin = best(inCategory(products, 'skin-care'));
    const perfume = best(inCategory(products, 'fragrances'));
    const tablet = best(inCategory(products, 'tablets'));
    const kitchen = best(inCategory(products, 'kitchen-accessories'));

    const slides = [
      phone && {
        eyebrow: 'สมาร์ทโฟนยอดนิยม',
        title: phone.title,
        subtitle: `เริ่มต้น ${formatPrice(phone.price)} · ผ่อนได้ ส่งฟรี`,
        to: `/product/${phone.id}`,
        image: phone.thumbnail,
        bg: 'from-indigo-950 via-blue-900 to-blue-500',
      },
      laptop && {
        eyebrow: 'โน้ตบุ๊กแรงทุกงาน',
        title: laptop.title,
        subtitle: `เริ่มต้น ${formatPrice(laptop.price)}`,
        to: `/product/${laptop.id}`,
        image: laptop.thumbnail,
        bg: 'from-slate-950 via-slate-800 to-cyan-700',
      },
      bag && {
        eyebrow: 'แฟชั่นคอลเลกชันใหม่',
        title: bag.title,
        subtitle: `เริ่มต้น ${formatPrice(bag.price)}`,
        to: `/product/${bag.id}`,
        image: bag.thumbnail,
        bg: 'from-rose-950 via-rose-700 to-orange-500',
      },
    ].filter(Boolean);

    return {
      slides,
      shoe,
      grocery,
      decor,
      furniture,
      skin,
      perfume,
      tablet,
      kitchen,
      deals: [...products.filter((p) => p.stock > 0)].sort(byDiscount).slice(0, 5),
      groceryRow: [...inGroup(products, 'groceries')].sort(byRating).slice(0, 5),
      homeRow: [...inGroup(products, 'home')].sort(byRating).slice(0, 5),
      beautyRow: [...inGroup(products, 'beauty')].sort(byRating).slice(0, 5),
      fashionRow: [...inGroup(products, 'womens'), ...inGroup(products, 'mens')]
        .sort(byRating)
        .slice(0, 5),
      groceryPics: inGroup(products, 'groceries').sort(byRating).slice(0, 3),
    };
  }, [products]);

  const recent = useMemo(() => {
    if (!products) return [];
    return recentIds.map((id) => products.find((p) => p.id === id)).filter(Boolean).slice(0, 5);
  }, [products, recentIds]);

  if (error) {
    return <ErrorState title="โหลดสินค้าไม่สำเร็จ" message={error.message} onRetry={reload} />;
  }
  if (loading || !sections) return <HomeSkeleton />;

  const s = sections;

  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="grid gap-4 lg:h-96 lg:grid-cols-3">
        <div className="h-72 sm:h-80 lg:col-span-2 lg:h-full">
          <HeroCarousel slides={s.slides} />
        </div>
        <Link
          to="/products?deal=1"
          className="relative hidden overflow-hidden rounded-3xl bg-gradient-to-b from-sky-300 via-sky-500 to-blue-700 p-8 text-white lg:block"
        >
          <p className="text-sm font-semibold tracking-widest">SALE</p>
          <p className="mt-1 text-sm">ลดสูงสุด</p>
          <p className="text-8xl font-bold leading-none">50<span className="text-5xl">%</span></p>
          {s.shoe && (
            <img
              src={s.shoe.thumbnail}
              alt=""
              className="absolute -bottom-2 left-1/2 w-5/6 -translate-x-1/2 -rotate-6 object-contain drop-shadow-2xl"
            />
          )}
        </Link>
      </div>

      <Section title="หมวดหมู่ยอดนิยม" to="/products">
        <CategoryCircles products={products} />
      </Section>

      <ProductRow title="ดีลเด็ดวันนี้สำหรับคุณ!" to="/products?deal=1" products={s.deals} />

      {/* แบนเนอร์ 3 ช่อง */}
      <div className="grid gap-4 md:grid-cols-3">
        <PromoCard
          to="/products?group=groceries"
          eyebrow="สดใหม่ ส่งถึงบ้าน"
          title="ผักผลไม้และของชำ ลดสูงสุด 50%"
          className="bg-gradient-to-br from-fuchsia-800 to-rose-600"
          image={s.grocery?.thumbnail}
          imageClass="right-0 bottom-0 h-4/5"
        />
        <PromoCard
          to={s.tablet ? `/product/${s.tablet.id}` : '/products?group=electronics'}
          eyebrow="แท็บเล็ตและมือถือ"
          title="อัปเกรดอุปกรณ์ ใช้ AI ได้ลื่นกว่าเดิม"
          className="bg-gradient-to-br from-sky-200 to-blue-400"
          dark={false}
          ctaClass="bg-brand-900 text-white"
          image={s.tablet?.thumbnail}
          imageClass="right-0 bottom-0 h-4/5"
        />
        <PromoCard
          to="/products?group=home"
          eyebrow="แต่งบ้านรับเทศกาล"
          title="ของตกแต่งบ้านและครัว คัดมาแล้ว"
          className="bg-gradient-to-br from-red-700 to-red-500"
          ctaClass="bg-amber-400 text-neutral-900"
          image={s.decor?.thumbnail}
          imageClass="right-0 bottom-0 h-4/5"
        />
      </div>

      <Section title="ร้านค้าแบรนด์ยอดนิยม">
        <BrandStores products={products} />
      </Section>

      {/* โมเสกแบนเนอร์ */}
      <div className="grid gap-4 lg:h-80 lg:grid-cols-12 lg:grid-rows-2">
        <PromoCard
          to="/products?group=home"
          eyebrow="บ้านน่าอยู่"
          title="อยู่บ้านก็สุขใจ ลดสูงสุด 70%"
          className="bg-gradient-to-br from-sky-600 to-cyan-400 lg:col-span-5 lg:row-span-2"
          image={s.furniture?.thumbnail}
          imageClass="right-2 bottom-2 h-4/5"
        />
        <PromoCard
          to="/products?category=fragrances"
          eyebrow="น้ำหอมแบรนด์ดัง"
          title="กลิ่นหอมที่คุณหลงรัก"
          className="min-h-36 bg-gradient-to-br from-purple-800 to-fuchsia-600 lg:col-span-4"
          image={s.perfume?.thumbnail}
          imageClass="right-2 bottom-1 h-4/5"
        />
        <PromoCard
          to="/products?category=kitchen-accessories"
          eyebrow="คุณภาพดี คุ้มค่า"
          title="อุปกรณ์ครัวคัดพิเศษ"
          className="min-h-36 bg-gradient-to-br from-blue-600 to-sky-400 lg:col-span-4"
          image={s.kitchen?.thumbnail}
          imageClass="right-2 bottom-1 h-4/5"
        />
        <PromoCard
          to="/products?group=beauty"
          eyebrow="สร้างเซ็ตของคุณเอง"
          title="ดูแลผิวครบเซ็ต ส่งฟรี"
          dark={false}
          className="bg-gradient-to-br from-rose-100 to-rose-300 lg:col-span-3 lg:row-span-2"
          ctaClass="bg-rose-700 text-white"
          image={s.skin?.thumbnail}
          imageClass="right-1/2 translate-x-1/2 bottom-2 h-1/2"
        />
      </div>

      <ProductRow title="สินค้าขายดีหมวดของชำ" to="/products?group=groceries" products={s.groceryRow} />
      <ProductRow title="สินค้าขายดีหมวดบ้านและครัว" to="/products?group=home" products={s.homeRow} />

      {/* แบนเนอร์นับถอยหลัง */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-700 to-teal-600 px-6 py-10 text-white sm:px-10">
        <div className="relative z-10 max-w-lg space-y-4">
          <p className="text-sm font-medium text-emerald-100">โปรโมชั่นประจำวัน</p>
          <h2 className="text-2xl font-semibold leading-tight sm:text-4xl">ดีลแรงจำกัดเวลา ลดสูงสุด 50%</h2>
          <Countdown />
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/products?deal=1"
              className="rounded-full bg-amber-400 px-6 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-amber-300"
            >
              สั่งเลย
            </Link>
            <button
              onClick={() => {
                navigator.clipboard?.writeText('SAVE10');
                showToast('คัดลอกโค้ด SAVE10 แล้ว นำไปใช้ที่ตะกร้าได้เลย');
              }}
              className="rounded-full border border-dashed border-white/60 px-4 py-2 text-sm hover:bg-white/10"
            >
              โค้ด <strong>SAVE10</strong> (แตะเพื่อคัดลอก)
            </button>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 items-end justify-end gap-2 pr-6 md:flex">
          {s.groceryPics.map((p, i) => (
            <img
              key={p.id}
              src={p.thumbnail}
              alt=""
              className={`object-contain drop-shadow-2xl ${i === 1 ? 'h-56' : 'h-40'}`}
            />
          ))}
        </div>
      </section>

      <ProductRow title="ความงามและสุขภาพ" to="/products?group=beauty" products={s.beautyRow} />
      <ProductRow title="แฟชั่นและสไตล์" to="/products?group=womens" products={s.fashionRow} />
      <ProductRow title="สินค้าที่คุณดูล่าสุด" products={recent} />

      {/* จุดเด่นบริการ */}
      <section className="grid gap-4 rounded-3xl bg-tile p-6 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-brand-800">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-xs text-neutral-500">{text}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
