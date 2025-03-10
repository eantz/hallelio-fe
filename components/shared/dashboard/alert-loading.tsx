'use client';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import useAlertLoadingStore from "@/stores/alertLoadingStore";
import { LoaderCircle } from "lucide-react";
import { MouseEvent } from "react";

export default function AlertLoading({
  title,
  message = 'Processing request...',
  afterActionMessage = 'Success processing request.',
  closeDelay = 2
}: {
  title: string,
  message?: string,
  afterActionMessage?: string,
  closeDelay?: number
}) {
  const {open, loading, onAction, closeConfirmation} = useAlertLoadingStore()

  const handleActionClick = (e:  MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    closeConfirmation()
  }

  const handleOpenChange = (isOpen: boolean) => {
    console.log('is open : ' + isOpen)
    if (isOpen) {
      // onAction()
      console.log('trigger action')
    } else {
      closeConfirmation();
    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="flex">
            <LoaderCircle className="h-4 w-4 animate-spin mr-3" />
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleActionClick} disabled={loading}>Close</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}