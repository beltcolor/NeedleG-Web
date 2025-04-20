// Feed 페이지 로드 함수
function loadFeedContent() {
    fetch('ContentFeed.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('main-content').innerHTML = data;
            setupFeedEvents();
            setupPullToRefresh();
            setupProfileLinks();
        })
        .catch(error => console.error('Error loading feed content:', error));
}

// Feed 페이지 이벤트 설정
function setupFeedEvents() {
    // 좋아요 버튼 이벤트 설정
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const icon = button.querySelector('.material-icons');
            if (button.classList.contains('liked')) {
                button.classList.remove('liked');
                icon.textContent = 'favorite_border';
                // 좋아요 카운트 업데이트
                const likesElement = button.closest('.feed-post').querySelector('.feed-post-likes');
                const likes = parseInt(likesElement.textContent) - 1;
                likesElement.textContent = `${likes} likes`;
            } else {
                button.classList.add('liked');
                icon.textContent = 'favorite';
                // 좋아요 카운트 업데이트
                const likesElement = button.closest('.feed-post').querySelector('.feed-post-likes');
                const likes = parseInt(likesElement.textContent) + 1;
                likesElement.textContent = `${likes} likes`;
            }
        });
    });

    // 북마크 버튼 이벤트 설정
    const bookmarkButtons = document.querySelectorAll('.feed-post-action-btn:last-child');
    bookmarkButtons.forEach(button => {
        button.addEventListener('click', () => {
            const icon = button.querySelector('.material-icons');
            if (icon.textContent === 'bookmark') {
                icon.textContent = 'bookmark_border';
            } else {
                icon.textContent = 'bookmark';
            }
        });
    });

    // 댓글 입력 활성화/비활성화
    const commentInputs = document.querySelectorAll('.feed-post-add-comment input');
    commentInputs.forEach(input => {
        const postButton = input.nextElementSibling;
        
        input.addEventListener('input', () => {
            if (input.value.trim()) {
                postButton.classList.add('active');
            } else {
                postButton.classList.remove('active');
            }
        });
    });

    // 댓글 게시 버튼 이벤트
    const postButtons = document.querySelectorAll('.feed-post-add-comment button');
    postButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling;
            const commentText = input.value.trim();
            
            if (commentText) {
                // 댓글 게시 로직 (실제로는 서버에 저장해야 함)
                console.log('Posted comment:', commentText);
                
                // 입력 필드 초기화
                input.value = '';
                button.classList.remove('active');
                
                // 피드백 제공 (예: 댓글 수 증가)
                const post = button.closest('.feed-post');
                const commentsElement = post.querySelector('.feed-post-view-comments');
                const commentCountText = commentsElement.textContent;
                const commentCount = parseInt(commentCountText.match(/\d+/)[0]) + 1;
                commentsElement.textContent = `View all ${commentCount} comments`;
            }
        });
    });

    // 댓글 보기 이벤트
    const viewCommentsElements = document.querySelectorAll('.feed-post-view-comments');
    viewCommentsElements.forEach(element => {
        element.addEventListener('click', (e) => {
            // 댓글 모달을 열거나 댓글 섹션을 확장하는 로직
            console.log('View comments clicked');
            alert('댓글 기능은 현재 개발 중입니다.');
        });
    });

    // 무한 스크롤 (스크롤 이벤트를 통한 추가 컨텐츠 로드)
    window.addEventListener('scroll', () => {
        // 페이지 하단에 도달했는지 확인
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            // 추가 컨텐츠 로드 로직
            loadMoreFeedContent();
        }
    });

    // 스토리 클릭 이벤트
    const storyElements = document.querySelectorAll('.feed-story');
    storyElements.forEach(story => {
        story.addEventListener('click', () => {
            const username = story.querySelector('.feed-story-username').textContent;
            console.log('Story clicked:', username);
            alert(`${username}의 스토리가 준비 중입니다.`);
        });
    });
}

