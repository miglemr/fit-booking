import { Session, Trainer, Sport, User } from '@server/entities'
import { createCallerFactory } from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import {
  fakeAdmin,
  fakeSession,
  fakeSport,
  fakeTrainer,
  fakeUser,
} from '@server/entities/tests/fakes'
import { authContext } from '@tests/utils/context'
import * as sendEmail from '@server/modules/sendEmail'
import sessionRouter from '../../index'
import { generateEmailContent } from './service'

const db = await createTestDatabase()
const sessionRepository = db.getRepository(Session)

const createCaller = createCallerFactory(sessionRouter)

const { cancel } = createCaller(authContext({ db }, fakeAdmin()))

vi.mock('@server/modules/sendEmail', () => ({ default: vi.fn() }))

const [user, userOther] = await db
  .getRepository(User)
  .save([fakeUser(), fakeUser()])

await db.getRepository(Trainer).save([fakeTrainer(), fakeTrainer()])
await db.getRepository(Sport).save([fakeSport(), fakeSport()])

await sessionRepository.save([
  fakeSession({
    sportId: 1,
    trainerId: 1,
    users: [user, userOther],
  }),
])

it('should cancel a session', async () => {
  const sendEmailSpy = vi.spyOn(sendEmail, 'default')

  await cancel({ id: 1 })

  const session = await db.getRepository(Session).findOneOrFail({
    where: { id: 1 },
    relations: {
      users: true,
    },
  })
  expect(session.isCancelled).toEqual(true)
  expect(session.users).toHaveLength(0)
  expect(sendEmailSpy).toBeCalledTimes(2)
  expect(sendEmailSpy).toHaveBeenCalledWith(
    user.email,
    generateEmailContent(user.firstName, session)
  )
  expect(sendEmailSpy).toHaveBeenCalledWith(
    userOther.email,
    generateEmailContent(userOther.firstName, session)
  )
})
