import React, { useState } from 'react';
import {
  Globe,
  Wifi,
  Lock,
  Eye,
  EyeOff,
  User,
  Building,
  Briefcase,
  Mail,
  Phone,
  MessageSquare,
  MessageCircle,
  FileText,
  X
} from 'lucide-react';

export default function InputForms({
  type,
  formData,
  onChangeField,
  onClear,
  onApplyPreset
}) {
  const [showWifiPass, setShowWifiPass] = useState(false);

  // URL Presets
  const urlPresets = [
    { label: 'Google', val: 'https://google.com' },
    { label: 'GitHub', val: 'https://github.com' },
    { label: 'YouTube', val: 'https://youtube.com' },
    { label: 'Wikipedia', val: 'https://wikipedia.org' },
  ];

  switch (type) {
    case 'url':
      return (
        <div className="form-group">
          <div className="form-label">
            <span>Website Address</span>
            <span className="char-badge">{(formData.url || '').length} characters</span>
          </div>
          <div className="input-wrapper">
            <span className="input-icon">
              <Globe size={18} />
            </span>
            <input
              type="text"
              className="url-input"
              value={formData.url || ''}
              onChange={(e) => onChangeField('url', e.target.value)}
              placeholder="https://example.com"
              autoFocus
            />
            {formData.url && (
              <button
                type="button"
                className="input-clear-btn"
                onClick={() => onClear('url')}
                title="Clear"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="presets-list">
            <span className="preset-label">Quick Presets:</span>
            {urlPresets.map((p) => (
              <button
                key={p.label}
                type="button"
                className="preset-chip"
                onClick={() => onApplyPreset('url', p.val)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      );

    case 'wifi':
      return (
        <div className="form-group">
          <div className="form-row-2">
            <div>
              <label className="form-label">Network Name (SSID) *</label>
              <div className="input-wrapper">
                <span className="input-icon"><Wifi size={18} /></span>
                <input
                  type="text"
                  className="url-input"
                  value={formData.ssid || ''}
                  onChange={(e) => onChangeField('ssid', e.target.value)}
                  placeholder="Network SSID"
                  required
                />
              </div>
            </div>

            <div>
              <label className="form-label">Encryption Type</label>
              <select
                className="select-control"
                value={formData.encryption || 'WPA'}
                onChange={(e) => onChangeField('encryption', e.target.value)}
              >
                <option value="WPA">WPA / WPA2 / WPA3</option>
                <option value="WEP">WEP (Legacy)</option>
                <option value="nopass">None (Open)</option>
              </select>
            </div>
          </div>

          {formData.encryption !== 'nopass' && (
            <div style={{ marginTop: '0.85rem' }}>
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <span className="input-icon"><Lock size={18} /></span>
                <input
                  type={showWifiPass ? 'text' : 'password'}
                  className="url-input"
                  value={formData.password || ''}
                  onChange={(e) => onChangeField('password', e.target.value)}
                  placeholder="Network Key"
                />
                <button
                  type="button"
                  className="input-clear-btn"
                  onClick={() => setShowWifiPass(!showWifiPass)}
                  title={showWifiPass ? 'Hide password' : 'Show password'}
                >
                  {showWifiPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          )}

          <div style={{ marginTop: '0.85rem' }}>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={!!formData.hidden}
                onChange={(e) => onChangeField('hidden', e.target.checked)}
              />
              <span>Hidden Network</span>
            </label>
          </div>
        </div>
      );

    case 'vcard':
      return (
        <div className="form-group">
          <div className="form-row-2">
            <div>
              <label className="form-label">First Name *</label>
              <div className="input-wrapper">
                <span className="input-icon"><User size={18} /></span>
                <input
                  type="text"
                  className="url-input"
                  value={formData.firstName || ''}
                  onChange={(e) => onChangeField('firstName', e.target.value)}
                  placeholder="First name"
                />
              </div>
            </div>
            <div>
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="url-input text-pad"
                value={formData.lastName || ''}
                onChange={(e) => onChangeField('lastName', e.target.value)}
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="form-row-2" style={{ marginTop: '0.85rem' }}>
            <div>
              <label className="form-label">Phone Number</label>
              <div className="input-wrapper">
                <span className="input-icon"><Phone size={18} /></span>
                <input
                  type="tel"
                  className="url-input"
                  value={formData.phone || ''}
                  onChange={(e) => onChangeField('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            <div>
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon"><Mail size={18} /></span>
                <input
                  type="email"
                  className="url-input"
                  value={formData.email || ''}
                  onChange={(e) => onChangeField('email', e.target.value)}
                  placeholder="name@company.com"
                />
              </div>
            </div>
          </div>

          <div className="form-row-2" style={{ marginTop: '0.85rem' }}>
            <div>
              <label className="form-label">Company / Organization</label>
              <div className="input-wrapper">
                <span className="input-icon"><Building size={18} /></span>
                <input
                  type="text"
                  className="url-input"
                  value={formData.org || ''}
                  onChange={(e) => onChangeField('org', e.target.value)}
                  placeholder="Organization"
                />
              </div>
            </div>
            <div>
              <label className="form-label">Job Title</label>
              <div className="input-wrapper">
                <span className="input-icon"><Briefcase size={18} /></span>
                <input
                  type="text"
                  className="url-input"
                  value={formData.title || ''}
                  onChange={(e) => onChangeField('title', e.target.value)}
                  placeholder="Role / Title"
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '0.85rem' }}>
            <label className="form-label">Website</label>
            <div className="input-wrapper">
              <span className="input-icon"><Globe size={18} /></span>
              <input
                type="url"
                className="url-input"
                value={formData.website || ''}
                onChange={(e) => onChangeField('website', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>
        </div>
      );

    case 'email':
      return (
        <div className="form-group">
          <div>
            <label className="form-label">Recipient Email *</label>
            <div className="input-wrapper">
              <span className="input-icon"><Mail size={18} /></span>
              <input
                type="email"
                className="url-input"
                value={formData.email || ''}
                onChange={(e) => onChangeField('email', e.target.value)}
                placeholder="recipient@domain.com"
                required
              />
            </div>
          </div>

          <div style={{ marginTop: '0.85rem' }}>
            <label className="form-label">Subject</label>
            <input
              type="text"
              className="url-input text-pad"
              value={formData.subject || ''}
              onChange={(e) => onChangeField('subject', e.target.value)}
              placeholder="Subject line"
            />
          </div>

          <div style={{ marginTop: '0.85rem' }}>
            <label className="form-label">Message Body</label>
            <textarea
              className="textarea-control"
              rows={3}
              value={formData.body || ''}
              onChange={(e) => onChangeField('body', e.target.value)}
              placeholder="Write pre-filled message..."
            />
          </div>
        </div>
      );

    case 'phone':
      return (
        <div className="form-group">
          <label className="form-label">Phone Number *</label>
          <div className="input-wrapper">
            <span className="input-icon"><Phone size={18} /></span>
            <input
              type="tel"
              className="url-input"
              value={formData.phone || ''}
              onChange={(e) => onChangeField('phone', e.target.value)}
              placeholder="+1 (555) 000-0000"
              required
            />
            {formData.phone && (
              <button
                type="button"
                className="input-clear-btn"
                onClick={() => onClear('phone')}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <p className="field-hint">Phone cameras will prompt to call this number immediately.</p>
        </div>
      );

    case 'sms':
      return (
        <div className="form-group">
          <label className="form-label">Phone Number *</label>
          <div className="input-wrapper">
            <span className="input-icon"><Phone size={18} /></span>
            <input
              type="tel"
              className="url-input"
              value={formData.phone || ''}
              onChange={(e) => onChangeField('phone', e.target.value)}
              placeholder="+1 (555) 000-0000"
              required
            />
          </div>

          <div style={{ marginTop: '0.85rem' }}>
            <label className="form-label">Pre-filled SMS Text</label>
            <textarea
              className="textarea-control"
              rows={3}
              value={formData.message || ''}
              onChange={(e) => onChangeField('message', e.target.value)}
              placeholder="Text message content..."
            />
          </div>
        </div>
      );

    case 'whatsapp':
      return (
        <div className="form-group">
          <label className="form-label">WhatsApp Number (with country code) *</label>
          <div className="input-wrapper">
            <span className="input-icon"><MessageCircle size={18} /></span>
            <input
              type="tel"
              className="url-input"
              value={formData.phone || ''}
              onChange={(e) => onChangeField('phone', e.target.value)}
              placeholder="e.g. 15551234567"
              required
            />
          </div>
          <p className="field-hint">Enter numbers only with country code (e.g. 15551234567 for US, 447123456789 for UK).</p>

          <div style={{ marginTop: '0.85rem' }}>
            <label className="form-label">Pre-filled Message</label>
            <textarea
              className="textarea-control"
              rows={3}
              value={formData.message || ''}
              onChange={(e) => onChangeField('message', e.target.value)}
              placeholder="Hello! Reaching out via your QR code..."
            />
          </div>
        </div>
      );

    case 'text':
    default:
      return (
        <div className="form-group">
          <div className="form-label">
            <span>Plain Text / Note</span>
            <span className="char-badge">{(formData.text || '').length} characters</span>
          </div>
          <textarea
            className="textarea-control"
            rows={5}
            value={formData.text || ''}
            onChange={(e) => onChangeField('text', e.target.value)}
            placeholder="Type or paste any text or note..."
            autoFocus
          />
          {formData.text && (
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={() => onClear('text')}
              style={{ marginTop: '0.5rem' }}
            >
              Clear Text
            </button>
          )}
        </div>
      );
  }
}
