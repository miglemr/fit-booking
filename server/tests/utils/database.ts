import { createDatabase } from '@server/database'
import config from '@server/config'

export async function createTestDatabase() {
  const db = createDatabase(config.database)

  await db.initialize()

  return db
}