// 더 많은 피드 콘텐츠 로드 (무한 스크롤용)
function loadMoreFeedContent() {
    const feedLoading = document.querySelector('.feed-loading');
    
    // 이미 로딩 중인지 확인
    if (feedLoading.classList.contains('loading')) {
        return;
    }
    
    // 로딩 상태 표시
    feedLoading.classList.add('loading');
    feedLoading.innerHTML = '<span class="material-icons rotating">autorenew</span>';
    
    // 로딩 시뮬레이션 (실제로는 API 호출)
    setTimeout(() => {
        // 새 포스트 추가
        const posts = [
            {
                username: 'crypto_enthusiast',
                verified: false,
                location: 'Berlin, Germany',
                likes: 67,
                caption: 'Just acquired this amazing NFT from my favorite artist. The colors and composition are incredible! #NFTCollector #DigitalArt',
                comments: 5,
                time: '12 HOURS AGO'
            },
            {
                username: 'art_collector',
                verified: true,
                location: 'Paris, France',
                likes: 124,
                caption: 'Proud to present the latest addition to my digital art collection. This piece speaks volumes about contemporary digital expression. #NFTArt #Collection',
                comments: 15,
                time: '1 DAY AGO'
            }
        ];
        
        const feedContainer = document.querySelector('.feed-container');
        
        // 로딩 요소 제거
        feedLoading.remove();
        
        // 새 포스트 추가
        posts.forEach(post => {
            const postElement = createPostElement(post);
            feedContainer.appendChild(postElement);
        });
        
        // 새 로딩 요소 추가
        const newLoadingElement = document.createElement('div');
        newLoadingElement.className = 'feed-loading';
        newLoadingElement.innerHTML = '<span class="material-icons">autorenew</span>';
        feedContainer.appendChild(newLoadingElement);
        
        // 새 포스트에 이벤트 리스너 설정
        setupFeedEvents();
    }, 1500);
}

// 새 포스트 요소 생성
function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.className = 'feed-post';
    
    postElement.innerHTML = `
        <div class="feed-post-header">
            <a href="#profile/${post.username}" class="feed-post-avatar-link">
                <div class="feed-post-avatar">
                    <span class="material-icons">person</span>
                </div>
            </a>
            <div class="feed-post-user">
                <a href="#profile/${post.username}" class="feed-post-username-link">
                    <div class="feed-post-username">${post.username} ${post.verified ? '<span class="material-icons" style="font-size: 14px; color: var(--accent-color);">verified</span>' : ''}</div>
                </a>
                <div class="feed-post-location">${post.location}</div>
            </div>
            <div class="feed-post-options">
                <span class="material-icons">more_horiz</span>
            </div>
        </div>
        
        <div class="feed-post-image">
            <!-- NFT 이미지 -->
        </div>
        
        <div class="feed-post-actions">
            <div class="feed-post-left-actions">
                <button class="feed-post-action-btn like-btn">
                    <span class="material-icons">favorite_border</span>
                </button>
                <button class="feed-post-action-btn">
                    <span class="material-icons">chat_bubble_outline</span>
                </button>
                <button class="feed-post-action-btn">
                    <span class="material-icons">send</span>
                </button>
            </div>
            <button class="feed-post-action-btn">
                <span class="material-icons">bookmark_border</span>
            </button>
        </div>
        
        <div class="feed-post-likes">
            ${post.likes} likes
        </div>
        
        <div class="feed-post-caption">
            <p class="feed-post-caption-text">
                <a href="#profile/${post.username}" class="feed-post-username-link">
                    <span class="feed-post-caption-username">${post.username}</span>
                </a> 
                ${post.caption}
            </p>
        </div>
        
        <div class="feed-post-comments">
            <div class="feed-post-view-comments">
                View all ${post.comments} comments
            </div>
        </div>
        
        <div class="feed-post-timestamp">
            ${post.time}
        </div>
        
        <div class="feed-post-add-comment">
            <input type="text" placeholder="Add a comment...">
            <button>Post</button>
        </div>
    `;
    
    return postElement;
}

// CSS 애니메이션 추가
const feedStyle = document.createElement('style');
feedStyle.textContent = `
    @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .rotating {
        animation: rotate 1s linear infinite;
    }
`;
document.head.appendChild(feedStyle);

