/**
 * Archivo el cual se encarga de realizar las peticiones a la API de Kladi.
 * Contiene una función para obtener los productos.
 * usando axios para realizar las peticiones.
 */
import axios from 'axios';
import { sanitizeProducts } from '../adapters/productAdapters';

const kladiApi = axios.create({
    baseURL: 'https://catalogo-kladi.dev.rombo.microsipnube.com/',
});

export const fetchProducts = async () => {
    const response = await kladiApi.get('/');
    if (response.status !== 200) {
        throw new Error('Error fetching products');
    }
    // Sanitizar los productos antes de retornarlos
    return sanitizeProducts(response.data.__ITEMS__);
};
