import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import useAlertLoadingStore from "@/stores/alertLoadingStore";

export function RegenerateQRCode({
  id
}: {
  id: string,
}) {

  const { setMessage, setLoading, setErrorMessage, openConfirmation, closeConfirmation } = useAlertLoadingStore()

  const handleRegenerateQRCode = async() => {
    openConfirmation({
      onCancel: () => {}
    })

    setLoading(true)

    const resp = await fetch('/api/member/regenerate-qr-code', {
      method: 'POST',
      body: JSON.stringify({
        id: id
      })
    })

    const body = await resp.json()

    if (resp.status === 500) {
      setLoading(false)
      setErrorMessage(body.message.message)
    } else {
      setLoading(false)
      setMessage('Done processing request')
      
        setTimeout(() => {
          closeConfirmation()
        }, 2000)
    }
  }

  return (
    <>
      <DropdownMenuItem 
        className="cursor-pointer"
        onClick={handleRegenerateQRCode}
      >
        Regenerate QR Code
      </DropdownMenuItem>
    </>
  )
}