const ENV = import.meta.env.VITE_API_BASE || 'https://timegen.onrender.com'
const API_HOST = ENV.replace(/\/$/, '')
export const API_BASE = API_HOST.endsWith('/api') ? API_HOST : `${API_HOST}/api`
export const API_HOST_ONLY = API_HOST

export default API_BASE
