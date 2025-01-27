import { useFetchApi } from "./useFetchApi.js";

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
export function useFetchApiCrud(path) {
    async function read(id) {

        return await useFetchApi({
            method: "GET",
            endpoint: `${path}/${id}`,
        });
    }

    async function readAll() {
        return await useFetchApi({
            method: "GET",
            endpoint: path,
        });
    }

    async function create(data) {
        return await useFetchApi({
            method: "POST",
            endpoint: path,
            data,
        });
    }

    async function del(id) {
        return await useFetchApi({
            method: "DELETE",
            endpoint: `${path}/${id}`,
        });
    }

    async function update(id, data) {
        return await useFetchApi({
            method: "PUT",
            endpoint: `${path}/${id}`,
            data,
        });
    }

    return {
        read,
        readAll,
        create,
        del,
        update,
    };
}