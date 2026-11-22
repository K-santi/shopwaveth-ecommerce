import useFetch from './useFetch';
import { getAllProducts } from '../services/api';

export default function useProducts() {
  return useFetch(getAllProducts, 'all-products');
}
