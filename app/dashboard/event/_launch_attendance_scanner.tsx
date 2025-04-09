'use client';

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import useAlertLoadingStore from "@/stores/alertLoadingStore";
import { eventOccurenceSchema } from "./schema";
import { parse } from "date-fns";
import { registerOccurence } from "./actions";
import { useRouter } from "next/navigation";

export function LaunchAttendanceScanner({
  actionData = {},
}: {
  
  actionData?: any
}) {

  const { setOpen, setLoading, setErrorMessage, openConfirmation } = useAlertLoadingStore()

  const router = useRouter()

  const handleTriggerAction = async () => {
    openConfirmation({
      onCancel: () => {
        setOpen(false)
      },
      
    })

    setLoading(true)
    setOpen(true)
    
    const params = eventOccurenceSchema.safeParse({
      event_id: actionData.event_id,
      occurence_time: parse(actionData.start_time, 'yyyy-MM-dd HH:mm:ss', new Date()),
    })
  
    if (!params.success) {
      let errors = ''
      params.error.issues.map((issue) => {
        errors += issue.message
      })
      setErrorMessage(errors)
      setLoading(false)
      return
    }
  
    const resp = await registerOccurence(params.data)
  
    if (resp.status === 'error') {
      setErrorMessage(resp.message?.message)
      setLoading(false)
      return
    }
  
    router.push(`/dashboard/event/attendance/scanner/${resp.data?.id}`)
    
    setTimeout(() => {
      setLoading(false)
      setOpen(false)
    }, 2000)
    
    
  }

  return (
    <>
      <DropdownMenuItem 
        className="cursor-pointer"
        onClick={() => {
          handleTriggerAction()
        }}
      >
        Attendance Scanner
      </DropdownMenuItem>
    </>
  )
}