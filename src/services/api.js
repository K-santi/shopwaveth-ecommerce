import { categoryLabel } from '../data/catalog';

const BASE_URL = 'https://dummyjson.com';

// DummyJSON ราคาเป็น USD — แปลงเป็นบาทด้วยอัตราคงที่สำหรับเดโม
export const USD_TO_THB = 35;

const cache = new Map();

async function request(path) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`);
  } catch {
    throw new Error('เชื่อมต่อเครือข่ายไม่ได้ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองอีกครั้ง');
  }
  if (!response.ok) {
    throw new Error(`โหลดข้อมูลไม่สำเร็จ (รหัส ${response.status})`);
  }
  return response.json();
}

function cached(key, loader) {
  if (!cache.has(key)) {
    const promise = loader().catch((error) => {
      cache.delete(key); // ให้ลองใหม่ได้เมื่อ error
      throw error;
    });
    cache.set(key, promise);
  }
  return cache.get(key);
}

function normalize(raw) {
  const originalPrice = Math.max(1, Math.round(raw.price * USD_TO_THB));
  const discount = Math.round(raw.discountPercentage ?? 0);
  const price = Math.max(1, Math.round(originalPrice * (1 - discount / 100)));
  const tags = raw.tags ?? [];

  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    category: raw.category,
    brand: raw.brand ?? null,
    price,
    originalPrice,
    discount,
    rating: raw.rating ?? 0,
    reviews: raw.reviews ?? [],
    ratingCount: raw.reviews?.length ?? 0,
    stock: raw.stock ?? 0,
    sku: raw.sku,
    tags,
    thumbnail: raw.thumbnail,
    images: raw.images?.length ? raw.images : [raw.thumbnail],
    searchText: [raw.title, raw.brand, raw.category, categoryLabel(raw.category), ...tags]
      .filter(Boolean)
      .join(' ')
      .toLowerCase(),
  };
}

// โหลดสินค้าทั้งหมด (194 ชิ้น) ครั้งเดียว แล้วกรอง/ค้นหา/เรียงที่ฝั่ง client
export function getAllProducts() {
  return cached('all', async () => {
    const data = await request('/products?limit=0');
    return data.products.map(normalize);
  });
}

export async function getProduct(id) {
  const products = await getAllProducts();
  const product = products.find((item) => String(item.id) === String(id));
  if (!product) throw new Error('ไม่พบสินค้านี้ อาจถูกนำออกจากร้านแล้ว');
  return product;
}
