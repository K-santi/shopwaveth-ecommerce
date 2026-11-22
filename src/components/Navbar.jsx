import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ChevronDown, Heart, LayoutGrid, LogOut, MapPin, Package, Search, ShoppingBag,
  Sparkles, Tag, User, X,
} from 'lucide-react';
import { useCartStore, selectCount } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore, selectUser } from '../store/authStore';
import { useUiStore } from '../store/uiStore';
import { useToastStore } from '../store/toastStore';
import useProducts from '../hooks/useProducts';
import { GROUPS, PROVINCES, categoryLabel } from '../data/catalog';
import { formatPrice } from '../utils/format';

/* ---------- ช่องค้นหา + คำแนะนำสินค้า ---------- */
function SearchBox() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const urlQuery = pathname === '/products' ? params.get('q') ?? '' : '';

  const [query, setQuery] = useState(urlQuery);
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  const { data: products } = useProducts();

  useEffect(() => setQuery(urlQuery), [urlQuery]);

  useEffect(() => {
    const close = (event) => {
      if (!boxRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2 || !products) return [];
    return products.filter((p) => p.searchText.includes(q)).slice(0, 6);
  }, [query, products]);

  const submit = (event) => {
    event.preventDefault();
    const q = query.trim();
    setOpen(false);
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products');
  };

  return (
    <form
      ref={boxRef}
      onSubmit={submit}
      role="search"
      className="relative order-last w-full lg:order-none lg:max-w-xl lg:flex-1"
      onKeyDown={(event) => event.key === 'Escape' && setOpen(false)}
    >
      <label htmlFor="site-search" className="sr-only">ค้นหาสินค้าหรือแบรนด์</label>
      <Sparkles className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-500" aria-hidden="true" />
      <input
        id="site-search"
        type="search"
        autoComplete="off"
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        placeholder="ค้นหาสินค้าหรือแบรนด์"
        className="w-full rounded-full bg-tile py-3 pl-11 pr-14 text-sm outline-none ring-brand-100 transition placeholder:text-neutral-400 focus:bg-white focus:ring-4 [&::-webkit-search-cancel-button]:hidden"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          aria-label="ล้างคำค้นหา"
          className="absolute right-12 top-1/2 -translate-y-1/2 rounded-full p-1 text-neutral-400 hover:text-neutral-700"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <button
        type="submit"
        aria-label="ค้นหา"
        className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-brand-900 text-white transition hover:bg-brand-700"
      >
        <Search className="h-4 w-4" />
      </button>

      {open && suggestions.length > 0 && (
        <ul className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl">
          {suggestions.map((product) => (
            <li key={product.id}>
              <Link
                to={`/product/${product.id}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 transition hover:bg-tile"
              >
                <img src={product.thumbnail} alt="" className="h-10 w-10 rounded-lg bg-tile object-contain" />
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-1 text-sm">{product.title}</span>
                  <span className="text-xs text-neutral-500">{categoryLabel(product.category)}</span>
                </span>
                <span className="text-sm font-medium text-brand-900">{formatPrice(product.price)}</span>
              </Link>
            </li>
          ))}
          <li className="border-t border-neutral-100">
            <button type="submit" className="w-full px-4 py-3 text-left text-sm text-brand-700 hover:bg-tile">
              ดูผลการค้นหาทั้งหมดสำหรับ “{query.trim()}”
            </button>
          </li>
        </ul>
      )}
    </form>
  );
}

/* ---------- เมนูบัญชีผู้ใช้ ---------- */
function AccountMenu() {
  const user = useAuthStore(selectUser);
  const logout = useAuthStore((state) => state.logout);
  const showToast = useToastStore((state) => state.show);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (event) => {
      if (!ref.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  if (!user) {
    return (
      <Link
        to="/login"
        className="flex items-center gap-2 rounded-full p-2.5 text-sm transition hover:bg-tile lg:px-3"
      >
        <User className="h-5 w-5" aria-hidden="true" />
        <span className="hidden lg:inline">เข้าสู่ระบบ</span>
        <span className="sr-only lg:hidden">เข้าสู่ระบบ</span>
      </Link>
    );
  }

  const item = 'flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-tile';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full p-1.5 text-sm transition hover:bg-tile lg:pr-3"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-900 text-sm font-semibold text-white">
          {user.name.charAt(0).toUpperCase()}
        </span>
        <span className="hidden max-w-24 truncate lg:inline">{user.name}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-neutral-200 bg-white py-1 shadow-xl">
          <p className="truncate px-4 py-2 text-xs text-neutral-500">{user.email}</p>
          <Link to="/account" onClick={() => setOpen(false)} className={item}>
            <Package className="h-4 w-4" /> บัญชีและคำสั่งซื้อ
          </Link>
          <Link to="/wishlist" onClick={() => setOpen(false)} className={item}>
            <Heart className="h-4 w-4" /> รายการโปรด
          </Link>
          <button
            onClick={() => {
              logout();
              setOpen(false);
              showToast('ออกจากระบบแล้ว');
              navigate('/');
            }}
            className={`${item} border-t border-neutral-100 text-red-600`}
          >
            <LogOut className="h-4 w-4" /> ออกจากระบบ
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- Navbar หลัก ---------- */
export default function Navbar() {
  const count = useCartStore(selectCount);
  const wishlistCount = useWishlistStore((state) => state.ids.length);
  const openCart = useUiStore((state) => state.openCart);
  const province = useUiStore((state) => state.province);
  const setProvince = useUiStore((state) => state.setProvince);
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const [megaOpen, setMegaOpen] = useState(false);
  const megaRef = useRef(null);

  useEffect(() => setMegaOpen(false), [pathname, params]);

  useEffect(() => {
    const close = (event) => {
      if (!megaRef.current?.contains(event.target)) setMegaOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const activeGroup = pathname === '/products' ? params.get('group') : null;
  const chip = (active) =>
    `whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] transition ${
      active ? 'bg-brand-900 text-white' : 'text-neutral-600 hover:bg-tile hover:text-neutral-900'
    }`;
  const iconBtn = 'relative rounded-full p-2.5 transition hover:bg-tile';
  const badge =
    'absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-semibold text-white';

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-3 px-4 py-3 sm:px-6 lg:flex-nowrap lg:gap-x-5 lg:px-8">
        <Link to="/" aria-label="ShopWave หน้าแรก" className="mr-auto flex items-center gap-2 lg:mr-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-900 text-base font-bold text-white">
            S
          </span>
          <span className="text-xl font-semibold tracking-tight text-brand-900">ShopWave</span>
        </Link>

        <SearchBox />

        <label className="hidden items-center gap-1.5 text-xs text-neutral-600 xl:flex">
          <MapPin className="h-4 w-4 text-brand-700" aria-hidden="true" />
          <span className="leading-tight">
            จัดส่งไปยัง
            <select
              value={province}
              onChange={(event) => setProvince(event.target.value)}
              aria-label="เลือกจังหวัดที่จัดส่ง"
              className="block max-w-32 cursor-pointer bg-transparent font-medium text-neutral-900 outline-none"
            >
              {PROVINCES.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </span>
        </label>

        <div className="flex items-center gap-0.5">
          <Link to="/wishlist" aria-label={`รายการโปรด ${wishlistCount} ชิ้น`} className={iconBtn}>
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && <span className={`${badge} bg-red-500`}>{wishlistCount}</span>}
          </Link>
          <button onClick={openCart} aria-label={`ตะกร้าสินค้า ${count} ชิ้น`} className={iconBtn}>
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && <span className={`${badge} bg-brand-900`}>{count > 99 ? '99+' : count}</span>}
          </button>
          <AccountMenu />
        </div>
      </div>

      <nav aria-label="หมวดหมู่สินค้า" className="border-t border-neutral-100">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 py-1.5 sm:px-6 lg:px-8">
          <div ref={megaRef} className="relative shrink-0">
            <button
              onClick={() => setMegaOpen((v) => !v)}
              aria-expanded={megaOpen}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium text-neutral-900 transition hover:bg-tile"
            >
              <LayoutGrid className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">หมวดหมู่ทั้งหมด</span>
              <span className="sm:hidden">หมวดหมู่</span>
              <ChevronDown className={`h-3.5 w-3.5 transition ${megaOpen ? 'rotate-180' : ''}`} />
            </button>

            {megaOpen && (
              <div className="absolute left-0 top-full z-50 mt-1.5 grid max-h-[70vh] w-[min(92vw,56rem)] animate-fade-in gap-6 overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl sm:grid-cols-2 lg:grid-cols-4">
                {GROUPS.map((group) => (
                  <div key={group.id}>
                    <Link to={`/products?group=${group.id}`} className="text-sm font-semibold text-brand-900 hover:underline">
                      {group.label}
                    </Link>
                    <ul className="mt-2 space-y-1.5">
                      {group.slugs.map((slug) => (
                        <li key={slug}>
                          <Link to={`/products?category=${slug}`} className="text-sm text-neutral-600 hover:text-brand-700">
                            {categoryLabel(slug)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="no-scrollbar flex flex-1 gap-1 overflow-x-auto">
            {GROUPS.map((group) => (
              <Link key={group.id} to={`/products?group=${group.id}`} className={chip(activeGroup === group.id)}>
                {group.label}
              </Link>
            ))}
          </div>

          <div className="hidden shrink-0 items-center gap-1 text-[13px] md:flex">
            <NavLink
              to="/products?deal=1"
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium text-brand-700 hover:bg-brand-50"
            >
              <Tag className="h-4 w-4" aria-hidden="true" /> ดีลเด็ด
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
}
