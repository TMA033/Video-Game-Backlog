import {useEffect, useRef } from 'react';
import './Modal.css';


export default function Modal({isOpen, onClose, children}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    isOpen ? dialog.showModal() : dialog.close();
  }, [isOpen]);

  const handleCancel = (event) => {
    event.preventDefault();
    onClose();
  }

  return (
    <dialog ref={dialogRef} onCancel={handleCancel} className="universal-modal" closedby="any">
      <div className='universal-modal-content'>
        <button className='universal-close-btn' onClick={onClose}>&times;</button>
        {children}
      </div>
    </dialog>
  )
}