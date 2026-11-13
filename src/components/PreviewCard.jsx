import React, { useRef, useState } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import {
  Download,
  Copy,
  Printer,
  ExternalLink,
  Share2,
  Check,
  ChevronDown,
  FileCode,
  QrCode,
  CheckCircle2
} from 'lucide-react';
import { renderExportCanvas, fireConfetti, printQrCode } from '../utils/qrUtils';
import { EXPORT_RESOLUTIONS } from '../constants/qrTypes';

export default function PreviewCard({
  payload,
  activeType,
  fgColor,
  bgColor,
  level,
  marginSize,
  frameStyle,
  frameText,
  logoSrc,
  logoSize,
  excavateLogo,
  renderFormat,
  previewDimension,
  onNotify
}) {
  const [exportRes, setExportRes] = useState(1024);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef(null);
  const svgRef = useRef(null);

  // Logo config for qrcode.react
  const imageSettings = logoSrc
    ? {
        src: logoSrc,
        height: Math.round(previewDimension * logoSize),
        width: Math.round(previewDimension * logoSize),
        excavate: excavateLogo
      }
    : undefined;

  // Prepare clean filename
  const getFilename = () => {
    let name = 'detla-qr';
    if (activeType === 'url') {
      try {
        const u = new URL(payload);
        name = `detla-${u.hostname.replace(/[^a-z0-9]/gi, '_')}`;
      } catch {
        name = 'detla-url';
      }
    } else {
      name = `detla-${activeType}`;
    }
    return name;
  };

  // Helper to generate export canvas
  const getPreparedCanvas = (resolution) => {
    const sourceCanvas = canvasRef.current?.querySelector('canvas');
    if (!sourceCanvas) return null;

    return renderExportCanvas({
      sourceCanvas,
      targetSize: resolution,
      frameStyle,
      frameText: frameText || 'SCAN ME',
      bgColor,
      fgColor
    });
  };

  // Download PNG
  const handleDownloadPng = (resolution = exportRes) => {
    if (!payload) {
      onNotify('No data to export', 'info');
      return;
    }

    const exportCanvas = getPreparedCanvas(resolution);
    if (!exportCanvas) {
      onNotify('Rendering failed', 'danger');
      return;
    }

    try {
      const link = document.createElement('a');
      link.download = `${getFilename()}-${resolution}px.png`;
      link.href = exportCanvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      fireConfetti();
      onNotify(`Downloaded ${resolution}px PNG`, 'success');
    } catch (err) {
      console.error(err);
      onNotify('Download failed', 'danger');
    }
  };

  // Download JPEG
  const handleDownloadJpeg = () => {
    const exportCanvas = getPreparedCanvas(exportRes);
    if (!exportCanvas) return;
    const link = document.createElement('a');
    link.download = `${getFilename()}.jpg`;
    link.href = exportCanvas.toDataURL('image/jpeg', 0.95);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    fireConfetti();
    onNotify('Downloaded JPEG image', 'success');
  };

  // Download WebP
  const handleDownloadWebp = () => {
    const exportCanvas = getPreparedCanvas(exportRes);
    if (!exportCanvas) return;
    const link = document.createElement('a');
    link.download = `${getFilename()}.webp`;
    link.href = exportCanvas.toDataURL('image/webp', 0.95);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    fireConfetti();
    onNotify('Downloaded WebP image', 'success');
  };

  // Download SVG
  const handleDownloadSvg = () => {
    if (!payload) return;
    const svg = svgRef.current?.querySelector('svg');
    if (!svg) {
      onNotify('SVG element not ready', 'info');
      return;
    }

    try {
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${getFilename()}.svg`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      fireConfetti();
      onNotify('Downloaded scalable SVG', 'success');
    } catch (err) {
      console.error(err);
      onNotify('SVG download failed', 'danger');
    }
  };

  // Print or Save as PDF
  const handlePrint = () => {
    if (!payload) {
      onNotify('No data to print', 'info');
      return;
    }

    const exportCanvas = getPreparedCanvas(exportRes);
    if (!exportCanvas) {
      onNotify('Could not prepare print canvas', 'danger');
      return;
    }

    try {
      printQrCode({
        exportCanvas,
        title: getFilename(),
        payload,
        type: activeType
      });
      onNotify('Opening Print & PDF dialog...', 'info');
    } catch (err) {
      console.error(err);
      onNotify('Print error', 'danger');
    }
  };

  // Copy Image to Clipboard
  const handleCopyClipboard = async () => {
    if (!payload) return;
    const exportCanvas = getPreparedCanvas(exportRes);
    if (!exportCanvas) return;

    if (!navigator.clipboard || !window.ClipboardItem) {
      onNotify('Clipboard API not supported in this browser', 'info');
      return;
    }

    try {
      exportCanvas.toBlob(async (blob) => {
        if (!blob) {
          onNotify('Failed to convert image', 'danger');
          return;
        }
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        onNotify('QR Code copied to clipboard', 'success');
      }, 'image/png');
    } catch (err) {
      console.error(err);
      onNotify('Failed to copy to clipboard', 'danger');
    }
  };

  // Web Share API
  const handleShare = async () => {
    if (!payload) return;
    const exportCanvas = getPreparedCanvas(exportRes);
    if (!exportCanvas) return;

    if (navigator.share && navigator.canShare) {
      try {
        exportCanvas.toBlob(async (blob) => {
          const file = new File([blob], `${getFilename()}.png`, { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'Detla Qr Service',
              text: `Scannable QR Code for ${activeType}`,
              files: [file]
            });
            onNotify('Shared successfully', 'success');
          } else {
            await navigator.share({
              title: 'Detla Qr Service',
              text: payload
            });
          }
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      }
    } else {
      handleCopyClipboard();
    }
  };

  // Open Link if valid URL
  const handleOpenLink = () => {
    if (!payload) return;
    const isUrl = /^https?:\/\//i.test(payload);
    if (isUrl) {
      window.open(payload, '_blank', 'noopener,noreferrer');
    } else {
      onNotify('Not a direct web URL', 'info');
    }
  };

  const isPayloadUrl = /^https?:\/\//i.test(payload);

  return (
    <section className="card preview-card">
      <div className="preview-header">
        <h3 className="card-title" style={{ margin: 0 }}>
          <QrCode size={19} className="preview-title-icon" />
          <span>Interactive Preview</span>
        </h3>

        <div className="resolution-selector">
          <select
            className="select-control compact"
            value={exportRes}
            onChange={(e) => setExportRes(Number(e.target.value))}
            title="Export resolution"
          >
            {EXPORT_RESOLUTIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Frame / Display Box */}
      <div className="qr-display-container">
        {payload ? (
          <>
            <div className={`qr-styled-frame frame-${frameStyle}`} style={{ backgroundColor: bgColor }}>
              {/* Optional Top Banner Frame */}
              {frameStyle === 'top-banner' && (
                <div className="frame-header-banner" style={{ color: fgColor }}>
                  {frameText || 'SCAN ME'}
                </div>
              )}

              {/* QR Render Target */}
              <div className="qr-render-box">
                {renderFormat === 'canvas' ? (
                  <div ref={canvasRef}>
                    <QRCodeCanvas
                      value={payload}
                      size={previewDimension}
                      bgColor={bgColor}
                      fgColor={fgColor}
                      level={level}
                      marginSize={marginSize}
                      imageSettings={imageSettings}
                    />
                  </div>
                ) : (
                  <div ref={svgRef}>
                    <QRCodeSVG
                      value={payload}
                      size={previewDimension}
                      bgColor={bgColor}
                      fgColor={fgColor}
                      level={level}
                      marginSize={marginSize}
                      imageSettings={imageSettings}
                    />
                  </div>
                )}

                {/* Offscreen companion for dual export */}
                {renderFormat === 'svg' && (
                  <div ref={canvasRef} style={{ display: 'none' }}>
                    <QRCodeCanvas
                      value={payload}
                      size={previewDimension}
                      bgColor={bgColor}
                      fgColor={fgColor}
                      level={level}
                      marginSize={marginSize}
                      imageSettings={imageSettings}
                    />
                  </div>
                )}
                {renderFormat === 'canvas' && (
                  <div ref={svgRef} style={{ display: 'none' }}>
                    <QRCodeSVG
                      value={payload}
                      size={previewDimension}
                      bgColor={bgColor}
                      fgColor={fgColor}
                      level={level}
                      marginSize={marginSize}
                      imageSettings={imageSettings}
                    />
                  </div>
                )}
              </div>

              {/* Optional Bottom Pill Frame */}
              {frameStyle === 'bottom-pill' && (
                <div
                  className="frame-bottom-pill"
                  style={{ backgroundColor: fgColor, color: bgColor }}
                >
                  {frameText || 'SCAN ME'}
                </div>
              )}

              {/* Optional Polaroid Label Frame */}
              {frameStyle === 'polaroid' && (
                <div className="frame-polaroid-caption" style={{ color: fgColor }}>
                  {frameText || 'Scan with Camera'}
                </div>
              )}
            </div>

            <div className="qr-status-badge">
              <CheckCircle2 size={13} color="var(--success)" />
              <span>Scannable & Valid</span>
            </div>
          </>
        ) : (
          <div className="qr-empty-state">
            <div className="empty-icon-wrap">
              <QrCode size={32} />
            </div>
            <p style={{ fontWeight: 600, fontSize: '0.98rem' }}>Awaiting Input</p>
            <p style={{ fontSize: '0.84rem' }}>Enter content on the left to render your QR code.</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="actions-section">
        <div className="primary-actions-row">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleDownloadPng()}
            disabled={!payload}
          >
            <Download size={17} />
            <span>Download PNG</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleDownloadSvg}
            disabled={!payload}
            title="Download scalable SVG"
          >
            <FileCode size={16} />
            <span>SVG</span>
          </button>

          {/* More Formats Dropdown */}
          <div className="dropdown-wrapper">
            <button
              type="button"
              className="btn btn-secondary icon-only"
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={!payload}
              title="More export formats"
              aria-label="More export formats"
            >
              <ChevronDown size={16} />
            </button>

            {showExportMenu && (
              <div className="dropdown-menu">
                <button type="button" onClick={() => { handleDownloadJpeg(); setShowExportMenu(false); }}>
                  Export as JPEG (.jpg)
                </button>
                <button type="button" onClick={() => { handleDownloadWebp(); setShowExportMenu(false); }}>
                  Export as WebP (.webp)
                </button>
                <button type="button" onClick={() => { handleDownloadPng(512); setShowExportMenu(false); }}>
                  Standard (512px)
                </button>
                <button type="button" onClick={() => { handleDownloadPng(2048); setShowExportMenu(false); }}>
                  Ultra 4K Print (2048px)
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="secondary-actions-row">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handlePrint}
            disabled={!payload}
            title="Print or Save directly as PDF"
          >
            <Printer size={15} />
            <span>Print / PDF</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleCopyClipboard}
            disabled={!payload}
          >
            {copied ? <Check size={15} color="var(--success)" /> : <Copy size={15} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleShare}
            disabled={!payload}
          >
            <Share2 size={15} />
            <span>Share</span>
          </button>

          {isPayloadUrl && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleOpenLink}
              title="Test destination in new tab"
            >
              <ExternalLink size={15} />
              <span>Open</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
