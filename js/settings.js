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

// 토글 스위치 설정
function setupToggleSwitches() {
    const toggleSwitches = document.querySelectorAll('.toggle-switch input');
    console.log('Toggle switches found:', toggleSwitches.length);
    
    if (toggleSwitches.length === 0) {
        console.warn('토글 스위치를 찾을 수 없습니다');
        return;
    }
    
    // 초기 상태 설정
    toggleSwitches.forEach(toggle => {
        // 기존 이벤트 리스너 제거 (중복 방지)
        toggle.removeEventListener('change', handleToggleChange);
        
        // 초기 상태 설정
        updateToggleStatus(toggle);
        
        // 변경 이벤트 리스너 추가
        toggle.addEventListener('change', handleToggleChange);
    });
}

// 토글 변경 핸들러 함수 (이벤트 리스너 중복 방지용)
function handleToggleChange() {
    console.log('Toggle changed:', this.checked);
    // 알림 설정 저장 (실제 구현에서는 서버로 전송)
    updateToggleStatus(this);
    
    const settingOption = this.closest('.settings-option');
    const settingName = settingOption.querySelector('h4').textContent;
    const isEnabled = this.checked;
    console.log(`Setting "${settingName}" changed to: ${isEnabled}`);
    
    // 토글 변경 애니메이션 및 효과
    settingOption.classList.add('setting-updated');
    
    // 리플 효과 추가
    addRippleEffect(this);
    
    setTimeout(() => {
        settingOption.classList.remove('setting-updated');
    }, 500);
}

// 토글 스위치 상태 텍스트 업데이트
function updateToggleStatus(toggleInput) {
    const settingOption = toggleInput.closest('.settings-option');
    const statusText = settingOption.querySelector('.settings-option-text p');
    const settingName = settingOption.querySelector('h4').textContent;
    
    console.log('Updating toggle status for:', settingName, 'Checked:', toggleInput.checked);
    
    if (statusText) {
        if (toggleInput.checked) {
            statusText.textContent = `${settingName} is enabled`;
            statusText.style.color = 'var(--accent-color)';
            statusText.style.fontWeight = '500';
        } else {
            statusText.textContent = `${settingName} is disabled`;
            statusText.style.color = 'var(--red-color)'; // 빨간색으로 변경
            statusText.style.fontWeight = '500';
        }
    }
}

// 리플 효과 추가
function addRippleEffect(toggleInput) {
    const toggle = toggleInput.closest('.toggle-switch');
    
    // 이미 있는 리플 요소 제거
    const existingRipple = toggle.querySelector('.toggle-ripple');
    if (existingRipple) {
        existingRipple.remove();
    }
    
    // 새 리플 요소 생성
    const ripple = document.createElement('span');
    ripple.className = 'toggle-ripple';
    toggle.appendChild(ripple);
    
    // 애니메이션 후 제거
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
    console.log('Theme changed event detected');
    if (document.querySelector('.settings-container')) {
        updateThemeSettingDisplay();
    }
});

// 로그인 상태 변경 이벤트 리스너 추가
document.addEventListener('loginStatusChanged', function() {
    console.log('Login status changed event detected');
    if (document.querySelector('.settings-container')) {
        updateSettingsBasedOnLoginStatus();
    }
}); 