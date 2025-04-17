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
        }, 100);
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
    // 이벤트 리스너 제거
    const fileInput = document.getElementById('nft-artwork-upload');
    const uploadBtn = document.getElementById('upload-artwork-btn');
    const deleteFileBtn = document.querySelector('.delete-file-btn');
    
    if (fileInput) {
        fileInput.removeEventListener('change', null);
    }
    
    if (uploadBtn) {
        uploadBtn.removeEventListener('click', null);
    }
    
    if (deleteFileBtn) {
        deleteFileBtn.removeEventListener('click', null);
    }
}

// CreateNFT 페이지 이벤트 설정
function setupCreateNFTEvents() {
    setupFileUpload();
    setupTagSystem();
    setupToolsSystem();
    setupProcessImages();
    setupNFTPreview();
    setupMarketplaceOptions();
}

// 파일 업로드 관련 설정
function setupFileUpload() {
    const uploadBtn = document.getElementById('upload-artwork-btn');
    const fileInput = document.getElementById('nft-artwork-upload');
    const uploadedFileInfo = document.querySelector('.uploaded-file-info');
    const fileName = document.querySelector('.file-name');
    const deleteFileBtn = document.querySelector('.delete-file-btn');
    
    let selectedFile = null;
    
    if (uploadBtn && fileInput) {
        uploadBtn.addEventListener('click', () => {
            fileInput.click();
        });
    }
    
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                selectedFile = file;
                fileName.textContent = file.name;
                uploadedFileInfo.style.display = 'flex';
                uploadBtn.style.display = 'none';
                
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        updateImagePreview(e.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            }
        });
    }
    
    if (deleteFileBtn) {
        deleteFileBtn.addEventListener('click', () => {
            selectedFile = null;
            fileInput.value = '';
            uploadedFileInfo.style.display = 'none';
            uploadBtn.style.display = 'flex';
            
            const previewImage = document.querySelector('.nft-preview-image');
            if (previewImage) {
                previewImage.innerHTML = '<span class="material-icons">image</span>';
            }
        });
    }
}

// 태그 시스템 설정
function setupTagSystem() {
    const tagInput = document.getElementById('tag-input');
    const addTagBtn = document.querySelector('.add-tag-btn');
    const tagsList = document.querySelector('.tags-list');
    let tags = new Set();

    function addTag(tagText) {
        if (!tagText) return;
        
        // # 기호가 없으면 추가
        if (!tagText.startsWith('#')) {
            tagText = '#' + tagText;
        }
        
        // 이미 존재하는 태그인지 확인
        if (tags.has(tagText)) return;
        
        // 태그 추가
        tags.add(tagText);
        
        // 태그 요소 생성
        const tagElement = document.createElement('div');
        tagElement.className = 'tag-item';
        tagElement.innerHTML = `
            <span>${tagText}</span>
            <span class="material-icons" role="button">close</span>
        `;
        
        // 삭제 버튼 이벤트
        tagElement.querySelector('.material-icons').addEventListener('click', () => {
            tags.delete(tagText);
            tagElement.remove();
        });
        
        tagsList.appendChild(tagElement);
        tagInput.value = '';
    }

    // Enter 키로 태그 추가
    tagInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag(tagInput.value.trim());
        }
    });

    // 추가 버튼으로 태그 추가
    addTagBtn.addEventListener('click', () => {
        addTag(tagInput.value.trim());
    });
}

// 도구 목록 시스템 설정
function setupToolsSystem() {
    const toolsInput = document.getElementById('tools-input');
    const addToolBtn = document.querySelector('.add-tool-btn');
    const toolsList = document.querySelector('.tools-list');
    let tools = new Set();

    function addTool(toolName) {
        if (!toolName) return;
        if (tools.has(toolName)) return;
        
        tools.add(toolName);
        
        const toolElement = document.createElement('div');
        toolElement.className = 'tag-item'; // 태그와 같은 스타일 사용
        toolElement.innerHTML = `
            <span>${toolName}</span>
            <span class="material-icons" role="button">close</span>
        `;
        
        toolElement.querySelector('.material-icons').addEventListener('click', () => {
            tools.delete(toolName);
            toolElement.remove();
        });
        
        toolsList.appendChild(toolElement);
        toolsInput.value = '';
    }

    toolsInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTool(toolsInput.value.trim());
        }
    });

    addToolBtn.addEventListener('click', () => {
        addTool(toolsInput.value.trim());
    });
}

