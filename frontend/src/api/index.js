import request from '../utils/request'

const entityEndpoint = '/entities'

export const getEntities = data => {
  return request.fetch(entityEndpoint, data)
}