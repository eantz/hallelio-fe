import { create } from 'zustand'

interface AlertLoadingState {
  open: boolean;
  loading: boolean,
  message: string,
  errorMessage: string,
  setOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  setMessage: (message: string) => void;
  setErrorMessage: (errorMessage: string) => void;
}

interface AlertLoadingActions {
  openConfirmation: (data: {
    onCancel: () => void;
  }) => void;
  closeConfirmation: () => void;
}

const useAlertLoadingStore = create<AlertLoadingState & AlertLoadingActions>((set) => ({
  open: false,
  loading: false,
  message: 'Processing request...',
  errorMessage: '',
  setOpen: (open) => set(() => ({open: open})),
  setLoading: (loading) => set(() => ({loading: loading})),
  setMessage: (message) => set(() => ({message: message})),
  setErrorMessage: (errorMessage) => set(() => ({errorMessage: errorMessage})),
  openConfirmation: (data) => 
    set(() => ({
      open: true,
      loading: false,
      errorMessage: '',
      onCancel: data.onCancel
    })),
  closeConfirmation: () =>
    set(() => ({
      open: false,
      loading: false,
      onCancel: () => {}
    })),
}))

export default useAlertLoadingStore;