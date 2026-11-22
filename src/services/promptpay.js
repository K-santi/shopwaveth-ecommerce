// สร้าง payload ของ PromptPay QR (EMVCo / Thai QR Payment)
const field = (id, value) => `${id}${String(value.length).padStart(2, '0')}${value}`;

function crc16(text) {
  let crc = 0xffff;
  for (let i = 0; i < text.length; i += 1) {
    crc ^= text.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * @param target เบอร์พร้อมเพย์ 10 หลัก หรือเลขบัตรประชาชน 13 หลัก
 * @param amount จำนวนเงิน (บาท) — ถ้าไม่ใส่จะเป็น QR แบบไม่กำหนดยอด
 */
export function buildPromptPayPayload(target, amount) {
  const digits = String(target).replace(/\D/g, '');
  const isCitizenId = digits.length === 13;
  const account = isCitizenId
    ? field('02', digits)
    : field('01', `0066${digits.replace(/^0/, '')}`);

  const merchant = field('00', 'A000000677010111') + account;

  let payload =
    field('00', '01') +
    field('01', amount ? '12' : '11') +
    field('29', merchant) +
    field('53', '764') +
    (amount ? field('54', Number(amount).toFixed(2)) : '') +
    field('58', 'TH') +
    '6304';

  return payload + crc16(payload);
}

export const PROMPTPAY_ID = import.meta.env.VITE_PROMPTPAY_ID || '0000000000';
