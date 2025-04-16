import { z } from "zod"

export type Event = {
  id: string,
  event_type: string,
  title: string,
  description: string,
  location: string,
  start_time: string,
  end_time: string,
  is_recurring: boolean,
  exception_event_id: string | null,
  event_occurence_id: number | null
}

export const EventTypes = ['sunday_service', 'kids_sunday_service', 'cell_group', 'community'] as const
export const EventTypeString: Record<string, string> = {
  'sunday_service': 'Sunday Service',
  'kids_sunday_service': 'Kids Sunday Service',
  'cell_group': 'Cell Group',
  'community': 'Community'
}

export const RecurrenceTypes = ['daily', 'weekly', 'monthly'] as const

export const EditModes = ['this', 'this_and_following'] as const
export const EditModeString: Record<string, string> = {
  'this': 'This event only',
  'this_and_following': 'This and following events'
}

export const eventSchema = z.object({
  id: z.number(),
  event_type: z.enum(EventTypes),
  title: z.string().max(255),
  description: z.string(),
  location: z.string().max(255),
  start_time: z.date(),
  end_time: z.date(),
  is_recurring: z.boolean(),
  mode: z.enum(EditModes).nullable(),
  recurrence: z.object({
    recurrence_type: z.enum(RecurrenceTypes),
    start_date: z.date(),
    end_date: z.date(),
    interval: z.number()
  }).nullable()
})

export const formInitialState = {
  id: 0,
  event_type: EventTypes[0],
  title: "",
  description: "",
  location: "",
  start_time: new Date(),
  end_time: new Date(),
  is_recurring: false,
  mode: null,
  recurrence: {
    recurrence_type: RecurrenceTypes[0],
    start_date: new Date(),
    end_date: new Date(),
    interval: 1
  }
}

export const eventOccurenceSchema = z.object({
  event_id: z.number(),
  occurence_time: z.date(),
});

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