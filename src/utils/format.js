export function formatPrice(value) {
  const number = Number(value) || 0;
  const text = number.toLocaleString('th-TH', {
    minimumFractionDigits: Number.isInteger(number) ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return `฿${text}`;
}

export function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString('th-TH', {
    dateStyle: 'long',
    timeStyle: 'short',
  });
}

export const truncate = (text = '', max = 36) =>
  text.length > max ? `${text.slice(0, max).trim()}…` : text;
