import { authContext } from '@tests/utils/context'
import { createCallerFactory } from '@server/trpc'
import { fakeAdmin } from '@server/entities/tests/fakes'
import { router } from '..'
import { adminProcedure } from '.'

const routes = router({
  testCall: adminProcedure.query(() => 'passed'),
})

const db = {} as any

const createCaller = createCallerFactory(routes)
const authenticatedAdmin = createCaller(authContext({ db }, fakeAdmin()))

it('should pass if user is admin', async () => {
  const response = await authenticatedAdmin.testCall()

  expect(response).toEqual('passed')
})

it('should not pass if user is not admin', async () => {
  const authenticatedNotAdmin = createCaller(authContext({ db }))

  await expect(authenticatedNotAdmin.testCall()).rejects.toThrow(
    // any authentication-like error
    /login|log in|logged in|authenticate|unauthorized/i
  )
})
