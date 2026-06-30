import axios from 'axios';
import { Repository } from '../interfaces/Repository';
import { GithubUser } from '../interfaces/GithubUser';
import { RepositoryPayload } from '../interfaces/RepositoryPayload';

const GITHUB_API_URL = import.meta.env.VITE_GITHUB_API_URL;
const GITHUB_API_TOKEN = import.meta.env.VITE_GITHUB_API_TOKEN;

const apiClient = axios.create({
    baseURL: GITHUB_API_URL,
    headers: {
        Authorization: `Bearer ${GITHUB_API_TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
    }
});

export const fetchRepositories = async (): Promise<Repository[]> => {
    try {
        const response = await apiClient.get(`/user/repos`, {
            params: {
                per_page: 100,
                sort: 'created',
                direction: 'desc',
                affiliation: 'owner',
                t: Date.now()
            }
        });
        if (response.status !== 200) {
            throw new Error(`${response.statusText}`);
        }
        return response.data;
    } catch (error) {
        throw new Error(`${(error as Error).message}`);
    }
};

export const createRepository = async (repository: RepositoryPayload): Promise<Repository | null> => {
    try {
        const response = await apiClient.post(`/user/repos`, repository);
        if (response.status !== 201) {
            throw new Error(`${response.statusText}`);
        }
        return response.data;
    } catch (error) {
        throw new Error(`${(error as Error).message}`);
    }
};

export const fetchUserInfo = async (): Promise<GithubUser | null> => {
    try {
        const response = await apiClient.get(`/user`);
        if (response.status !== 200) {
            throw new Error(`${response.statusText}`);
        }
        return response.data;
    } catch (error) {
        throw new Error(`${(error as Error).message}`);
    }
};



export const updateRepository = async (owner: string, repo: string, repositoryData: Partial<RepositoryPayload>): Promise<Repository | null> => {
    try {
       
        const response = await apiClient.patch(`/repos/${owner}/${repo}`, repositoryData);
        if (response.status !== 200) {
            throw new Error(`${response.statusText}`);
        }
        return response.data;
    } catch (error) {
        throw new Error(`${(error as Error).message}`);
    }
};

export const deleteRepository = async (owner: string, repo: string): Promise<boolean> => {
    try {
        // DELETE y la ruta incluye el dueño y el nombre del repo
        const response = await apiClient.delete(`/repos/${owner}/${repo}`);
       
        if (response.status !== 204) {
            throw new Error(`${response.statusText}`);
        }
        return true;
    } catch (error) {
        throw new Error(`${(error as Error).message}`);
    }
};