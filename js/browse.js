// Browse 페이지 로드 함수
function loadBrowseContent() {
    fetch('ContentBrowse.html') // HTML 파일 경로
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('main-content').innerHTML = data; // HTML 내용 삽입
            setupBrowseEvents(); // 이벤트 리스너 설정
        })
        .catch(error => console.error('Error loading browse content:', error));
}

// Browse 페이지 이벤트 리스너 설정
function setupBrowseEvents() {
    // 검색 버튼 이벤트
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.getElementById('nft-search-input');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            searchNFTs(searchInput.value);
        });
        
        // 엔터 키 이벤트
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchNFTs(searchInput.value);
            }
        });
    }
    
    // 필터 이벤트
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', applyFilters);
    }
    
    // 아티스트 유형 탭 이벤트
    const artistTabs = document.querySelectorAll('.artist-tab');
    if (artistTabs.length > 0) {
        artistTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // 모든 탭에서 active 클래스 제거
                artistTabs.forEach(t => t.classList.remove('active'));
                // 클릭한 탭에 active 클래스 추가
                this.classList.add('active');
                // 필터 적용
                filterByArtistType(this.getAttribute('data-type'));
            });
        });
    }
    
    // 좋아요 버튼 이벤트
    const likeButtons = document.querySelectorAll('.like-btn');
    if (likeButtons.length > 0) {
        likeButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation(); // NFT 아이템 클릭 이벤트 방지
                toggleLike(this);
            });
        });
    }
    
    // 댓글 버튼 이벤트
    const commentButtons = document.querySelectorAll('.comment-btn');
    if (commentButtons.length > 0) {
        commentButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation(); // NFT 아이템 클릭 이벤트 방지
                openCommentModal(this);
            });
        });
    }
    
    // 공유 버튼 이벤트
    const shareButtons = document.querySelectorAll('.share-btn');
    if (shareButtons.length > 0) {
        shareButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation(); // NFT 아이템 클릭 이벤트 방지
                openShareModal(this);
            });
        });
    }
    
    // 댓글 모달 닫기 버튼
    const commentModalCloseBtn = document.querySelector('#comment-modal .close-modal');
    if (commentModalCloseBtn) {
        commentModalCloseBtn.addEventListener('click', closeCommentModal);
    }
    
    // 공유 모달 닫기 버튼
    const shareModalCloseBtn = document.querySelector('#share-modal .close-modal');
    if (shareModalCloseBtn) {
        shareModalCloseBtn.addEventListener('click', closeShareModal);
    }
    
    // 댓글 모달 배경 클릭 시 닫기
    const commentModal = document.getElementById('comment-modal');
    if (commentModal) {
        commentModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeCommentModal();
            }
        });
    }
    
    // 공유 모달 배경 클릭 시 닫기
    const shareModal = document.getElementById('share-modal');
    if (shareModal) {
        shareModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeShareModal();
            }
        });
    }
    
    // 공유 옵션 버튼 이벤트
    const shareOptions = document.querySelectorAll('.share-option');
    if (shareOptions.length > 0) {
        shareOptions.forEach(option => {
            option.addEventListener('click', function() {
                shareToSocialMedia(this.getAttribute('data-platform'));
            });
        });
    }
    
    // 링크 복사 버튼 이벤트
    const copyLinkBtn = document.querySelector('.copy-link-btn');
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', copyShareLink);
    }
    
    // 댓글 등록 버튼 이벤트
    const postCommentBtn = document.querySelector('.post-comment-btn');
    if (postCommentBtn) {
        postCommentBtn.addEventListener('click', postComment);
    }
    
    // 댓글 좋아요 버튼 이벤트
    const commentLikeButtons = document.querySelectorAll('.comment-like');
    if (commentLikeButtons.length > 0) {
        commentLikeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                toggleCommentLike(this);
            });
        });
    }
    
    // 페이지네이션 이벤트
    const prevBtn = document.querySelector('.pagination-btn.prev');
    const nextBtn = document.querySelector('.pagination-btn.next');
    const pageNumbers = document.querySelectorAll('.page-number');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            goToPreviousPage();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            goToNextPage();
        });
    }
    
    if (pageNumbers.length > 0) {
        pageNumbers.forEach(pageNum => {
            pageNum.addEventListener('click', function() {
                if (this.textContent !== '...') {
                    goToPage(parseInt(this.textContent));
                }
            });
        });
    }
    
    // NFT 아이템 클릭 이벤트
    const nftItems = document.querySelectorAll('.nft-item');
    
    if (nftItems.length > 0) {
        nftItems.forEach(item => {
            item.addEventListener('click', function() {
                // NFT 상세 페이지로 이동 또는 모달 표시
                showNFTDetails(this);
            });
        });
    }
    
    // 북마크 버튼 이벤트
    const bookmarkButtons = document.querySelectorAll('.bookmark-btn');
    if (bookmarkButtons.length > 0) {
        bookmarkButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation(); // NFT 아이템 클릭 이벤트 방지
                toggleBookmark(this);
            });
        });
    }
}

