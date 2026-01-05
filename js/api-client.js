// API Client for Portfolio Backend
class APIClient {
    constructor(baseURL = '') {
        // Auto-detect API URL based on environment
        if (baseURL) {
            this.baseURL = baseURL;
        } else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            // Local development
            this.baseURL = 'http://localhost:8080';
        } else {
            // Production - update this with your deployed backend URL
            this.baseURL = 'https://your-backend.onrender.com';
        }

        this.headers = {
            'Content-Type': 'application/json',
        };
    }

    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: {
                ...this.headers,
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const error = await response.text();
                throw new Error(`API Error: ${response.status} - ${error}`);
            }

            // Handle empty responses
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }

            return await response.text();
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    // GET request
    async get(endpoint) {
        return this.request(endpoint, {
            method: 'GET',
        });
    }

    // POST request
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // PUT request
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    // DELETE request
    async delete(endpoint, data) {
        return this.request(endpoint, {
            method: 'DELETE',
            body: JSON.stringify(data),
        });
    }

    // Health check
    async healthCheck() {
        return this.get('/health');
    }

    // Portfolio endpoints
    async getPortfolio() {
        return this.get('/api/portfolio');
    }

    async updatePortfolio(data) {
        return this.put('/api/portfolio/update', data);
    }

    // Personal info endpoints
    async updatePersonal(data) {
        return this.put('/api/personal', data);
    }

    // Experience endpoints
    async addExperience(data) {
        return this.post('/api/experience/add', data);
    }

    async updateExperience(data) {
        return this.put('/api/experience/update', data);
    }

    async deleteExperience(id) {
        return this.delete('/api/experience/delete', { id });
    }

    // Education endpoints (to be implemented on backend)
    async addEducation(data) {
        return this.post('/api/education/add', data);
    }

    async updateEducation(data) {
        return this.put('/api/education/update', data);
    }

    async deleteEducation(id) {
        return this.delete('/api/education/delete', { id });
    }

    // Project endpoints (to be implemented on backend)
    async addProject(data) {
        return this.post('/api/project/add', data);
    }

    async updateProject(data) {
        return this.put('/api/project/update', data);
    }

    async deleteProject(id) {
        return this.delete('/api/project/delete', { id });
    }

    // Skills endpoints (to be implemented on backend)
    async updateSkills(data) {
        return this.put('/api/skills/update', data);
    }

    // Social links endpoints (to be implemented on backend)
    async addSocial(data) {
        return this.post('/api/social/add', data);
    }

    async updateSocial(data) {
        return this.put('/api/social/update', data);
    }

    async deleteSocial(id) {
        return this.delete('/api/social/delete', { id });
    }
}

// Create global API client instance
window.apiClient = new APIClient();

// Export for ES modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APIClient;
}
