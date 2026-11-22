// ชื่อหมวดหมู่ภาษาไทย (slug มาจาก DummyJSON)
export const CATEGORY_LABELS = {
  beauty: 'เครื่องสำอาง',
  fragrances: 'น้ำหอม',
  furniture: 'เฟอร์นิเจอร์',
  groceries: 'ของชำ',
  'home-decoration': 'ของตกแต่งบ้าน',
  'kitchen-accessories': 'อุปกรณ์ครัว',
  laptops: 'โน้ตบุ๊ก',
  'mens-shirts': 'เสื้อเชิ้ตผู้ชาย',
  'mens-shoes': 'รองเท้าผู้ชาย',
  'mens-watches': 'นาฬิกาผู้ชาย',
  'mobile-accessories': 'อุปกรณ์เสริมมือถือ',
  motorcycle: 'มอเตอร์ไซค์',
  'skin-care': 'สกินแคร์',
  smartphones: 'สมาร์ทโฟน',
  'sports-accessories': 'อุปกรณ์กีฬา',
  sunglasses: 'แว่นกันแดด',
  tablets: 'แท็บเล็ต',
  tops: 'เสื้อผู้หญิง',
  vehicle: 'ยานยนต์',
  'womens-bags': 'กระเป๋าผู้หญิง',
  'womens-dresses': 'ชุดเดรส',
  'womens-jewellery': 'เครื่องประดับ',
  'womens-shoes': 'รองเท้าผู้หญิง',
  'womens-watches': 'นาฬิกาผู้หญิง',
};

export const categoryLabel = (slug) => CATEGORY_LABELS[slug] ?? slug;

// กลุ่มหมวดหมู่หลัก (ใช้ใน Navbar, หมวดหมู่ยอดนิยม, ตัวกรอง)
export const GROUPS = [
  { id: 'electronics', label: 'อิเล็กทรอนิกส์', slugs: ['smartphones', 'laptops', 'tablets', 'mobile-accessories'] },
  { id: 'womens', label: 'แฟชั่นผู้หญิง', slugs: ['womens-dresses', 'tops', 'womens-shoes', 'womens-bags', 'womens-jewellery', 'womens-watches'] },
  { id: 'mens', label: 'แฟชั่นผู้ชาย', slugs: ['mens-shirts', 'mens-shoes', 'mens-watches', 'sunglasses'] },
  { id: 'beauty', label: 'ความงาม', slugs: ['beauty', 'skin-care', 'fragrances'] },
  { id: 'home', label: 'บ้านและครัว', slugs: ['furniture', 'home-decoration', 'kitchen-accessories'] },
  { id: 'groceries', label: 'ของชำ', slugs: ['groceries'] },
  { id: 'auto', label: 'กีฬาและยานยนต์', slugs: ['sports-accessories', 'motorcycle', 'vehicle'] },
];

export const groupById = (id) => GROUPS.find((group) => group.id === id);

export const groupOfCategory = (slug) =>
  GROUPS.find((group) => group.slugs.includes(slug));

export const PROVINCES = [
  'กรุงเทพมหานคร', 'กระบี่', 'กาญจนบุรี', 'กาฬสินธุ์', 'กำแพงเพชร', 'ขอนแก่น', 'จันทบุรี', 'ฉะเชิงเทรา',
  'ชลบุรี', 'ชัยนาท', 'ชัยภูมิ', 'ชุมพร', 'เชียงราย', 'เชียงใหม่', 'ตรัง', 'ตราด', 'ตาก', 'นครนายก',
  'นครปฐม', 'นครพนม', 'นครราชสีมา', 'นครศรีธรรมราช', 'นครสวรรค์', 'นนทบุรี', 'นราธิวาส', 'น่าน',
  'บึงกาฬ', 'บุรีรัมย์', 'ปทุมธานี', 'ประจวบคีรีขันธ์', 'ปราจีนบุรี', 'ปัตตานี', 'พระนครศรีอยุธยา',
  'พะเยา', 'พังงา', 'พัทลุง', 'พิจิตร', 'พิษณุโลก', 'เพชรบุรี', 'เพชรบูรณ์', 'แพร่', 'ภูเก็ต',
  'มหาสารคาม', 'มุกดาหาร', 'แม่ฮ่องสอน', 'ยโสธร', 'ยะลา', 'ร้อยเอ็ด', 'ระนอง', 'ระยอง', 'ราชบุรี',
  'ลพบุรี', 'ลำปาง', 'ลำพูน', 'เลย', 'ศรีสะเกษ', 'สกลนคร', 'สงขลา', 'สตูล', 'สมุทรปราการ',
  'สมุทรสงคราม', 'สมุทรสาคร', 'สระแก้ว', 'สระบุรี', 'สิงห์บุรี', 'สุโขทัย', 'สุพรรณบุรี',
  'สุราษฎร์ธานี', 'สุรินทร์', 'หนองคาย', 'หนองบัวลำภู', 'อ่างทอง', 'อำนาจเจริญ', 'อุดรธานี',
  'อุตรดิตถ์', 'อุทัยธานี', 'อุบลราชธานี',
];
