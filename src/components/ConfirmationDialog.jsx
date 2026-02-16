import React from 'react';
import { Check, X } from 'lucide-react';
import '../styles/ConfirmationDialog.css';

export const ConfirmationDialog = ({ 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  isDangerous = true 
}) => {
  return (
    <div className="confirmation-overlay">
      <div className="confirmation-dialog">
        <div className="confirmation-header">
          <h2>{title}</h2>
        </div>
        <div className="confirmation-body">
          <p>{message}</p>
        </div>
        <div className="confirmation-footer">
          <button 
            className="confirmation-btn cancel-btn"
            onClick={onCancel}
          >
            <X size={16} />
            {cancelText}
          </button>
          <button 
            className={`confirmation-btn confirm-btn ${isDangerous ? 'dangerous' : ''}`}
            onClick={onConfirm}
          >
            <Check size={16} />
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
