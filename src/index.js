export default function({ baseUrl }, entities) {
  let res = {}

  Object.keys(entities).forEach(entity => {
    res[entity] = pk => {
      if (pk) {
        return {
          fetch: async () => apiCall('GET', `${baseUrl}/${entity}/${pk}`),
          update: async data =>
            apiCall('PATCH', `${baseUrl}/${entity}/${pk}`, data),
          del: async () => apiCall('DELETE', `${baseUrl}/${entity}/${pk}`),
        }
      } else {
        return {
          fetch: async () => apiCall('GET', `${baseUrl}/${entity}`),
          create: async data => apiCall('POST', `${baseUrl}/${entity}`, data),
        }
      }
    }
  })

  return res
}

async function apiCall(method, url, data = null) {
  let config = { method }

  if (data) {
    config = {
      ...config,
      body: JSON.stringify(data),
    }
  }

  return await fetch(url, config)
}
