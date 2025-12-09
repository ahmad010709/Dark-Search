document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('addWebsiteModal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const addWebsiteForm = document.getElementById('addWebsiteForm');
    const websiteGrid = document.getElementById('websites-grid');
    const searchInput = document.getElementById('search-input');
    const searchIcon = document.querySelector('.search-icon');

    // Modal Logic
    openModalBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });

    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Load initial websites
    loadWebsites();

    // Search Logic - Explicit Trigger
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            loadWebsites(searchInput.value);
        }
    });

    searchIcon.addEventListener('click', () => {
        loadWebsites(searchInput.value);
    });

    // Add Website Form Submission
    addWebsiteForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('siteName').value;
        const url = document.getElementById('siteUrl').value;
        const description = document.getElementById('siteDesc').value;

        try {
            const response = await fetch('/api/websites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, url, description })
            });

            if (response.ok) {
                // Reset form and close modal
                addWebsiteForm.reset();
                modal.classList.remove('active');
                // Reload grid
                loadWebsites();
            } else if (response.status === 409) {
                alert('This website URL already exists!');
            } else {
                alert('Failed to add website. Please try again.');
            }
        } catch (error) {
            console.error('Error adding website:', error);
            alert('An error occurred.');
        }
    });

    async function loadWebsites(query = '') {
        websiteGrid.innerHTML = '<div class="loader"></div>';
        try {
            const url = query
                ? `/api/websites?q=${encodeURIComponent(query)}`
                : '/api/websites';

            const response = await fetch(url);
            const websites = await response.json();

            renderWebsites(websites);
        } catch (error) {
            console.error('Error loading websites:', error);
            websiteGrid.innerHTML = '<p class="no-results">Error loading websites. Please make sure the server is running.</p>';
        }
    }

    function renderWebsites(websites) {
        websiteGrid.innerHTML = '';
        const totalSitesSpan = document.getElementById('total-sites');
        if (totalSitesSpan) {
            totalSitesSpan.textContent = websites.length;
        }

        if (websites.length === 0) {
            websiteGrid.innerHTML = '<p class="no-results">No websites found.</p>';
            return;
        }

        websites.forEach(site => {
            const card = document.createElement('a');
            card.href = site.url;
            card.className = 'website-card';
            card.target = '_blank';
            card.rel = 'noopener noreferrer';

            // Generate a random-ish icon based on the name roughly, or just generic
            // For now, consistent generic icon
            card.innerHTML = `
                <div class="card-icon">
                    <i class="fa-solid fa-globe"></i>
                </div>
                <div class="website-name">${escapeHtml(site.name)}</div>
                <div class="website-desc">${escapeHtml(site.description)}</div>
                <div class="website-url">
                    <i class="fa-solid fa-link"></i> ${new URL(site.url).hostname}
                </div>
            `;
            websiteGrid.appendChild(card);
        });
    }

    function escapeHtml(text) {
        if (!text) return '';
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});