// 아티스트 유형별 필터링 함수
function filterByArtistType(artistType) {
    const nftItems = document.querySelectorAll('.nft-item');
    const noResults = document.querySelector('.no-results');
    let hasVisibleItems = false;
    
    nftItems.forEach(item => {
        if (artistType === 'all') {
            item.style.display = 'block';
            hasVisibleItems = true;
        } else {
            if (item.getAttribute('data-artist-type') === artistType) {
                item.style.display = 'block';
                hasVisibleItems = true;
            } else {
                item.style.display = 'none';
            }
        }
    });
    
    // 결과가 없을 때 메시지 표시
    if (noResults) {
        noResults.style.display = hasVisibleItems ? 'none' : 'block';
    }
}

// 필터 적용 함수 (기존 함수 수정)
function applyFilters() {
    const category = document.getElementById('category-filter').value;
    const sortBy = document.getElementById('sort-filter').value;
    const activeArtistTab = document.querySelector('.artist-tab.active');
    const artistType = activeArtistTab ? activeArtistTab.getAttribute('data-type') : 'all';
    
    console.log('카테고리:', category);
    console.log('정렬기준:', sortBy);
    console.log('아티스트 유형:', artistType);
    
    // 실제로는 솔라나 API를 호출하여 필터링된 결과 가져오기
    // 여기서는 간단한 정렬 및 필터링 예시만 구현
    
    const nftGrid = document.querySelector('.nft-grid');
    let nftItems = Array.from(document.querySelectorAll('.nft-item'));
    const noResults = document.querySelector('.no-results');
    
    // 아티스트 유형 필터링
    if (artistType !== 'all') {
        nftItems = nftItems.filter(item => item.getAttribute('data-artist-type') === artistType);
    }
    
    // 카테고리 필터링
    if (category !== 'all') {
        nftItems = nftItems.filter(item => item.getAttribute('data-category') === category);
    }
    
    // 정렬 로직
    if (sortBy === 'recent') {
        // 최신순 정렬 (기본 상태 유지)
    } else if (sortBy === 'popular') {
        // 인기순 정렬 (임의로 순서 변경)
        nftItems.sort(() => Math.random() - 0.5);
    } else if (sortBy === 'price-low') {
        // 가격 낮은순 정렬
        nftItems.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('.nft-price span:last-child').textContent.split(' ')[0]);
            const priceB = parseFloat(b.querySelector('.nft-price span:last-child').textContent.split(' ')[0]);
            return priceA - priceB;
        });
    } else if (sortBy === 'price-high') {
        // 가격 높은순 정렬
        nftItems.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('.nft-price span:last-child').textContent.split(' ')[0]);
            const priceB = parseFloat(b.querySelector('.nft-price span:last-child').textContent.split(' ')[0]);
            return priceB - priceA;
        });
    }
    
    // 모든 NFT 아이템 숨김
    document.querySelectorAll('.nft-item').forEach(item => {
        item.style.display = 'none';
    });
    
    // 정렬된 아이템 다시 추가 및 표시
    nftItems.forEach(item => {
        nftGrid.appendChild(item);
        item.style.display = 'block';
    });
    
    // 결과가 없을 경우 메시지 표시
    if (noResults) {
        noResults.style.display = nftItems.length === 0 ? 'block' : 'none';
    }
}

