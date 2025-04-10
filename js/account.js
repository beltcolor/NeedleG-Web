// Account 페이지 로드 함수
function loadAccountContent() {
    fetch('ContentAccount.html') // HTML 파일 경로
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('main-content').innerHTML = data; // HTML 내용 삽입
            initAccountPage(); // 계정 페이지 초기화
            initLoginModal(); // 로그인 모달 초기화
        })
        .catch(error => console.error('Error loading content:', error));
}

// 계정 페이지 초기화 함수 (모든 사용자에게 동일한 UI 표시)
function initAccountPage() {
    // 사용자 로그인 상태 확인
    const isLoggedIn = localStorage.getItem('needleG_login') === 'true';
    
    // 로그인 상태에 따라 UI 업데이트
    updateUIBasedOnLoginStatus(isLoggedIn);
    
    // 갤러리 탭 초기화
    initGalleryTabs();
}

// 로그인 상태에 따라 UI 업데이트
function updateUIBasedOnLoginStatus(isLoggedIn) {
    // 프로필 영역 업데이트
    const profileActions = document.getElementById('profile-actions');
    
    if (isLoggedIn) {
        // 로그인된 경우 - 사용자 정보 표시
        const userData = JSON.parse(localStorage.getItem('needleG_userData') || '{}');
        
        // 프로필 정보 업데이트
        document.getElementById('user-name').textContent = userData.name || 'User';
        document.getElementById('tattoo-count').textContent = userData.tattoos || 0;
        document.getElementById('appointment-count').textContent = userData.appointments || 0;
        document.getElementById('artist-count').textContent = userData.artists || 0;
        
        // 혜택 정보 업데이트
        document.getElementById('user-tier').textContent = userData.tier || 'Bronze';
        document.getElementById('user-points').textContent = `${userData.points || 0} P`;
        document.getElementById('user-coupons').textContent = userData.coupons || 0;
        
        // 프로필 이미지 업데이트 (만약 있다면)
        if (userData.avatar) {
            document.getElementById('user-avatar').src = userData.avatar;
        }
        
        // 등급에 따른 혜택 정보 업데이트
        updateTierBenefits(userData.tier || 'Bronze');
        
        // 프로필 액션 버튼 업데이트 (로그아웃 버튼 추가)
        profileActions.innerHTML = `
            <button class="edit-profile-btn">Edit Profile</button>
            <button class="logout-btn" onclick="handleLogout()">Logout</button>
        `;
        
        // 갤러리 메시지 및 버튼 업데이트
        document.getElementById('tattoos-message').textContent = 'No tattoos added yet';
        document.getElementById('tattoos-action-btn').textContent = 'Start Designing';
        document.getElementById('tattoos-action-btn').onclick = null;
        
        document.getElementById('saved-message').textContent = 'No saved designs';
        document.getElementById('saved-action-btn').textContent = 'Browse Tattoos';
        document.getElementById('saved-action-btn').onclick = null;
        
        document.getElementById('appointments-message').textContent = 'No scheduled appointments';
        document.getElementById('appointments-action-btn').textContent = 'Schedule Appointment';
        document.getElementById('appointments-action-btn').onclick = null;
        
        // 콘텐츠 로드
        loadGridContent('tattoos');
    } else {
        // 로그인되지 않은 경우 - 게스트 정보 표시
        document.getElementById('user-name').textContent = 'Guest';
        document.getElementById('tattoo-count').textContent = '0';
        document.getElementById('appointment-count').textContent = '0';
        document.getElementById('artist-count').textContent = '0';
        
        // 혜택 정보 업데이트 (게스트 상태)
        document.getElementById('user-tier').textContent = 'Guest';
        document.getElementById('user-points').textContent = '0 P';
        document.getElementById('user-coupons').textContent = '0';
        
        // 기본 프로필 이미지
        document.getElementById('user-avatar').src = 'assets/default-avatar.png';
        
        // 게스트 혜택 안내
        const benefitsList = document.getElementById('tier-benefits-list');
        benefitsList.innerHTML = '<li>Login to view membership benefits</li>';
        
        // 프로필 액션 버튼 업데이트 (로그인 버튼 표시)
        profileActions.innerHTML = `
            <button class="login-profile-btn" onclick="showLoginModal()">Login</button>
        `;
        
        // 갤러리 메시지 및 버튼 업데이트
        document.getElementById('tattoos-message').textContent = 'Login to start your tattoo gallery';
        document.getElementById('tattoos-action-btn').textContent = 'Login';
        document.getElementById('tattoos-action-btn').onclick = showLoginModal;
        
        document.getElementById('saved-message').textContent = 'Login to save your favorite designs';
        document.getElementById('saved-action-btn').textContent = 'Login';
        document.getElementById('saved-action-btn').onclick = showLoginModal;
        
        document.getElementById('appointments-message').textContent = 'Login to schedule appointments';
        document.getElementById('appointments-action-btn').textContent = 'Login';
        document.getElementById('appointments-action-btn').onclick = showLoginModal;
    }
}

