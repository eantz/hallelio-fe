'use client';

import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import { useEffect, useRef, useState } from "react";
import { registerAttendance } from "./actions";
import { attendanceListType, attendanceSchema } from "../../../schema";
import { parse } from 'date-fns';
import AlertLoading from '@/components/shared/dashboard/alert-loading';
import useAlertLoadingStore from '@/stores/alertLoadingStore';
import GuestForm from './_guest_form';



export default function ScannerContainer({
  eventOccurenceId,
}:{
  eventOccurenceId: number
}) {

  const { setOpen, setErrorMessage, openConfirmation } = useAlertLoadingStore()

  const [attendanceList, setAttendanceList] = useState<Record<string, attendanceListType>>({});

  const attendanceListRef = useRef<null | HTMLDivElement>(null)

  const handleScan = async (barcodeData: IDetectedBarcode) => {
    console.log(barcodeData)

    openConfirmation({
      onCancel: () => {
        setOpen(false)
      },
    })

    const params = attendanceSchema.safeParse({
      event_occurence_id: eventOccurenceId,
      attendance_type: "member",
      attendance_time: new Date(),
      member_id: barcodeData.rawValue,
      guest_name: null,
    })

    if (!params.success) {
      let errors = ''
      params.error.issues.map((issue) => {
        errors += issue.message
      })
      setErrorMessage(errors)
      return;
    }

    const resp = await registerAttendance(params.data)
    if (resp.status !== "success") {
      setErrorMessage(resp.message?.error);
      return;
    }

    const newAttendanceList = {
      memberId: resp.data?.member.id,
      memberName: resp.data?.member.first_name + " " + resp.data?.member.last_name,
      attendanceTime: parse(resp.data?.attended_at, 'yyyy-MM-dd HH:mm:ss', new Date()),
      attendanceType: resp.data?.attendance_type,
      guestName: resp.data?.guest_name,
    }
    
    updateAttendanceList(newAttendanceList)
    
    setOpen(false)
  }

  const updateAttendanceList = (newAttendance: attendanceListType) => {

    let key: string = newAttendance.memberId
    if (newAttendance.attendanceType === 'guest') {
      key = 'guest-' + Math.floor(Date.now() / 1000)
    }

    setAttendanceList((prev) => {
        return {
          ...prev,
          [key]: newAttendance
        }
    });
  }

  useEffect(() => {
    const domNode = attendanceListRef.current;
    if (domNode) {
      domNode.scrollTop = domNode.scrollHeight;
    }
    
  }, [attendanceList])

  return (
    <div className="flex flex-row w-full gap-8">
      <div className="min-w-[600px] h-[600px]">
        <Scanner 
          onScan={(data) => {
            handleScan(data[0]);
          }}
          onError={(error) => {
            console.error(error);
          }}
          allowMultiple={true}
          scanDelay={1000}
        />
      </div>

      <div className="h-[565px] flex-auto max-w-[400px]"> 

        <div className="h-full overflow-y-scroll p-4 border border-gray-200 rounded-t-md" ref={attendanceListRef}>
          {Object.keys(attendanceList).length === 0 && (
            <div className="text-gray-500 text-sm">
              No attendance recorded
            </div>
          )}

          {Object.entries(attendanceList).map(([key, attendance]: [string, attendanceListType]) => (
            attendance.attendanceType === 'member' ? (
                <div key={key} className="bg-blue-100 odd:bg-opacity-60 rounded-md p-1 mb-1 text-sm border-b border-blue-600 text-blue-900">
                    {attendance.memberName}
                  </div>
              ) : (
                <div key={key} className="bg-orange-100 odd:bg-opacity-60 rounded-md p-1 mb-1 text-sm border-b border-orange-600 text-orange-900">
                  {attendance.guestName}
                </div>
              )
          ))}
        </div>

        <GuestForm
          eventOccurenceId={eventOccurenceId}
          onSuccessAddAttendance={updateAttendanceList}
        />
      </div>

      <AlertLoading 
        title="Processing..."
      />
    </div>
  )
}