import { useFetchApi } from 'useFetchApi.js';

/**
 * Fetch data from an API and perform CRUD operations
 *
 * @param {string} path - The path to the API
 * @param {string} [baseUrl=null] - The base URL of the API
 * @param {object} [additionalHeaders={}] - Additional headers to send with each request
 * @returns {Object} The fetch API utilities
 * @property {Function} read - Function to read data
 * @property {Function} readAll - Function to read all data
 * @property {Function} create - Function to create data
 * @property {Function} del - Function to delete data
 * @property {Function} update - Function to update data
 * @property {Function} fetchApiToRef - Function to fetch data and return it in refs
 * @example
 * const userCrud = useFetchApiCrud('users');
 */
export function useFetchApiCrud(path, baseUrl = null, additionalHeaders = {}) {

    const { fetchApiToRef } = useFetchApi(baseUrl, additionalHeaders);

    function read(id, headers = {}, timeout = 5000) {
        return fetchApiToRef({
            url: `${path}/${id}`,
            method: 'GET',
            headers,
            timeout,
        });
    }

    function readAll(headers = {}, timeout = 5000) {
        return fetchApiToRef({
            url: path,
            method: 'GET',
            headers,
            timeout,
        });
    }

    function create(data, headers = {}, timeout = 5000) {
        return fetchApiToRef({
            url: path,
            data,
            method: 'POST',
            headers,
            timeout,
        });
    }

    function del(id, headers = {}, timeout = 5000) {
        return fetchApiToRef({
            url: `${path}/${id}`,
            method: 'DELETE',
            headers,
            timeout,
        });
    }

    function update(id, data, headers = {}, timeout = 5000) {
        return fetchApiToRef({
            url: `${path}/${id}`,
            data,
            method: 'PATCH',
            headers,
            timeout,
        });
    }

    return {
        read,
        readAll,
        create,
        del,
        update,
        fetchApiToRef
    };
}