// 위로 당겨서 새로고침 기능 설정
function setupPullToRefresh() {
    let startY = 0;
    let isRefreshing = false;
    const feedContainer = document.querySelector('.feed-container');
    
    if (!feedContainer) return;
    
    // 새로고침 인디케이터 추가
    const refreshIndicator = document.createElement('div');
    refreshIndicator.className = 'refresh-indicator';
    refreshIndicator.innerHTML = '<span class="material-icons">arrow_downward</span>';
    feedContainer.prepend(refreshIndicator);
    
    // 터치 시작 이벤트
    document.addEventListener('touchstart', function(e) {
        // 현재 스크롤 위치가 맨 위에 있는지 확인
        if (window.scrollY === 0) {
            startY = e.touches[0].clientY;
        }
    }, { passive: true });
    
    // 터치 이동 이벤트
    document.addEventListener('touchmove', function(e) {
        if (startY === 0 || isRefreshing) return;
        
        const currentY = e.touches[0].clientY;
        const diff = currentY - startY;
        
        // 아래로 당기는 중이고, 스크롤 위치가 맨 위에 있을 때
        if (diff > 0 && window.scrollY === 0) {
            // 인디케이터 표시 및 변형
            const pullDistance = Math.min(diff * 0.5, 150); // 저항 추가 (0.5 배율)
            refreshIndicator.style.transform = `translateY(${pullDistance}px)`;
            refreshIndicator.style.opacity = Math.min(pullDistance / 80, 1);
            
            // 충분히 당겼을 때 회전 아이콘으로 변경
            if (pullDistance > 60) {
                refreshIndicator.querySelector('.material-icons').textContent = 'refresh';
                refreshIndicator.querySelector('.material-icons').classList.add('rotating');
                // 진동 피드백 (가능한 경우)
                if (window.navigator && window.navigator.vibrate) {
                    window.navigator.vibrate(10);
                }
            } else {
                refreshIndicator.querySelector('.material-icons').textContent = 'arrow_downward';
                refreshIndicator.querySelector('.material-icons').classList.remove('rotating');
            }
            
            // 기본 스크롤 동작 방지
            e.preventDefault();
        }
    }, { passive: false });
    
    // 터치 종료 이벤트
    document.addEventListener('touchend', function(e) {
        if (startY === 0 || isRefreshing) return;
        
        const currentY = e.changedTouches[0].clientY;
        const diff = currentY - startY;
        
        // 충분히 당겼을 때 새로고침 실행
        if (diff > 120 && window.scrollY === 0) {
            isRefreshing = true;
            
            // 새로고침 인디케이터 표시
            refreshIndicator.style.transform = 'translateY(50px)';
            refreshIndicator.querySelector('.material-icons').textContent = 'refresh';
            refreshIndicator.querySelector('.material-icons').classList.add('rotating');
            
            // 새로고침 시뮬레이션 (실제로는 API 호출)
            setTimeout(() => {
                // 피드 컨테이너 페이드 아웃
                feedContainer.style.opacity = '0.7';
                
                // 로딩 피드백 애니메이션 추가
                const loadingFeedback = document.createElement('div');
                loadingFeedback.className = 'feed-loading-new';
                loadingFeedback.style.height = '3px';
                loadingFeedback.style.width = '100%';
                loadingFeedback.style.position = 'absolute';
                loadingFeedback.style.top = '0';
                loadingFeedback.style.left = '0';
                feedContainer.appendChild(loadingFeedback);
                
                // 새 콘텐츠 로드 (여기서는, 기존 피드 새로고침으로 시뮬레이션)
                setTimeout(() => {
                    // 로딩 피드백 제거
                    loadingFeedback.remove();
                    
                    // 기존 인디케이터 원래 위치로
                    refreshIndicator.style.transform = 'translateY(0)';
                    refreshIndicator.style.opacity = '0';
                    
                    // 피드 컨테이너 페이드 인
                    feedContainer.style.opacity = '1';
                    
                    // 피드 다시 로드 (실제로는 API 호출로 교체)
                    loadFeedContent();
                    
                    // 상태 초기화
                    isRefreshing = false;
                    startY = 0;
                    
                    // 성공 메시지 표시
                    showRefreshToast();
                }, 1000);
            }, 500);
        } else {
            // 충분히 당기지 않았을 때 인디케이터 원래 위치로
            refreshIndicator.style.transform = 'translateY(0)';
            refreshIndicator.style.opacity = '0';
            startY = 0;
        }
    }, { passive: true });
}

// 프로필 링크 설정 함수
function setupProfileLinks() {
    // 프로필 아바타 또는 유저네임 클릭 이벤트 리스너 설정
    const profileLinks = document.querySelectorAll('.feed-post-avatar-link, .feed-post-username-link');
    
    profileLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // URL에서 유저네임 추출
            const username = this.getAttribute('href').split('/')[1];
            
            // 즉시 프로필 페이지로 이동
            navigateToProfile(username);
        });
    });
}

// 프로필 페이지로 이동하는 함수
function navigateToProfile(username) {
    // 프로필 정보 (실제로는 API에서 가져와야 함)
    const profileInfo = {
        artist_name: {
            name: 'Artist Name',
            posts: 42,
            followers: 1248,
            following: 567,
            bio: 'Digital Artist and NFT Creator',
            verified: true
        },
        digital_artist: {
            name: 'Digital Artist',
            posts: 78,
            followers: 892,
            following: 315,
            bio: 'Creating digital masterpieces and NFTs',
            verified: false
        },
        nft_designer: {
            name: 'NFT Designer',
            posts: 156,
            followers: 3450,
            following: 421,
            bio: 'Professional NFT creator and digital artist',
            verified: true
        }
    };
    
    // 기본 프로필 정보
    const defaultProfile = {
        name: username,
        posts: 0,
        followers: 0,
        following: 0,
        bio: '',
        verified: false
    };
    
    // 요청한 유저의 프로필 정보 가져오기
    const profile = profileInfo[username] || defaultProfile;
    
    // 프로필 페이지 HTML 생성 (실제로는 별도 컨텐츠 로드)
    const profileHTML = createProfileHTML(username, profile);
    
    // 메인 컨텐츠에 프로필 페이지 삽입
    document.getElementById('main-content').innerHTML = profileHTML;
    
    // 해시 URL 업데이트
    window.location.hash = `profile/${username}`;
    
    // 프로필 페이지 이벤트 리스너 설정
    setupProfilePageEvents(username);
}

