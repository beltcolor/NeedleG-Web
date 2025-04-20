// 다국어 지원을 위한 번역 데이터

// 언어 텍스트 데이터
const translations = {
    // 영어 번역
    en: {
        // 메뉴 및 탐색
        home: "Home",
        browse: "Browse",
        account: "Account",
        tattoo: "Get Tattoo",
        createNFT: "Create NFT",
        membership: "Membership",
        loyalty: "Loyalty",
        help: "Help",
        settings: "Settings",
        
        // 테마 관련
        lightMode: "Light Mode",
        darkMode: "Dark Mode",
        
        // 언어 관련
        language: "English",
        selectLanguage: "Select Language",
        
        // 계정 관련
        signIn: "Sign In",
        signOut: "Sign Out",
        
        // 설정 관련
        accountSettings: "Account Settings",
        profileInfo: "Profile Information",
        password: "Password",
        email: "Email",
        updateSettings: "Update Settings",
        
        // 일반 UI 요소
        search: "Search",
        filter: "Filter",
        apply: "Apply",
        cancel: "Cancel",
        save: "Save",
        delete: "Delete",
        edit: "Edit",
        close: "Close",
        
        // 알림 메시지
        successUpdate: "Settings updated successfully",
        errorUpdate: "Error updating settings",
        
        // 도움말 및 기타
        faq: "FAQ",
        contactSupport: "Contact Support",
        other: "Other",
        helpCenter: "Help Center",
        getHelp: "Get help with using the app",
        privacyPolicy: "Privacy Policy",
        readPrivacy: "Read about how we process your data"
    },
    
    // 한국어 번역
    ko: {
        // 메뉴 및 탐색
        home: "홈",
        browse: "둘러보기",
        account: "계정",
        tattoo: "타투 받기",
        createNFT: "NFT 생성",
        help: "도움말",
        settings: "설정",
        membership: "멤버십",
        loyalty: "로열티",
        // 테마 관련
        lightMode: "라이트 모드",
        darkMode: "다크 모드",
        
        // 언어 관련
        language: "한국어",
        selectLanguage: "언어 선택",
        
        // 계정 관련
        signIn: "로그인",
        signOut: "로그아웃",
        
        // 설정 관련
        accountSettings: "계정 설정",
        profileInfo: "프로필 정보",
        password: "비밀번호",
        email: "이메일",
        updateSettings: "설정 업데이트",
        
        // 일반 UI 요소
        search: "검색",
        filter: "필터",
        apply: "적용",
        cancel: "취소",
        save: "저장",
        delete: "삭제",
        edit: "편집",
        close: "닫기",
        
        // 알림 메시지
        successUpdate: "설정이 성공적으로 업데이트되었습니다",
        errorUpdate: "설정 업데이트 중 오류가 발생했습니다",
        
        // 도움말 및 기타
        faq: "자주 묻는 질문",
        contactSupport: "고객 지원 문의",
        other: "기타",
        helpCenter: "도움말 센터",
        getHelp: "앱 사용에 대한 도움말",
        privacyPolicy: "개인정보 처리방침",
        readPrivacy: "당사의 데이터 처리 방법에 대한 정보"
    },
    
    // 폴란드어 번역
    pl: {
        // 메뉴 및 탐색
        home: "Strona główna",
        browse: "Przeglądaj",
        account: "Konto",
        tattoo: "Tatuaż",
        createNFT: "Stwórz NFT",
        help: "Pomoc",
        settings: "Ustawienia",
        membership: "Członkostwo",
        loyalty: "Loyalty",
        
        // 테마 관련
        lightMode: "Tryb jasny",
        darkMode: "Tryb ciemny",
        
        // 언어 관련
        language: "Polski",
        selectLanguage: "Wybierz język",
        
        // 계정 관련
        signIn: "Zaloguj się",
        signOut: "Wyloguj się",
        
        // 설정 관련
        accountSettings: "Ustawienia konta",
        profileInfo: "Informacje o profilu",
        password: "Hasło",
        email: "Email",
        updateSettings: "Aktualizuj ustawienia",
        
        // 일반 UI 요소
        search: "Szukaj",
        filter: "Filtruj",
        apply: "Zastosuj",
        cancel: "Anuluj",
        save: "Zapisz",
        delete: "Usuń",
        edit: "Edytuj",
        close: "Zamknij",
        
        // 알림 메시지
        successUpdate: "Ustawienia zaktualizowane pomyślnie",
        errorUpdate: "Błąd podczas aktualizacji ustawień",
        
        // 도움말 및 기타
        faq: "FAQ",
        contactSupport: "Skontaktuj się z pomocą techniczną",
        other: "Inne",
        helpCenter: "Centrum pomocy",
        getHelp: "Uzyskaj pomoc dotyczącą korzystania z aplikacji",
        privacyPolicy: "Polityka prywatności",
        readPrivacy: "Przeczytaj o tym, jak przetwarzamy Twoje dane"
    }
};

