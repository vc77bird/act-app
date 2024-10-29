import axios from 'axios';

let baseURL = 'http://127.0.0.1:8001/'
// let baseURL = 'http://oncore-ontrack.umms.umm.edu:8800/'

try {
    if (import.meta.env.VITE_API_URL)
        baseURL = import.meta.env.VITE_API_URL
} catch (error) {
    console.log('Error', error)
}
console.log(baseURL)

const api = axios.create({
    baseURL: baseURL,
});

export default api;