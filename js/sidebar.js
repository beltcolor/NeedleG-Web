// 사이드바 관련 기능 모음

// 사이드바 초기화
function initSidebar() {
    // 사이드바 확장 설정 불러오기
    loadSavedSidebarSettings();
    
    // 사이드바 오버레이 설정
    setupSidebarOverlay();
}

// 저장된 사이드바 설정 불러오기
function loadSavedSidebarSettings() {
    const sidebarExpandEnabled = localStorage.getItem('sidebarExpandEnabled');
    
    // 'false'인 경우에만 사이드바 확장을 비활성화
    if (sidebarExpandEnabled === 'false') {
        document.body.classList.add('sidebar-expand-disabled');
        // 경고 아이콘 제거 (표시하지 않음)
        removeSidebarExpansionNotice();
    } else {
        document.body.classList.remove('sidebar-expand-disabled');
        // 경고 아이콘 제거
        removeSidebarExpansionNotice();
    }
}

// 사이드바 확장 비활성화 경고 아이콘 추가
function addSidebarExpansionNotice() {
    // 이미 있는지 확인
    if (document.querySelector('.sidebar-expansion-notice')) {
        return;
    }
    
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        const notice = document.createElement('div');
        notice.className = 'sidebar-expansion-notice';
        notice.innerHTML = '<i class="material-icons">info</i>';
        
        // 툴팁 추가
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = '사이드바 확장이 비활성화되었습니다';
        notice.appendChild(tooltip);
        
        sidebar.appendChild(notice);
    }
}

// 사이드바 확장 비활성화 경고 아이콘 제거
function removeSidebarExpansionNotice() {
    const notice = document.querySelector('.sidebar-expansion-notice');
    if (notice) {
        notice.remove();
    }
}

// 사이드바 오버레이 설정
function setupSidebarOverlay() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (sidebar && overlay) {
        console.log("사이드바 오버레이 설정");
        
        // 사이드바에 마우스가 올라갔을 때 오버레이 표시
        sidebar.addEventListener('mouseenter', function() {
            // 사이드바 확장이 비활성화되어 있지 않은 경우에만 오버레이 표시
            if (!document.body.classList.contains('sidebar-expand-disabled')) {
                overlay.style.opacity = '1';
                overlay.style.visibility = 'visible';
                overlay.style.pointerEvents = 'auto';
            }
        });
        
        // 사이드바에서 마우스가 떠났을 때 오버레이 숨김
        sidebar.addEventListener('mouseleave', function() {
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
            overlay.style.pointerEvents = 'none';
        });
        
        // 오버레이 클릭 시 사이드바 닫기 기능
        overlay.addEventListener('click', function() {
            // 인라인 스타일 대신 클래스로 제어
            sidebar.classList.add('sidebar-collapsed');
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
            overlay.style.pointerEvents = 'none';
            
            // 잠시 후 클래스 제거하여 hover 효과가 다시 작동하도록 함
            setTimeout(() => {
                sidebar.classList.remove('sidebar-collapsed');
            }, 300);
        });
    }
}

// 사이드바 버튼 설정
function setupSidebarButtons() {
    // 테마와 언어 버튼을 제외한 모든 사이드바 버튼 선택
    const sidebarButtons = document.querySelectorAll('.sidebar-button:not(.theme-toggle-sidebar):not(.language-toggle)');
    
    // 각 사이드바 버튼에 인라인 onclick 추가
    sidebarButtons.forEach(button => {
        const page = button.getAttribute('data-page');
        if (page) {
            // 인라인 이벤트 핸들러 추가
            button.setAttribute('onclick', `handleSidebarButtonClick('${page}'); window.location.hash='${page}'`);
        }
    });
}

// 사이드바 메뉴 클릭 시 처리하는 함수
function handleSidebarButtonClick(page) {
    console.log('사이드바 버튼 클릭: ', page);
    
    // 페이지 이동은 인라인 onclick에서 처리됨
}

// 페이지 로드 시 사이드바 초기화
document.addEventListener('DOMContentLoaded', function() {
    initSidebar();
    setupSidebarButtons();
});

// 전역으로 함수 내보내기
window.handleSidebarButtonClick = handleSidebarButtonClick;
window.loadSavedSidebarSettings = loadSavedSidebarSettings;
window.removeSidebarExpansionNotice = removeSidebarExpansionNotice;
window.addSidebarExpansionNotice = addSidebarExpansionNotice;
