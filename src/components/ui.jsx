import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock3,
  CreditCard,
  Download,
  FileText,
  Headphones,
  House,
  Image,
  LayoutDashboard,
  Mail,
  MapPin,
  Menu,
  Plus,
  QrCode,
  RotateCcw,
  ScanLine,
  Settings,
  ShieldCheck,
  Smartphone,
  Ticket,
  Users,
  Wifi,
  X,
  XCircle,
  Megaphone,
  Search,
} from "lucide-react";

export const asset = (name) => `${import.meta.env.BASE_URL}assets/${name}`;
const icons = {
  arrow: ArrowRight,
  external: ArrowUpRight,
  bell: Bell,
  calendar: CalendarDays,
  camera: Camera,
  check: Check,
  success: CheckCircle2,
  down: ChevronDown,
  back: ChevronLeft,
  next: ChevronRight,
  list: ClipboardList,
  clock: Clock3,
  card: CreditCard,
  download: Download,
  file: FileText,
  support: Headphones,
  home: House,
  image: Image,
  dashboard: LayoutDashboard,
  mail: Mail,
  pin: MapPin,
  menu: Menu,
  plus: Plus,
  qr: QrCode,
  reset: RotateCcw,
  scan: ScanLine,
  settings: Settings,
  shield: ShieldCheck,
  phone: Smartphone,
  ticket: Ticket,
  users: Users,
  wifi: Wifi,
  close: X,
  error: XCircle,
  news: Megaphone,
  search: Search,
};
export function Icon({ name, size = 20, ...props }) {
  const Component = icons[name] ?? FileText;
  return (
    <Component size={size} strokeWidth={1.8} aria-hidden="true" {...props} />
  );
}

export function Brand({ compact = false, inverse = false }) {
  return (
    <span
      className={`brand ${compact ? "brand-compact" : ""} ${inverse ? "brand-inverse" : ""}`}
    >
      <span className="brand-mark">
        <img
          src={asset("logo-clube-branco.png")}
          alt=""
          width="200"
          height="192"
        />
      </span>
      <span className="brand-name">
        Clube de Campo
        <br />
        de Brotas
      </span>
    </span>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  icon,
  ...props
}) {
  return (
    <button className={`button button-${variant} ${className}`} {...props}>
      {children}
      {icon && <Icon name={icon} size={18} />}
    </button>
  );
}

export function BrowserFrame({
  children,
  title = "Clube de Campo de Brotas · Prévia",
  className = "",
}) {
  return (
    <div className={`browser-frame ${className}`}>
      <div className="browser-chrome" aria-hidden="true">
        <span className="traffic-lights">
          <i />
          <i />
          <i />
        </span>
        <span className="browser-address">
          <Icon name="shield" size={12} />
          {title}
        </span>
        <span className="browser-chrome-end" />
      </div>
      {children}
    </div>
  );
}

export function PhoneFrame({
  children,
  className = "",
  label = "Prévia do aplicativo",
}) {
  return (
    <div className={`phone-frame ${className}`} aria-label={label}>
      <div className="phone-screen">
        <div className="phone-status" aria-hidden="true">
          <span>9:41</span>
          <span className="phone-island" />
          <span className="phone-indicators">
            <Wifi size={13} />
            <span className="battery" />
          </span>
        </div>
        {children}
        <div className="phone-home" aria-hidden="true" />
      </div>
    </div>
  );
}

export function Tabs({ items, value, onChange, label, className = "" }) {
  const prefix = useId();
  const handleKeys = (event, index) => {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % items.length;
    if (event.key === "ArrowLeft")
      next = (index - 1 + items.length) % items.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = items.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      onChange(items[next].id);
      event.currentTarget.parentElement.children[next]?.focus();
    }
  };
  return (
    <div className={`tabs ${className}`} role="tablist" aria-label={label}>
      {items.map((item, index) => (
        <button
          type="button"
          role="tab"
          aria-selected={value === item.id}
          tabIndex={value === item.id ? 0 : -1}
          id={`${prefix}-${item.id}`}
          key={item.id}
          onClick={() => onChange(item.id)}
          onKeyDown={(event) => handleKeys(event, index)}
        >
          {item.icon && <Icon name={item.icon} size={18} />}
          {item.label}
        </button>
      ))}
    </div>
  );
}

export function Avatar({ person, size = "" }) {
  return (
    <span
      className={`avatar avatar-${person.color ?? "blue"} ${size ? `avatar-${size}` : ""}`}
      aria-hidden="true"
    >
      {person.initials ??
        person.name
          ?.split(" ")
          .slice(0, 2)
          .map((part) => part[0])
          .join("")}
    </span>
  );
}
export function Status({ children, tone = "blue" }) {
  return (
    <span className={`status status-${tone}`}>
      <i />
      {children}
    </span>
  );
}
export function DemoNote({ children = "Prévia navegável · Dados fictícios" }) {
  return (
    <p className="demo-note">
      <Icon name="shield" size={14} />
      {children}
    </p>
  );
}

export function Modal({ title, children, onClose, wide = false }) {
  const ref = useRef(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement;
    dialog.showModal();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = oldOverflow;
      previous?.focus();
    };
  }, []);
  return createPortal(
    <dialog
      ref={ref}
      className={`modal ${wide ? "modal-wide" : ""}`}
      aria-labelledby={titleId}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      <div className="modal-header">
        <h2 id={titleId}>{title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="icon-button"
          aria-label="Fechar janela"
        >
          <Icon name="close" />
        </button>
      </div>
      <div className="modal-body">{children}</div>
    </dialog>,
    document.body,
  );
}

export function SectionHeading({ title, description, centered = false }) {
  return (
    <div
      className={`section-heading ${centered ? "section-heading-center" : ""}`}
    >
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
