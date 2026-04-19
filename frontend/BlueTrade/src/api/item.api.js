import axios from 'axios';

export const getItems = async () => {
    return axios.get('http://127.0.0.1:8000/item/test/items/')
}