// 프로필 페이지 HTML 생성 함수
function createProfileHTML(username, profile) {
    // 프로필 페이지 HTML 구성
    return `
        <div class="profile-container profile-transition">
            <div class="profile-header">
                <div class="profile-back">
                    <button class="profile-back-btn">
                        <span class="material-icons">arrow_back</span>
                    </button>
                </div>
                <div class="profile-username">${username}</div>
                <div class="profile-options">
                    <span class="material-icons">more_horiz</span>
                </div>
            </div>
            
            <div class="profile-info">
                <div class="profile-avatar">
                    <span class="material-icons">person</span>
                    ${profile.verified ? '<span class="profile-verified"><span class="material-icons">verified</span></span>' : ''}
                </div>
                
                <div class="profile-stats">
                    <div class="profile-stat">
                        <span class="stat-number">${profile.posts}</span>
                        <span class="stat-label">게시물</span>
                    </div>
                    <div class="profile-stat">
                        <span class="stat-number">${profile.followers}</span>
                        <span class="stat-label">팔로워</span>
                    </div>
                    <div class="profile-stat">
                        <span class="stat-number">${profile.following}</span>
                        <span class="stat-label">팔로잉</span>
                    </div>
                </div>
            </div>
            
            <div class="profile-bio">
                <h3 class="profile-name">${profile.name}</h3>
                <p class="profile-bio-text">${profile.bio}</p>
            </div>
            
            <div class="profile-actions">
                <button class="profile-follow-btn">팔로우</button>
                <button class="profile-message-btn">메시지</button>
            </div>
            
            <div class="profile-tabs">
                <button class="profile-tab active">
                    <span class="material-icons">grid_on</span>
                </button>
                <button class="profile-tab">
                    <span class="material-icons">video_library</span>
                </button>
                <button class="profile-tab">
                    <span class="material-icons">bookmark_border</span>
                </button>
                <button class="profile-tab">
                    <span class="material-icons">person_outline</span>
                </button>
            </div>
            
            <div class="profile-posts">
                <!-- 프로필에 게시물이 없는 경우 표시될 메시지 -->
                <div class="profile-empty-posts">
                    <span class="material-icons">photo_camera</span>
                    <p>아직 게시물이 없습니다</p>
                </div>
            </div>
        </div>
    `;
}

// 프로필 페이지 이벤트 리스너 설정
function setupProfilePageEvents(username) {
    // 뒤로가기 버튼 클릭 이벤트
    const backButton = document.querySelector('.profile-back-btn');
    if (backButton) {
        backButton.addEventListener('click', function() {
            // 피드 페이지로 돌아가기
            window.location.hash = 'feed';
            loadFeedContent();
        });
    }
    
    // 팔로우 버튼 클릭 이벤트
    const followButton = document.querySelector('.profile-follow-btn');
    if (followButton) {
        followButton.addEventListener('click', function() {
            // 버튼 상태 토글
            if (this.classList.contains('following')) {
                this.classList.remove('following');
                this.textContent = '팔로우';
            } else {
                this.classList.add('following');
                this.textContent = '팔로잉';
                // 진동 피드백 (가능한 경우)
                if (window.navigator && window.navigator.vibrate) {
                    window.navigator.vibrate(10);
                }
            }
        });
    }
    
    // 메시지 버튼 클릭 이벤트
    const messageButton = document.querySelector('.profile-message-btn');
    if (messageButton) {
        messageButton.addEventListener('click', function() {
            alert(`메시지 기능은 현재 개발 중입니다.`);
        });
    }
}

// 무한 스크롤 리스너를 초기화하는 함수
function setupInfiniteScroll() {
    window.addEventListener('scroll', () => {
        // 페이지 하단에 도달했는지 확인
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            // 피드 페이지일 때만 추가 콘텐츠 로드
            const feedContainer = document.querySelector('.feed-container');
            if (feedContainer) {
                loadMoreFeedContent();
            }
        }
    });
}

