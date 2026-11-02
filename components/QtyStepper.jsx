import { MAX_QTY } from '@/lib/menu';

export default function QtyStepper({ value, onChange, label, max = MAX_QTY }) {
  return (
    <div className="qty-stepper" role="group" aria-label={`Quantity of ${label}`}>
      <button type="button" onClick={() => onChange(value - 1)}
              aria-label={value === 1 ? `Remove ${label}` : `Fewer ${label}`}>&minus;</button>
      <span aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max}
              aria-label={`More ${label}`} title={value >= max ? `Max ${max} per item` : undefined}>+</button>
    </div>
  );
}
