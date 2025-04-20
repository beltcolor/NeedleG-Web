// 페이지가 로드될 때 기본 콘텐츠를 불러옵니다
document.addEventListener('DOMContentLoaded', function() {
    // 페이지 관리를 위한 전역 객체 초기화
    window.pages = {};
    
    // URL 해시 기반 라우팅 처리
    function handleHashChange() {
        const hash = window.location.hash.substring(1); // '#' 제거
        if (hash) {
            navigateTo(hash);
            updateActiveTab(hash);
        } else {
            // 기본 페이지 로드
            navigateTo('home');
            updateActiveTab('home');
        }
    }
    
    // 페이지 로드 시 해시 확인
    handleHashChange();
    
    // 해시 변경 이벤트 리스너 추가
    window.addEventListener('hashchange', handleHashChange);
    
    // 저장된 테마 설정을 불러옵니다
    initTheme();
    
    // 저장된 언어 설정을 불러옵니다
    initLanguage();
    
    // 네비게이션 탭 버튼에 클릭 이벤트 리스너 설정
    setupNavTabs();

    // 메뉴 항목 클릭 시 메뉴 모달 닫기
    document.addEventListener('click', function(e) {
        // 메뉴 항목 클릭 시 닫기
        if (e.target.closest('.menu-list a')) {
            const menuModal = document.getElementById('menu-modal');
            if (menuModal) {
                menuModal.style.display = 'none';
                // 메뉴 버튼 아이콘 업데이트
                const menuButton = document.getElementById('menu-button');
                if (menuButton) {
                    const menuIcon = menuButton.querySelector('i');
                    if (menuIcon) {
                        menuIcon.textContent = 'menu';
                    }
                }
            }
        }
    });
    
    // 다크 모드 토글 버튼 이벤트 리스너
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            toggleTheme();
            
            // 모달 닫기
            const menuModal = document.getElementById('menu-modal');
            if (menuModal) {
                menuModal.style.display = 'none';
                
                // 메뉴 버튼 아이콘 업데이트
                const menuButton = document.getElementById('menu-button');
                if (menuButton) {
                    const menuIcon = menuButton.querySelector('i');
                    if (menuIcon) {
                        menuIcon.textContent = 'menu';
                    }
                }
            }
        });
    }
});

// 네비게이션 탭 버튼 설정 함수
function setupNavTabs() {
    console.log("네비게이션 탭 버튼 설정 시작");
    
    // 탭 버튼만 선택
    const tabButtons = document.querySelectorAll('.tab-button');
    
    console.log("네비게이션 탭 버튼 수: ", tabButtons.length);
    
    // 초기 활성 탭 설정
    const initialActivePage = window.location.hash.substring(1) || 'home';
    updateActiveTab(initialActivePage);
    
    // 각 탭 버튼에 이벤트 리스너 추가 전 디버깅용 콘솔 출력
    tabButtons.forEach((button, index) => {
        console.log(`버튼 ${index}: ${button.getAttribute('data-page')}, 클래스: ${button.className}`);
    });
    
    // 각 탭 버튼에 인라인 onclick 추가
    tabButtons.forEach(button => {
        const page = button.getAttribute('data-page');
        // 인라인 이벤트 핸들러 추가
        button.setAttribute('onclick', `window.location.hash='${page}'`);
        console.log(`인라인 onclick 이벤트 추가: ${page}`);
    });
}

// 활성 탭 업데이트 함수
function updateActiveTab(activePage) {
    const tabButtons = document.querySelectorAll('.tab-button, .sidebar-button');
    
    // 모든 탭에서 활성 클래스 제거
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // 현재 페이지에 해당하는 탭에 활성 클래스 추가
    const activeTabButton = document.querySelector(`.tab-button[data-page="${activePage}"]`);
    if (activeTabButton) {
        activeTabButton.classList.add('active');
    }
    
    // 사이드바의 버튼에도 활성 클래스 추가
    const activeSidebarButton = document.querySelector(`.sidebar-button[data-page="${activePage}"]`);
    if (activeSidebarButton) {
        activeSidebarButton.classList.add('active');
    }
}

// 페이지 네비게이션 함수 개선
async function navigateTo(page) {
    const container = document.getElementById('main-content');
    try {
        let content;
        // 프로필 페이지 라우팅 처리
        if (page.startsWith('profile/')) {
            const username = page.split('/')[1];
            if (username) {
                // 피드가 로드되었는지 확인하고, 로드되지 않았다면 로드
                if (typeof navigateToProfile === 'function') {
                    // 프로필 페이지로 즉시 이동
                    navigateToProfile(username);
                } else {
                    // feed.js가 로드되지 않은 경우, 로드 후 즉시 이동
                    await loadFeedContent();
                    navigateToProfile(username);
                }
                return;
            }
        }
        
        switch(page) {
            case 'home':
                await loadHomeContent();
                break;
            case 'tattoo':
                await loadTattooContent();
                break;
            case 'browse':
                await loadBrowseContent();
                break;
            case 'account':
                await loadAccountContent();
                break;
            case 'settings':
                await loadSettingsContent();
                break;
            case 'createNFT':
                await loadCreateNFTContent();
                break;
            case 'loyalty':
                await loadLoyaltyContent();
                break;
            case 'feed':
                await loadFeedContent();
                break;
            case 'help':
                await loadHelpContent();
                break;
            default:
                console.error('알 수 없는 페이지:', page);
                container.innerHTML = '<p>요청한 페이지를 찾을 수 없습니다.</p>';
        }

    } catch (error) {
        console.error('페이지 로드 중 오류:', error);
        container.innerHTML = '<p>콘텐츠를 불러오는데 실패했습니다.</p>';
    }
}

