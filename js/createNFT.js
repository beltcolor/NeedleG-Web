// CreateNFT 콘텐츠 로드 함수
async function loadCreateNFTContent() {
    const container = document.getElementById('main-content');
    try {
        // createNFT 페이지 초기화
        if (typeof pages.createNFT === 'object' && typeof pages.createNFT.init === 'function') {
            pages.createNFT.init();
        } else {
            console.error('createNFT 페이지 초기화 함수를 찾을 수 없습니다.');
        }
    } catch (error) {
        console.error('CreateNFT 콘텐츠 로드 중 오류:', error);
        container.innerHTML = '<p>NFT 생성 콘텐츠를 불러오는데 실패했습니다.</p>';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // 페이지 라우팅 시스템에 createNFT 페이지 등록
    if (typeof pages !== 'undefined') {
        pages.createNFT = {
            init: initCreateNFTPage,
            destroy: destroyCreateNFTPage
        };
    }
    
    // 현재 페이지가 createNFT인 경우 바로 초기화
    if (window.location.hash === '#createNFT') {
        setTimeout(() => {
            if (typeof pages.createNFT?.init === 'function') {
                pages.createNFT.init();
            }
        }, 100); // 약간의 지연 추가
    }
});

// CreateNFT 페이지 초기화 함수
function initCreateNFTPage() {
    console.log('CreateNFT 페이지 초기화');
    
    // 필요한 HTML 콘텐츠 로드
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        // CreateNFT.html의 내용을 가져와 삽입
        fetch('./CreateNFT.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('CreateNFT.html 파일을 찾을 수 없습니다.');
                }
                return response.text();
            })
            .then(html => {
                mainContent.innerHTML = html;
                setupCreateNFTEvents();
            })
            .catch(error => {
                console.error('CreateNFT 페이지 로드 중 오류 발생:', error);
                mainContent.innerHTML = '<div class="error-message">페이지를 로드할 수 없습니다.</div>';
            });
    }
}

// CreateNFT 페이지 정리 함수
function destroyCreateNFTPage() {
    console.log('CreateNFT 페이지 정리');
    // 페이지 전환 시 필요한 정리 작업 수행
    
    // 이벤트 리스너 제거 등 필요한 정리 작업
    const uploadBox = document.querySelector('.nft-upload-box');
    if (uploadBox) {
        uploadBox.removeEventListener('click', handleUploadBoxClick);
    }
    
    const uploadInput = document.getElementById('nft-artwork-upload');
    if (uploadInput) {
        uploadInput.removeEventListener('change', handleFileSelect);
    }
}

// CreateNFT 페이지 이벤트 설정
function setupCreateNFTEvents() {
    // 업로드 박스 클릭 이벤트
    const uploadBox = document.querySelector('.nft-upload-box');
    const uploadInput = document.getElementById('nft-artwork-upload');
    const uploadBtn = document.getElementById('upload-artwork-btn');
    
    if (uploadBox && uploadInput) {
        uploadBox.addEventListener('click', handleUploadBoxClick);
        uploadInput.addEventListener('change', handleFileSelect);
    }
    
    if (uploadBtn) {
        uploadBtn.addEventListener('click', handleUploadBoxClick);
    }
    
    // 폼 입력값 변경 시 프리뷰 업데이트
    const nftNameInput = document.getElementById('nft-name');
    const nftPriceInput = document.getElementById('nft-price');
    
    if (nftNameInput) {
        nftNameInput.addEventListener('input', updateNFTPreview);
    }
    
    if (nftPriceInput) {
        nftPriceInput.addEventListener('input', updateNFTPreview);
    }
    
    // 버튼 클릭 이벤트
    const saveDraftBtn = document.getElementById('save-draft-btn');
    const createNFTBtn = document.getElementById('create-nft-btn');
    
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', handleSaveDraft);
    }
    
    if (createNFTBtn) {
        createNFTBtn.addEventListener('click', handleCreateNFT);
    }
    
    // 드래그 앤 드롭 기능 설정
    setupDragAndDrop();
}

