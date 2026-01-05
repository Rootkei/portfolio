// Popup Script - Handles UI and sync logic
let isOnLinkedIn = false;
let apiUrl = 'http://localhost:8080';

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
    // Load saved API URL
    const saved = await chrome.storage.local.get(['apiUrl']);
    if (saved.apiUrl) {
        apiUrl = saved.apiUrl;
        document.getElementById('apiUrl').value = apiUrl;
    }

    // Check if we're on LinkedIn
    checkLinkedInStatus();

    // Check API status
    checkAPIStatus();

    // Setup event listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Sync button
    document.getElementById('syncBtn').addEventListener('click', syncData);

    // Open portfolio button
    document.getElementById('openPortfolioBtn').addEventListener('click', () => {
        chrome.tabs.create({ url: 'http://localhost:5500/manage.html' });
    });

    // API URL input
    document.getElementById('apiUrl').addEventListener('change', async (e) => {
        apiUrl = e.target.value;
        await chrome.storage.local.set({ apiUrl: apiUrl });
        checkAPIStatus();
    });
}

async function checkLinkedInStatus() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (tab.url && tab.url.includes('linkedin.com')) {
            isOnLinkedIn = true;
            updateLinkedInStatus('success', 'Detected ✓');
            document.getElementById('syncBtn').disabled = false;
        } else {
            isOnLinkedIn = false;
            updateLinkedInStatus('error', 'Not on LinkedIn');
            document.getElementById('syncBtn').disabled = true;
        }
    } catch (error) {
        console.error('Error checking LinkedIn status:', error);
        updateLinkedInStatus('error', 'Error');
    }
}

async function checkAPIStatus() {
    try {
        const response = await fetch(`${apiUrl}/health`);
        if (response.ok) {
            updateAPIStatus('success', 'Connected ✓');
        } else {
            updateAPIStatus('error', 'Offline');
        }
    } catch (error) {
        updateAPIStatus('error', 'Offline');
    }
}

function updateLinkedInStatus(type, text) {
    const badge = document.getElementById('linkedinStatus');
    badge.textContent = text;
    badge.className = `badge ${type}`;
}

function updateAPIStatus(type, text) {
    const badge = document.getElementById('apiStatus');
    badge.textContent = text;
    badge.className = `badge ${type}`;
}

function showMessage(text, type) {
    const message = document.getElementById('message');
    message.textContent = text;
    message.className = `message ${type} show`;

    setTimeout(() => {
        message.classList.remove('show');
    }, 5000);
}

function showLoader(show) {
    const loader = document.getElementById('loader');
    const syncBtn = document.getElementById('syncBtn');

    if (show) {
        loader.classList.add('show');
        syncBtn.disabled = true;
    } else {
        loader.classList.remove('show');
        syncBtn.disabled = false;
    }
}

async function syncData() {
    if (!isOnLinkedIn) {
        showMessage('Please navigate to your LinkedIn profile first', 'error');
        return;
    }

    showLoader(true);
    showMessage('Extracting data from LinkedIn...', 'success');

    try {
        // Get active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        // Extract data from LinkedIn
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractData' });

        if (!response || !response.success) {
            throw new Error('Failed to extract data from LinkedIn');
        }

        const linkedInData = response.data;
        console.log('Extracted data:', linkedInData);

        // Merge with existing portfolio data
        showMessage('Merging with existing portfolio data...', 'success');
        const mergedData = await mergeWithPortfolio(linkedInData);

        // Send to backend
        showMessage('Syncing to backend...', 'success');
        await syncToBackend(mergedData);

        showLoader(false);
        showMessage('✅ Successfully synced LinkedIn data!', 'success');

    } catch (error) {
        console.error('Sync error:', error);
        showLoader(false);
        showMessage(`❌ Error: ${error.message}`, 'error');
    }
}

async function mergeWithPortfolio(linkedInData) {
    try {
        console.log('🔄 Fetching existing portfolio data...');

        // Get existing portfolio data
        const response = await fetch(`${apiUrl}/api/portfolio`);
        let portfolioData = {};

        if (response.ok) {
            portfolioData = await response.json();
            console.log('✅ Existing portfolio loaded');
        } else {
            console.warn('⚠️ No existing portfolio, creating new');
            // Initialize empty portfolio structure
            portfolioData = {
                personal: {},
                social: [],
                experience: [],
                education: [],
                skills: {},
                projects: [],
                certifications: []
            };
        }

        console.log('🔀 Merging LinkedIn data with portfolio...');

        // Merge personal info
        portfolioData.personal = {
            name: linkedInData.personal.name || portfolioData.personal?.name || '',
            title: linkedInData.personal.title || portfolioData.personal?.title || '',
            location: linkedInData.personal.location || portfolioData.personal?.location || '',
            bio: linkedInData.personal.bio || portfolioData.personal?.bio || '',
            photo: linkedInData.personal.photo || portfolioData.personal?.photo || '',
            email: portfolioData.personal?.email || '',
            phone: portfolioData.personal?.phone || '',
            tagline: portfolioData.personal?.tagline || linkedInData.personal.title || '',
            resume: portfolioData.personal?.resume || ''
        };

        // Replace experience with LinkedIn data
        portfolioData.experience = linkedInData.experience || [];

        // Replace education with LinkedIn data
        portfolioData.education = linkedInData.education || [];

        // Merge skills
        portfolioData.skills = {
            ...portfolioData.skills,
            ...linkedInData.skills
        };

        // Replace certifications with LinkedIn data
        portfolioData.certifications = linkedInData.certifications || [];

        // Keep existing projects and social
        portfolioData.projects = portfolioData.projects || [];
        portfolioData.social = portfolioData.social || [];

        console.log('✅ Data merged successfully');
        console.log('Merged data:', portfolioData);

        return portfolioData;
    } catch (error) {
        console.error('❌ Error merging data:', error);
        throw new Error(`Merge failed: ${error.message}`);
    }
}

async function syncToBackend(data) {
    try {
        console.log('📤 Sending data to backend...');
        console.log('API URL:', `${apiUrl}/api/portfolio/update`);
        console.log('Data to send:', data);

        const response = await fetch(`${apiUrl}/api/portfolio/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Backend error:', errorText);
            throw new Error(`Backend returned ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log('✅ Backend response:', result);
        return result;
    } catch (error) {
        console.error('❌ Error syncing to backend:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack
        });
        throw new Error(`Sync failed: ${error.message}`);
    }
}