// NFT 검색 함수 (기존 함수 수정)
function searchNFTs(query) {
    console.log('검색어:', query);
    
    const nftItems = document.querySelectorAll('.nft-item');
    const noResults = document.querySelector('.no-results');
    let hasVisibleItems = false;
    
    if (query.trim() === '') {
        // 검색어가 비어있으면 현재 선택된 아티스트 유형에 따라 필터링
        const activeArtistTab = document.querySelector('.artist-tab.active');
        const artistType = activeArtistTab ? activeArtistTab.getAttribute('data-type') : 'all';
        
        nftItems.forEach(item => {
            if (artistType === 'all' || item.getAttribute('data-artist-type') === artistType) {
                item.style.display = 'block';
                hasVisibleItems = true;
            }
        });
    } else {
        // 검색어로 필터링
        const activeArtistTab = document.querySelector('.artist-tab.active');
        const artistType = activeArtistTab ? activeArtistTab.getAttribute('data-type') : 'all';
        
        nftItems.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const creator = item.querySelector('.nft-creator').textContent.toLowerCase();
            const matchesQuery = title.includes(query.toLowerCase()) || creator.includes(query.toLowerCase());
            const matchesArtistType = artistType === 'all' || item.getAttribute('data-artist-type') === artistType;
            
            if (matchesQuery && matchesArtistType) {
                item.style.display = 'block';
                hasVisibleItems = true;
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // 결과가 없을 때 메시지 표시
    if (noResults) {
        noResults.style.display = hasVisibleItems ? 'none' : 'block';
    }
}

// 페이지네이션 함수
function goToPage(pageNum) {
    console.log('페이지로 이동:', pageNum);
    
    // 페이지 번호 업데이트
    const pageNumbers = document.querySelectorAll('.page-number');
    pageNumbers.forEach(page => {
        if (page.textContent !== '...') {
            page.classList.remove('active');
            if (parseInt(page.textContent) === pageNum) {
                page.classList.add('active');
            }
        }
    });
    
    // 실제로는 API를 호출하여 해당 페이지의 NFT 가져오기
    // 여기서는 페이지 번호만 변경
}

function goToPreviousPage() {
    const activePage = document.querySelector('.page-number.active');
    const pageNum = parseInt(activePage.textContent);
    
    if (pageNum > 1) {
        goToPage(pageNum - 1);
    }
}

function goToNextPage() {
    const activePage = document.querySelector('.page-number.active');
    const pageNum = parseInt(activePage.textContent);
    const maxPage = 10; // 임의의 최대 페이지 수
    
    if (pageNum < maxPage) {
        goToPage(pageNum + 1);
    }
}

// NFT 상세 정보 표시 함수
function showNFTDetails(nftItem) {
    const title = nftItem.querySelector('h3').textContent;
    const creator = nftItem.querySelector('.nft-creator').textContent;
    const price = nftItem.querySelector('.nft-price span:last-child').textContent;
    
    console.log('NFT 상세 정보:', { title, creator, price });
    
    // 모달 창으로 상세 정보 표시
    const modalWrapper = document.createElement('div');
    modalWrapper.className = 'modal';
    modalWrapper.style.display = 'block'; // 모달이 보이도록 표시 설정
    
    const modal = document.createElement('div');
    modal.className = 'nft-detail-modal';
    modal.style.display = 'block';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    // 모바일 대응을 위한 스타일 추가
    if (window.innerWidth <= 768) {
        modalContent.style.width = '100vw';
        modalContent.style.height = '100vh';
        modalContent.style.maxWidth = 'none';
        modalContent.style.margin = '0';
        modalContent.style.padding = '0';
        modalContent.style.borderRadius = '0';
        modalContent.style.overflowY = 'auto';
    }
    
    // 닫기 버튼
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-modal';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = function() {
        document.body.removeChild(modalWrapper);
    };
    
    // 모달 배경 클릭 시 닫기
    modalWrapper.onclick = function(event) {
        if (event.target === modalWrapper || event.target === modal) {
            document.body.removeChild(modalWrapper);
        }
    };
    
    // 상세 정보 내용
    const detailsContent = document.createElement('div');
    detailsContent.className = 'nft-details-content';
    
    // 이미지와 정보를 나란히 배치
    detailsContent.innerHTML = `
        <div class="nft-detail-image">
            <div class="nft-image">
                <div class="placeholder-image"></div>
            </div>
        </div>
        <div class="nft-detail-info">
            <h2>${title}</h2>
            <p class="nft-creator">${creator}</p>
            <div class="nft-price">
                <span class="material-icons">currency_bitcoin</span>
                <span>${price}</span>
            </div>
            <div class="nft-description">
                <h3>Description</h3>
                <p>This is a unique digital artwork created with passion and creativity.</p>
            </div>
            <div class="nft-details-actions">
                <button class="btn-secondary">Add to Wishlist</button>
                <button class="btn-primary">Buy Now</button>
            </div>
        </div>
    `;
    
    // 모달 구성 요소 조합
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(detailsContent);
    modal.appendChild(modalContent);
    modalWrapper.appendChild(modal);
    
    // 문서에 모달 추가
    document.body.appendChild(modalWrapper);
    
    // 모바일에서 body 스크롤 방지
    if (window.innerWidth <= 768) {
        document.body.style.overflow = 'hidden';
    }
    
    // 모달이 닫힐 때 body 스크롤 복원
    closeBtn.addEventListener('click', function() {
        document.body.style.overflow = '';
    });
    
    // 모달 배경 클릭 시에도 body 스크롤 복원
    modalWrapper.addEventListener('click', function(event) {
        if (event.target === modalWrapper || event.target === modal) {
            document.body.style.overflow = '';
        }
    });
}

// 솔라나 구현을 위한 더미 함수 (나중에 구현 예정)
function loadSolanaNFTs() {
    console.log('솔라나 NFT 로드 준비됨');
    // 솔라나 API 연동 코드는 나중에 구현
}

// 지갑 연결 함수 (나중에 구현 예정)
function connectWallet() {
    console.log('지갑 연결 준비됨');
    // 솔라나 지갑 연결 코드는 나중에 구현
}

// 좋아요 토글 함수
function toggleLike(likeButton) {
    const likeIcon = likeButton.querySelector('.material-icons');
    const countElement = likeButton.querySelector('.interaction-count');
    let count = parseInt(likeButton.getAttribute('data-count'));
    
    if (likeButton.classList.contains('active')) {
        // 좋아요 취소
        likeButton.classList.remove('active');
        likeIcon.textContent = 'favorite_border';
        count--;
    } else {
        // 좋아요 추가
        likeButton.classList.add('active');
        likeIcon.textContent = 'favorite';
        count++;
    }
    
    // 카운트 업데이트
    likeButton.setAttribute('data-count', count);
    countElement.textContent = count;
    
    // 실제로는 API 호출하여 서버에 업데이트 필요
    console.log('좋아요 상태 변경:', { liked: likeButton.classList.contains('active'), count: count });
}

// 댓글 모달 열기
function openCommentModal(commentButton) {
    const commentModal = document.getElementById('comment-modal');
    const nftItem = commentButton.closest('.nft-item');
    const title = nftItem.querySelector('h3').textContent;
    
    // 모달 제목 설정
    const modalTitle = commentModal.querySelector('.comment-modal-title');
    modalTitle.textContent = `Comments on "${title}"`;
    
    // 모달 표시
    commentModal.style.display = 'block';
    
    // 실제로는 API 호출하여 해당 NFT의 댓글 목록 로드 필요
    console.log('댓글 모달 열기:', { nftTitle: title });
}

// 댓글 모달 닫기
function closeCommentModal() {
    const commentModal = document.getElementById('comment-modal');
    commentModal.style.display = 'none';
}

// 공유 모달 열기
function openShareModal(shareButton) {
    const shareModal = document.getElementById('share-modal');
    const nftItem = shareButton.closest('.nft-item');
    const title = nftItem.querySelector('h3').textContent;
    
    // 모달 제목 설정
    const modalTitle = shareModal.querySelector('.share-modal-title');
    modalTitle.textContent = `Share "${title}"`;
    
    // NFT 링크 생성 (실제로는 서버에서 가져오거나 동적으로 생성)
    const linkInput = shareModal.querySelector('.copy-link-input input');
    const nftSlug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    linkInput.value = `https://needleg.com/nft/${nftSlug}`;
    
    // 모달 표시
    shareModal.style.display = 'block';
    
    console.log('공유 모달 열기:', { nftTitle: title, nftSlug: nftSlug });
}

// 공유 모달 닫기
function closeShareModal() {
    const shareModal = document.getElementById('share-modal');
    shareModal.style.display = 'none';
}

// 소셜 미디어 공유
function shareToSocialMedia(platform) {
    const shareModal = document.getElementById('share-modal');
    const shareLink = shareModal.querySelector('.copy-link-input input').value;
    const shareTitle = shareModal.querySelector('.share-modal-title').textContent.replace('Share ', '');
    
    let shareUrl = '';
    
    switch (platform) {
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(`Check out this NFT: ${shareTitle}`)}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`;
            break;
        case 'telegram':
            shareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(`Check out this NFT: ${shareTitle}`)}`;
            break;
        case 'email':
            shareUrl = `mailto:?subject=${encodeURIComponent(`Check out this NFT: ${shareTitle}`)}&body=${encodeURIComponent(`I found this amazing NFT: ${shareLink}`)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank');
    }
    
    console.log('소셜 미디어 공유:', { platform, shareLink, shareTitle });
}

// 공유 링크 복사
function copyShareLink() {
    const linkInput = document.querySelector('.copy-link-input input');
    linkInput.select();
    document.execCommand('copy');
    
    // 복사 성공 알림
    const copyBtn = document.querySelector('.copy-link-btn');
    const originalIcon = copyBtn.innerHTML;
    copyBtn.innerHTML = '<span class="material-icons">check</span>';
    
    setTimeout(() => {
        copyBtn.innerHTML = originalIcon;
    }, 2000);
    
    console.log('링크 복사됨:', linkInput.value);
}

// 댓글 등록
function postComment() {
    const commentTextarea = document.querySelector('.comment-form textarea');
    const commentText = commentTextarea.value.trim();
    
    if (commentText === '') {
        return;
    }
    
    // 댓글 요소 생성
    const newComment = document.createElement('div');
    newComment.className = 'comment-item';
    newComment.innerHTML = `
        <div class="comment-avatar">
            <span class="material-icons">account_circle</span>
        </div>
        <div class="comment-content">
            <div class="comment-header">
                <span class="comment-author">@current_user</span>
                <span class="comment-time">Just now</span>
            </div>
            <p class="comment-text">${commentText}</p>
            <div class="comment-actions">
                <button class="comment-like">
                    <span class="material-icons">favorite_border</span>
                    <span>0</span>
                </button>
                <button class="comment-reply">Reply</button>
            </div>
        </div>
    `;
    
    // 댓글 추가
    const commentsContainer = document.querySelector('.comments-container');
    commentsContainer.insertBefore(newComment, commentsContainer.firstChild);
    
    // 댓글 입력창 초기화
    commentTextarea.value = '';
    
    // 댓글 좋아요 이벤트 리스너 추가
    const likeBtn = newComment.querySelector('.comment-like');
    likeBtn.addEventListener('click', function() {
        toggleCommentLike(this);
    });
    
    console.log('댓글 등록:', { text: commentText });
}

// 댓글 좋아요 토글
function toggleCommentLike(likeButton) {
    const likeIcon = likeButton.querySelector('.material-icons');
    const countElement = likeButton.querySelector('span:last-child');
    let count = parseInt(countElement.textContent);
    
    if (likeIcon.textContent === 'favorite') {
        // 좋아요 취소
        likeIcon.textContent = 'favorite_border';
        count--;
    } else {
        // 좋아요 추가
        likeIcon.textContent = 'favorite';
        count++;
    }
    
    // 카운트 업데이트
    countElement.textContent = count;
    
    console.log('댓글 좋아요 토글:', { count: count });
}

// 북마크 토글 함수
function toggleBookmark(bookmarkButton) {
    const bookmarkIcon = bookmarkButton.querySelector('.material-icons');
    const isBookmarked = bookmarkButton.getAttribute('data-bookmarked') === 'true';
    const nftItem = bookmarkButton.closest('.nft-item');
    
    // 북마크 상태 토글
    if (isBookmarked) {
        // 북마크 해제
        bookmarkButton.setAttribute('data-bookmarked', 'false');
        bookmarkIcon.textContent = 'bookmark_border';
        removeFromSaved(nftItem);
    } else {
        // 북마크 추가
        bookmarkButton.setAttribute('data-bookmarked', 'true');
        bookmarkIcon.textContent = 'bookmark';
        addToSaved(nftItem);
    }
    
    // 실제로는 API 호출하여 서버에 업데이트 필요
    console.log('북마크 상태 변경:', { bookmarked: !isBookmarked });
}

// 북마크된 NFT를 저장하는 함수
function addToSaved(nftItem) {
    // 현재 저장된 북마크 목록 가져오기
    let savedNFTs = JSON.parse(localStorage.getItem('savedNFTs') || '[]');
    
    const nftId = nftItem.getAttribute('data-id') || generateNFTId(nftItem);
    const nftTitle = nftItem.querySelector('h3').textContent;
    const nftCreator = nftItem.querySelector('.nft-creator').textContent;
    const nftPrice = nftItem.querySelector('.nft-price span:last-child').textContent;
    const nftCategory = nftItem.getAttribute('data-category');
    const nftArtistType = nftItem.getAttribute('data-artist-type');
    
    // 이미 저장되어 있는지 확인
    const existingIndex = savedNFTs.findIndex(item => item.id === nftId);
    
    if (existingIndex === -1) {
        // 새로운 항목 추가
        savedNFTs.push({
            id: nftId,
            title: nftTitle,
            creator: nftCreator,
            price: nftPrice,
            category: nftCategory,
            artistType: nftArtistType,
            savedAt: new Date().toISOString()
        });
        
        // 로컬 스토리지에 저장
        localStorage.setItem('savedNFTs', JSON.stringify(savedNFTs));
        
        // 저장 완료 메시지
        showToast('NFT saved to your collection');
    }
}

// 북마크된 NFT를 제거하는 함수
function removeFromSaved(nftItem) {
    // 현재 저장된 북마크 목록 가져오기
    let savedNFTs = JSON.parse(localStorage.getItem('savedNFTs') || '[]');
    
    const nftId = nftItem.getAttribute('data-id') || generateNFTId(nftItem);
    
    // 해당 항목 제거
    const newSavedNFTs = savedNFTs.filter(item => item.id !== nftId);
    
    // 로컬 스토리지에 저장
    localStorage.setItem('savedNFTs', JSON.stringify(newSavedNFTs));
    
    // 제거 완료 메시지
    showToast('NFT removed from your collection');
}

// NFT ID 생성 함수 (고유 식별자가 없을 경우 임시로 생성)
function generateNFTId(nftItem) {
    const title = nftItem.querySelector('h3').textContent;
    const creator = nftItem.querySelector('.nft-creator').textContent;
    return `${title.replace(/\s+/g, '-').toLowerCase()}-${creator.replace(/\s+/g, '-').toLowerCase()}`;
}

// 알림 메시지 표시 함수
function showToast(message) {
    // 이미 존재하는 토스트 확인
    let toast = document.querySelector('.toast-notification');
    
    if (toast) {
        // 이미 있는 토스트 업데이트
        toast.textContent = message;
        clearTimeout(window.toastTimeout);
    } else {
        // 새 토스트 생성
        toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // 토스트 애니메이션
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
    }
    
    // 토스트 자동 제거
    window.toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Account 페이지에서 저장된 NFT 표시 함수 (Account.js에 연결되어야 함)
function loadSavedNFTs() {
    const savedNFTs = JSON.parse(localStorage.getItem('savedNFTs') || '[]');
    const savedContainer = document.querySelector('.saved-nfts-container');
    
    if (savedContainer) {
        if (savedNFTs.length === 0) {
            // 저장된 항목이 없는 경우
            savedContainer.innerHTML = '<div class="no-saved-items">No saved NFTs yet. Browse and bookmark NFTs to save them here.</div>';
            return;
        }
        
        // 컨테이너 초기화
        savedContainer.innerHTML = '';
        
        // 저장된 NFT 추가
        savedNFTs.forEach(nft => {
            const nftItem = createNFTItem(nft);
            savedContainer.appendChild(nftItem);
        });
    }
}

// 저장된 NFT 아이템 생성 함수
function createNFTItem(nft) {
    const nftItem = document.createElement('div');
    nftItem.className = 'nft-item';
    nftItem.setAttribute('data-id', nft.id);
    nftItem.setAttribute('data-category', nft.category);
    nftItem.setAttribute('data-artist-type', nft.artistType);
    
    nftItem.innerHTML = `
        <div class="nft-image">
            ${nft.artistType === 'professional' ? '<div class="artist-badge verified"><span class="material-icons">verified</span></div>' : ''}
        </div>
        <div class="nft-info">
            <h3>${nft.title}</h3>
            <p class="nft-creator">${nft.creator} ${nft.artistType === 'professional' ? '<span class="material-icons artist-verified-icon">verified</span>' : ''}</p>
            <div class="nft-price">
                <span class="material-icons">currency_bitcoin</span>
                <span>${nft.price}</span>
            </div>
            <div class="nft-interactions">
                <div class="left-interactions">
                    <button class="interaction-btn like-btn" data-count="0">
                        <span class="material-icons">favorite_border</span>
                        <span class="interaction-count">0</span>
                    </button>
                    <button class="interaction-btn comment-btn" data-count="0">
                        <span class="material-icons">chat_bubble_outline</span>
                        <span class="interaction-count">0</span>
                    </button>
                    <button class="interaction-btn share-btn">
                        <span class="material-icons">share</span>
                    </button>
                </div>
                <div class="right-interactions">
                    <button class="interaction-btn bookmark-btn" data-bookmarked="true">
                        <span class="material-icons">bookmark</span>
                    </button>
                </div>
            </div>
            <div class="saved-date">Saved on ${new Date(nft.savedAt).toLocaleDateString()}</div>
        </div>
    `;
    
    // 이벤트 리스너 추가
    const bookmarkBtn = nftItem.querySelector('.bookmark-btn');
    if (bookmarkBtn) {
        bookmarkBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleBookmark(this);
        });
    }
    
    return nftItem;
}

// 페이지 로드 시 북마크 상태 초기화
function initializeBookmarkState() {
    const savedNFTs = JSON.parse(localStorage.getItem('savedNFTs') || '[]');
    const nftItems = document.querySelectorAll('.nft-item');
    
    if (nftItems.length > 0 && savedNFTs.length > 0) {
        nftItems.forEach(item => {
            const nftId = item.getAttribute('data-id') || generateNFTId(item);
            const isBookmarked = savedNFTs.some(saved => saved.id === nftId);
            const bookmarkBtn = item.querySelector('.bookmark-btn');
            
            if (bookmarkBtn) {
                bookmarkBtn.setAttribute('data-bookmarked', isBookmarked.toString());
                bookmarkBtn.querySelector('.material-icons').textContent = isBookmarked ? 'bookmark' : 'bookmark_border';
            }
        });
    }
}

// 페이지 로드 완료 후 북마크 상태 초기화
document.addEventListener('DOMContentLoaded', function() {
    // Browse 페이지인 경우에만 실행
    if (window.location.hash === '#browse' || document.querySelector('.browse-container')) {
        initializeBookmarkState();
    }
    
    // Account 페이지에서 Saved 탭이 선택된 경우에만 실행
    if (window.location.hash === '#account' && document.querySelector('.saved-nfts-container')) {
        loadSavedNFTs();
    }
});

// 북마크 관련 CSS 스타일
const bookmarkStyles = `
.toast-notification {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background-color: var(--accent-color);
    color: white;
    padding: 12px 20px;
    border-radius: 4px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
    z-index: 9999;
    opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.toast-notification.show {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
}

.saved-date {
    font-size: 11px;
    color: var(--text-secondary);
    margin-top: 8px;
}

.no-saved-items {
    text-align: center;
    padding: 50px 20px;
    color: var(--text-secondary);
}
`;

// 스타일 요소 생성 및 추가
const styleElement = document.createElement('style');
styleElement.textContent = bookmarkStyles;
document.head.appendChild(styleElement);