// 업로드 박스 클릭 이벤트 핸들러
function handleUploadBoxClick() {
    const uploadInput = document.getElementById('nft-artwork-upload');
    if (uploadInput) {
        uploadInput.click();
    }
}

// 파일 선택 핸들러
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // 프리뷰 이미지 업데이트
            updateImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
    }
}

// 이미지 프리뷰 업데이트
function updateImagePreview(imageURL) {
    const previewImage = document.querySelector('.nft-preview-image');
    if (previewImage) {
        previewImage.innerHTML = '';
        const img = document.createElement('img');
        img.src = imageURL;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        previewImage.appendChild(img);
    }
}

// NFT 프리뷰 업데이트
function updateNFTPreview() {
    const nftName = document.getElementById('nft-name').value || 'NFT Name';
    const nftPrice = document.getElementById('nft-price').value || '0.01';
    
    const previewName = document.querySelector('.nft-preview-name');
    const previewPrice = document.querySelector('.price-value');
    
    if (previewName) {
        previewName.textContent = nftName;
    }
    
    if (previewPrice) {
        previewPrice.textContent = nftPrice;
    }
}

// 드래그 앤 드롭 설정
function setupDragAndDrop() {
    const dropZone = document.querySelector('.nft-upload-box');
    if (!dropZone) return;
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        dropZone.classList.add('highlight');
    }
    
    function unhighlight() {
        dropZone.classList.remove('highlight');
    }
    
    dropZone.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                updateImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
            
            // 파일 입력 필드에도 파일 설정
            const fileInput = document.getElementById('nft-artwork-upload');
            if (fileInput) {
                // 파일 입력 필드에 파일 할당은 보안상 직접 설정할 수 없으므로
                // 대신 파일 정보만 표시
                const fileName = document.createElement('div');
                fileName.textContent = `선택된 파일: ${file.name}`;
                fileName.className = 'selected-file-name';
                
                const placeholder = document.querySelector('.upload-placeholder');
                if (placeholder) {
                    placeholder.innerHTML = '';
                    placeholder.appendChild(fileName);
                }
            }
        }
    }
}

// 드래프트 저장 핸들러
function handleSaveDraft() {
    // 드래프트 저장 로직
    console.log('NFT 드래프트 저장');
    showNotification('NFT 드래프트가 저장되었습니다.');
}

// NFT 생성 핸들러
function handleCreateNFT() {
    // NFT 생성 로직
    console.log('NFT 생성 시작');
    
    // 폼 유효성 검사
    const nftName = document.getElementById('nft-name').value;
    const nftDescription = document.getElementById('nft-description').value;
    const nftPrice = document.getElementById('nft-price').value;
    
    if (!nftName || !nftDescription || !nftPrice) {
        showNotification('모든 필수 정보를 입력해주세요.', 'error');
        return;
    }
    
    // NFT 생성 성공 시뮬레이션 (실제로는 블록체인 트랜잭션 등이 필요)
    showLoadingSpinner();
    
    setTimeout(() => {
        hideLoadingSpinner();
        showNotification('NFT가 성공적으로 생성되었습니다!', 'success');
    }, 2000);
}

// 알림 표시 함수
function showNotification(message, type = 'info') {
    // 기존 알림 시스템 사용 (있는 경우)
    if (typeof showToast === 'function') {
        showToast(message, type);
        return;
    }
    
    // 기존 알림 시스템이 없는 경우 간단한 알림 생성
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }, 10);
}

// 로딩 스피너 표시/숨기기
function showLoadingSpinner() {
    let spinner = document.querySelector('.loading-spinner');
    
    if (!spinner) {
        spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.innerHTML = '<div class="spinner"></div>';
        document.body.appendChild(spinner);
    }
    
    spinner.classList.add('show');
}

function hideLoadingSpinner() {
    const spinner = document.querySelector('.loading-spinner');
    if (spinner) {
        spinner.classList.remove('show');
        
        setTimeout(() => {
            spinner.remove();
        }, 300);
    }
} 