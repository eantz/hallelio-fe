import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import useAlertDeleteStore from "@/stores/alertDeleteStore";
import { useRouter } from "next/navigation";

export function DataTableDeleteAction({
  deleteEndpoint,
  deleteParams,
  label = 'Delete'
}: {
  deleteEndpoint: string,
  deleteParams: any,
  label?: string
}) {

  const { setOpen, setLoading, openConfirmation } = useAlertDeleteStore()

  const router = useRouter();

  const handleDeleteAction = async() => {
    setLoading(true)
    
    const resp = await fetch(deleteEndpoint, {
      method: 'DELETE',
      body: JSON.stringify(deleteParams)
    })

    console.log(resp)

    setLoading(false)
    setOpen(false)

    router.refresh();
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
        {label}
      </DropdownMenuItem>
    </>
  )
}