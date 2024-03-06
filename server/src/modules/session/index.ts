import { router } from '@server/trpc'
import { createCustom, createBySchedule, cancel } from './admin'
import { book, cancelBooking, findByDate, findByUserId } from './user'

export default router({
  createCustom,
  createBySchedule,
  cancel,
  book,
  cancelBooking,
  findByDate,
  findByUserId,
})
