'use client';

import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import useAlertLoadingStore from "@/stores/alertLoadingStore";
import { LoaderCircle } from "lucide-react";
import { MouseEvent } from "react";

export default function AlertLoading({
  title,
}: {
  title: string,
  afterActionMessage?: string,
  closeDelay?: number
}) {
  const {open, loading, message, errorMessage, closeConfirmation} = useAlertLoadingStore()

  const handleActionClick = (e:  MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    closeConfirmation()
  }

  return (
    <AlertDialog
      open={open}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="flex">
            {loading ? <LoaderCircle className="h-4 w-4 animate-spin mr-3" /> : ''}
            {errorMessage === '' ? message : (
              <span className="text-red-600">
                {errorMessage}
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleActionClick} disabled={loading}>Close</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}