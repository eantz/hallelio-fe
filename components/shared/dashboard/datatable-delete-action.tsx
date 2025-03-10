import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import useAlertDeleteStore from "@/stores/alertDeleteStore";
import { redirect } from "next/navigation";

export function DataTableDeleteAction({
  deleteEndpoint,
  deleteParams
}: {
  deleteEndpoint: string,
  deleteParams: any
}) {

  const { setOpen, setLoading, openConfirmation } = useAlertDeleteStore()

  const handleDeleteAction = async() => {
    setLoading(true)
    
    const resp = await fetch(deleteEndpoint, {
      method: 'DELETE',
      body: JSON.stringify(deleteParams)
    })

    console.log(resp)

    setLoading(false)
    setOpen(false)
    redirect('/dashboard/user')
  }

  return (
    <>
      <DropdownMenuItem 
        className="text-red-600 focus:text-red-700 cursor-pointer"
        onClick={() => {
          openConfirmation({
            onAction: handleDeleteAction,
            onCancel: () => {}
          })
        }}
      >
        Delete
      </DropdownMenuItem>
    </>
  )
}