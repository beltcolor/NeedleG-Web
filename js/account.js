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
            
            // 화면 크기에 따라 다른 동작 구현
            const isMobile = window.innerWidth <= 768;
            
            if (isMobile) {
                // 모바일 화면: 전체 화면 메뉴
                
                // 메뉴 아이콘 변경 (메뉴/닫기)
                const menuIcon = menuButton.querySelector('i');
                if (menuIcon) {
                    menuIcon.textContent = menuIcon.textContent === 'menu' ? 'close' : 'menu';
                }
                
                // 드롭다운을 전체 화면으로 표시
                menuDropdown.classList.toggle('fullscreen-menu');
                
                // 메뉴가 표시되면 스크롤 방지
                if (menuDropdown.classList.contains('fullscreen-menu')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            } else {
                // 데스크톱 화면: 일반 드롭다운 메뉴
                
                // 드롭다운 위치 조정
                const buttonRect = menuButton.getBoundingClientRect();
                menuDropdown.style.position = 'fixed';
                menuDropdown.style.top = (buttonRect.bottom + 5) + 'px';
                menuDropdown.style.right = (window.innerWidth - buttonRect.right) + 'px';
                menuDropdown.style.left = 'auto';
                
                // 드롭다운 표시/숨김 토글
                menuDropdown.style.display = menuDropdown.style.display === 'block' ? 'none' : 'block';
            }
        });
        
        // 메뉴 항목 클릭 시 메뉴 닫기
        const menuItems = menuDropdown.querySelectorAll('a');
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                const isMobile = window.innerWidth <= 768;
                
                if (isMobile) {
                    menuDropdown.classList.remove('fullscreen-menu');
                    document.body.style.overflow = '';
                    
                    // 메뉴 아이콘 원래대로
                    const menuIcon = menuButton.querySelector('i');
                    if (menuIcon) {
                        menuIcon.textContent = 'menu';
                    }
                } else {
                    menuDropdown.style.display = 'none';
                }
            });
        });
        
        // 바깥 영역 클릭 시 메뉴 닫기
        document.addEventListener('click', function(e) {
            if (!menuButton.contains(e.target) && !menuDropdown.contains(e.target)) {
                const isMobile = window.innerWidth <= 768;
                
                if (isMobile) {
                    menuDropdown.classList.remove('fullscreen-menu');
                    document.body.style.overflow = '';
                    
                    // 메뉴 아이콘 원래대로
                    const menuIcon = menuButton.querySelector('i');
                    if (menuIcon) {
                        menuIcon.textContent = 'menu';
                    }
                } else {
                    menuDropdown.style.display = 'none';
                }
            }
        });
        
        // 화면 크기 변경 시 메뉴 스타일 조정
        window.addEventListener('resize', function() {
            const isMobile = window.innerWidth <= 768;
            
            // 화면 크기 변경 시 열려있는 메뉴 닫기
            if (isMobile) {
                menuDropdown.classList.remove('fullscreen-menu');
                document.body.style.overflow = '';
            } else {
                menuDropdown.style.display = 'none';
            }
            
            // 메뉴 아이콘 원래대로
            const menuIcon = menuButton.querySelector('i');
            if (menuIcon) {
                menuIcon.textContent = 'menu';
            }
        });
        
        // Dark/Light mode toggle
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', function(e) {
                e.preventDefault();
                toggleTheme();
                
                const isMobile = window.innerWidth <= 768;
                if (isMobile) {
                    menuDropdown.classList.remove('fullscreen-menu');
                    document.body.style.overflow = '';
                    
                    // 메뉴 아이콘 원래대로
                    const menuIcon = menuButton.querySelector('i');
                    if (menuIcon) {
                        menuIcon.textContent = 'menu';
                    }
                } else {
                    menuDropdown.style.display = 'none';
                }
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
    const showRegisterBtn = document.getElementById('show-register-btn');
    const showLoginBtn = document.getElementById('show-login-btn');
    const loginSection = document.querySelector('.login-section');
    const registerSection = document.querySelector('.register-section');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const sendCodeBtn = document.getElementById('send-code-btn');
    
    if (closeBtn && modal) {
        // 모달 닫기 및 폼 초기화 함수
        function resetAndCloseModal() {
            // 모달 숨기기
            modal.style.display = 'none';
            
            // 로그인 폼을 기본으로 표시
            loginSection.style.display = 'block';
            registerSection.style.display = 'none';
            
            // 입력 필드 초기화
            const allInputs = modal.querySelectorAll('input');
            allInputs.forEach(input => {
                input.value = '';
                input.classList.remove('error', 'success');
                
                // 확인 코드 필드는 비활성화
                if (input.id === 'verification-code') {
                    input.disabled = true;
                }
            });
            
            // 오류 메시지 초기화
            const allErrorMsgs = modal.querySelectorAll('.input-error, .input-success');
            allErrorMsgs.forEach(msg => {
                msg.textContent = '';
                msg.className = msg.className.includes('input-success') ? 'input-success' : 'input-error';
            });
            
            // 확인 코드 버튼 초기화
            if (sendCodeBtn) {
                sendCodeBtn.textContent = 'Send Code';
                sendCodeBtn.disabled = false;
                sendCodeBtn.classList.remove('sending', 'sent');
                
                // 타이머 중지
                if (window.verificationTimer) {
                    clearInterval(window.verificationTimer);
                    window.verificationTimer = null;
                }
                
                // 코드 확인 상태 초기화
                window.isEmailVerified = false;
            }
        }
        
        // X 버튼 클릭 시 초기화 및 닫기
        closeBtn.addEventListener('click', resetAndCloseModal);
        
        // 모달 바깥 클릭 시 초기화 및 닫기
        window.addEventListener('click', function(event) {
            if (event.target == modal) {
                resetAndCloseModal();
            }
        });
        
        // 회원가입 폼 보기
        if (showRegisterBtn) {
            showRegisterBtn.addEventListener('click', function(e) {
                e.preventDefault();
                loginSection.style.display = 'none';
                registerSection.style.display = 'block';
                // 실시간 유효성 검사 설정
                setupRegisterValidation();
            });
        }
        
        // 로그인 폼 보기
        if (showLoginBtn) {
            showLoginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                registerSection.style.display = 'none';
                loginSection.style.display = 'block';
            });
        }
        
        // 로그인 버튼 이벤트
        if (loginBtn) {
            loginBtn.addEventListener('click', handleLogin);
        }
        
        // 회원가입 버튼 이벤트
        if (registerBtn) {
            registerBtn.addEventListener('click', handleRegister);
        }
        
        // 이메일 확인 코드 전송 버튼 이벤트
        if (sendCodeBtn) {
            sendCodeBtn.addEventListener('click', handleSendVerificationCode);
        }
        
        // 이메일 확인 코드 입력 이벤트
        const verificationCodeInput = document.getElementById('verification-code');
        if (verificationCodeInput) {
            verificationCodeInput.addEventListener('input', function() {
                validateVerificationCode(this);
            });
        }
        
        // 실시간 유효성 검사 설정 (모달이 처음 열릴 때를 위함)
        setupRegisterValidation();
    }
}

