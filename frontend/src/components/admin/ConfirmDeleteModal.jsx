import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, loading, title, message }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || 'Confirm Delete'}>
      <p className="text-sm text-slate-600">{message || 'This action cannot be undone. Are you sure?'}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" loading={loading} onClick={onConfirm}>Delete</Button>
      </div>
    </Modal>
  );
}
