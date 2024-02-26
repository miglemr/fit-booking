import { router } from '../trpc'
import user from './user'
import trainer from './trainer'
import timeslot from './timeslot'
import sport from './sport'
import session from './session'

export const appRouter = router({
  user,
  trainer,
  timeslot,
  sport,
  session,
})

export type AppRouter = typeof appRouter
