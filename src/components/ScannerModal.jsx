import React, { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import { X, Upload, Camera, Copy, ExternalLink, RefreshCw, Check } from 'lucide-react';

export default function ScannerModal({
  isOpen,
  onClose,
  onLoadScannedValue,
  onNotify
}) {
  const [scanResult, setScanResult] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setScanResult('');
      setCameraError('');
    }
  }, [isOpen]);

  // Stop camera stream
  const stopCamera = () => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Start Camera Stream
  const startCamera = async () => {
    setCameraError('');
    setScanResult('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.play();
        setIsCameraActive(true);
        requestAnimationFrame(tickScan);
      }
    } catch (err) {
      console.error(err);
      setCameraError('Camera access denied or unavailable. You can still upload an image file.');
    }
  };

  // Frame tick for video scanning
  const tickScan = () => {
    if (!videoRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
      animFrameIdRef.current = requestAnimationFrame(tickScan);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert'
    });

    if (code && code.data) {
      setScanResult(code.data);
      stopCamera();
      onNotify('QR Code detected successfully', 'success');
      return;
    }

    animFrameIdRef.current = requestAnimationFrame(tickScan);
  };

  // File Upload Scan
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data) {
          setScanResult(code.data);
          onNotify('QR Code scanned successfully', 'success');
        } else {
          onNotify('No valid QR code detected in this image', 'danger');
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Copy Result
  const handleCopy = () => {
    if (!scanResult) return;
    navigator.clipboard.writeText(scanResult);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    onNotify('Copied to clipboard', 'success');
  };

  if (!isOpen) return null;

  const isUrl = /^https?:\/\//i.test(scanResult);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Camera size={19} className="modal-icon" />
            <h3 className="modal-title">Scan QR Code</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Method Selector */}
          <div className="scan-options-row">
            <button
              type="button"
              className={`btn btn-sm ${isCameraActive ? 'btn-primary' : 'btn-secondary'}`}
              onClick={isCameraActive ? stopCamera : startCamera}
            >
              <Camera size={15} />
              <span>{isCameraActive ? 'Stop Camera' : 'Scan with Camera'}</span>
            </button>

            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={15} />
              <span>Upload Image File</span>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </button>
          </div>

          {cameraError && (
            <p className="scanner-error-text">{cameraError}</p>
          )}

          {/* Camera Viewport */}
          {isCameraActive && (
            <div className="camera-viewport-wrap">
              <video ref={videoRef} className="camera-video" />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <div className="camera-reticle">
                <div className="reticle-corner tl"></div>
                <div className="reticle-corner tr"></div>
                <div className="reticle-corner bl"></div>
                <div className="reticle-corner br"></div>
              </div>
            </div>
          )}

          {/* Scan Result Card */}
          {scanResult ? (
            <div className="scan-result-card">
              <div className="result-label">Decoded Payload:</div>
              <div className="result-text">{scanResult}</div>

              <div className="result-actions">
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={handleCopy}
                >
                  {isCopied ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>

                {isUrl && (
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={() => window.open(scanResult, '_blank', 'noopener,noreferrer')}
                  >
                    <ExternalLink size={14} />
                    <span>Open URL</span>
                  </button>
                )}

                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={() => {
                    onLoadScannedValue(scanResult);
                    onClose();
                  }}
                >
                  <RefreshCw size={14} />
                  <span>Use This Data</span>
                </button>
              </div>
            </div>
          ) : (
            !isCameraActive && (
              <div
                className="dropzone-area"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={30} style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Upload or drop an image</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Supports PNG, JPEG, SVG, WebP with QR codes
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
