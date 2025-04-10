// Load Account page content
function loadAccountContent() {
    fetch('ContentAccount.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('main-content').innerHTML = data;
            initAccountPage();
        })
        .catch(error => console.error('Error loading content:', error));
}

// Initialize Account page
function initAccountPage() {
    // Check login status
    const isLoggedIn = localStorage.getItem('needleG_login') === 'true';
    
    // Initialize menu dropdown
    initMenuDropdown();
    
    // Initialize content tabs
    initContentTabs();
    
    // Initialize login modal
    initLoginModal();
    
    // Update UI based on login status
    updateUserProfile(isLoggedIn);
    
    // Load content based on login status
    if (isLoggedIn) {
        loadUserContent();
    }
}

// Initialize menu dropdown
function initMenuDropdown() {
    const menuButton = document.getElementById('menu-button');
    const menuDropdown = document.getElementById('menu-dropdown');
    
    if (menuButton && menuDropdown) {
        menuButton.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // 드롭다운 위치 조정
            const buttonRect = menuButton.getBoundingClientRect();
            menuDropdown.style.position = 'fixed';
            menuDropdown.style.top = (buttonRect.bottom + 5) + 'px';
            menuDropdown.style.right = '20px';
            
            // 드롭다운 표시/숨김 토글
            menuDropdown.style.display = menuDropdown.style.display === 'block' ? 'none' : 'block';
        });
        
        // Close dropdown when clicking elsewhere
        document.addEventListener('click', function(e) {
            if (!menuButton.contains(e.target) && !menuDropdown.contains(e.target)) {
                menuDropdown.style.display = 'none';
            }
        });
        
        // Dark/Light mode toggle
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', function(e) {
                e.preventDefault();
                document.documentElement.classList.toggle('light-mode');
                menuDropdown.style.display = 'none';
            });
        }
    }
}

// Initialize content tabs
function initContentTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const contentSections = document.querySelectorAll('.content-section');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all content sections
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Show the selected content section
            const tabName = this.getAttribute('data-tab');
            document.getElementById(`${tabName}-section`).classList.add('active');
        });
    });
}

// Initialize login modal
function initLoginModal() {
    const modal = document.getElementById('login-modal');
    const closeBtn = document.querySelector('.close-modal');
    
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Close when clicking outside the modal
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

// Show login modal
function showLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.style.display = 'block';
        
        // Focus on username input
        setTimeout(() => {
            const usernameInput = document.getElementById('username');
            if (usernameInput) {
                usernameInput.focus();
            }
        }, 300);
    }
}

