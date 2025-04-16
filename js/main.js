// 페이지가 로드될 때 기본 콘텐츠를 불러옵니다
document.addEventListener('DOMContentLoaded', function() {
    // 기본적으로 'home' 페이지를 로드합니다
    navigateTo('home');
    
    // 저장된 테마 설정을 불러옵니다
    initTheme();
    
    // 저장된 언어 설정을 불러옵니다
    initLanguage();
    
    // 네비게이션 탭 버튼에 클릭 이벤트 리스너 추가
    initNavTabs();
    
    // 사이드바 오버레이 제어
    setupSidebarOverlay();
    
    // 언어 팝업 초기화
    setupLanguagePopup();
});

// 네비게이션 탭 버튼 초기화 함수
function initNavTabs() {
    // 테마와 언어 버튼을 제외한 모든 탭 버튼 선택
    const tabButtons = document.querySelectorAll('.tab-button, .sidebar-button:not(.theme-toggle-sidebar):not(.language-toggle)');
    
    // 초기 활성 탭 설정
    const initialActivePage = 'home';
    updateActiveTab(initialActivePage);
    
    // 각 탭 버튼에 클릭 이벤트 추가
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            if (page) { // data-page 속성이 있는 경우에만 페이지 이동
                navigateTo(page);
                updateActiveTab(page);
                
                // 사이드바 버튼 클릭 시 사이드바 최소화
                const sidebar = document.querySelector('.sidebar');
                if (sidebar && this.classList.contains('sidebar-button')) {
                    // 인라인 스타일 대신 클래스로 제어
                    sidebar.classList.add('sidebar-collapsed');
                    
                    // 오버레이도 함께 숨김
                    const overlay = document.querySelector('.sidebar-overlay');
                    if (overlay) {
                        overlay.style.opacity = '0';
                        overlay.style.visibility = 'hidden';
                        overlay.style.pointerEvents = 'none';
                    }
                    
                    // 잠시 후 클래스 제거하여 hover 효과가 다시 작동하도록 함
                    setTimeout(() => {
                        sidebar.classList.remove('sidebar-collapsed');
                    }, 300);
                }
            }
        });
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
            case 'settings':
                await loadSettingsContent();
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
    // 현재 언어 가져오기
    const currentLang = localStorage.getItem('language') || 'en';
    
    if (currentTheme === 'light') {
        document.documentElement.classList.add('light-mode');
        // 라이트 모드일 때 해 아이콘 표시
        document.querySelector('.theme-toggle .icon').textContent = 'light_mode';
        
        // 사이드바 토글 버튼 아이콘 설정
        const sidebarToggle = document.querySelector('.theme-toggle-sidebar .material-icons');
        if (sidebarToggle) {
            sidebarToggle.textContent = 'light_mode';
        }
        
        // 테마 텍스트 업데이트
        updateThemeText(currentLang, true);
    } else if (currentTheme === 'dark') {
        document.documentElement.classList.remove('light-mode');
        // 다크 모드일 때 달 아이콘 표시
        document.querySelector('.theme-toggle .icon').textContent = 'dark_mode';
        
        // 사이드바 토글 버튼 아이콘 설정
        const sidebarToggle = document.querySelector('.theme-toggle-sidebar .material-icons');
        if (sidebarToggle) {
            sidebarToggle.textContent = 'dark_mode';
        }
        
        // 테마 텍스트 업데이트
        updateThemeText(currentLang, false);
    } else {
        // 기본 설정 (시스템 설정 따르기)
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // 시스템이 다크 모드인 경우
            document.documentElement.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
            // 다크 모드일 때 달 아이콘 표시
            document.querySelector('.theme-toggle .icon').textContent = 'dark_mode';
            
            // 사이드바 토글 버튼 아이콘 설정
            const sidebarToggle = document.querySelector('.theme-toggle-sidebar .material-icons');
            if (sidebarToggle) {
                sidebarToggle.textContent = 'dark_mode';
            }
            
            // 테마 텍스트 업데이트
            updateThemeText(currentLang, false);
        } else {
            // 시스템이 라이트 모드인 경우
            document.documentElement.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
            // 라이트 모드일 때 해 아이콘 표시
            document.querySelector('.theme-toggle .icon').textContent = 'light_mode';
            
            // 사이드바 토글 버튼 아이콘 설정
            const sidebarToggle = document.querySelector('.theme-toggle-sidebar .material-icons');
            if (sidebarToggle) {
                sidebarToggle.textContent = 'light_mode';
            }
            
            // 테마 텍스트 업데이트
            updateThemeText(currentLang, true);
        }
    }
}

