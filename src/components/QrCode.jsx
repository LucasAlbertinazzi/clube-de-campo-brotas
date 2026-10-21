import { useMemo } from "react";
import QRCode from "qrcode";

export function qrMarkup(value) {
  const qr = QRCode.create(value, { errorCorrectionLevel: "M" });
  const padding = 4;
  const size = qr.modules.size + padding * 2;
  let path = "";
  for (let row = 0; row < qr.modules.size; row += 1)
    for (let column = 0; column < qr.modules.size; column += 1)
      if (qr.modules.get(row, column))
        path += `M${column + padding} ${row + padding}h1v1h-1z`;
  return { size, path };
}

export default function QrCode({
  value,
  label = "QR Code de demonstração",
  className = "",
}) {
  const { size, path } = useMemo(() => qrMarkup(value), [value]);
  return (
    <svg
      className={`qr-code ${className}`}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={label}
      shapeRendering="crispEdges"
    >
      <rect width={size} height={size} fill="#fff" />
      <path d={path} fill="#102f3d" />
    </svg>
  );
}

export function downloadQr(value, filename = "ingresso-demonstracao") {
  const { size, path } = qrMarkup(value);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges"><title>QR demonstrativo do Clube de Campo de Brotas</title><rect width="${size}" height="${size}" fill="white"/><path d="${path}" fill="#102f3d"/></svg>`;
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.svg`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
