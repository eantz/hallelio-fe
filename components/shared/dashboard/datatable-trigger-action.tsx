'use client';

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import useAlertLoadingStore from "@/stores/alertLoadingStore";

export function DataTableTriggerAction({
  onAction,
  actionData = {},
  label = 'Action'
}: {
  onAction: (data: any) => Promise<string>,
  actionData?: any
  label?: string
}) {

  const { setOpen, setLoading, setErrorMessage, openConfirmation } = useAlertLoadingStore()


  const handleTriggerAction = async () => {
    openConfirmation({
      onCancel: () => {
        setOpen(false)
      },
      
    })

    setLoading(true)
    setOpen(true)
    
    const error = await onAction(actionData)
    if (error !== '') {
      setLoading(false)
      setErrorMessage(error)
    } else {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
      <DropdownMenuItem 
        className="cursor-pointer"
        onClick={() => {
          handleTriggerAction()
        }}
      >
        {label}
      </DropdownMenuItem>
    </>
  )
}