// 테마 전환 함수
function toggleTheme() {
    // 현재 언어 가져오기
    const currentLang = localStorage.getItem('language') || 'en';
    
    if (document.documentElement.classList.contains('light-mode')) {
        // 다크 모드로 전환
        document.documentElement.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
        // 다크 모드일 때 달 아이콘 표시
        document.querySelector('.theme-toggle .icon').textContent = 'dark_mode';
        
        // 사이드바 토글 버튼 아이콘 변경
        const sidebarToggle = document.querySelector('.theme-toggle-sidebar .material-icons');
        if (sidebarToggle) {
            sidebarToggle.textContent = 'dark_mode';
        }
        
        // 테마 텍스트 업데이트
        updateThemeText(currentLang, false);
    } else {
        // 라이트 모드로 전환
        document.documentElement.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
        // 라이트 모드일 때 해 아이콘 표시
        document.querySelector('.theme-toggle .icon').textContent = 'light_mode';
        
        // 사이드바 토글 버튼 아이콘 변경
        const sidebarToggle = document.querySelector('.theme-toggle-sidebar .material-icons');
        if (sidebarToggle) {
            sidebarToggle.textContent = 'light_mode';
        }
        
        // 테마 텍스트 업데이트
        updateThemeText(currentLang, true);
    }
    
    // 사이드바 최소화 효과 적용
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.add('sidebar-collapsed');
        
        // 오버레이도 함께 숨김
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
            overlay.style.pointerEvents = 'none';
        }
        
        // 잠시 후 클래스 제거하여 hover 효과가 다시 작동하도록 함
        setTimeout(() => {
            sidebar.classList.remove('sidebar-collapsed');
        }, 300);
    }
    
    // 테마 변경 커스텀 이벤트 발생
    const themeChangedEvent = new Event('themeChanged');
    document.dispatchEvent(themeChangedEvent);
    console.log('Theme change event dispatched');
}

// 테마 텍스트 업데이트 함수
function updateThemeText(lang, isLightMode) {
    const translations = {
        en: {
            lightMode: "Light Mode",
            darkMode: "Dark Mode"
        },
        ko: {
            lightMode: "라이트 모드",
            darkMode: "다크 모드"
        },
        pl: {
            lightMode: "Tryb jasny",
            darkMode: "Tryb ciemny"
        }
    };
    
    const currentTranslation = translations[lang] || translations.en;
    const themeText = isLightMode ? currentTranslation.lightMode : currentTranslation.darkMode;
    
    // 사이드바 테마 버튼 텍스트 업데이트
    const themeButton = document.querySelector('.theme-toggle-sidebar .button-text');
    if (themeButton) {
        themeButton.textContent = themeText;
    }
}

// 사이드바 오버레이 설정
function setupSidebarOverlay() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (sidebar && overlay) {
        // 사이드바에 마우스가 올라갔을 때 오버레이 표시
        sidebar.addEventListener('mouseenter', function() {
            overlay.style.opacity = '1';
            overlay.style.visibility = 'visible';
            overlay.style.pointerEvents = 'auto';
        });
        
        // 사이드바에서 마우스가 떠났을 때 오버레이 숨김
        sidebar.addEventListener('mouseleave', function() {
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
            overlay.style.pointerEvents = 'none';
        });
        
        // 오버레이 클릭 시 사이드바 닫기 기능 (모바일)
        overlay.addEventListener('click', function() {
            sidebar.style.width = '50px'; // 사이드바 축소
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
            overlay.style.pointerEvents = 'none';
        });
    }
}

// 언어 설정 초기화
function initLanguage() {
    const currentLang = localStorage.getItem('language') || 'en';
    document.documentElement.setAttribute('lang', currentLang);
    updateActiveLanguage(currentLang);
    updateLanguageIcon(currentLang);
    
    // UI 텍스트도 함께 업데이트
    updateUILanguage(currentLang);
}

// 언어 팝업 설정
function setupLanguagePopup() {
    const languageToggle = document.querySelector('.language-toggle');
    const languagePopup = document.getElementById('language-popup');
    const closePopupBtn = document.getElementById('close-language-popup');
    const languageOptions = document.querySelectorAll('.language-option');
    
    // 언어 토글 버튼 클릭 시 팝업 표시
    if (languageToggle) {
        languageToggle.addEventListener('click', function(e) {
            e.stopPropagation(); // 이벤트 버블링 방지
            languagePopup.style.display = 'block';
            
            // 사이드바 최소화
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.classList.add('sidebar-collapsed');
                
                // 사이드바 오버레이 숨김
                const sidebarOverlay = document.querySelector('.sidebar-overlay');
                if (sidebarOverlay) {
                    sidebarOverlay.style.opacity = '0';
                    sidebarOverlay.style.visibility = 'hidden';
                    sidebarOverlay.style.pointerEvents = 'none';
                }
                
                setTimeout(() => {
                    sidebar.classList.remove('sidebar-collapsed');
                }, 300);
            }
        });
    }
    
    // 팝업 닫기 버튼
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // 이벤트 버블링 방지
            languagePopup.style.display = 'none';
        });
    }
    
    // ESC 키 눌렀을 때 언어 팝업 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && languagePopup.style.display === 'block') {
            languagePopup.style.display = 'none';
        }
    });
    
    // 모달 바깥 클릭 시 팝업 닫기
    window.addEventListener('click', function(event) {
        if (event.target === languagePopup) {
            languagePopup.style.display = 'none';
        }
    });
    
    // 언어 옵션 클릭 이벤트
    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            changeLanguage(lang);
            
            // 팝업 닫기
            languagePopup.style.display = 'none';
        });
    });
    
    // 현재 선택된 언어 표시
    updateActiveLanguage(localStorage.getItem('language') || 'en');
}

