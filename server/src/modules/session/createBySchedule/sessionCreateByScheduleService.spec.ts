import { Trainer, Sport, Session } from '@server/entities'
import { createTestDatabase } from '@tests/utils/database'
import {
  fakeSport,
  fakeTrainer,
  fakeSession,
} from '@server/entities/tests/fakes'
import { isSessionOverlap } from './service'

const db = await createTestDatabase()

await db.getRepository(Trainer).save([fakeTrainer(), fakeTrainer()])
await db.getRepository(Sport).save([fakeSport(), fakeSport()])

describe('isSessionOverlap', () => {
  it('should return true if there is an overlapping session', async () => {
    await db.getRepository(Session).save(
      fakeSession({
        sportId: 1,
        trainerId: 1,
        date: '2024-02-24',
        timeStart: '10:00',
        timeEnd: '11:00',
      })
    )

    const result = await isSessionOverlap(
      fakeSession({
        sportId: 1,
        trainerId: 1,
        date: '2024-02-24',
        timeStart: '10:00',
        timeEnd: '11:00',
      }),
      db
    )

    expect(result).toBe(true)
  })

  it('should return false if there are no overlapping session', async () => {
    const result = await isSessionOverlap(
      fakeSession({
        sportId: 1,
        trainerId: 1,
        date: '2024-02-24',
        timeStart: '14:00',
        timeEnd: '15:00',
      }),
      db
    )

    expect(result).toBe(false)
  })
})
