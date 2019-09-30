export default function({ baseUrl }, entities) {
  let res = {}

  Object.keys(entities).forEach(entity => {
    res[entity] = pk => {
      const { onMember = {}, onCollection = {} } = entities[entity]
      if (pk) {
        const memberURL = buildUrl(baseUrl, entity, pk)
        return {
          fetch: async () => jsonCall('GET', memberURL),
          update: async data => jsonCall('PATCH', memberURL, data),
          del: async () => jsonCall('DELETE', memberURL),
          ...customActions(onMember, memberURL),
        }
      } else {
        const colUrl = buildUrl(baseUrl, entity)
        return {
          fetch: async queryParams => jsonCall('GET', colUrl, queryParams),
          create: async data => jsonCall('POST', colUrl, data),
          ...customActions(onCollection, colUrl),
        }
      }
    }
  })

  return res
}

function customActions(actions, base) {
  return Object.keys(actions).reduce((acc, m) => {
    const name = actions[m]
    acc[name] = data => jsonCall(m, `${base}${name}`, data)
    return acc
  }, {})
}

async function jsonCall(method, initialUrl, data = {}, headers = {}) {
  const response = await apiCall(method, initialUrl, data, headers)
  const json = await response.json()
  return json
}

async function apiCall(method, initialUrl, data = null, headers = {}) {
  let config = {
    method, // *GET, POST, PUT, DELETE, etc.
    // mode: 'cors', // no-cors, *cors, same-origin
    // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    // redirect: 'follow', // manual, *follow, error
    // referrer: 'no-referrer', // no-referrer, *client
  }

  const url =
    method === 'GET' && Object.keys(data).length > 0
      ? `${initialUrl}?${query(data)}`
      : initialUrl

  if (method === 'POST' || method === 'PATCH' || method === 'PUT') {
    config = { ...config, body: JSON.stringify(data) }
  }

  return await fetch(url, config)
}

function query(data) {
  return Object.keys(data)
    .map(k => `${k}=${data[k]}`)
    .join('&')
}

function buildUrl(baseUrl, entity, pk = null) {
  const url = `${noSlash(baseUrl)}/${entity}/`
  if (pk) {
    return `${url}${pk}/`
  }
  return url
}

function noSlash(base) {
  return base.endsWith('/') ? base.substring(0, base.length - 1) : base
}
