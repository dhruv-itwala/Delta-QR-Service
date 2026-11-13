import React, { useRef } from 'react';
import { Palette, Frame, Image as ImageIcon, Sliders, Upload, Trash2 } from 'lucide-react';
import { COLOR_THEMES, PRESET_LOGOS } from '../constants/colorThemes';
import { ERROR_CORRECTION_LEVELS, FRAME_STYLES } from '../constants/qrTypes';

export default function Customizer({
  fgColor,
  setFgColor,
  bgColor,
  setBgColor,
  level,
  setLevel,
  marginSize,
  setMarginSize,
  frameStyle,
  setFrameStyle,
  frameText,
  setFrameText,
  logoSrc,
  setLogoSrc,
  logoSize,
  setLogoSize,
  excavateLogo,
  setExcavateLogo,
  renderFormat,
  setRenderFormat,
  previewDimension,
  setPreviewDimension
}) {
  const fileInputRef = useRef(null);

  const handleCustomLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, SVG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setLogoSrc(event.target.result);
      setLevel('H'); // Auto set high error recovery
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="customizer-panel">
      {/* 1. Color Themes */}
      <div className="customizer-section">
        <h4 className="customizer-title">
          <Palette size={17} />
          <span>Color Themes & Palette</span>
        </h4>

        <div className="themes-grid">
          {COLOR_THEMES.map((theme) => {
            const isSelected = fgColor === theme.fg && bgColor === theme.bg;
            return (
              <button
                key={theme.id}
                type="button"
                className={`theme-preset-card ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  setFgColor(theme.fg);
                  setBgColor(theme.bg);
                }}
              >
                <div className="theme-preset-dots">
                  <span className="dot" style={{ backgroundColor: theme.fg }}></span>
                  <span className="dot" style={{ backgroundColor: theme.bg, border: '1px solid #cbd5e1' }}></span>
                </div>
                <span className="theme-preset-name">{theme.name}</span>
              </button>
            );
          })}
        </div>

        <div className="options-row" style={{ marginTop: '0.85rem' }}>
          <div>
            <label className="form-label">Foreground (Dots)</label>
            <div className="color-picker-wrap">
              <input
                type="color"
                className="color-input"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
              />
              <span className="color-hex">{fgColor.toUpperCase()}</span>
            </div>
          </div>
          <div>
            <label className="form-label">Background</label>
            <div className="color-picker-wrap">
              <input
                type="color"
                className="color-input"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
              />
              <span className="color-hex">{bgColor.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Frame Styling */}
      <div className="customizer-section">
        <h4 className="customizer-title">
          <Frame size={17} />
          <span>Card Framing</span>
        </h4>

        <div className="frames-grid">
          {FRAME_STYLES.map((frame) => (
            <button
              key={frame.id}
              type="button"
              className={`frame-select-btn ${frameStyle === frame.id ? 'active' : ''}`}
              onClick={() => setFrameStyle(frame.id)}
            >
              {frame.label}
            </button>
          ))}
        </div>

        {frameStyle !== 'none' && (
          <div style={{ marginTop: '0.75rem' }}>
            <label className="form-label">Frame Text / Header</label>
            <input
              type="text"
              className="url-input text-pad"
              maxLength={24}
              value={frameText}
              onChange={(e) => setFrameText(e.target.value)}
              placeholder="SCAN ME"
            />
          </div>
        )}
      </div>

      {/* 3. Center Icon / Logo */}
      <div className="customizer-section">
        <h4 className="customizer-title">
          <ImageIcon size={17} />
          <span>Center Icon or Logo</span>
        </h4>

        <div className="logos-preset-row">
          {PRESET_LOGOS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`logo-preset-btn ${logoSrc === item.src ? 'active' : ''}`}
              onClick={() => {
                setLogoSrc(item.src);
                if (item.src) setLevel('H');
              }}
              title={item.name}
            >
              {item.src ? (
                <img src={item.src} alt={item.name} width={18} height={18} />
              ) : (
                <span style={{ fontSize: '0.72rem', fontWeight: 600 }}>None</span>
              )}
            </button>
          ))}

          {/* Upload Custom */}
          <button
            type="button"
            className="logo-preset-btn upload"
            onClick={() => fileInputRef.current?.click()}
            title="Upload image"
          >
            <Upload size={16} />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleCustomLogoUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </button>

          {logoSrc && (
            <button
              type="button"
              className="btn btn-sm btn-danger-soft"
              onClick={() => setLogoSrc(null)}
              title="Remove logo"
              style={{ padding: '0.35rem 0.65rem', marginLeft: 'auto' }}
            >
              <Trash2 size={14} />
              <span>Remove</span>
            </button>
          )}
        </div>

        {logoSrc && (
          <div style={{ marginTop: '0.85rem' }} className="options-row">
            <div>
              <div className="range-header">
                <span className="form-label">Logo Scale</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{Math.round(logoSize * 100)}%</span>
              </div>
              <input
                type="range"
                className="range-slider"
                min="0.12"
                max="0.32"
                step="0.02"
                value={logoSize}
                onChange={(e) => setLogoSize(Number(e.target.value))}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label className="checkbox-label" style={{ marginTop: '1.25rem' }}>
                <input
                  type="checkbox"
                  checked={excavateLogo}
                  onChange={(e) => setExcavateLogo(e.target.checked)}
                />
                <span>Clear pattern beneath logo</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* 4. Precision Parameters */}
      <div className="customizer-section">
        <h4 className="customizer-title">
          <Sliders size={17} />
          <span>Precision & Formatting</span>
        </h4>

        <div className="options-row">
          <div>
            <label className="form-label">Error Correction</label>
            <select
              className="select-control"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              {ERROR_CORRECTION_LEVELS.map((lvl) => (
                <option key={lvl.value} value={lvl.value}>
                  {lvl.label} - {lvl.desc}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Quiet Zone Margin</label>
            <select
              className="select-control"
              value={marginSize}
              onChange={(e) => setMarginSize(Number(e.target.value))}
            >
              <option value={2}>Standard (2 modules)</option>
              <option value={4}>Wide (4 modules - Print Safe)</option>
              <option value={0}>None (0 modules - Tight)</option>
            </select>
          </div>
        </div>

        <div className="options-row" style={{ marginTop: '0.85rem' }}>
          <div>
            <label className="form-label">Render Format</label>
            <select
              className="select-control"
              value={renderFormat}
              onChange={(e) => setRenderFormat(e.target.value)}
            >
              <option value="canvas">Canvas (Bitmap / Pixel-exact)</option>
              <option value="svg">SVG (Vector / Scalable)</option>
            </select>
          </div>
          <div>
            <div className="range-header">
              <span className="form-label">Preview Dimension</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{previewDimension} px</span>
            </div>
            <input
              type="range"
              className="range-slider"
              min="200"
              max="420"
              step="20"
              value={previewDimension}
              onChange={(e) => setPreviewDimension(Number(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