// 번역 문자열 가져오기
function getTranslation(key, lang) {
    // 요청된 언어가 없으면 현재 언어 사용
    if (!lang) {
        lang = localStorage.getItem('language') || 'en';
    }
    
    // 언어가 지원되지 않으면 영어로 대체
    if (!translations[lang]) {
        lang = 'en';
    }
    
    // 요청된 키에 해당하는 번역 반환, 없으면 영어 또는 키 자체 반환
    return translations[lang][key] || translations['en'][key] || key;
}

// UI 텍스트 업데이트
function updateUITexts(lang) {
    // 기본 UI 요소 업데이트
    updateNavigation(lang);
    updateSettings(lang);
    updateMessages(lang);
}

// 네비게이션 요소 업데이트
function updateNavigation(lang) {
    // 홈 탭
    const homeTab = document.querySelector('.tab-button[data-page="home"] .button-text');
    if (homeTab) homeTab.textContent = getTranslation('home', lang);
    
    // 브라우즈 탭
    const browseTab = document.querySelector('.tab-button[data-page="browse"] .button-text');
    if (browseTab) browseTab.textContent = getTranslation('browse', lang);
    
    // 사이드바 요소
    document.querySelectorAll('.sidebar-button').forEach(button => {
        const key = button.getAttribute('data-page');
        const textElement = button.querySelector('.button-text');
        if (textElement && key) {
            textElement.textContent = getTranslation(key, lang);
        }
    });
    
    // 테마 토글 버튼
    const themeText = document.querySelector('.theme-toggle-sidebar .button-text');
    if (themeText) {
        const theme = document.documentElement.classList.contains('light-mode') ? 'lightMode' : 'darkMode';
        themeText.textContent = getTranslation(theme, lang);
    }
    
    // 언어 선택 제목
    const langTitle = document.querySelector('.language-popup-title');
    if (langTitle) langTitle.textContent = getTranslation('selectLanguage', lang);
}

// 설정 페이지 텍스트 업데이트
function updateSettings(lang) {
    const settingsTitle = document.querySelector('.settings-title');
    if (settingsTitle) settingsTitle.textContent = getTranslation('settings', lang);
    
    const accountSettingsTitle = document.querySelector('.account-settings-title');
    if (accountSettingsTitle) accountSettingsTitle.textContent = getTranslation('accountSettings', lang);
    
    // 계정 설정 요소
    const profileInfoLabel = document.querySelector('.profile-info-label');
    if (profileInfoLabel) profileInfoLabel.textContent = getTranslation('profileInfo', lang);
    
    const passwordLabel = document.querySelector('.password-label');
    if (passwordLabel) passwordLabel.textContent = getTranslation('password', lang);
    
    const emailLabel = document.querySelector('.email-label');
    if (emailLabel) emailLabel.textContent = getTranslation('email', lang);
    
    // 버튼 텍스트
    const updateButton = document.querySelector('.update-settings-button');
    if (updateButton) updateButton.textContent = getTranslation('updateSettings', lang);
}

// 메시지 및 알림 텍스트 업데이트
function updateMessages(lang) {
    // 알림 메시지
    const successMsg = document.querySelector('.success-message');
    if (successMsg) successMsg.textContent = getTranslation('successUpdate', lang);
    
    const errorMsg = document.querySelector('.error-message');
    if (errorMsg) errorMsg.textContent = getTranslation('errorUpdate', lang);
}

// 전역으로 함수 내보내기
window.translations = translations;
window.getTranslation = getTranslation;
window.updateUITexts = updateUITexts; 