import confetti from 'canvas-confetti';

/**
 * DelQrCode Utility Functions
 */

export function buildQrPayload(type, formData) {
  switch (type) {
    case 'url': {
      const raw = (formData.url || '').trim();
      if (!raw) return '';
      const hasProto = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(raw);
      if (!hasProto && raw.includes('.') && !raw.includes(' ')) {
        return `https://${raw}`;
      }
      return raw;
    }

    case 'wifi': {
      const ssid = (formData.ssid || '').trim();
      if (!ssid) return '';
      const pass = formData.password || '';
      const enc = formData.encryption || 'WPA';
      const hidden = formData.hidden ? 'true' : 'false';
      return `WIFI:T:${enc};S:${ssid};P:${pass};H:${hidden};;`;
    }

    case 'vcard': {
      const fn = (formData.firstName || '').trim();
      const ln = (formData.lastName || '').trim();
      if (!fn && !ln) return '';
      const org = (formData.org || '').trim();
      const title = (formData.title || '').trim();
      const phone = (formData.phone || '').trim();
      const email = (formData.email || '').trim();
      const web = (formData.website || '').trim();

      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${ln};${fn};;;`,
        `FN:${fn} ${ln}`.trim(),
        org ? `ORG:${org}` : null,
        title ? `TITLE:${title}` : null,
        phone ? `TEL;TYPE=CELL:${phone}` : null,
        email ? `EMAIL:${email}` : null,
        web ? `URL:${web}` : null,
        'END:VCARD'
      ].filter(Boolean).join('\n');
    }

    case 'email': {
      const to = (formData.email || '').trim();
      if (!to) return '';
      const params = new URLSearchParams();
      if (formData.subject) params.append('subject', formData.subject);
      if (formData.body) params.append('body', formData.body);
      const query = params.toString();
      return `mailto:${to}${query ? `?${query}` : ''}`;
    }

    case 'phone': {
      const num = (formData.phone || '').trim();
      if (!num) return '';
      return `tel:${num}`;
    }

    case 'sms': {
      const num = (formData.phone || '').trim();
      if (!num) return '';
      const body = formData.message ? `?body=${encodeURIComponent(formData.message)}` : '';
      return `sms:${num}${body}`;
    }

    case 'whatsapp': {
      const cleanPhone = (formData.phone || '').replace(/[^0-9]/g, '');
      if (!cleanPhone) return '';
      const text = formData.message ? `?text=${encodeURIComponent(formData.message)}` : '';
      return `https://wa.me/${cleanPhone}${text}`;
    }

    case 'text':
    default:
      return (formData.text || '').trim();
  }
}

/**
 * Trigger celebration confetti on successful export
 */
export function fireConfetti() {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.75 },
      colors: ['#38bdf8', '#818cf8', '#34d399', '#f472b6']
    });
  } catch (e) {
    // Ignore confetti fallback
  }
}

/**
 * Generate a high-resolution export canvas with optional frame styling
 */
export function renderExportCanvas({
  sourceCanvas,
  targetSize = 1024,
  frameStyle = 'none',
  frameText = 'SCAN ME',
  bgColor = '#ffffff',
  fgColor = '#000000'
}) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  let extraTop = 0;
  let extraBottom = 0;

  if (frameStyle === 'top-banner') {
    extraTop = Math.round(targetSize * 0.16);
    extraBottom = Math.round(targetSize * 0.05);
  } else if (frameStyle === 'bottom-pill') {
    extraTop = Math.round(targetSize * 0.05);
    extraBottom = Math.round(targetSize * 0.16);
  } else if (frameStyle === 'polaroid') {
    extraTop = Math.round(targetSize * 0.08);
    extraBottom = Math.round(targetSize * 0.22);
  } else {
    extraTop = Math.round(targetSize * 0.05);
    extraBottom = Math.round(targetSize * 0.05);
  }

  const extraSides = Math.round(targetSize * 0.05);
  const totalW = targetSize + extraSides * 2;
  const totalH = targetSize + extraTop + extraBottom;

  canvas.width = totalW;
  canvas.height = totalH;

  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, totalW, totalH);

  // Draw QR code centered in allocated box
  const qrX = extraSides;
  const qrY = extraTop;
  ctx.drawImage(sourceCanvas, qrX, qrY, targetSize, targetSize);

  // Draw Frame Decorations
  if (frameStyle === 'top-banner') {
    ctx.fillStyle = fgColor;
    ctx.font = `bold ${Math.round(targetSize * 0.075)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(frameText.toUpperCase(), totalW / 2, extraTop / 2 + 5);
  } else if (frameStyle === 'bottom-pill') {
    const pillH = Math.round(targetSize * 0.1);
    const pillW = Math.round(targetSize * 0.65);
    const pillX = (totalW - pillW) / 2;
    const pillY = qrY + targetSize + (extraBottom - pillH) / 2;
    const radius = pillH / 2;

    ctx.fillStyle = fgColor;
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, radius);
    ctx.fill();

    ctx.fillStyle = bgColor;
    ctx.font = `bold ${Math.round(pillH * 0.45)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(frameText.toUpperCase(), totalW / 2, pillY + pillH / 2);
  } else if (frameStyle === 'polaroid') {
    ctx.fillStyle = fgColor;
    ctx.font = `600 ${Math.round(targetSize * 0.06)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(frameText, totalW / 2, qrY + targetSize + extraBottom / 2);
  }

  return canvas;
}

/**
 * Print or Save as PDF using an offscreen iframe
 */
export function printQrCode({
  exportCanvas,
  title = 'DelQrCode',
  payload = '',
  type = 'url'
}) {
  const dataUrl = exportCanvas.toDataURL('image/png');

  // Create temporary hidden iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} - Print / Save as PDF</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 20mm;
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #111827;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 90vh;
            padding: 2rem;
            text-align: center;
          }
          .print-header {
            margin-bottom: 2rem;
          }
          .print-title {
            font-size: 24pt;
            font-weight: 800;
            letter-spacing: -0.02em;
            color: #0f172a;
            margin-bottom: 0.35rem;
          }
          .print-subtitle {
            font-size: 11pt;
            color: #64748b;
          }
          .qr-image-container {
            margin: 1.5rem auto;
            max-width: 400px;
            padding: 12px;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          }
          .qr-image {
            width: 100%;
            height: auto;
            display: block;
            border-radius: 6px;
          }
          .print-payload-box {
            max-width: 460px;
            margin: 1.5rem auto 0 auto;
            padding: 0.75rem 1rem;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            word-break: break-all;
            font-size: 10pt;
            color: #334155;
          }
          .print-footer {
            margin-top: 2.5rem;
            font-size: 9pt;
            color: #94a3b8;
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h1 class="print-title">Scan QR Code</h1>
          <p class="print-subtitle">Open your smartphone camera to scan</p>
        </div>

        <div class="qr-image-container">
          <img class="qr-image" src="${dataUrl}" alt="QR Code" />
        </div>

        <div class="print-payload-box">
          <strong>${type.toUpperCase()}:</strong> ${payload}
        </div>

        <div class="print-footer">
          Generated via DelQrCode &bull; Printable & PDF Export Ready
        </div>
      </body>
    </html>
  `;

  doc.open();
  doc.write(html);
  doc.close();

  // Wait for images to load, then trigger print dialog
  iframe.contentWindow.focus();
  setTimeout(() => {
    iframe.contentWindow.print();
    // Clean up after print dialog finishes
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 2000);
  }, 400);
}
