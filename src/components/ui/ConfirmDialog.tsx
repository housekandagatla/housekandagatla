import { useState } from 'react';
import { Button } from './Button';
import { Drawer } from './Drawer';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  eyebrow?: string;
  error?: string | null;
  busy?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  eyebrow = 'PLEASE CONFIRM',
  error = null,
  busy = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const [working, setWorking] = useState(false);
  const isBusy = busy || working;

  const handleConfirm = async () => {
    setWorking(true);
    try {
      await onConfirm();
    } finally {
      setWorking(false);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={isBusy ? () => undefined : onClose}
      title={title}
      subtitle={description}
      eyebrow={eyebrow}
      className="kds-confirm-dialog"
    >
      {error ? <p className="kds-confirm-error" role="alert">{error}</p> : null}
      <div className="kds-dialog-actions">
        <Button variant="secondary" type="button" onClick={onClose} disabled={isBusy}>
          {cancelLabel}
        </Button>
        <Button variant="danger" type="button" onClick={handleConfirm} disabled={isBusy}>
          {isBusy ? 'Deleting…' : confirmLabel}
        </Button>
      </div>
    </Drawer>
  );
}
