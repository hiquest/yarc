import yarc from '../src/index'

// single user
// api.users(1).fetch()

// create a user
// api.users().create({ name: 'John' })

// update a user
// api.users(1).update({ name: 'John' })

// delete a user
// api.users(1).del()

describe('YARC librariry', () => {
  let fetch

  const api = yarc(
    {
      baseUrl: 'https://google.com/api',
    },
    {
      users: {},
    },
  )

  beforeEach(() => {
    fetch = jest.fn()
    global.fetch = fetch.mockImplementation(fetchIml)
  })

  it('fetches the list of users', () => {
    api.users().fetch()

    expect(fetch.mock.calls.length).toEqual(1)
    const args = fetch.mock.calls[0]
    expect(args).toEqual(['https://google.com/api/users', { method: 'GET' }])
  })

  it('fetches a user', () => {
    api.users(1).fetch()

    expect(fetch.mock.calls.length).toEqual(1)
    const args = fetch.mock.calls[0]
    expect(args).toEqual(['https://google.com/api/users/1', { method: 'GET' }])
  })

  it('update a user', () => {
    api.users(1).update({ name: 'John' })

    expect(fetch.mock.calls.length).toEqual(1)
    const args = fetch.mock.calls[0]
    expect(args).toEqual([
      'https://google.com/api/users/1',
      { method: 'PATCH', body: '{"name":"John"}' },
    ])
  })

  it('delete a user', () => {
    api.users(1).del()

    expect(fetch.mock.calls.length).toEqual(1)
    const args = fetch.mock.calls[0]
    expect(args).toEqual([
      'https://google.com/api/users/1',
      { method: 'DELETE' },
    ])
  })

  it('create a user', () => {
    api.users().create({ name: 'John' })

    expect(fetch.mock.calls.length).toEqual(1)
    const args = fetch.mock.calls[0]
    expect(args).toEqual([
      'https://google.com/api/users',
      { method: 'POST', body: '{"name":"John"}' },
    ])
  })
})

function fetchIml() {
  return {
    json: async () => {},
  }
}
