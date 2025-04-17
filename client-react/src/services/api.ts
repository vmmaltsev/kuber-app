import axios from 'axios';

export const fetchCurrentTime = (api: string) => axios.get(api).then(res => res.data); 