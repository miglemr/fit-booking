import { router } from '@server/trpc'
import create from './create'
import cancel from './cancel'
import book from './book'
import cancelBooking from './cancelBooking'
import findByDate from './findByDate'
import findByUserId from './findByUserId'

export default router({
  create,
  cancel,
  book,
  cancelBooking,
  findByDate,
  findByUserId,
})
