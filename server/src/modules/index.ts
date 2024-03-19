import { router } from '../trpc'
import user from './user'
import trainer from './trainer'
import timeslot from './timeslot'
import sport from './sport'
import session from './session'
import booking from './booking'

export const appRouter = router({
  user,
  trainer,
  timeslot,
  sport,
  session,
  booking,
})

export type AppRouter = typeof appRouter
