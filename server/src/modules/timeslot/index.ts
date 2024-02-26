import { router } from '@server/trpc'
import create from './create'
import remove from './remove'
import findByDay from './findByDay'

export default router({
  create,
  remove,
  findByDay,
})
