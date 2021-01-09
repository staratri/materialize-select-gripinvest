import axios from 'axios'

// Can go to separate profile
const endPoints = {
  BASE_URL: (process.env.VUE_APP_API_BASE_URL || 'http://localhost:3001'),
  TIMEOUT: 3000
}

let axiosInstance

function init(axios, API_CONSTANTS, callback) {
  axiosInstance = axios.create({
    baseURL: API_CONSTANTS.BASE_URL,
    timeout: API_CONSTANTS.TIMEOUT
  })

  axiosInstance.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config
  })

  // Add a response interceptor
  axiosInstance.interceptors.response.use(response => {
    // Do something with response data
    return response
  }, error => {
    console.log(error)
    // Mutate error state
    // const serverErrorCode = 500
    // const { status } = error.response
    // if (status === serverErrorCode) {
    //   callback && callback(error)
    // }
    // Temporarily return of promise, components not required to catch error,
    // Root Component (Supplier Framework) will watch error state and perform desrired actions
    return Promise.reject(error.response)
  })
}

const request = {
  init,
  setHeader(header, post = false) {
    axiosInstance.defaults.headers.post['Content-Type'] = 'application/json'
    if (post) {
      axiosInstance.defaults.headers.post[header.key] = header.value
    } else {
      axiosInstance.defaults.headers.common[header.key] = header.value
    }
  },

  fetch(url, data) {
    return axiosInstance.get(url, {
      params: data
    })
  },

  create(url, data) {
    return axiosInstance.post(url, data)
  },

  update(url, data) {
    return axiosInstance.put(url, data)
  },

  delete(url, id) {
    return axiosInstance.delete(url, { params: { id: id } })
  }
}

request.init(axios, endPoints)

export default request
