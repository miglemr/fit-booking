import { router } from '@server/trpc'
import create from './create'
import findAll from './findAll'
import update from './update'
import remove from './remove'

export default router({
  create,
  findAll,
  update,
  remove,
})
