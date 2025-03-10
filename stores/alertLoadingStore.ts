import { create } from 'zustand'

interface AlertLoadingState {
  open: boolean;
  loading: boolean,
  setOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  onAction: () => void;
}

interface AlertLoadingActions {
  openConfirmation: (data: {
    onAction: () => void;
    onCancel: () => void;
  }) => void;
  closeConfirmation: () => void;
}

const useAlertLoadingStore = create<AlertLoadingState & AlertLoadingActions>((set) => ({
  open: false,
  loading: false,
  setOpen: (open) => set(() => ({open: open})),
  setLoading: (loading) => set(() => ({loading: loading})),
  onAction: () => {},
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
    })),
}))

export default useAlertLoadingStore;