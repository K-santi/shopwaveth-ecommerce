export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

// เบอร์ไทย 9–10 หลัก ขึ้นต้นด้วย 0
export const isThaiPhone = (value) => /^0\d{8,9}$/.test(value.replace(/[\s-]/g, ''));

export const isZip = (value) => /^\d{5}$/.test(value.trim());

// ตรวจเลขบัตรด้วยอัลกอริทึม Luhn
export function isCardNumber(value) {
  const digits = value.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(digits)) return false;
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = Number(digits[i]);
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    double = !double;
  }
  return sum % 10 === 0;
}

// รูปแบบ MM/YY และยังไม่หมดอายุ
export function isExpiryValid(value) {
  const match = /^(\d{2})\/(\d{2})$/.exec(value.trim());
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;
  const endOfMonth = new Date(year, month, 0, 23, 59, 59);
  return endOfMonth >= new Date();
}

export const isCvv = (value) => /^\d{3,4}$/.test(value.trim());

export const formatCardNumber = (value) =>
  value.replace(/\D/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim();

export const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};
