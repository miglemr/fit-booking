import { router } from '@server/trpc'
import book from './book'
import cancel from './cancel'
import findByDate from './findByDate'

export default router({
  book,
  cancel,
  findByDate,
})
