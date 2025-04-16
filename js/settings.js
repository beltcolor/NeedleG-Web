// Load Settings page content
function loadSettingsContent() {
    fetch('ContentSettings.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('main-content').innerHTML = data;
            // 페이지 로드 후 즉시 초기화
            setTimeout(() => {
                initSettingsPage();
            }, 100); // 약간의 지연을 두어 DOM이 완전히 로드되도록 함
        })
        .catch(error => console.error('Error loading settings content:', error));
}

// Initialize Settings page
function initSettingsPage() {
    console.log('Settings page initialized');
    
    // 현재 언어 상태 표시
    updateLanguageSettingDisplay();
    
    // 현재 테마 상태 표시
    updateThemeSettingDisplay();
    
    // 계정 로그인 상태에 따라 UI 조정
    updateSettingsBasedOnLoginStatus();
    
    // 토글 스위치 초기화 및 이벤트 설정
    setupToggleSwitches();
    
    // 설정 버튼 클릭 이벤트 설정
    setupSettingsButtons();
    
    // 사이드바 설정 로드
    loadSidebarSettings();
    
    // 다크 모드 토글 초기화
    initDarkModeToggle();
}

// 현재 언어 상태 표시
function updateLanguageSettingDisplay() {
    const currentLang = localStorage.getItem('language') || 'en';
    const langNames = {
        'en': 'English',
        'ko': '한국어',
        'pl': 'Polski'
    };
    
    // 언어 설정 옵션 찾기 (has 선택자 없이)
    const langOptions = document.querySelectorAll('.settings-option-info');
    langOptions.forEach(option => {
        const icon = option.querySelector('.material-icons');
        if (icon && icon.textContent === 'language') {
            const langText = option.querySelector('p');
            if (langText) {
                langText.textContent = `Current: ${langNames[currentLang] || 'English'}`;
            }
        }
    });
}

// 현재 테마 상태 표시
function updateThemeSettingDisplay() {
    const isLightMode = document.documentElement.classList.contains('light-mode');
    
    // 테마 설정 옵션 찾기 (has 선택자 없이)
    const themeOptions = document.querySelectorAll('.settings-option-info');
    themeOptions.forEach(option => {
        const icon = option.querySelector('.material-icons');
        if (icon && icon.textContent === 'brightness_4') {
            const themeText = option.querySelector('p');
            if (themeText) {
                themeText.textContent = `Current: ${isLightMode ? 'Light Mode' : 'Dark Mode'}`;
            }
        }
    });
}

// 로그인 상태에 따라 설정 UI 조정
function updateSettingsBasedOnLoginStatus() {
    const isLoggedIn = localStorage.getItem('needleG_login') === 'true';
    
    // 계정 설정 섹션은 로그인한 사용자만 접근 가능
    const accountSection = document.querySelector('.settings-section:first-child');
    if (accountSection) {
        if (!isLoggedIn) {
            accountSection.classList.add('disabled-section');
            
            // 계정 설정 버튼 비활성화 및 로그인 버튼으로 변경
            const settingsBtns = accountSection.querySelectorAll('.settings-btn');
            settingsBtns.forEach(btn => {
                btn.textContent = 'Sign In Required';
                btn.classList.add('disabled');
                btn.onclick = function() {
                    showLoginModal();
                };
            });
        }
    }
    
    // 로그아웃 버튼 표시 조건 (:has 선택자 없이)
    const logoutOptions = document.querySelectorAll('.settings-option');
    logoutOptions.forEach(option => {
        const icon = option.querySelector('.material-icons');
        if (icon && icon.textContent === 'logout') {
            option.style.display = isLoggedIn ? 'flex' : 'none';
        }
    });
}

// 토글 스위치 초기화 및 이벤트 설정
function setupToggleSwitches() {
    const toggleSwitches = document.querySelectorAll('.toggle-switch input[type="checkbox"]');
    
    toggleSwitches.forEach(toggle => {
        // 기존 이벤트 리스너 제거 (중복 방지)
        toggle.removeEventListener('change', handleToggleChange);
        
        // 새 이벤트 리스너 추가
        toggle.addEventListener('change', handleToggleChange);
        
        // 초기 상태 표시 업데이트
        updateToggleStatus(toggle);
    });
}

