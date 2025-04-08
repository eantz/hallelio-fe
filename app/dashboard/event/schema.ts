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
  exception_event_id: string | null
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

export const attendanceSchema = z.object({
  event_occurence_id: z.number(),
  attendance_time: z.date(),
  attendance_type: z.enum(['member', 'guest']),
  member_id: z.string().nullable(),
  guest_name: z.string().max(255).nullable(),
})