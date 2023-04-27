import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
    config => {
      // 删除 GET 请求中的空查询参数
      if (config.method === 'get') {
        const queryParameters = config.params;
        let filteredParameters = {};

        for (let key in queryParameters) {
          const value = queryParameters[key];
          if (value !== null && value !== undefined && value !== "") {
            filteredParameters[key] = value;
          }
        }
        config.params = filteredParameters;
      }

      // 删除 POST 请求中的 FormData 中的空数据
      if (config.method === 'post' && config.headers["Content-Type"] === "multipart/form-data") {
        const formData = config.data;
        let filteredData = new FormData();

        for (let entry of formData.entries()) {
          const key = entry[0];
          const value = entry[1];
          if (value !== null && value !== undefined && value !== "") {
            filteredData.append(key, value);
          }
        }
        config.data = filteredData;
      }

      if (store.getters.token) {
        config.headers['Authorization'] = 'Bearer ' + getToken()
      }
      return config
    },
    error => {
      console.log(error) // for debug
      return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    response => {
      const res = response.data
      return res
    },
    error => {
      console.log('err' + error) // for debug
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
)

export default service
