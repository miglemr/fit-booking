import { TRPCError } from '@trpc/server'
import { authenticatedProcedure } from '../authenticatedProcedure'

export function buildAdminProcedure() {
  return authenticatedProcedure.use(({ ctx, next }) => {
    if (!ctx.authUser.isAdmin) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }

    return next()
  })
}
