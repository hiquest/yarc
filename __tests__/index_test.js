import yarc from '../src/index'

describe('YARC', () => {
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
    expect(args).toEqual([
      'https://google.com/api/users/',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ])
  })

  it('fetches the list of users with params', () => {
    api.users().fetch({ page: 1, limit: 10 })

    expect(fetch.mock.calls.length).toEqual(1)
    const args = fetch.mock.calls[0]
    expect(args).toEqual([
      'https://google.com/api/users/?page=1&limit=10',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ])
  })

  it('fetches a user', () => {
    api.users(1).fetch()

    expect(fetch.mock.calls.length).toEqual(1)
    const args = fetch.mock.calls[0]
    expect(args).toEqual([
      'https://google.com/api/users/1/',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ])
  })

  it('update a user', () => {
    api.users(1).update({ name: 'John' })

    expect(fetch.mock.calls.length).toEqual(1)
    const args = fetch.mock.calls[0]
    expect(args).toEqual([
      'https://google.com/api/users/1/',
      {
        method: 'PATCH',
        body: '{"name":"John"}',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ])
  })

  it('delete a user', () => {
    api.users(1).del()

    expect(fetch.mock.calls.length).toEqual(1)
    const args = fetch.mock.calls[0]
    expect(args).toEqual([
      'https://google.com/api/users/1/',
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ])
  })

  it('create a user', () => {
    api.users().create({ name: 'John' })

    expect(fetch.mock.calls.length).toEqual(1)
    const args = fetch.mock.calls[0]
    expect(args).toEqual([
      'https://google.com/api/users/',
      {
        method: 'POST',
        body: '{"name":"John"}',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ])
  })
})

function fetchIml() {
  return {
    json: async () => {},
  }
}
