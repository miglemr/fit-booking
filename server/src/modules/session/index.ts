import { router } from '@server/trpc'
import createCustom from './createCustom'
import createBySchedule from './createBySchedule'
import cancel from './cancel'
import book from './book'
import cancelBooking from './cancelBooking'
import findByDate from './findByDate'
import findByUserId from './findByUserId'

export default router({
  createCustom,
  createBySchedule,
  cancel,
  book,
  cancelBooking,
  findByDate,
  findByUserId,
})
