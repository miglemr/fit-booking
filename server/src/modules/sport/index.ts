import { router } from '@server/trpc'
import create from './create'
import remove from './remove'
import findAll from './findAll'

export default router({
  create,
  remove,
  findAll,
})
