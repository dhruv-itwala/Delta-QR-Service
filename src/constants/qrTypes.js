export const QR_TYPES = [
  { id: 'url', label: 'Website URL', icon: 'Globe', placeholder: 'https://example.com' },
  { id: 'wifi', label: 'Wi-Fi Network', icon: 'Wifi', placeholder: 'Connect to Wi-Fi' },
  { id: 'vcard', label: 'Contact Card', icon: 'UserSquare2', placeholder: 'Save contact details' },
  { id: 'email', label: 'Email', icon: 'Mail', placeholder: 'Send an email' },
  { id: 'phone', label: 'Phone Call', icon: 'Phone', placeholder: '+1 (555) 000-0000' },
  { id: 'sms', label: 'SMS Message', icon: 'MessageSquare', placeholder: 'Send text message' },
  { id: 'whatsapp', label: 'WhatsApp', icon: 'MessageCircle', placeholder: 'WhatsApp chat link' },
  { id: 'text', label: 'Plain Text', icon: 'FileText', placeholder: 'Any note, secret or text' },
];

export const ERROR_CORRECTION_LEVELS = [
  { value: 'L', label: 'Low (7%)', desc: 'Minimal data redundancy' },
  { value: 'M', label: 'Medium (15%)', desc: 'Standard balance' },
  { value: 'Q', label: 'Quartile (25%)', desc: 'Enhanced reliability' },
  { value: 'H', label: 'High (30%)', desc: 'Best for logo embedding' },
];

export const FRAME_STYLES = [
  { id: 'none', label: 'No Frame' },
  { id: 'top-banner', label: 'Top Banner' },
  { id: 'bottom-pill', label: 'Bottom Pill' },
  { id: 'polaroid', label: 'Polaroid Card' },
];

export const EXPORT_RESOLUTIONS = [
  { label: 'Standard (512 px)', value: 512 },
  { label: 'High-Res (1024 px)', value: 1024 },
  { label: 'Ultra 4K (2048 px)', value: 2048 },
];
