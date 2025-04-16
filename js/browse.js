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
}

// NFT 검색 함수
function searchNFTs(query) {
    console.log('검색어:', query);
    // 실제로는 솔라나 API를 호출하여 NFT 검색
    // 여기서는 간단한 필터링 예시만 구현
    
    const nftItems = document.querySelectorAll('.nft-item');
    
    if (query.trim() === '') {
        // 검색어가 비어있으면 모든 NFT 표시
        nftItems.forEach(item => {
            item.style.display = 'block';
        });
        return;
    }
    
    // 검색어로 필터링
    nftItems.forEach(item => {
        const title = item.querySelector('h3').textContent.toLowerCase();
        const creator = item.querySelector('.nft-creator').textContent.toLowerCase();
        
        if (title.includes(query.toLowerCase()) || creator.includes(query.toLowerCase())) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// 필터 적용 함수
function applyFilters() {
    const category = document.getElementById('category-filter').value;
    const sortBy = document.getElementById('sort-filter').value;
    
    console.log('카테고리:', category);
    console.log('정렬기준:', sortBy);
    
    // 실제로는 솔라나 API를 호출하여 필터링된 결과 가져오기
    // 여기서는 간단한 정렬 및 필터링 예시만 구현
    
    const nftGrid = document.querySelector('.nft-grid');
    let nftItems = Array.from(document.querySelectorAll('.nft-item'));
    
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
    
    // 정렬된 아이템 다시 추가
    nftGrid.innerHTML = '';
    nftItems.forEach(item => {
        nftGrid.appendChild(item);
    });
    
    // 결과가 없을 경우 메시지 표시
    if (nftItems.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.textContent = '검색 결과가 없습니다.';
        nftGrid.appendChild(noResults);
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
    
    // 실제로는 모달 창이나 상세 페이지로 이동
    alert(`NFT 상세 정보\n제목: ${title}\n제작자: ${creator}\n가격: ${price}`);
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