// Show login modal
function showLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.style.display = 'block';
        
        // 항상 로그인 폼을 기본으로 표시
        const loginSection = document.querySelector('.login-section');
        const registerSection = document.querySelector('.register-section');
        
        if (loginSection && registerSection) {
            loginSection.style.display = 'block';
            registerSection.style.display = 'none';
        }
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
        // 로그인된 상태: localStorage에서 사용자 정보 가져오기
        const user = JSON.parse(localStorage.getItem('needleG_user') || '{}');
        const userData = JSON.parse(localStorage.getItem('needleG_userData') || '{}');
        
        // username-display에 사용자 아이디 표시 (우선순위: username > email > 기본값)
        if (usernameDisplay) {
            if (user.username) {
                usernameDisplay.textContent = user.username;
            } else if (user.email) {
                usernameDisplay.textContent = user.email.split('@')[0]; // 이메일의 @ 앞부분만 표시
            } else {
                usernameDisplay.textContent = 'User';
            }
        }
        
        if (userBio) userBio.textContent = userData.bio || 'No bio added yet';
        if (membershipLevel) membershipLevel.textContent = user.role || 'Standard';
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
async function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }
    
    try {
        const userData = await apiService.login(email, password);
        
        // 로그인 성공 처리
        document.getElementById('login-modal').style.display = 'none';
        
        // 사용자 정보 업데이트
        updateUserProfile(true);
        
        // 환영 메시지 표시
        const username = userData.username || email.split('@')[0];
        showSuccessNotification(`Welcome back, ${username}!`, 'You have successfully logged in.');
        
        // 페이지 새로고침
        // location.reload();
    } catch (error) {
        alert(error.message || 'Login failed. Please try again.');
    }
}

