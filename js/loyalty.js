// Loyalty 페이지 로드 함수
function loadLoyaltyContent() {
    fetch('ContentLoyalty.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('main-content').innerHTML = data;
            initLoyaltyPage();
        })
        .catch(error => console.error('Error loading loyalty content:', error));
}

// Loyalty 페이지 초기화 함수
function initLoyaltyPage() {
    console.log('Loyalty 페이지 초기화');
    
    // 사용자의 로그인 상태 확인
    const isLoggedIn = localStorage.getItem('needleG_login') === 'true';
    
    // 로그인 상태에 따라 컨텐츠 업데이트
    updateLoyaltyStatus(isLoggedIn);
}

// 로열티 상태 업데이트 함수
function updateLoyaltyStatus(isLoggedIn) {
    const currentLoyaltyLevel = document.getElementById('current-loyalty-level');
    const loyaltyPoints = document.getElementById('loyalty-points');
    const nextLevelPoints = document.getElementById('next-level-points');
    const loyaltyProgressBar = document.getElementById('loyalty-progress-bar');
    
    if (isLoggedIn) {
        // 실제로는 서버에서 사용자의 로열티 데이터를 가져와야 함
        // 여기서는 더미 데이터 사용
        const userData = {
            level: 'Standard',
            points: 120,
            nextLevel: 'Premium',
            nextLevelPoints: 500,
            progress: 24
        };
        
        if (currentLoyaltyLevel) currentLoyaltyLevel.textContent = userData.level;
        if (loyaltyPoints) loyaltyPoints.textContent = userData.points;
        if (nextLevelPoints) nextLevelPoints.textContent = userData.nextLevelPoints;
        if (loyaltyProgressBar) loyaltyProgressBar.style.width = userData.progress + '%';
    } else {
        // 비로그인 상태인 경우 기본 데이터 표시
        if (currentLoyaltyLevel) currentLoyaltyLevel.textContent = 'Guest';
        if (loyaltyPoints) loyaltyPoints.textContent = '0';
        if (nextLevelPoints) nextLevelPoints.textContent = '500';
        if (loyaltyProgressBar) loyaltyProgressBar.style.width = '0%';
    }
}