// 작업 과정 이미지 설정
function setupProcessImages() {
    const processUploadBtn = document.querySelector('.process-upload-btn');
    const processImagesInput = document.getElementById('process-images');
    const processImagesPreview = document.querySelector('.process-images-preview');
    let processImages = new Set();

    if (processUploadBtn && processImagesInput) {
        processUploadBtn.addEventListener('click', () => {
            processImagesInput.click();
        });

        processImagesInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            
            // 최대 5개까지만 허용
            if (processImages.size + files.length > 5) {
                alert('최대 5개의 이미지만 업로드할 수 있습니다.');
        return;
    }
    
            files.forEach(file => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const imageElement = document.createElement('div');
                        imageElement.className = 'process-image-item';
                        imageElement.innerHTML = `
                            <img src="${e.target.result}" alt="Process Image">
                            <span class="material-icons remove-image">close</span>
                        `;
                        
                        imageElement.querySelector('.remove-image').addEventListener('click', () => {
                            processImages.delete(file);
                            imageElement.remove();
                        });
                        
                        processImages.add(file);
                        processImagesPreview.appendChild(imageElement);
                    };
                    reader.readAsDataURL(file);
                }
            });
        });
    }
}

// 이미지 프리뷰 업데이트
function updateImagePreview(imageURL) {
    const previewImage = document.querySelector('.nft-preview-image');
    if (previewImage) {
        previewImage.innerHTML = '';
        const img = document.createElement('img');
        img.src = imageURL;
        previewImage.appendChild(img);
    }
}

// NFT 프리뷰 설정
function setupNFTPreview() {
    const nftNameInput = document.getElementById('nft-name');
    const nftPriceInput = document.getElementById('nft-price');
    const nftDescriptionInput = document.getElementById('nft-description');
    
    // 입력 필드의 변경사항을 실시간으로 프리뷰에 반영
    if (nftNameInput) {
        nftNameInput.addEventListener('input', updateNFTPreview);
    }
    
    if (nftPriceInput) {
        nftPriceInput.addEventListener('input', updateNFTPreview);
    }
    
    if (nftDescriptionInput) {
        nftDescriptionInput.addEventListener('input', updateNFTPreview);
    }
    
    // 초기 프리뷰 업데이트
    updateNFTPreview();
}

// NFT 프리뷰 업데이트
function updateNFTPreview() {
    const nftName = document.getElementById('nft-name')?.value || 'NFT Name';
    const nftPrice = document.getElementById('nft-price')?.value || '0.01';
    const nftDescription = document.getElementById('nft-description')?.value || '';
    
    const previewName = document.querySelector('.nft-preview-name');
    const previewPrice = document.querySelector('.price-value');
    const previewDescription = document.querySelector('.nft-preview-description');
    
    if (previewName) {
        previewName.textContent = nftName;
    }
    
    if (previewPrice) {
        previewPrice.textContent = nftPrice;
    }
    
    if (previewDescription) {
        previewDescription.textContent = nftDescription;
    }
}

// 마켓플레이스 옵션 설정
function setupMarketplaceOptions() {
    const marketplaceCheckbox = document.getElementById('put-on-marketplace');
    const marketplaceOptions = document.querySelector('.marketplace-options');
    
    if (marketplaceCheckbox && marketplaceOptions) {
        marketplaceCheckbox.addEventListener('change', function() {
            marketplaceOptions.style.display = this.checked ? 'block' : 'none';
        });
    }
} 