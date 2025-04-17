import { z } from "zod"

export type EventMember = {
  id: string,
  first_name: string,
  last_name: string,
  birth_place: string,
  birth_date: string,
  phone_number: string,
  address: string,
  personal_id_number: string,
  picture: string,
  qr_code: string
}

export type Attendance = {
  id: number,
  event_occurence_id: number,
  attendance_type: string,
  member_id: string,
  guest_name: string,
  attended_at: string,
  member: EventMember,
}

export const attendanceType = ['member', 'guest'] as const

export const attendanceSchema = z.object({
  id: z.number(),
  event_occurence_id: z.number(),
  attendance_time: z.date(),
  attendance_type: z.enum(attendanceType),
  member_id: z.string(),
  guest_name: z.string().max(255),
}).refine((data) => !(data.attendance_type === 'guest' && data.guest_name === ''), {
  message: "Guest Name is required",
  path: ['guest_name']
}).refine((data) => !(data.attendance_type === 'member' && data.member_id === ''), {
  message: "Member is required",
  path: ['member_id']
})

export const guestFormSchema = z.object({
  guest_name: z.string().max(255),
})

export type attendanceListType = {
  memberId: string,
  memberName: string,
  attendanceTime: Date,
  attendanceType: string,
  guestName: string | null,
}