// 언어 변경 함수
function changeLanguage(lang) {
    localStorage.setItem('language', lang);
    document.documentElement.setAttribute('lang', lang);
    updateActiveLanguage(lang);
    updateLanguageIcon(lang);
    
    // 여기에 언어에 따른 텍스트 변경 로직 추가
    updateUILanguage(lang);
    
    // 언어 변경 커스텀 이벤트 발생
    const languageChangedEvent = new Event('languageChanged');
    document.dispatchEvent(languageChangedEvent);
    console.log('Language change event dispatched');
}

// 활성화된 언어 옵션 표시
function updateActiveLanguage(lang) {
    const options = document.querySelectorAll('.language-option');
    options.forEach(option => {
        if (option.getAttribute('data-lang') === lang) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

// UI 텍스트 업데이트
function updateUILanguage(lang) {
    // 언어에 따른 텍스트 데이터
    const translations = {
        en: {
            home: "Home",
            search: "Search",
            profile: "Profile",
            tattoo: "Tattoo",
            help: "Help",
            lightMode: "Light Mode",
            darkMode: "Dark Mode",
            language: "English",  // 영어 선택 시 "English"로 표시
            settings: "Settings",
            selectLanguage: "Select Language"
        },
        ko: {
            home: "홈",
            search: "검색",
            profile: "프로필",
            tattoo: "타투",
            help: "도움말",
            lightMode: "라이트 모드",
            darkMode: "다크 모드",
            language: "한국어",  // 한국어 선택 시 "한국어"로 표시
            settings: "설정",
            selectLanguage: "언어 선택"
        },
        pl: {
            home: "Strona główna",
            search: "Szukaj",
            profile: "Profil",
            tattoo: "Tatuaż",
            help: "Pomoc",
            lightMode: "Tryb jasny",
            darkMode: "Tryb ciemny",
            language: "Polski",  // 폴란드어 선택 시 "Polski"로 표시
            settings: "Ustawienia",
            selectLanguage: "Wybierz język"
        }
    };
    
    // 현재 언어에 해당하는 번역 데이터
    const currentTranslation = translations[lang] || translations.en;
    
    // 현재 테마 모드 확인
    const isLightMode = document.documentElement.classList.contains('light-mode');
    const themeText = isLightMode ? currentTranslation.lightMode : currentTranslation.darkMode;
    
    // 사이드바 버튼 텍스트 업데이트
    document.querySelector('.sidebar-button[data-page="home"] .button-text').textContent = currentTranslation.home;
    document.querySelector('.sidebar-button[data-page="search"] .button-text').textContent = currentTranslation.search;
    document.querySelector('.sidebar-button[data-page="account"] .button-text').textContent = currentTranslation.profile;
    document.querySelector('.sidebar-button[data-page="tattoo"] .button-text').textContent = currentTranslation.tattoo;
    document.querySelector('.sidebar-button[data-page="help"] .button-text').textContent = currentTranslation.help;
    document.querySelector('.theme-toggle-sidebar .button-text').textContent = themeText;
    document.querySelector('.language-toggle .button-text').textContent = currentTranslation.language;
    document.querySelector('.sidebar-button[data-page="settings"] .button-text').textContent = currentTranslation.settings;
}

// 언어 토글 함수 (팝업 표시)
function toggleLanguage() {
    const languagePopup = document.getElementById('language-popup');
    
    if (languagePopup) {
        languagePopup.style.display = 'block';
    }
    
    // 사이드바 최소화 효과 적용
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.add('sidebar-collapsed');
        
        // 오버레이도 함께 숨김
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
            overlay.style.pointerEvents = 'none';
        }
        
        // 잠시 후 클래스 제거하여 hover 효과가 다시 작동하도록 함
        setTimeout(() => {
            sidebar.classList.remove('sidebar-collapsed');
        }, 300);
    }
}

// 사이드바 언어 아이콘 업데이트
function updateLanguageIcon(lang) {
    const languageIcon = document.getElementById('current-language-icon');
    if (languageIcon) {
        languageIcon.src = `assets/flags/${lang}.png`;
        languageIcon.alt = lang.toUpperCase();
    }
}