import { getEnv } from "./config-utils";

export const BASE_URL = getEnv('BASE_URL');
export const PORT = getEnv('PORT');
export const URL = `${BASE_URL}${PORT ? ':' + PORT : ''}`;
export const LOGIN_URL = `${URL}/admin/login`;
export const DELETE_PRODUCT_API = '/api/products/';
export const CREATE_PRODUCT_API = '/api/products'
export const ADMIN_USER_NAME = 'ADMIN_USER_NAME';
export const ADMIN_PASSWORD = 'ADMIN_PASSWORD';