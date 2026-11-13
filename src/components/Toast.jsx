import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function Toast({ toast }) {
  if (!toast.show) return null;

  const IconComp = toast.type === 'success' 
    ? CheckCircle2 
    : toast.type === 'danger' 
    ? AlertCircle 
    : Info;

  return (
    <div className={`toast show ${toast.type}`}>
      <span className="toast-icon">
        <IconComp size={16} />
      </span>
      <span>{toast.message}</span>
    </div>
  );
}