// 로그인 모달 초기화
function initLoginModal() {
    const modal = document.getElementById('login-modal');
    const closeBtn = document.querySelector('.close-modal');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// 로그인 모달 표시 함수
function showLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.style.display = 'block';
        
        // 사용자명 입력 필드에 포커스
        setTimeout(() => {
            const usernameInput = document.getElementById('username');
            if (usernameInput) {
                usernameInput.focus();
            }
        }, 300);
    }
}

// 로그인 처리 함수
function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        alert('사용자 이름과 비밀번호를 입력해주세요.');
        return;
    }
    
    // 실제 환경에서는 서버에 로그인 요청을 보내야 합니다.
    // 여기서는 데모를 위해 로컬 스토리지에 저장합니다.
    localStorage.setItem('needleG_login', 'true');
    localStorage.setItem('needleG_username', username);
    
    // 데모용 사용자 정보 저장
    const demoUserData = {
        name: username,
        avatar: 'assets/default-avatar.png',
        tattoos: 3,
        appointments: 1,
        artists: 2,
        tier: 'Silver',
        points: '1,200',
        coupons: '2'
    };
    localStorage.setItem('needleG_userData', JSON.stringify(demoUserData));
    
    // 로그인 모달 닫기
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    // UI 업데이트
    updateUIBasedOnLoginStatus(true);
    
    // 로그인 폼 초기화
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// 로그아웃 함수
function handleLogout() {
    localStorage.removeItem('needleG_login');
    localStorage.removeItem('needleG_username');
    localStorage.removeItem('needleG_userData');
    
    // UI 업데이트
    updateUIBasedOnLoginStatus(false);
}

// 사용자 프로필 데이터 로드 함수
function loadUserProfile() {
    // 로컬 스토리지에서 사용자 데이터 로드
    const userDataStr = localStorage.getItem('needleG_userData');
    if (!userDataStr) return;
    
    const userData = JSON.parse(userDataStr);
    
    // 프로필 정보 업데이트
    document.getElementById('user-name').textContent = userData.name;
    document.getElementById('tattoo-count').textContent = userData.tattoos;
    document.getElementById('appointment-count').textContent = userData.appointments;
    document.getElementById('artist-count').textContent = userData.artists;
    
    // 혜택 정보 업데이트
    document.getElementById('user-tier').textContent = userData.tier;
    document.getElementById('user-points').textContent = `${userData.points} P`;
    document.getElementById('user-coupons').textContent = `${userData.coupons}장`;
    
    // 프로필 이미지 업데이트 (만약 있다면)
    if (userData.avatar) {
        document.getElementById('user-avatar').src = userData.avatar;
    }
    
    // 등급에 따른 혜택 정보 업데이트
    updateTierBenefits(userData.tier);
}

// 등급별 혜택 정보 업데이트 함수
function updateTierBenefits(tier) {
    const benefitsList = document.getElementById('tier-benefits-list');
    if (!benefitsList) return;
    
    // 등급별 혜택 데이터
    const tierBenefits = {
        'Bronze': [
            'Birthday coupon',
            'Access to member events'
        ],
        'Silver': [
            '10% discount on services',
            'Birthday coupon',
            'Priority booking'
        ],
        'Gold': [
            '15% discount on services',
            'Birthday coupon',
            'Priority booking',
            'Artist consultation'
        ],
        'Platinum': [
            '20% discount on services',
            'Birthday coupon',
            'Priority booking',
            'Artist consultation',
            'VIP care service'
        ]
    };
    
    // 해당 등급의 혜택 목록 가져오기
    const benefits = tierBenefits[tier] || tierBenefits['Bronze'];
    
    // 혜택 목록 렌더링
    benefitsList.innerHTML = '';
    benefits.forEach(benefit => {
        const li = document.createElement('li');
        li.textContent = benefit;
        benefitsList.appendChild(li);
    });
}