// Update user profile based on login status
function updateUserProfile(isLoggedIn) {
    // Elements that need to be updated
    const usernameDisplay = document.getElementById('username-display');
    const userBio = document.getElementById('user-bio');
    const membershipLevel = document.getElementById('membership-level');
    const collectionCount = document.getElementById('collection-count');
    const reservationCount = document.getElementById('reservation-count');
    const reservationStat = document.querySelector('.reservation-stat');
    const userAvatar = document.getElementById('user-avatar');
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    
    // Empty state buttons
    const addPostBtn = document.getElementById('add-post-btn');
    const browseDesignsBtn = document.getElementById('browse-designs-btn');
    const exploreBtn = document.getElementById('explore-btn');
    
    // Empty state messages
    const postsEmptyMessage = document.querySelector('#posts-empty p');
    const savedEmptyMessage = document.querySelector('#saved-empty p');
    const likedEmptyMessage = document.querySelector('#liked-empty p');
    
    if (isLoggedIn) {
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem('needleG_userData') || '{}');
        
        // Update profile information
        if (usernameDisplay) usernameDisplay.textContent = userData.name || 'User';
        if (userBio) userBio.textContent = userData.bio || 'No bio added yet';
        if (membershipLevel) membershipLevel.textContent = userData.tier || 'Standard';
        if (collectionCount) collectionCount.textContent = userData.collections || 0;
        
        // Show/hide reservation stats based on if user has reservations
        if (reservationStat && reservationCount) {
            if (userData.reservations && userData.reservations > 0) {
                reservationCount.textContent = userData.reservations;
                reservationStat.style.display = 'flex';
            } else {
                reservationStat.style.display = 'none';
            }
        }
        
        // Update profile image
        if (userAvatar && userData.avatar) {
            userAvatar.src = userData.avatar;
        }
        
        // Show logout, hide login
        if (loginLink) loginLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'block';
        
        // Show edit profile button
        if (editProfileBtn) editProfileBtn.style.display = 'block';
        
        // Update empty state messages
        if (postsEmptyMessage) postsEmptyMessage.textContent = 'No posts yet';
        if (savedEmptyMessage) savedEmptyMessage.textContent = 'No saved items yet';
        if (likedEmptyMessage) likedEmptyMessage.textContent = 'No liked items yet';
        
        // Update empty state buttons
        if (addPostBtn) {
            addPostBtn.textContent = 'Add Post';
            addPostBtn.onclick = function() {
                console.log('Add post clicked');
                // Implement post creation functionality
            };
        }
        
        if (browseDesignsBtn) {
            browseDesignsBtn.textContent = 'Browse Designs';
            browseDesignsBtn.onclick = function() {
                console.log('Browse designs clicked');
                // Implement design browsing functionality
            };
        }
        
        if (exploreBtn) {
            exploreBtn.textContent = 'Explore';
            exploreBtn.onclick = function() {
                console.log('Explore clicked');
                // Implement explore functionality
            };
        }
    } else {
        // Default guest profile
        if (usernameDisplay) usernameDisplay.textContent = 'Guest';
        if (userBio) userBio.textContent = 'Sign in to customize your profile';
        if (membershipLevel) membershipLevel.textContent = 'Guest';
        if (collectionCount) collectionCount.textContent = '0';
        
        // Hide reservation stats for guests
        if (reservationStat) reservationStat.style.display = 'none';
        
        // Default avatar
        if (userAvatar) userAvatar.src = 'assets/default-avatar.png';
        
        // Show login, hide logout
        if (loginLink) loginLink.style.display = 'block';
        if (logoutLink) logoutLink.style.display = 'none';
        
        // Hide edit profile button
        if (editProfileBtn) editProfileBtn.style.display = 'none';
        
        // Update empty state messages for guests
        if (postsEmptyMessage) postsEmptyMessage.textContent = 'Sign in to start sharing your posts';
        if (savedEmptyMessage) savedEmptyMessage.textContent = 'Sign in to save your favorite designs';
        if (likedEmptyMessage) likedEmptyMessage.textContent = 'Sign in to like designs';
        
        // Update empty state buttons for guests
        if (addPostBtn) {
            addPostBtn.textContent = 'Sign In';
            addPostBtn.onclick = showLoginModal;
        }
        
        if (browseDesignsBtn) {
            browseDesignsBtn.textContent = 'Sign In';
            browseDesignsBtn.onclick = showLoginModal;
        }
        
        if (exploreBtn) {
            exploreBtn.textContent = 'Sign In';
            exploreBtn.onclick = showLoginModal;
        }
    }
}

// Handle login
function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        alert('Please enter username and password');
        return;
    }
    
    // Demo login (in a real app, this would be a server request)
    localStorage.setItem('needleG_login', 'true');
    
    // Demo user data
    const demoUserData = {
        name: username,
        bio: 'Tattoo enthusiast and art lover',
        avatar: 'assets/default-avatar.png',
        tier: 'Gold',
        collections: 12,
        reservations: 2,
        posts: [
            { id: 1, imageUrl: 'https://picsum.photos/500/500?random=1', caption: 'My first tattoo' },
            { id: 2, imageUrl: 'https://picsum.photos/500/500?random=2', caption: 'Flower design' },
            { id: 3, imageUrl: 'https://picsum.photos/500/500?random=3', caption: 'Dragon sketch' }
        ],
        saved: [
            { id: 1, imageUrl: 'https://picsum.photos/500/500?random=4', caption: 'Geometric pattern' }
        ]
    };
    
    localStorage.setItem('needleG_userData', JSON.stringify(demoUserData));
    
    // Close login modal
    const modal = document.getElementById('login-modal');
    if (modal) modal.style.display = 'none';
    
    // Update UI
    updateUserProfile(true);
    
    // Load user content
    loadUserContent();
    
    // Reset form
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// Handle logout
function handleLogout() {
    // Clear user data
    localStorage.removeItem('needleG_login');
    localStorage.removeItem('needleG_userData');
    
    // Update UI
    updateUserProfile(false);
    
    // Clear content
    clearUserContent();
    
    // Close menu dropdown
    const menuDropdown = document.getElementById('menu-dropdown');
    if (menuDropdown) menuDropdown.style.display = 'none';
}

// Load user content (posts, saved, liked)
function loadUserContent() {
    loadPosts();
    loadSavedItems();
    loadLikedItems();
}

