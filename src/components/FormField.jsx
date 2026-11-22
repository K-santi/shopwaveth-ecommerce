/**
 * ช่องกรอกข้อมูลพร้อม label ที่มองเห็นเสมอ
 * ใช้ as="select" แล้วใส่ <option> เป็น children ได้
 */
export default function FormField({
  label,
  name,
  error,
  hint,
  as: Tag = 'input',
  className = '',
  children,
  ...rest
}) {
  const describedBy = error ? `${name}-error` : hint ? `${name}-hint` : undefined;

  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-neutral-700">
        {label}
      </label>
      <Tag
        id={name}
        name={name}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:ring-4 ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
            : 'border-neutral-300 focus:border-brand-700 focus:ring-brand-100'
        }`}
        {...rest}
      >
        {children}
      </Tag>
      {error ? (
        <p id={`${name}-error`} className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${name}-hint`} className="mt-1.5 text-xs text-neutral-500">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
