import React, { useState, useEffect, useMemo, useRef } from 'react';
import Header from './components/Header';
import QrTypeSelector from './components/QrTypeSelector';
import InputForms from './components/InputForms';
import Customizer from './components/Customizer';
import PreviewCard from './components/PreviewCard';
import ScannerModal from './components/ScannerModal';
import Footer from './components/Footer';
import Toast from './components/Toast';
import { buildQrPayload } from './utils/qrUtils';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem('detla_qr_theme') || 'dark');

  // QR Mode & Form state
  const [activeType, setActiveType] = useState('url');
  const [formData, setFormData] = useState({
    url: 'https://google.com',
    ssid: '',
    password: '',
    encryption: 'WPA',
    hidden: false,
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    org: '',
    title: '',
    website: '',
    subject: '',
    body: '',
    message: '',
    text: ''
  });

  // Customizer styling state
  const [fgColor, setFgColor] = useState('#090d16');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [level, setLevel] = useState('H');
  const [marginSize, setMarginSize] = useState(2);
  const [frameStyle, setFrameStyle] = useState('none');
  const [frameText, setFrameText] = useState('SCAN ME');
  const [logoSrc, setLogoSrc] = useState(null);
  const [logoSize, setLogoSize] = useState(0.22);
  const [excavateLogo, setExcavateLogo] = useState(true);
  const [renderFormat, setRenderFormat] = useState('canvas');
  const [previewDimension, setPreviewDimension] = useState(260);

  // Scanner modal state
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Mobile tab state
  const [mobileTab, setMobileTab] = useState('editor'); // 'editor' | 'preview'

  // Toast state
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const toastTimerRef = useRef(null);

  // Apply Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('detla_qr_theme', theme);
  }, [theme]);

  const notify = (message, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ show: true, message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 2800);
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleChangeField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClearField = (field) => {
    setFormData((prev) => ({ ...prev, [field]: '' }));
  };

  const handleApplyPreset = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    notify(`Loaded preset: ${value}`, 'info');
  };

  // Compute active payload
  const currentPayload = useMemo(() => {
    return buildQrPayload(activeType, formData);
  }, [activeType, formData]);

  // Load scanned value
  const handleLoadScannedValue = (scanned) => {
    const isUrl = /^https?:\/\//i.test(scanned);
    if (isUrl) {
      setActiveType('url');
      setFormData((prev) => ({ ...prev, url: scanned }));
    } else {
      setActiveType('text');
      setFormData((prev) => ({ ...prev, text: scanned }));
    }
    setMobileTab('preview');
    notify('Imported scanned QR payload', 'success');
  };

  return (
    <>
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenScanner={() => setIsScannerOpen(true)}
      />

      <main className="main-content">
        <section className="hero-banner">
          <h2 className="hero-title">Detla Qr Service</h2>
          <p className="hero-desc">
            Free opensource for you. Generate custom, scannable QR codes with instant vector SVG, high-resolution PNG, and PDF print exports.
          </p>
        </section>

        {/* QR Type Selector Tabs */}
        <QrTypeSelector
          activeType={activeType}
          onChangeType={(type) => {
            setActiveType(type);
          }}
        />

        {/* Mobile View Switcher */}
        <div className="mobile-view-tabs" role="tablist">
          <button
            type="button"
            className={`mobile-tab-btn ${mobileTab === 'editor' ? 'active' : ''}`}
            onClick={() => setMobileTab('editor')}
          >
            Configure & Design
          </button>
          <button
            type="button"
            className={`mobile-tab-btn ${mobileTab === 'preview' ? 'active' : ''}`}
            onClick={() => setMobileTab('preview')}
          >
            Live Preview & Export
          </button>
        </div>

        <div className="generator-grid">
          {/* Left Column: Form & Customizer */}
          <div className={`studio-controls-column ${mobileTab === 'preview' ? 'mobile-hidden' : ''}`}>
            <section className="card">
              <InputForms
                type={activeType}
                formData={formData}
                onChangeField={handleChangeField}
                onClear={handleClearField}
                onApplyPreset={handleApplyPreset}
              />
            </section>

            <section className="card" style={{ marginTop: '1.25rem' }}>
              <Customizer
                fgColor={fgColor}
                setFgColor={setFgColor}
                bgColor={bgColor}
                setBgColor={setBgColor}
                level={level}
                setLevel={setLevel}
                marginSize={marginSize}
                setMarginSize={setMarginSize}
                frameStyle={frameStyle}
                setFrameStyle={setFrameStyle}
                frameText={frameText}
                setFrameText={setFrameText}
                logoSrc={logoSrc}
                setLogoSrc={setLogoSrc}
                logoSize={logoSize}
                setLogoSize={setLogoSize}
                excavateLogo={excavateLogo}
                setExcavateLogo={setExcavateLogo}
                renderFormat={renderFormat}
                setRenderFormat={setRenderFormat}
                previewDimension={previewDimension}
                setPreviewDimension={setPreviewDimension}
              />
            </section>
          </div>

          {/* Right Column: Live Interactive Preview */}
          <div className={`studio-preview-column ${mobileTab === 'editor' ? 'mobile-hidden' : ''}`}>
            <PreviewCard
              payload={currentPayload}
              activeType={activeType}
              fgColor={fgColor}
              bgColor={bgColor}
              level={level}
              marginSize={marginSize}
              frameStyle={frameStyle}
              frameText={frameText}
              logoSrc={logoSrc}
              logoSize={logoSize}
              excavateLogo={excavateLogo}
              renderFormat={renderFormat}
              previewDimension={previewDimension}
              onNotify={notify}
            />
          </div>
        </div>
      </main>

      {/* Scanner Modal */}
      <ScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onLoadScannedValue={handleLoadScannedValue}
        onNotify={notify}
      />

      {/* Floating Status Notification */}
      <Toast toast={toast} />

      {/* App Footer with Developer Credits */}
      <Footer />
    </>
  );
}
