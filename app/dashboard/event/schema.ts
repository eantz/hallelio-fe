import { z } from "zod"

export type Event = {
  id: string,
  event_type: string,
  title: string,
  description: string,
  location: string,
  start_time: string,
  end_time: string
}

export const EventTypes = ['sunday_service', 'kids_sunday_service', 'cell_group', 'community'] as const
export const EventTypeString: Record<string, string> = {
  'sunday_service': 'Sunday Service',
  'kids_sunday_service': 'Kids Sunday Service',
  'cell_group': 'Cell Group',
  'community': 'Community'
}

export const RecurrenceTypes = ['daily', 'weekly', 'monthly'] as const

export const eventSchema = z.object({
  id: z.string(),
  event_type: z.enum(EventTypes),
  title: z.string().max(255),
  description: z.string(),
  location: z.string().max(255),
  start_time: z.date(),
  end_time: z.date(),
  is_recurring: z.boolean(),
  recurrence: z.object({
    recurrence_type: z.enum(RecurrenceTypes),
    start_date: z.date(),
    end_date: z.date(),
    interval: z.number()
  }).nullable()
})

export const formInitialState = {
  id: "",
  event_type: EventTypes[0],
  title: "",
  description: "",
  location: "",
  start_time: new Date(),
  end_time: new Date(),
  is_recurring: false,
  recurrence: {
    recurrence_type: RecurrenceTypes[0],
    start_date: new Date(),
    end_date: new Date(),
    interval: 1
  }
}