// 토글 스위치 변경 핸들러
function handleToggleChange(event) {
    const toggle = event.target;
    const settingOption = toggle.closest('.settings-option');
    const settingName = settingOption.querySelector('h4').textContent;
    
    // 리플 효과 추가
    addRippleEffect(toggle);
    
    // 상태 텍스트 업데이트
    updateToggleStatus(toggle);
    
    // 설정 저장
    saveToggleSetting(settingName, toggle.checked);
    
    // 설정 변경 효과
    settingOption.classList.add('setting-updated');
    setTimeout(() => {
        settingOption.classList.remove('setting-updated');
    }, 500);
}

// 토글 설정 저장
function saveToggleSetting(settingName, isEnabled) {
    console.log(`Setting saved: ${settingName} = ${isEnabled}`);
    
    if (settingName === 'Dark Mode') {
        setTheme(isEnabled ? 'dark' : 'light');
    } else if (settingName === 'Push Notifications') {
        localStorage.setItem('pushNotificationsEnabled', isEnabled);
    } else if (settingName === 'Email Notifications') {
        localStorage.setItem('emailNotificationsEnabled', isEnabled);
    } else if (settingName === 'Sidebar Expansion') {
        localStorage.setItem('sidebarExpandEnabled', isEnabled);
        
        // 사이드바 확장 설정 즉시 적용
        if (isEnabled) {
            document.body.classList.remove('sidebar-expand-disabled');
            // 경고 아이콘 제거
            if (typeof removeSidebarExpansionNotice === 'function') {
                removeSidebarExpansionNotice();
            }
        } else {
            document.body.classList.add('sidebar-expand-disabled');
            // 경고 아이콘 표시하지 않음
            if (typeof removeSidebarExpansionNotice === 'function') {
                removeSidebarExpansionNotice();
            }
        }
    }
}

// 사이드바 확장 설정 처리 함수
function handleSidebarExpandSetting(isEnabled) {
    // 설정을 localStorage에 저장
    localStorage.setItem('sidebarExpandEnabled', isEnabled);
    
    // body에 클래스를 추가/제거하여 사이드바 동작 제어
    if (isEnabled) {
        document.body.classList.remove('sidebar-expand-disabled');
        // 경고 아이콘 제거
        if (typeof removeSidebarExpansionNotice === 'function') {
            removeSidebarExpansionNotice();
        }
    } else {
        document.body.classList.add('sidebar-expand-disabled');
        // 경고 아이콘 표시하지 않음
        if (typeof removeSidebarExpansionNotice === 'function') {
            removeSidebarExpansionNotice();
        }
    }
    
    console.log('Sidebar expansion setting updated:', isEnabled);
}

// 초기화 시 사이드바 설정 로드
function loadSidebarSettings() {
    const sidebarExpandToggle = document.getElementById('sidebar-expand-toggle');
    if (sidebarExpandToggle) {
        // localStorage에서 설정 불러오기
        const isEnabled = localStorage.getItem('sidebarExpandEnabled') !== 'false';
        sidebarExpandToggle.checked = isEnabled;
        
        // 현재 설정 적용
        handleSidebarExpandSetting(isEnabled);
        
        // 토글 상태 표시 업데이트
        updateToggleStatus(sidebarExpandToggle);
    }
}

// 토글 스위치 상태 표시 업데이트
function updateToggleStatus(toggle) {
    const settingOption = toggle.closest('.settings-option');
    const statusText = settingOption.querySelector('.settings-option-text p');
    const settingName = settingOption.querySelector('h4').textContent;
    
    if (statusText) {
        if (settingName === 'Push Notifications') {
            statusText.textContent = toggle.checked ? 'Push Notifications is enabled' : 'Push Notifications is disabled';
        } else if (settingName === 'Email Notifications') {
            statusText.textContent = toggle.checked ? 'Email Notifications is enabled' : 'Email Notifications is disabled';
        } else if (settingName === 'Sidebar Expansion') {
            statusText.textContent = toggle.checked ? 'Allow sidebar to expand on hover' : 'Sidebar expansion is disabled';
        }
    }
}

