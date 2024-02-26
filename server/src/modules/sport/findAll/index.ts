import { Sport } from '@server/entities'
import { adminProcedure } from '@server/trpc/adminProcedure'

export default adminProcedure.query(async ({ ctx: { db } }) => {
  const sports = await db.getRepository(Sport).find()

  return sports
})