// Handle logout
function handleLogout() {
    apiService.logout();
    updateUserProfile(false);
    // 페이지 새로고침
    // location.reload();
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

// Handle register
async function handleRegister() {
    const username = document.getElementById('register-username');
    const email = document.getElementById('register-email');
    const password = document.getElementById('register-password');
    const confirmPassword = document.getElementById('register-confirm-password');
    const verificationCode = document.getElementById('verification-code');
    const role = document.getElementById('register-role').value;
    
    // 오류 표시 요소들
    const usernameError = document.getElementById('username-error');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const confirmPasswordError = document.getElementById('confirm-password-error');
    const verificationError = document.getElementById('verification-error');
    const registerError = document.getElementById('register-error');
    
    // 빈 필드 체크
    let isValid = true;
    
    // 사용자 이름 검사
    if (!username.value) {
        username.classList.add('error');
        usernameError.textContent = 'Username is required';
        usernameError.className = 'input-error';
        isValid = false;
    } else {
        // 이미 입력된 경우 유효성 검사
        isValid = validateUsername(username, usernameError) && isValid;
    }
    
    // 이메일 검사
    if (!email.value) {
        email.classList.add('error');
        emailError.textContent = 'Email is required';
        emailError.className = 'input-error';
        isValid = false;
    } else {
        // 이미 입력된 경우 유효성 검사
        isValid = validateEmail(email, emailError) && isValid;
    }
    
    // 확인 코드 검사
    if (!window.isEmailVerified) {
        verificationCode.classList.add('error');
        verificationError.textContent = 'Email verification is required';
        verificationError.className = 'input-error';
        isValid = false;
    }
    
    // 비밀번호 검사
    if (!password.value) {
        password.classList.add('error');
        passwordError.textContent = 'Password is required';
        passwordError.className = 'input-error';
        isValid = false;
    } else {
        // 이미 입력된 경우 유효성 검사
        isValid = validatePassword(password, passwordError) && isValid;
    }
    
    // 비밀번호 확인 검사
    if (!confirmPassword.value) {
        confirmPassword.classList.add('error');
        confirmPasswordError.textContent = 'Please confirm your password';
        confirmPasswordError.className = 'input-error';
        isValid = false;
    } else {
        // 이미 입력된 경우 유효성 검사
        isValid = validateConfirmPassword(confirmPassword, password, confirmPasswordError) && isValid;
    }
    
    // 유효성 검사 실패 시 함수 종료
    if (!isValid) {
        return;
    }
    
    try {
        const userData = await apiService.register({
            username: username.value,
            email: email.value,
            password: password.value,
            role
        });
        
        // 회원가입 성공 처리
        document.getElementById('login-modal').style.display = 'none';
        
        // 성공 알림 표시
        showSuccessNotification(`Welcome, ${username.value}!`, 'Your account has been created successfully.');
        
        // 사용자 프로필 업데이트
        updateUserProfile(true);
    } catch (error) {
        // 서버 오류 메시지 표시
        registerError.textContent = error.message || 'Registration failed. Please try again.';
        registerError.style.display = 'block';
    }
}

// 성공 알림 표시 함수
function showSuccessNotification(title, message) {
    const notification = document.getElementById('success-notification');
    const titleElement = notification.querySelector('.success-notification-title');
    const messageElement = notification.querySelector('.success-notification-message');
    
    // 알림 내용 설정
    titleElement.textContent = title;
    messageElement.textContent = message;
    
    // 알림 표시
    notification.classList.add('show');
    
    // 3초 후 자동으로 사라짐
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// 회원가입 폼 입력 필드 실시간 유효성 검사 설정
function setupRegisterValidation() {
    const username = document.getElementById('register-username');
    const email = document.getElementById('register-email');
    const password = document.getElementById('register-password');
    const confirmPassword = document.getElementById('register-confirm-password');
    
    const usernameError = document.getElementById('username-error');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const confirmPasswordError = document.getElementById('confirm-password-error');
    
    // 사용자 이름 유효성 검사
    username.addEventListener('input', function() {
        validateUsername(this, usernameError);
    });
    
    // 이메일 유효성 검사
    email.addEventListener('input', function() {
        validateEmail(this, emailError);
    });
    
    // 비밀번호 유효성 검사
    password.addEventListener('input', function() {
        validatePassword(this, passwordError);
        // 비밀번호가 변경되면 비밀번호 확인도 재검사
        if (confirmPassword.value) {
            validateConfirmPassword(confirmPassword, this, confirmPasswordError);
        }
    });
    
    // 비밀번호 확인 유효성 검사
    confirmPassword.addEventListener('input', function() {
        validateConfirmPassword(this, password, confirmPasswordError);
    });
}

// 사용자 이름 유효성 검사 함수
function validateUsername(field, errorElement) {
    // 초기화
    field.classList.remove('error', 'success');
    errorElement.textContent = '';
    errorElement.className = 'input-error';
    
    if (!field.value) {
        // 빈 값
        return;
    }
    
    if (field.value.length < 3) {
        // 오류: 3자 미만
        field.classList.add('error');
        errorElement.textContent = 'Username must be at least 3 characters';
        return false;
    }
    
    // 타이핑 중에 너무 많은 요청을 방지하는 디바운스 설정
    clearTimeout(field.timer);
    
    // 기본 유효성 검사 통과 시 임시 성공 상태 표시
    field.classList.add('success');
    errorElement.textContent = 'Checking username...';
    errorElement.className = 'input-success';
    
    // 서버에 사용자 이름 확인 요청 (300ms 딜레이)
    field.timer = setTimeout(async () => {
        try {
            // 3자 이상일 때만 서버에 확인 요청
            if (field.value.length >= 3) {
                const result = await apiService.checkUsername(field.value);
                
                if (result.exists) {
                    // 이미 사용 중인 사용자 이름
                    field.classList.remove('success');
                    field.classList.add('error');
                    errorElement.textContent = 'Username is already taken';
                    errorElement.className = 'input-error';
                    return false;
                } else {
                    // 사용 가능한 사용자 이름
                    field.classList.add('success');
                    errorElement.textContent = 'Username is available';
                    errorElement.className = 'input-success';
                    return true;
                }
            }
        } catch (error) {
            console.error('Error checking username:', error);
            // 에러 발생 시 유효성 검사 통과 (서버 에러는 제출 시 확인)
            return true;
        }
    }, 300);
    
    return true; // 초기 반환값 (비동기 검사 결과는 나중에 업데이트)
}

// 이메일 유효성 검사 함수
function validateEmail(field, errorElement) {
    // 초기화
    field.classList.remove('error', 'success');
    errorElement.textContent = '';
    errorElement.className = 'input-error';
    
    if (!field.value) {
        // 빈 값
        return;
    }
    
    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(field.value)) {
        field.classList.add('error');
        errorElement.textContent = 'Please enter a valid email address';
        return false;
    }
    
    // 타이핑 중에 너무 많은 요청을 방지하는 디바운스 설정
    clearTimeout(field.timer);
    
    // 기본 유효성 검사 통과 시 임시 성공 상태 표시
    field.classList.add('success');
    errorElement.textContent = 'Checking email...';
    errorElement.className = 'input-success';
    
    // 서버에 이메일 확인 요청 (300ms 딜레이)
    field.timer = setTimeout(async () => {
        try {
            const result = await apiService.checkEmail(field.value);
            
            if (result.exists) {
                // 이미 사용 중인 이메일
                field.classList.remove('success');
                field.classList.add('error');
                errorElement.textContent = 'Email is already registered';
                errorElement.className = 'input-error';
                return false;
            } else {
                // 사용 가능한 이메일
                field.classList.add('success');
                errorElement.textContent = 'Email is available';
                errorElement.className = 'input-success';
                return true;
            }
        } catch (error) {
            console.error('Error checking email:', error);
            // 에러 발생 시 유효성 검사 통과 (서버 에러는 제출 시 확인)
            return true;
        }
    }, 300);
    
    return true; // 초기 반환값 (비동기 검사 결과는 나중에 업데이트)
}

// 비밀번호 유효성 검사 함수
function validatePassword(field, errorElement) {
    // 초기화
    field.classList.remove('error', 'success');
    errorElement.textContent = '';
    errorElement.className = 'input-error';
    
    if (!field.value) {
        // 빈 값
        return;
    }
    
    if (field.value.length < 6) {
        // 오류: 6자 미만
        field.classList.add('error');
        errorElement.textContent = 'Password must be at least 6 characters';
        return false;
    }
    
    // 성공
    field.classList.add('success');
    errorElement.textContent = 'Valid password';
    errorElement.className = 'input-success';
    return true;
}

// 비밀번호 확인 유효성 검사 함수
function validateConfirmPassword(field, passwordField, errorElement) {
    // 초기화
    field.classList.remove('error', 'success');
    errorElement.textContent = '';
    errorElement.className = 'input-error';
    
    if (!field.value) {
        // 빈 값
        return;
    }
    
    if (field.value !== passwordField.value) {
        // 오류: 비밀번호 불일치
        field.classList.add('error');
        errorElement.textContent = 'Passwords do not match';
        return false;
    }
    
    // 성공
    field.classList.add('success');
    errorElement.textContent = 'Passwords match';
    errorElement.className = 'input-success';
    return true;
}

// 이메일 확인 코드 전송 처리
async function handleSendVerificationCode() {
    const email = document.getElementById('register-email');
    const emailError = document.getElementById('email-error');
    const verificationCode = document.getElementById('verification-code');
    const verificationError = document.getElementById('verification-error');
    const sendCodeBtn = document.getElementById('send-code-btn');
    
    // 이메일 유효성 검사
    const isEmailValid = validateEmail(email, emailError);
    if (!isEmailValid) {
        return;
    }
    
    try {
        // 버튼 상태 변경
        sendCodeBtn.disabled = true;
        sendCodeBtn.classList.add('sending');
        sendCodeBtn.textContent = 'Sending...';
        
        // 이메일 확인 코드 전송 API 호출
        await apiService.sendVerificationCode(email.value);
        
        // 버튼 상태 변경
        sendCodeBtn.classList.remove('sending');
        sendCodeBtn.classList.add('sent');
        
        // 입력 필드 활성화
        verificationCode.disabled = false;
        verificationCode.focus();
        
        // 성공 메시지 표시
        verificationError.textContent = 'Verification code sent! Check your email.';
        verificationError.className = 'input-success';
        
        // 1분 타이머 설정
        let timeLeft = 60;
        
        // 이전 타이머 정리
        if (window.verificationTimer) {
            clearInterval(window.verificationTimer);
        }
        
        // 타이머 표시 요소 생성
        let countdownSpan = document.createElement('span');
        countdownSpan.className = 'countdown';
        countdownSpan.textContent = `(${timeLeft}s)`;
        sendCodeBtn.textContent = 'Resend';
        sendCodeBtn.appendChild(countdownSpan);
        
        // 타이머 설정
        window.verificationTimer = setInterval(() => {
            timeLeft--;
            countdownSpan.textContent = `(${timeLeft}s)`;
            
            if (timeLeft <= 0) {
                clearInterval(window.verificationTimer);
                sendCodeBtn.disabled = false;
                sendCodeBtn.textContent = 'Resend';
                sendCodeBtn.classList.remove('sent');
            }
        }, 1000);
        
    } catch (error) {
        // 오류 메시지 표시
        verificationError.textContent = error.message || 'Failed to send verification code. Please try again.';
        verificationError.className = 'input-error';
        
        // 버튼 상태 복원
        sendCodeBtn.disabled = false;
        sendCodeBtn.classList.remove('sending');
        sendCodeBtn.textContent = 'Send Code';
    }
}

// 이메일 확인 코드 유효성 검사
async function validateVerificationCode(field) {
    const email = document.getElementById('register-email').value;
    const code = field.value;
    const verificationError = document.getElementById('verification-error');
    
    // 초기화
    field.classList.remove('error', 'success');
    
    if (!code) {
        return;
    }
    
    // 6자리 숫자 확인
    if (code.length !== 6 || !/^\d+$/.test(code)) {
        field.classList.add('error');
        verificationError.textContent = 'Code must be 6 digits';
        verificationError.className = 'input-error';
        window.isEmailVerified = false;
        return;
    }
    
    try {
        // 코드 확인 API 호출
        await apiService.verifyCode(email, code);
        
        // 성공 상태 표시
        field.classList.add('success');
        verificationError.textContent = 'Email verified successfully!';
        verificationError.className = 'input-success';
        
        // 확인 상태 저장
        window.isEmailVerified = true;
        
        // 코드 전송 버튼 비활성화
        const sendCodeBtn = document.getElementById('send-code-btn');
        if (sendCodeBtn) {
            sendCodeBtn.disabled = true;
            sendCodeBtn.textContent = 'Verified';
            sendCodeBtn.classList.add('sent');
            
            // 타이머 중지
            if (window.verificationTimer) {
                clearInterval(window.verificationTimer);
                window.verificationTimer = null;
            }
        }
        
    } catch (error) {
        // 오류 상태 표시
        field.classList.add('error');
        verificationError.textContent = 'Invalid verification code';
        verificationError.className = 'input-error';
        window.isEmailVerified = false;
    }
}
