import { Trainer, Sport, Session } from '@server/entities'
import { createTestDatabase } from '@tests/utils/database'
import {
  fakeSport,
  fakeTrainer,
  fakeSession,
} from '@server/entities/tests/fakes'
import { checkSessionOverlap } from './service'

const db = await createTestDatabase()

await db.getRepository(Trainer).save([fakeTrainer(), fakeTrainer()])
await db.getRepository(Sport).save([fakeSport(), fakeSport()])

describe('checkSessionOverlap', () => {
  it('should throw an error if session starts and ends at the same time', async () => {
    await db.getRepository(Session).save(
      fakeSession({
        sportId: 1,
        trainerId: 1,
        date: '2024-02-24',
        timeStart: '10:00',
        timeEnd: '11:00',
      })
    )

    await expect(
      checkSessionOverlap(
        fakeSession({
          sportId: 1,
          trainerId: 1,
          date: '2024-02-24',
          timeStart: '10:00',
          timeEnd: '11:00',
        }),
        db
      )
    ).rejects.toThrow(/overlaps/)
  })

  it('should throw an error if session starts in between an existing session', async () => {
    await db.getRepository(Session).save(
      fakeSession({
        sportId: 1,
        trainerId: 1,
        date: '2024-02-24',
        timeStart: '10:00',
        timeEnd: '11:00',
      })
    )

    await expect(
      checkSessionOverlap(
        fakeSession({
          sportId: 1,
          trainerId: 1,
          date: '2024-02-24',
          timeStart: '10:30',
          timeEnd: '11:30',
        }),
        db
      )
    ).rejects.toThrow(/overlaps/)
  })

  it('should not throw an error if there is no overlapping session', async () => {
    await db.getRepository(Session).save(
      fakeSession({
        sportId: 1,
        trainerId: 1,
        date: '2024-02-24',
        timeStart: '10:00',
        timeEnd: '11:00',
      })
    )

    await expect(
      checkSessionOverlap(
        fakeSession({
          sportId: 1,
          trainerId: 1,
          date: '2024-02-24',
          timeStart: '11:00',
          timeEnd: '12:00',
        }),
        db
      )
    ).resolves.not.toThrow()
  })

  it('should not throw an error if overlapping session has other trainer', async () => {
    await db.getRepository(Session).save(
      fakeSession({
        sportId: 1,
        trainerId: 1,
        date: '2024-02-24',
        timeStart: '10:00',
        timeEnd: '11:00',
      })
    )

    await expect(
      checkSessionOverlap(
        fakeSession({
          sportId: 1,
          trainerId: 2,
          date: '2024-02-24',
          timeStart: '10:00',
          timeEnd: '11:00',
        }),
        db
      )
    ).resolves.not.toThrow()
  })

  it('should not throw an error if overlapping session is from another date', async () => {
    await db.getRepository(Session).save(
      fakeSession({
        sportId: 1,
        trainerId: 1,
        date: '2024-02-24',
        timeStart: '10:00',
        timeEnd: '11:00',
      })
    )

    await expect(
      checkSessionOverlap(
        fakeSession({
          sportId: 1,
          trainerId: 1,
          date: '2024-02-25',
          timeStart: '10:30',
          timeEnd: '11:30',
        }),
        db
      )
    ).resolves.not.toThrow()
  })
})
