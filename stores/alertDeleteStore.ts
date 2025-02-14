import { create } from 'zustand'

interface AlertDeleteState {
  open: boolean;
  loading: boolean,
  setOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  onAction: () => void;
  onCancel: () => void;
}

interface AlertDeleteActions {
  openConfirmation: (data: {
    onAction: () => void;
    onCancel: () => void;
  }) => void;
  closeConfirmation: () => void;
}

const useAlertDeleteStore = create<AlertDeleteState & AlertDeleteActions>((set) => ({
  open: false,
  loading: false,
  setOpen: (open) => set(() => ({open: open})),
  setLoading: (loading) => set(() => ({loading: loading})),
  onAction: () => {},
  onCancel: () => {},
  openConfirmation: (data) => 
    set(() => ({
      open: true,
      loading: false,
      onAction: data.onAction,
      onCancel: data.onCancel
    })),
  closeConfirmation: () =>
    set(() => ({
      open: false,
      loading: false,
      onAction: () => {},
      onCancel: () => {}
    }))
}))

export default useAlertDeleteStore;