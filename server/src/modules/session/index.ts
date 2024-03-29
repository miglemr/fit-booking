import { router } from '@server/trpc'
import cancel from './cancel'
import createBySchedule from './createBySchedule'
import createCustom from './createCustom'
import findByDate from './findByDate'

export default router({
  cancel,
  createBySchedule,
  createCustom,
  findByDate,
})
