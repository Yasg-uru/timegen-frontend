import axios from 'axios'
import { API_BASE } from './config'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
})

// send cookies by default for auth flows
api.defaults.withCredentials = true

export default api
