export type TimeSlot = { start: string; end: string }

export type LunchSlot = { start: string; end: string }

export type Subject = { code: string; name: string; type: string }

export type Faculty = { abbreviation: string; fullName: string }

export type Coordinator = { name: string; abbreviation: string; phone?: string }

export type Slot = {
  day: string
  startTime: string
  endTime: string
  subjectCode: string
  subjectName: string
  faculty: string[]
  type: string
}

export type UserRef = { _id?: string; name?: string; email?: string }

export type GeneratedTimetable = {
  _id?: string
  id?: string
  prompt: string
  department: string
  semester: string
  section?: string
  room: string
  effectiveDate: string
  timeTableMonth: string
  days: string[]
  timeSlots: TimeSlot[]
  lunchSlot: LunchSlot
  subjects: Subject[]
  facultyList: Faculty[]
  classCoordinator: Coordinator
  classCoCoordinator: Coordinator
  slots: Slot[]
  htmlContent: string
  createdBy?: string | UserRef
  createdAt?: string
  updatedAt?: string
}
