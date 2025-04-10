// 테마 초기화 함수
function initTheme() {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        document.documentElement.classList.add('light-mode');
        document.querySelector('.theme-toggle .icon').textContent = 'dark_mode';
    } else {
        document.documentElement.classList.remove('light-mode');
        document.querySelector('.theme-toggle .icon').textContent = 'light_mode';
    }
}

// 테마 전환 함수
function toggleTheme() {
    if (document.documentElement.classList.contains('light-mode')) {
        // 라이트 모드 -> 다크 모드
        document.documentElement.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
        document.querySelector('.theme-toggle .icon').textContent = 'light_mode';
    } else {
        // 다크 모드 -> 라이트 모드
        document.documentElement.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
        document.querySelector('.theme-toggle .icon').textContent = 'dark_mode';
    }
}