// 리플 효과 추가
function addRippleEffect(toggle) {
    const toggleSwitch = toggle.closest('.toggle-switch');
    
    // 기존 리플 요소 제거
    const existingRipple = toggleSwitch.querySelector('.toggle-ripple');
    if (existingRipple) {
        existingRipple.remove();
    }
    
    // 새 리플 요소 추가
    const ripple = document.createElement('span');
    ripple.classList.add('toggle-ripple');
    toggleSwitch.appendChild(ripple);
    
    // 애니메이션 완료 후 요소 제거
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// 로그아웃 핸들러 함수
function handleLogout() {
    // 로그아웃 처리
    localStorage.setItem('needleG_login', 'false');
    console.log('User logged out');
    
    // 설정 페이지 UI 업데이트
    updateSettingsBasedOnLoginStatus();
    
    // 알림 표시
    alert("로그아웃 되었습니다.");
}

// 설정 버튼 이벤트 설정
function setupSettingsButtons() {
    // 일반 설정 버튼
    const settingsButtons = document.querySelectorAll('.settings-btn:not([onclick])');
    settingsButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const settingName = this.closest('.settings-option').querySelector('h4').textContent;
            console.log(`Button clicked for: ${settingName}`);
            
            // 실제 구현에서는 각 설정에 맞는 기능 추가
            alert(`This feature (${settingName}) will be implemented soon.`);
        });
    });
    
    // 로그아웃 버튼 이벤트 설정 (이미 onclick이 설정된 버튼)
    const logoutBtn = document.querySelector('.signout-btn');
    if (logoutBtn) {
        // 기존 이벤트 제거 후 새 이벤트 추가
        logoutBtn.onclick = handleLogout;
    }
}

// 언어 변경 이벤트 리스너 추가
document.addEventListener('languageChanged', function() {
    console.log('Language changed event detected');
    if (document.querySelector('.settings-container')) {
        updateLanguageSettingDisplay();
    }
});

// 테마 변경 이벤트 리스너 추가
document.addEventListener('themeChanged', function() {
    console.log('Theme changed event detected in settings.js');
    
    // 다크 모드 토글 슬라이더 상태 업데이트
    updateDarkModeToggle();
});

// 로그인 상태 변경 이벤트 리스너 추가
document.addEventListener('loginStatusChanged', function() {
    console.log('Login status changed event detected');
    if (document.querySelector('.settings-container')) {
        updateSettingsBasedOnLoginStatus();
    }
});

// 다크 모드 토글 초기화
function initDarkModeToggle() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        // 현재 테마 상태에 따라 토글 상태 설정
        const isLightMode = document.documentElement.classList.contains('light-mode');
        darkModeToggle.checked = !isLightMode;
        
        // 다크 모드 토글 이벤트 리스너 설정
        darkModeToggle.addEventListener('change', function() {
            const isDarkMode = this.checked;
            setTheme(isDarkMode ? 'dark' : 'light');
            
            // 설정 변경 효과
            const settingOption = this.closest('.settings-option');
            if (settingOption) {
                settingOption.classList.add('setting-updated');
                setTimeout(() => {
                    settingOption.classList.remove('setting-updated');
                }, 500);
            }
            
            // 리플 효과 추가
            addRippleEffect(this);
            
            // 상태 텍스트 업데이트
            updateThemeSettingDisplay();
        });
    }
}

// 다크 모드 토글 상태 업데이트 함수
function updateDarkModeToggle() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        // 현재 테마 상태에 따라 토글 상태 설정
        const isLightMode = document.documentElement.classList.contains('light-mode');
        darkModeToggle.checked = !isLightMode;
    }
}

// 테마 설정 함수
function setTheme(theme) {
    if (theme === 'light') {
        document.documentElement.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
        
        // 아이콘 업데이트
        const themeIcons = document.querySelectorAll('.theme-toggle .icon, .theme-toggle-sidebar .material-icons');
        themeIcons.forEach(icon => {
            icon.textContent = 'light_mode';
        });
    } else {
        document.documentElement.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
        
        // 아이콘 업데이트
        const themeIcons = document.querySelectorAll('.theme-toggle .icon, .theme-toggle-sidebar .material-icons');
        themeIcons.forEach(icon => {
            icon.textContent = 'dark_mode';
        });
    }
    
    // translations.js의 함수를 사용하여 테마 텍스트 업데이트
    const currentLang = localStorage.getItem('language') || 'en';
    updateUITexts(currentLang);
    
    // 설정 페이지의 다크 모드 토글 슬라이더 업데이트
    updateDarkModeToggle();
    
    // 테마 변경 이벤트 발생
    const themeChangedEvent = new Event('themeChanged');
    document.dispatchEvent(themeChangedEvent);
    console.log('Theme change event dispatched');
}

// 함수를 전역으로 등록
window.setTheme = setTheme; 