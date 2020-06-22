export default create

interface Options {
  baseUrl: string
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type CustomActions<T extends string> = Array<[Method, T]>

type Entities<T extends string, U extends string, V extends string> = {
  [k in T]: Declarations<U, V>
}

type Declarations<K extends string, U extends string> = {
  onMember?: CustomActions<K>
  onCollection?: CustomActions<U>
}

type Data = {
  [key: string]: any
}

function create<T extends string, U extends string, V extends string>(
  { baseUrl }: Options,
  entities: Entities<T, U, V>,
) {
  const keys = Object.keys(entities) as Array<T>
  return keys.reduce(
    (acc, entity) => {
      acc[entity] = prepareEndpoint(baseUrl, entity, entities[entity])
      return acc
    },
    {} as { [k in T]: Endpoint<U, V> },
  )
}

type MemberCalls<T extends string> = {
  [k in T | 'fetch' | 'update' | 'del']: (data?: Data) => Promise<any>
}

type CollectionCalls<T extends string> = {
  [k in T | 'fetch' | 'create']: (data?: Data) => Promise<any>
}

interface Endpoint<U extends string, V extends string> {
  (): CollectionCalls<V>
  (pk: string | number): MemberCalls<U>
}

function prepareEndpoint<U extends string, V extends string>(
  baseUrl: string,
  endpoint: string,
  { onMember = [], onCollection = [] }: Declarations<U, V>,
): Endpoint<U, V> {
  return (pk?: string | number) => {
    if (pk) {
      const memberURL = buildUrl(baseUrl, endpoint, pk.toString())
      const res: any = {
        fetch: async () => jsonCall('GET', memberURL),
        update: async (data: Data) => jsonCall('PATCH', memberURL, data),
        del: async () => jsonCall('DELETE', memberURL),
        ...customActions(onMember, memberURL),
      }

      // const nkeys = Object.keys(nested)
      // if (nkeys.length > 0) {
      //   nkeys.forEach(n => {
      //     res[n] = prepareEndpoint(memberURL, n, nested[n])
      //   })
      // }

      return res
    } else {
      const colUrl = buildUrl(baseUrl, endpoint)
      return {
        fetch: async (queryParams: object) =>
          jsonCall('GET', colUrl, queryParams),
        create: async (data: Data) => jsonCall('POST', colUrl, data),
        ...customActions(onCollection, colUrl),
      }
    }
  }
}

function customActions<T extends string>(
  actions: CustomActions<T>,
  base: string,
) {
  return actions.reduce(
    (acc, [m, name]) => {
      if (name) {
        acc[name] = (data: Data) => jsonCall(m, `${base}${name}`, data)
        return acc
      }
      return acc
    },
    {} as { [key in T]: { (data: Data): Promise<any> } },
  )
}

async function jsonCall(
  method: Method,
  initialUrl: string,
  data: Data = {},
  headers = {},
): Promise<any> {
  const response = await apiCall(method, initialUrl, data, headers)
  const json = await response.json()
  return json
}

async function apiCall(
  method: Method,
  initialUrl: string,
  data: object | null,
  headers: object = {},
): Promise<Response> {
  const heads = {
    'Content-Type': 'application/json',
    ...headers,
  }
  let config: any = {
    method, // *GET, POST, PUT, DELETE, etc.
    // mode: 'cors', // no-cors, *cors, same-origin
    // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: 'same-origin', // include, *same-origin, omit
    headers: heads,
    // redirect: 'follow', // manual, *follow, error
    // referrer: 'no-referrer', // no-referrer, *client
  }

  const url =
    method === 'GET' && Object.keys(data || {}).length > 0
      ? `${initialUrl}?${query(data)}`
      : initialUrl

  if (method === 'POST' || method === 'PATCH' || method === 'PUT') {
    config = { ...config, body: JSON.stringify(data) }
  }

  return await fetch(url, config)
}

function query(data: Data | null) {
  const d = data || {}
  return Object.keys(d)
    .map((k: string) => `${k}=${d[k]}`)
    .join('&')
}

function buildUrl(baseUrl: string, entity: string, pk: string | null = null) {
  const url = `${noSlash(baseUrl)}/${entity}/`

  if (pk) {
    return `${url}${pk}/`
  }
  return url
}

function noSlash(base: string) {
  return endsWith(base, '/') ? base.substring(0, base.length - 1) : base
}

function endsWith(str: string, search: string) {
  const length = str.length
  return str.substring(length - search.length, length) === search
}

const api = yarc(
  { baseUrl: '/api/v1/' },
  {
    users: {
      books: {
        onMember: [
          { POST: 'mark_read' }
        ]
      },
      notes: {},
    },
    books: { onCollection: [{ GET: lookup }] },
    notes: { onCollection: [{}] },
  },
)