// Load user posts
function loadPosts() {
    const isLoggedIn = localStorage.getItem('needleG_login') === 'true';
    if (!isLoggedIn) return;
    
    const postsGrid = document.getElementById('posts-grid');
    const emptyState = document.getElementById('posts-empty');
    
    if (!postsGrid || !emptyState) return;
    
    // Get user data
    const userData = JSON.parse(localStorage.getItem('needleG_userData') || '{}');
    const posts = userData.posts || [];
    
    // Remove existing items except empty state
    const existingItems = postsGrid.querySelectorAll('.gallery-item');
    existingItems.forEach(item => item.remove());
    
    if (posts.length > 0) {
        // Hide empty state
        emptyState.style.display = 'none';
        
        // Add posts to grid
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'gallery-item';
            postElement.innerHTML = `<img src="${post.imageUrl}" alt="${post.caption || 'Gallery item'}">`;
            
            // Insert before empty state
            postsGrid.insertBefore(postElement, emptyState);
        });
    } else {
        // Show empty state
        emptyState.style.display = 'flex';
    }
}

// Load saved items
function loadSavedItems() {
    const isLoggedIn = localStorage.getItem('needleG_login') === 'true';
    if (!isLoggedIn) return;
    
    const savedGrid = document.getElementById('saved-grid');
    const emptyState = document.getElementById('saved-empty');
    
    if (!savedGrid || !emptyState) return;
    
    // Get user data
    const userData = JSON.parse(localStorage.getItem('needleG_userData') || '{}');
    const saved = userData.saved || [];
    
    // Remove existing items except empty state
    const existingItems = savedGrid.querySelectorAll('.gallery-item');
    existingItems.forEach(item => item.remove());
    
    if (saved.length > 0) {
        // Hide empty state
        emptyState.style.display = 'none';
        
        // Add saved items to grid
        saved.forEach(item => {
            const savedElement = document.createElement('div');
            savedElement.className = 'gallery-item';
            savedElement.innerHTML = `<img src="${item.imageUrl}" alt="${item.caption || 'Saved item'}">`;
            
            // Insert before empty state
            savedGrid.insertBefore(savedElement, emptyState);
        });
    } else {
        // Show empty state
        emptyState.style.display = 'flex';
    }
}

// Load liked items
function loadLikedItems() {
    const isLoggedIn = localStorage.getItem('needleG_login') === 'true';
    if (!isLoggedIn) return;
    
    const likedGrid = document.getElementById('liked-grid');
    const emptyState = document.getElementById('liked-empty');
    
    if (!likedGrid || !emptyState) return;
    
    // Get user data
    const userData = JSON.parse(localStorage.getItem('needleG_userData') || '{}');
    const liked = userData.liked || [];
    
    // Remove existing items except empty state
    const existingItems = likedGrid.querySelectorAll('.gallery-item');
    existingItems.forEach(item => item.remove());
    
    if (liked.length > 0) {
        // Hide empty state
        emptyState.style.display = 'none';
        
        // Add liked items to grid
        liked.forEach(item => {
            const likedElement = document.createElement('div');
            likedElement.className = 'gallery-item';
            likedElement.innerHTML = `<img src="${item.imageUrl}" alt="${item.caption || 'Liked item'}">`;
            
            // Insert before empty state
            likedGrid.insertBefore(likedElement, emptyState);
        });
    } else {
        // Show empty state
        emptyState.style.display = 'flex';
    }
}

// Clear user content
function clearUserContent() {
    // Clear posts
    const postsGrid = document.getElementById('posts-grid');
    const postsEmpty = document.getElementById('posts-empty');
    if (postsGrid && postsEmpty) {
        const postItems = postsGrid.querySelectorAll('.gallery-item');
        postItems.forEach(item => item.remove());
        postsEmpty.style.display = 'flex';
    }
    
    // Clear saved items
    const savedGrid = document.getElementById('saved-grid');
    const savedEmpty = document.getElementById('saved-empty');
    if (savedGrid && savedEmpty) {
        const savedItems = savedGrid.querySelectorAll('.gallery-item');
        savedItems.forEach(item => item.remove());
        savedEmpty.style.display = 'flex';
    }
    
    // Clear liked items
    const likedGrid = document.getElementById('liked-grid');
    const likedEmpty = document.getElementById('liked-empty');
    if (likedGrid && likedEmpty) {
        const likedItems = likedGrid.querySelectorAll('.gallery-item');
        likedItems.forEach(item => item.remove());
        likedEmpty.style.display = 'flex';
    }
}