// 테마 초기화 함수
function initTheme() {
    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme === 'light') {
        setTheme('light');
    } else if (currentTheme === 'dark') {
        setTheme('dark');
    } else {
        // 기본 설정 (시스템 설정 따르기)
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // 시스템이 다크 모드인 경우
            setTheme('dark');
        } else {
            // 시스템이 라이트 모드인 경우
            setTheme('light');
        }
    }
}

// 테마 전환 함수
function toggleTheme() {
    // 현재 테마 상태 확인
    const isLightMode = document.documentElement.classList.contains('light-mode');
    
    // 테마 변경 적용
    setTheme(isLightMode ? 'dark' : 'light');
    
    // 오버레이가 표시된 경우 숨김
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay && overlay.style.opacity !== '0') {
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
        overlay.style.pointerEvents = 'none';
    }
}

// 테마 설정 함수
function setTheme(theme) {
    const rootElement = document.documentElement;
    
    if (theme === 'light') {
        rootElement.classList.add('light-mode');
        rootElement.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        
        // 테마 토글 버튼의 아이콘 변경
        const themeToggleIcon = document.querySelector('.theme-toggle .icon');
        if (themeToggleIcon) {
            themeToggleIcon.textContent = 'light_mode';
        }
        
        // 사이드바 테마 토글 버튼의 텍스트 변경
        const themeText = document.querySelector('.theme-toggle-sidebar .button-text');
        if (themeText) {
            themeText.textContent = getTranslation('lightMode');
        }
    } else {
        rootElement.classList.add('dark-mode');
        rootElement.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
        
        // 테마 토글 버튼의 아이콘 변경
        const themeToggleIcon = document.querySelector('.theme-toggle .icon');
        if (themeToggleIcon) {
            themeToggleIcon.textContent = 'dark_mode';
        }
        
        // 사이드바 테마 토글 버튼의 텍스트 변경
        const themeText = document.querySelector('.theme-toggle-sidebar .button-text');
        if (themeText) {
            themeText.textContent = getTranslation('darkMode');
        }
    }
}

// 언어 초기화 함수
function initLanguage() {
    const currentLang = localStorage.getItem('language') || 'en';
    document.documentElement.setAttribute('lang', currentLang);
    
    // 언어 아이콘 및 텍스트 초기화
    updateLanguageDisplay(currentLang);
    
    // translations.js의 함수를 사용하여 UI 텍스트 업데이트
    updateUITexts(currentLang);
}

// 언어 표시 업데이트 함수
function updateLanguageDisplay(lang) {
    // 언어 아이콘 업데이트
    const languageIcon = document.getElementById('current-language-icon');
    if (languageIcon) {
        languageIcon.src = `assets/flags/${lang}.png`;
        languageIcon.alt = getTranslation('language', lang);
    }
    
    // 언어 텍스트 업데이트
    const languageText = document.querySelector('.language-toggle .button-text');
    if (languageText) {
        languageText.textContent = getTranslation('language', lang);
    }
    
    // 활성 언어 클래스 업데이트
    const options = document.querySelectorAll('.language-option');
    options.forEach(option => {
        if (option.getAttribute('data-lang') === lang) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

// 언어 변경 함수
function changeLanguage(lang) {
    localStorage.setItem('language', lang);
    document.documentElement.setAttribute('lang', lang);
    
    // 언어 아이콘 및 텍스트 업데이트
    updateLanguageDisplay(lang);
    
    // UI 텍스트 업데이트
    updateUITexts(lang);
    
    // 언어 변경 커스텀 이벤트 발생
    const languageChangedEvent = new Event('languageChanged');
    document.dispatchEvent(languageChangedEvent);
}

// 언어 토글 함수 (팝업 표시/숨김)
function toggleLanguage() {
    const languagePopup = document.getElementById('language-popup');
    
    if (languagePopup) {
        // 현재 표시 상태 확인 후 반전
        if (languagePopup.style.display === 'block') {
            languagePopup.style.display = 'none';
        } else {
            languagePopup.style.display = 'block';
        }
    }
}

// 페이지 라우팅 함수
function loadPageContent(page) {
    console.log('Loading page:', page);

    // 모든 탭 버튼에서 active 클래스 제거
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // 클릭된 탭에 active 클래스 추가
    const currentTabButton = document.querySelector(`.tab-button[data-page="${page}"]`);
    if (currentTabButton) {
        currentTabButton.classList.add('active');
    }

    // 사이드바 버튼에서도 active 클래스 제거 및 추가
    document.querySelectorAll('.sidebar-button').forEach(button => {
        button.classList.remove('active');
    });
    const currentSidebarButton = document.querySelector(`.sidebar-button[data-page="${page}"]`);
    if (currentSidebarButton) {
        currentSidebarButton.classList.add('active');
    }

    switch(page) {
        case 'home':
            loadHomeContent();
            break;
        case 'feed':
            loadFeedContent();
            break;
        case 'browse':
            loadBrowseContent();
            break;
        case 'tattoo':
            loadTattooContent();
            break;
        case 'account':
            loadAccountContent();
            break;
        case 'settings':
            loadSettingsContent();
            break;
        case 'createNFT':
            loadCreateNFTContent();
            break;
        case 'loyalty':
            loadLoyaltyContent();
            break;
        case 'help':
            loadHelpContent();
            break;
        default:
            loadHomeContent();
    }
}




