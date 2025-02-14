'use client';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import useAlertDeleteStore from "@/stores/alertDeleteStore";
import { MouseEvent } from "react";

export default function AlertDelete() {
  const {open, loading, onAction, closeConfirmation} = useAlertDeleteStore()

  const handleActionClick = (e:  MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    onAction()
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={closeConfirmation}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure to delete this data?</AlertDialogTitle>
          <AlertDialogDescription>
            {loading ? "Delete in progress..." : "This action cannot be undone."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleActionClick} disabled={loading}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}