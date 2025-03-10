import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import useAlertDeleteStore from "@/stores/alertDeleteStore";
import useAlertLoadingStore from "@/stores/alertLoadingStore";
import { redirect } from "next/navigation";

export function RegenerateQRCode({
  id
}: {
  id: string,
}) {

  const { setOpen, setLoading, openConfirmation } = useAlertLoadingStore()

  const handleRegenerateQRCode = async() => {
    console.log('yes')
  }

  return (
    <>
      <DropdownMenuItem 
        className="cursor-pointer"
        onClick={() => {
          openConfirmation({
            onAction: handleRegenerateQRCode,
            onCancel: () => {}
          })
        }}
      >
        Regenerate QR Code
      </DropdownMenuItem>
    </>
  )
}