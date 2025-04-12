// 페이지가 로드될 때 기본 콘텐츠를 불러옵니다
document.addEventListener('DOMContentLoaded', function() {
    // 기본적으로 'home' 페이지를 로드합니다
    navigateTo('home');
    
    // 저장된 테마 설정을 불러옵니다
    initTheme();
    
    // 네비게이션 탭 버튼에 클릭 이벤트 리스너 추가
    initNavTabs();
});

// 네비게이션 탭 버튼 초기화 함수
function initNavTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    // 초기 활성 탭 설정
    const initialActivePage = 'home';
    updateActiveTab(initialActivePage);
    
    // 각 탭 버튼에 클릭 이벤트 추가
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            navigateTo(page);
            updateActiveTab(page);
        });
    });
}

// 활성 탭 업데이트 함수
function updateActiveTab(activePage) {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    // 모든 탭에서 활성 클래스 제거
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // 현재 페이지에 해당하는 탭에 활성 클래스 추가
    const activeButton = document.querySelector(`.tab-button[data-page="${activePage}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// 페이지 네비게이션 함수 개선
async function navigateTo(page) {
    const container = document.getElementById('main-content');
    try {
        let content;
        switch(page) {
            case 'home':
                await loadHomeContent();
                break;
            case 'tattoo':
                await loadTattooContent();
                break;
            case 'search':
                await loadSearchContent();
                break;
            case 'account':
                await loadAccountContent();
                break;
        }

    } catch (error) {
        console.error('페이지 로드 중 오류:', error);
        container.innerHTML = '<p>콘텐츠를 불러오는데 실패했습니다.</p>';
    }
}

// 테마 초기화 함수
function initTheme() {
    const currentTheme = localStorage.getItem('theme');
    console.log('저장된 테마:', currentTheme); // 디버깅용 로그
    
    if (currentTheme === 'light') {
        document.documentElement.classList.add('light-mode');
        document.querySelector('.theme-toggle .icon').textContent = 'dark_mode';
    } else if (currentTheme === 'dark') {
        document.documentElement.classList.remove('light-mode');
        document.querySelector('.theme-toggle .icon').textContent = 'light_mode';
    } else {
        // 저장된 테마가 없으면 브라우저의 기본 테마 설정을 확인
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // 브라우저가 다크 모드를 선호하는 경우
            document.documentElement.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
            document.querySelector('.theme-toggle .icon').textContent = 'light_mode';
            console.log('브라우저 기본 테마(다크)로 설정됨');
        } else {
            // 브라우저가 라이트 모드를 선호하는 경우
            document.documentElement.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
            document.querySelector('.theme-toggle .icon').textContent = 'dark_mode';
            console.log('브라우저 기본 테마(라이트)로 설정됨');
        }
    }
}

// 테마 전환 함수
function toggleTheme() {
    if (document.documentElement.classList.contains('light-mode')) {
        // 라이트 모드 -> 다크 모드
        document.documentElement.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
        document.querySelector('.theme-toggle .icon').textContent = 'light_mode';
        console.log('다크 모드로 변경됨'); // 디버깅용 로그
    } else {
        // 다크 모드 -> 라이트 모드
        document.documentElement.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
        document.querySelector('.theme-toggle .icon').textContent = 'dark_mode';
        console.log('라이트 모드로 변경됨'); // 디버깅용 로그
    }
}