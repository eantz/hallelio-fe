'use client';

import { ResponseObject } from "@/lib/http";
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import { use, useState } from "react";
import { registerAttendance } from "./actions";
import { attendanceSchema } from "../../../schema";
import { format, parse } from "date-fns";

export default function ScannerContainer({
  event,
}:{
  event: Promise<ResponseObject>
}) {

  const [attendanceList, setAttendanceList] = useState<string[]>([]);

  const eventData = use(event);

  const handleScan = async (barcodeData: IDetectedBarcode) => {
    console.log(barcodeData)

    const params = attendanceSchema.safeParse({
      event_occurence_id: eventData.data?.id,
      attendance_type: "member",
      attendance_time: new Date(),
      member_id: barcodeData.rawValue,
      guest_name: null,
    })

    if (!params.success) {
      console.error(params.error);
      return;
    }

    const resp = await registerAttendance(params.data)
    if (resp.status !== "success") {
      console.error(resp.message);
      return;
    }

    const member_name = resp.data?.member.first_name + " " + resp.data?.member.last_name
    
    setAttendanceList((prev) => {
      if (prev.includes(member_name)) {
        return [...prev]
      } else {
        return [...prev, member_name]
      }
    });
    
  }

  const start_time = parse(eventData.data?.event.start_time, 'yyyy-MM-dd HH:mm:ss', new Date())
  const end_time = parse(eventData.data?.event.end_time, 'yyyy-MM-dd HH:mm:ss', new Date())

  return (
    <div className="pt-4">
      <h2>
        <span className="font-bold">{eventData.data?.event.title}</span> -&nbsp;
        <span className="text-gray-500 text-sm">{format(start_time, 'yyyy-MM-dd HH:mm')} - {format(end_time, 'HH:mm')}</span>
        
      </h2>

      <div className="flex flex-row w-full mt-4 gap-4">
        <div className="w-[600px] h-[600px]">
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
        <div className="w-1/4 h-[600px]"> 
          <h3>Attendance List</h3>

          <div className="h-full overflow-y-scroll p-2">
            {attendanceList.map((name, index) => (
              <div key={index} className="bg-gray-100 p-2 rounded-md mb-2">
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      
    </div>
  )
}