// 갤러리 탭 초기화 함수
function initGalleryTabs() {
    const galleryTabs = document.querySelectorAll('.gallery-tab');
    if (!galleryTabs.length) return;
    
    galleryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 활성 탭 클래스 제거
            galleryTabs.forEach(t => t.classList.remove('active'));
            
            // 클릭한 탭 활성화
            this.classList.add('active');
            
            // 탭에 해당하는 그리드 표시
            const tabName = this.getAttribute('data-tab');
            showGalleryGrid(tabName);
        });
    });
    
    // 기본으로 '내 타투' 탭 활성화
    showGalleryGrid('tattoos');
}

// 갤러리 그리드 표시 함수
function showGalleryGrid(tabName) {
    // 모든 그리드 숨기기
    const allGrids = document.querySelectorAll('.gallery-grid');
    allGrids.forEach(grid => {
        grid.style.display = 'none';
    });
    
    // 선택한 그리드만 표시
    const selectedGrid = document.getElementById(`${tabName}-grid`);
    if (selectedGrid) {
        selectedGrid.style.display = 'grid';
        
        // 필요한 경우 그리드에 콘텐츠 로드
        loadGridContent(tabName);
    }
}

// 그리드 콘텐츠 로드 함수
function loadGridContent(gridType) {
    // 이 함수에서는 실제 데이터를 가져와 그리드에 콘텐츠를 로드합니다.
    // 현재는 데모 데이터만 표시합니다.
    
    const grid = document.getElementById(`${gridType}-grid`);
    if (!grid) return;
    
    // 기존의 empty state가 아닌 항목들 모두 제거
    const items = grid.querySelectorAll('.gallery-item');
    items.forEach(item => item.remove());
    
    // 데모 데이터 배열 (각 탭 유형에 따라 다른 데이터 사용)
    let demoData = [];
    
    // userDataStr에서 해당 유형의 데이터 수 확인
    const userDataStr = localStorage.getItem('needleG_userData');
    if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        
        if (gridType === 'tattoos' && userData.tattoos > 0) {
            // 타투 데모 데이터
            demoData = Array(userData.tattoos).fill().map((_, i) => ({
                id: i + 1,
                imageUrl: `https://picsum.photos/500/500?random=${i + 10}`,
                title: `타투 디자인 #${i + 1}`
            }));
        } else if (gridType === 'appointments' && userData.appointments > 0) {
            // 예약 데모 데이터
            demoData = Array(userData.appointments).fill().map((_, i) => ({
                id: i + 1,
                date: new Date(Date.now() + (i + 1) * 86400000).toLocaleDateString(),
                artist: `아티스트 ${i + 1}`,
                status: '예약 확정'
            }));
        }
        // saved는 빈 상태로 유지
    }
    
    // 데이터가 있으면 그리드 아이템 생성하고 빈 상태 숨기기
    if (demoData.length > 0) {
        // 빈 상태 요소 숨기기
        const emptyState = grid.querySelector('.empty-state');
        if (emptyState) {
            emptyState.style.display = 'none';
        }
        
        // 그리드 아이템 추가
        demoData.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            if (gridType === 'tattoos') {
                // 타투 이미지 표시
                galleryItem.innerHTML = `<img src="${item.imageUrl}" alt="${item.title}">`;
            } else if (gridType === 'appointments') {
                // 예약 정보 표시
                galleryItem.innerHTML = `
                    <div class="appointment-item">
                        <div class="appointment-date">${item.date}</div>
                        <div class="appointment-artist">${item.artist}</div>
                        <div class="appointment-status">${item.status}</div>
                    </div>
                `;
            }
            
            grid.insertBefore(galleryItem, emptyState);
        });
    } else {
        // 데이터가 없으면 빈 상태 표시
        const emptyState = grid.querySelector('.empty-state');
        if (emptyState) {
            emptyState.style.display = 'flex';
        }
    }
}