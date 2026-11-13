# Detla Qr Service

**Free opensource for you** &bull; A privacy-first, client-side QR Code Studio built with **React 18**, **Vite**, and **`qrcode.react`**.

---

## Key Features

### 1. Multi-Format QR Generator
- **Website URL**: Automatic protocol normalization (`https://`), validation, and quick presets.
- **Wi-Fi Network**: Network Name (SSID), Password, Encryption (WPA/WPA2/WPA3, WEP, Open), and Hidden Network toggle. Compatible with native iOS Camera & Android Google Lens for instant connection.
- **vCard Contact**: First/Last name, organization, job title, phone, email, and website.
- **Email**: Pre-filled recipient, subject, and message body (`mailto:`).
- **Phone Call**: Direct dialer linking (`tel:`).
- **SMS Message**: Target number and pre-filled message.
- **WhatsApp**: International number normalization and customized pre-filled message.
- **Plain Text**: Unformatted notes, secret codes, crypto addresses, or raw data.

### 2. Studio Customization & Design
- **Designer Color Themes**: Curated palettes (Monochrome, Ocean Slate, Forest Emerald, Cyan Neon, Ruby Crimson, Royal Violet, Warm Amber, Deep Charcoal) and custom color pickers with hex readouts.
- **Card Framing**:
  - None (Clean QR)
  - Top Banner (e.g. `SCAN ME`)
  - Bottom Pill Badge
  - Polaroid Card with custom caption
- **Logo & Center Icons**:
  - Built-in SVG badges: Link, Wi-Fi, Mail, Chat, Star.
  - Upload custom logo files (PNG, JPG, SVG).
  - Background excavation (carves out QR matrix dots beneath the logo).
  - Scalable dimension slider.
- **Precision Parameters**:
  - Error correction levels: Low (7%), Medium (15%), Quartile (25%), High (30%).
  - Quiet zone margin: None, Standard (2 modules), or Wide (4 modules).
  - Dual Render Engine: Canvas (raster) & SVG (vector).

### 3. Print, PDF & Multi-Format Exports
- **Print & Save as PDF**: Dedicated print dialog formatted for A4/Letter size. Print directly to physical printers or select **Save as PDF** in your browser.
- **PNG Export**: Standard (512px), High-Res (1024px), or Ultra 4K (2048px).
- **Scalable Vector SVG**: Perfect for billboards, apparel, and graphic design.
- **WebP & JPEG**: Optimized lightweight raster formats.
- **Copy Image**: Copies PNG directly to system clipboard.
- **Web Share API**: Native mobile sharing dialog.

### 4. Built-in QR Scanner & Reader
- **Camera Scanner**: Scan physical QR codes in real-time with your device webcam or phone camera.
- **File Reader**: Upload or drop any QR code image to decode its contents instantly with one click to copy or reload.

### 5. Responsive Design
- Clean mobile-first design with responsive view switching on smaller screens between **Configure & Design** and **Live Preview & Export**.
- Zero emojis; uses consistent, vector Lucide icons.

---

## Tech Stack

- **Framework**: React 18 + Vite 6
- **QR Engine**: `qrcode.react` (Canvas & SVG)
- **QR Decoder**: `jsqr`
- **Iconography**: `lucide-react`
- **Effects**: `canvas-confetti`

---

## Getting Started

```bash
# Start development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

```bash
# Build production bundle
npm run build
```
Compiled, minified, production-ready assets are placed into `dist/`.
