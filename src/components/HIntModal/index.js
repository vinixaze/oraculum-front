import React from 'react';
import Button from '../Button';
import './HintModal.css';

function HintModal({ hint, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">💡 Dica</h2>
        </div>
        
        <div className="modal-body">
          <p className="hint-text">{hint}</p>
        </div>
        
        <div className="modal-footer">
          <Button variant="yellow" onClick={onClose}>
            Voltar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HintModal;