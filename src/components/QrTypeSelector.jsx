import React from 'react';
import {
  Globe,
  Wifi,
  UserSquare2,
  Mail,
  Phone,
  MessageSquare,
  MessageCircle,
  FileText
} from 'lucide-react';
import { QR_TYPES } from '../constants/qrTypes';

const ICON_MAP = {
  Globe,
  Wifi,
  UserSquare2,
  Mail,
  Phone,
  MessageSquare,
  MessageCircle,
  FileText
};

export default function QrTypeSelector({ activeType, onChangeType }) {
  return (
    <div className="type-selector-wrapper">
      <div className="type-selector-scroll">
        {QR_TYPES.map((type) => {
          const IconComp = ICON_MAP[type.icon] || Globe;
          const isActive = activeType === type.id;
          return (
            <button
              key={type.id}
              type="button"
              className={`type-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => onChangeType(type.id)}
            >
              <IconComp size={16} />
              <span>{type.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

