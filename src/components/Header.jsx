import React from 'react';
import { QrCode, ScanLine, Sun, Moon } from 'lucide-react';

export default function Header({
  theme,
  onToggleTheme,
  onOpenScanner
}) {
  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-icon">
          <QrCode size={22} strokeWidth={2.2} />
        </div>
        <div className="brand-text">
          <div className="brand-heading-row">
            <h1 className="brand-title">Detla Qr Service</h1>
            <span className="opensource-tag">Open Source</span>
          </div>
          <p className="brand-subtitle">Free opensource for you</p>
        </div>
      </div>

      <div className="header-actions">
        <button
          type="button"
          className="header-btn"
          onClick={onOpenScanner}
          title="Scan QR Code via camera or image"
        >
          <ScanLine size={16} />
          <span className="btn-text">Scan QR</span>
        </button>

        <button
          type="button"
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          <span className="btn-text">{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
      </div>
    </header>
  );
}
