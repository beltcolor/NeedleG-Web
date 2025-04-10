// 페이지가 로드될 때 기본 콘텐츠를 불러옵니다
document.addEventListener('DOMContentLoaded', function() {
    // 기본적으로 'get-tattoo' 페이지를 로드합니다
    navigateTo('get-tattoo');
    
    // 테마 설정 초기화
    initTheme();
});

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

// 페이지 네비게이션 함수 개선
async function navigateTo(page) {
    const container = document.getElementById('main-content');
    try {
        let content;
        switch(page) {
            case 'get-tattoo':
                await loadTattooContent();
                break;
            case 'collection':
                container.innerHTML = loadCollectionContent();
                break;
            case 'account':
                await loadAccountContent();
                break;
        }

    } catch (error) {
        console.error('페이지 로드 중 오류:', error);
        container.innerHTML = '<p>콘텐츠를 불러오는데 실패했습니다.</p>';
    }
}

// Get Tattoo 페이지 로드 함수
function loadTattooContent() {
    console.log('타투 콘텐츠 로드 시작');
    fetch('ContentTattoo.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('main-content').innerHTML = data;
            
            // 페이지 내비게이션 초기화 함수 호출
            initTattooPageNavigation();
            
            // 각 섹션 기능 초기화
            const widthElement = document.getElementById('width');
            const heightElement = document.getElementById('height');
            if (widthElement) widthElement.addEventListener('input', calculateArea);
            if (heightElement) heightElement.addEventListener('input', calculateArea);
            
            // 피부색 슬라이더 초기화
            initSkinToneSlider();
            
            const descriptionMap = {
                oldschool: "Bold outlines, limited color palette, and classic designs like anchors, roses, and eagles.",
                "neo-traditional": "A modern take on Traditional tattoos with more colors, shading, and intricate details.",
                "new-school": "Cartoonish and exaggerated designs with vibrant colors and dynamic compositions.",
                realism: "Highly detailed tattoos that resemble photographs, often depicting portraits, animals, or nature.",
                "black-grey": "A monochromatic version of Realism that relies on shading to create depth.",
                hyperrealism: "Extremely detailed realism tattoos that appear almost three-dimensional.",
                illustrative: "A combination of drawing and painting techniques, blending realism with artistic expression.",
                watercolor: "Soft, blended colors that mimic the look of watercolor paintings.",
                dotwork: "Composed of thousands of tiny dots to create patterns, shading, or intricate designs.",
                geometric: "Symmetrical, pattern-based designs often inspired by sacred geometry.",
                blackwork: "Uses only black ink to create bold and often large-scale tattoos.",
                tribal: "Inspired by indigenous cultures like Polynesian, Maori, and Aztec, using bold black lines and patterns.",
                japanese: "Richly detailed depictions of dragons, koi fish, samurais, and cherry blossoms in a classic Japanese style.",
                biomechanical: "Designs that mimic mechanical components, often appearing integrated with the body.",
                sketch: "Resembles hand-drawn sketches with rough lines and shading.",
                minimalism: "Simple, clean designs with minimal lines and details.",
                lettering: "Typography-based tattoos using artistic fonts and calligraphy.",
                chicano: "Originating from Mexican-American culture, featuring black-and-grey portraits, script, and religious symbols.",
                glitch: "Inspired by digital distortions, creating a glitchy, broken image effect.",
                anime: "Features characters or scenes from anime with vibrant colors and precise detail.",
                gothic: "Dark-themed tattoos featuring skulls, crosses, demons, and other gothic elements.",
                sticker: "Designed to look like stickers placed on the skin, often with bold outlines and vibrant colors."
            };
            
            // 컬러 스타일 설명
            const colorDescriptionMap = {
                "bold-vibrant": "Strong, saturated colors that make a statement. High contrast and eye-catching.",
                "soft-pastel": "Light, delicate colors with a dreamy quality. Gentle on the eyes with a soothing feel.",
                "dark-moody": "Deep, rich colors with dramatic shadows creating an intense atmosphere.",
                "minimal-monochrome": "Single color with various shades and tints, creating a sophisticated, timeless look.",
                "earthy-natural": "Warm browns, greens, and ochres inspired by nature, creating a grounded, organic feel.",
                "black-grey": "Classic combination of black ink with grey shading, creating depth without color.",
                "retro-vintage": "Faded colors reminiscent of bygone eras, with a nostalgic, timeworn quality.",
                "mystic-cosmic": "Deep purples, blues and pinks evoking galaxies, nebulae and magical elements.",
                "neon-cyberpunk": "Bright, electric colors that pop against dark backgrounds, with a futuristic digital feel.",
                "watercolor-dreamy": "Fluid, transparent colors that blend into each other like watercolor paintings.",
                "grunge-dirty": "Distressed, textured colors with raw, edgy aesthetic and intentional imperfections.",
                "tropical-fun": "Bright, sunny colors inspired by beaches, fruits, and exotic flowers.",
                "cold-icy": "Cool blues, whites, and silvers creating a crisp, winter-inspired palette.",
                "others": "Custom color preference defined by you."
            };

            // 스타일 선택 이벤트 리스너
            const tattooStylesElement = document.getElementById('tattooStyles');
            if (tattooStylesElement) {
                tattooStylesElement.addEventListener('change', function () {
                    const style = this.value;
                    const description = descriptionMap[style];
                    const descriptionElement = document.getElementById('description');
                    if (descriptionElement) {
                        descriptionElement.innerText = `💡 ${description}`;
                    }
                });
            }
            
            // 컬러 스타일 선택 이벤트 리스너
            const colorStylesElement = document.getElementById('colorStyles');
            const otherColorContainer = document.getElementById('otherColorContainer');
            const otherColorInput = document.getElementById('otherColorInput');
            
            if (colorStylesElement) {
                colorStylesElement.addEventListener('change', function () {
                    const style = this.value;
                    const description = colorDescriptionMap[style];
                    const descriptionElement = document.getElementById('colorDescription');
                    
                    // Others... 옵션 선택 시 입력창 표시
                    if (style === 'others') {
                        otherColorContainer.style.display = 'block';
                        // 인풋 창에 포커스 주기
                        setTimeout(() => otherColorInput.focus(), 100);
                    } else {
                        otherColorContainer.style.display = 'none';
                    }
                    
                    if (descriptionElement) {
                        descriptionElement.innerText = `💡 ${description}`;
                    }
                });
            }
            
            // Others 옵션 사용자 입력 처리
            if (otherColorInput) {
                otherColorInput.addEventListener('input', function() {
                    const userInput = this.value.trim();
                    const descriptionElement = document.getElementById('colorDescription');
                    
                    if (descriptionElement && userInput) {
                        // 사용자 입력이 있는 경우 해당 내용으로 설명 업데이트
                        descriptionElement.innerText = `💡 Custom color preference: ${userInput}`;
                    } else if (descriptionElement) {
                        // 입력이 없는 경우 기본 설명 표시
                        descriptionElement.innerText = `💡 ${colorDescriptionMap['others']}`;
                    }
                });
            }
            
            // 레퍼런스 이미지 업로드 기능 초기화
            initReferenceImageUpload();

            // 폰트 관련 기능 초기화
            const useCustomFontCheckbox = document.getElementById('useCustomFont');
            if (useCustomFontCheckbox) {
                useCustomFontCheckbox.addEventListener('change', toggleFontSelection);
            }
            
            // 폰트 카테고리와 파일 정보를 저장할 객체
            const fontCategories = {
                'Bold': [],
                'Brush': [],
                'Gothic': [],
                'Graffiti': [],
                'Hand Writing': [],
                'New School': [],
                'Old School': [],
                'Simple': []
            };

            // 체크박스 상태에 따라 폰트 선택 영역을 보여주거나 숨기는 함수
            function toggleFontSelection() {
                const useCustomFont = document.getElementById('useCustomFont').checked;
                const fontSelectionArea = document.getElementById('fontSelectionArea');
                const textInputContainer = document.querySelector('.text-input-container');
                
                if (useCustomFont) {
                    // 체크박스가 선택된 경우
                    // 요소를 먼저 표시하고 그 다음 페이드 인
                    textInputContainer.style.display = 'flex';
                    fontSelectionArea.style.display = 'flex';
                    
                    // 이전에 추가된 fade-out 클래스가 있다면 제거
                    textInputContainer.classList.remove('fade-out');
                    fontSelectionArea.classList.remove('fade-out');
                    
                    // requestAnimationFrame을 사용하여 렌더링 타이밍에 맞춰 애니메이션 클래스 추가
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            textInputContainer.classList.add('fade-in');
                            fontSelectionArea.classList.add('fade-in');
                            createCategorySelector();
                        });
                    });
                } else {
                    // 체크박스가 해제된 경우
                    // 페이드 아웃 클래스 추가하여 빠르게 사라지게 함
                    textInputContainer.classList.remove('fade-in');
                    fontSelectionArea.classList.remove('fade-in');
                    
                    textInputContainer.classList.add('fade-out');
                    fontSelectionArea.classList.add('fade-out');
                    
                    // 애니메이션 완료 후 요소 숨김 (0.4초로 시간 단축)
                    setTimeout(() => {
                        textInputContainer.style.display = 'none';
                        fontSelectionArea.style.display = 'none';
                        
                        // 클래스 정리
                        textInputContainer.classList.remove('fade-out');
                        fontSelectionArea.classList.remove('fade-out');
                    }, 400); // 페이드 아웃 애니메이션 시간(0.4초)과 동일하게 설정
                }
            }

            // 카테고리 선택기를 생성하는 함수
            function createCategorySelector() {
                const fontSelectionArea = document.getElementById('fontSelectionArea');
                fontSelectionArea.innerHTML = ''; // 기존 내용 초기화
                
                // 카테고리 선택 컨테이너 생성
                const categorySelectContainer = document.createElement('div');
                categorySelectContainer.className = 'category-select-container';
                
                // 라벨 생성
                const categoryLabel = document.createElement('label');
                categoryLabel.className = 'category-label';
                categorySelectContainer.appendChild(categoryLabel);
                
                // 카테고리 선택 드롭다운 생성
                const categorySelect = document.createElement('select');
                categorySelect.id = 'font-category-select';
                categorySelect.className = 'category-select';
                
                // 기본 옵션 추가
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'Select your preferred font style';
                defaultOption.disabled = true;
                defaultOption.selected = true;
                categorySelect.appendChild(defaultOption);
                
                // 각 카테고리 옵션 추가
                Object.keys(fontCategories).forEach(category => {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = category;
                    categorySelect.appendChild(option);
                });
                
                // 카테고리 선택 시 해당 카테고리의 폰트 로드
                categorySelect.addEventListener('change', function() {
                    loadFontsForSelectedCategory(this.value);
                });
                
                categorySelectContainer.appendChild(categorySelect);
                fontSelectionArea.appendChild(categorySelectContainer);
                
                // 폰트 리스트를 표시할 컨테이너와 그라데이션 효과 생성
                const fontListWrapper = document.createElement('div');
                fontListWrapper.className = 'font-list-wrapper';
                
                // 상단 그라데이션 요소 추가
                const topFade = document.createElement('div');
                topFade.className = 'font-list-top-fade';
                fontListWrapper.appendChild(topFade);
                
                // 폰트 리스트 컨테이너 생성
                const fontListContainer = document.createElement('div');
                fontListContainer.id = 'font-list-container';
                fontListContainer.className = 'font-list-container';
                fontListWrapper.appendChild(fontListContainer);
                
                // 하단 그라데이션 요소 추가
                const bottomFade = document.createElement('div');
                bottomFade.className = 'font-list-bottom-fade';
                fontListWrapper.appendChild(bottomFade);
                
                // 전체 래퍼를 폰트 선택 영역에 추가
                fontSelectionArea.appendChild(fontListWrapper);
            }
            
            // 선택한 카테고리의 폰트를 로드하는 함수
            function loadFontsForSelectedCategory(category) {
                const fontListContainer = document.getElementById('font-list-container');
                fontListContainer.innerHTML = ''; // 기존 내용 초기화
                
                // 로딩 메시지 표시
                const loadingMessage = document.createElement('p');
                loadingMessage.textContent = '폰트 로딩 중...';
                loadingMessage.className = 'loading-message';
                fontListContainer.appendChild(loadingMessage);
                
                console.log(`폰트 카테고리 로드 시도: ${category}`);
                
                // GitHub Pages 배포시 기본 URL 설정
                const baseUrl = window.location.hostname.includes('github.io') ? '/NeedleG-Web' : '';
                
                // GitHub Pages에서는 폴더 구분자를 다르게 설정
                const folderPath = window.location.hostname.includes('github.io') ? '/NeedleG-Web/fonts' : './fonts';
                
                // JSON 파일에서 폰트 목록 가져오기
                fetch(`${baseUrl}${window.location.hostname.includes('github.io') ? '/fonts.json' : './fonts.json'}`)
                    .then(response => {
                        console.log(`JSON 응답 상태: ${response.status} ${response.statusText}`);
                        if (!response.ok) {
                            throw new Error('JSON 파일을 불러올 수 없습니다.');
                        }
                        return response.json();
                    })
                    .then(data => {
                        // 로딩 메시지 제거
                        fontListContainer.innerHTML = '';
                        
                        // 해당 카테고리의 폰트 목록 가져오기
                        const fonts = data[category];
                        
                        if (!fonts || fonts.length === 0) {
                            const noFontsMessage = document.createElement('p');
                            noFontsMessage.textContent = '이 카테고리에 사용 가능한 폰트가 없습니다.';
                            noFontsMessage.className = 'no-fonts-message';
                            fontListContainer.appendChild(noFontsMessage);
                            return;
                        }
                        
                        console.log(`${category} 카테고리의 폰트 수: ${fonts.length}`);
                        
                        // 현재 입력된 텍스트 가져오기
                        const currentText = document.getElementById('letteringText').value;
                        
                        // 현재 선택된 피부색 가져오기
                        const selectedSkinTone = document.querySelector('.skin-color-box.selected');
                        const skinColor = selectedSkinTone ? selectedSkinTone.getAttribute('data-color') : '#FFFFFF';
                        // 글자색은 항상 검정색으로 설정
                        const textColor = '#000000';
                        
                        // 폰트 그리드 컨테이너 생성
                        const fontGrid = document.createElement('div');
                        fontGrid.className = 'font-grid';
                        
                        // 각 폰트 파일에 대한 항목 생성
                        fonts.forEach(fontFile => {
                            const fontName = fontFile.replace(/\.(ttf|otf)$/i, '');
                            
                            // 각 폰트 아이템 생성
                            const fontItem = document.createElement('div');
                            fontItem.className = 'font-item';
                            fontItem.setAttribute('data-font-url', fontFile);
                            fontItem.setAttribute('data-font-name', fontName);
                            fontItem.style.backgroundColor = skinColor;
                            fontItem.style.border = `1px solid ${skinColor === '#FFFFFF' ? '#cccccc' : 'transparent'}`;
                            
                            // 폰트 이름 표시
                            const fontNameElem = document.createElement('div');
                            fontNameElem.className = 'font-name';
                            fontNameElem.textContent = fontName.replace(/%20/g, ' ');
                            fontNameElem.style.color = textColor;
                            fontNameElem.style.opacity = '0.7';
                            fontItem.appendChild(fontNameElem);
                            
                            // 폰트 샘플 표시 (사용자 입력 텍스트 사용 또는 폰트 이름)
                            const fontSample = document.createElement('div');
                            fontSample.className = 'font-sample';
                            fontSample.style.fontFamily = `"${fontName}"`;
                            fontSample.textContent = currentText || fontName.replace(/%20/g, ' ');
                            fontSample.style.backgroundColor = skinColor;
                            fontSample.style.color = textColor;
                            fontItem.appendChild(fontSample);
                            
                            // 폰트 로드 및 적용
                            loadAndApplyFontToElement(category, fontFile, fontName, fontSample);
                            
                            // 폰트 선택 이벤트
                            fontItem.addEventListener('click', function() {
                                // 선택된 클래스 토글
                                document.querySelectorAll('.font-item').forEach(item => {
                                    item.classList.remove('selected');
                                });
                                fontItem.classList.add('selected');
                                
                                // 선택된 폰트를 미리보기에 적용
                                applySelectedFont(category, fontFile);
                            });
                            
                            fontGrid.appendChild(fontItem);
                        });
                        
                        fontListContainer.appendChild(fontGrid);
                    })
                    .catch(error => {
                        console.error(`폰트 목록 로드 중 오류 (${category}):`, error);
                        fontListContainer.innerHTML = '';
                        const errorMessage = document.createElement('p');
                        errorMessage.textContent = '폰트 로드 실패. 다시 시도해주세요.';
                        errorMessage.className = 'error-message';
                        fontListContainer.appendChild(errorMessage);
                    });
            }

            // 특정 요소에 폰트를 로드하고 적용하는 함수
            function loadAndApplyFontToElement(category, fontUrl, fontName, element) {
                // GitHub Pages 배포시 기본 URL 설정
                const baseUrl = window.location.hostname.includes('github.io') ? '/NeedleG-Web' : '';
                
                // 폰트 파일의 전체 경로 구성
                const fullFontUrl = `${baseUrl}${window.location.hostname.includes('github.io') ? '/fonts' : './fonts'}/${category}/${fontUrl}`;
                
                console.log('폰트 로드 시도 (요소용):', fullFontUrl);
                
                // URL 인코딩 문제 방지를 위해 폰트 이름에서 특수문자 처리
                const safeFontName = fontName.replace(/[^a-zA-Z0-9]/g, '_');
                
                const fontFace = new FontFace(safeFontName, `url('${fullFontUrl}')`);
                fontFace.load().then(loadedFace => {
                    document.fonts.add(loadedFace);
                    element.style.fontFamily = `'${safeFontName}', sans-serif`;
                    
                    // 폰트 크기 자동 조정
                    adjustFontSize(element);
                }).catch(error => {
                    console.error('폰트 로드 실패 (요소용):', error);
                    // 폰트 로드 실패 시 기본 폰트 사용
                    element.style.fontFamily = 'sans-serif';
                    element.textContent = '로드 실패';
                    element.classList.add('font-load-error');
                });
            }

            // 폰트 크기를 자동으로 조정하는 함수
            function adjustFontSize(element) {
                // 기본 크기 설정 (더 크게)
                element.style.fontSize = '50px';
                
                // 폰트가 로드된 후 크기 조정
                setTimeout(() => {
                    // 기준 높이 (대부분의 폰트가 이 높이에 맞춰지도록)
                    const targetHeight = 70;
                    
                    // 현재 높이 측정
                    const currentHeight = element.offsetHeight;
                    
                    // 비율 계산 및 크기 조정
                    if (currentHeight > 0) {
                        const ratio = targetHeight / currentHeight;
                        const newSize = Math.round(50 * ratio);
                        
                        // 최소/최대 크기 제한 (더 큰 범위로 조정)
                        const adjustedSize = Math.max(32, Math.min(80, newSize));
                        element.style.fontSize = `${adjustedSize}px`;
                    }
                }, 100); // 폰트 로드 후 약간의 지연 시간을 두고 크기 조정
            }

            // 선택된 폰트를 적용하는 함수
            function applySelectedFont(category, fontUrl) {
                // GitHub Pages 배포시 기본 URL 설정
                const baseUrl = window.location.hostname.includes('github.io') ? '/NeedleG-Web' : '';
                
                const letteringPreview = document.getElementById('letteringPreview');
                const letteringText = document.getElementById('letteringText');
                const fontPreview = document.getElementById('font-preview');
                const reviewFontPreview = document.getElementById('review-font-preview');
                
                if (!letteringPreview || !letteringText) return;
                
                const fontName = fontUrl.replace(/\.(ttf|otf)$/i, '');
                const fullFontUrl = `${baseUrl}${window.location.hostname.includes('github.io') ? '/fonts' : './fonts'}/${category}/${fontUrl}`;
                
                console.log('폰트 적용 URL:', fullFontUrl);
                
                // 폰트 이름 안전하게 처리
                const safeFontName = fontName.replace(/[^a-zA-Z0-9]/g, '_');
                
                // 폰트가 이미 로드되어 있는지 확인
                const fontExists = Array.from(document.fonts).some(f => f.family === safeFontName);
                
                if (fontExists) {
                    letteringPreview.style.fontFamily = `'${safeFontName}', sans-serif`;
                    
                    if (fontPreview) {
                        fontPreview.style.fontFamily = `'${safeFontName}', sans-serif`;
                    }
                    
                    if (reviewFontPreview) {
                        reviewFontPreview.style.fontFamily = `'${safeFontName}', sans-serif`;
                        reviewFontPreview.style.display = 'flex';
                    }
                    
                    // 폰트 미리보기 업데이트
                    if (document.getElementById('review-lettering-font')) {
                        document.getElementById('review-lettering-font').textContent = `Font: ${fontName}`;
                        document.getElementById('review-lettering-font').style.display = 'block';
                    }
                    
                    if (document.getElementById('review-font-preview-container')) {
                        document.getElementById('review-font-preview-container').style.display = 'block';
                    }
                    
                    // 선택된 폰트 정보 저장
                    selectedLetteringFont = {
                        name: fontName,
                        url: fontUrl,
                        category: category
                    };
                    
                    console.log('폰트 선택 완료:', selectedLetteringFont);
                } else {
                    // 폰트 로드 후 적용
                    const fontFace = new FontFace(safeFontName, `url('${fullFontUrl}')`);
                    fontFace.load().then(loadedFace => {
                        document.fonts.add(loadedFace);
                        
                        letteringPreview.style.fontFamily = `'${safeFontName}', sans-serif`;
                        
                        if (fontPreview) {
                            fontPreview.style.fontFamily = `'${safeFontName}', sans-serif`;
                        }
                        
                        if (reviewFontPreview) {
                            reviewFontPreview.style.fontFamily = `'${safeFontName}', sans-serif`;
                            reviewFontPreview.style.display = 'flex';
                        }
                        
                        // 폰트 미리보기 업데이트
                        if (document.getElementById('review-lettering-font')) {
                            document.getElementById('review-lettering-font').textContent = `Font: ${fontName}`;
                            document.getElementById('review-lettering-font').style.display = 'block';
                        }
                        
                        if (document.getElementById('review-font-preview-container')) {
                            document.getElementById('review-font-preview-container').style.display = 'block';
                        }
                        
                        // 선택된 폰트 정보 저장
                        selectedLetteringFont = {
                            name: fontName,
                            url: fontUrl,
                            category: category
                        };
                        
                        console.log('폰트 선택 완료:', selectedLetteringFont);
                    }).catch(error => {
                        console.error('폰트 로드 실패 (미리보기용):', error);
                    });
                }
            }

            // 텍스트 미리보기를 업데이트하는 함수
            function updatePreview() {
                const text = document.getElementById('letteringText').value;
                
                // 폰트 샘플 미리보기들도 업데이트
                const fontSamples = document.querySelectorAll('.font-sample');
                fontSamples.forEach(sample => {
                    // 상위 폰트 아이템의 data-font-name 속성 가져오기
                    const parentItem = sample.closest('.font-item');
                    if (parentItem) {
                        const itemFontName = parentItem.getAttribute('data-font-name');
                        sample.textContent = text || itemFontName.replace(/%20/g, ' ');
                    }
                    
                    // 텍스트 길이에 따라 글자 크기 자동 조정 (더 크게)
                    const displayedText = sample.textContent;
                    if (displayedText.length > 30) {
                        sample.style.fontSize = '40px';
                    } else if (displayedText.length > 20) {
                        sample.style.fontSize = '46px';
                    } else if (displayedText.length > 10) {
                        sample.style.fontSize = '52px';
                    } else {
                        sample.style.fontSize = '58px';
                    }
                    
                    // 폰트 크기 자동 조정
                    adjustFontSize(sample);
                });
            }

            // 피부색 선택 상자 기능 초기화
            function initSkinToneSelector() {
                const skinColorBoxes = document.querySelectorAll('.skin-color-box');
                
                // 마지막 색상(흰색)을 기본으로 선택
                if (skinColorBoxes.length > 0) {
                    // 모든 선택 제거
                    skinColorBoxes.forEach(b => b.classList.remove('selected'));
                    
                    // 마지막 색상(흰색)을 선택
                    const whiteColorBox = skinColorBoxes[skinColorBoxes.length - 1];
                    whiteColorBox.classList.add('selected');
                    
                    // 피부색 선택 이벤트 리스너 추가
                    skinColorBoxes.forEach(box => {
                        box.addEventListener('click', function() {
                            // 기존 선택 제거
                            skinColorBoxes.forEach(b => b.classList.remove('selected'));
                            
                            // 새 선택 추가
                            this.classList.add('selected');
                            
                            // 선택된 배경색 가져오기
                            const selectedColor = this.getAttribute('data-color');
                            
                            // 모든 폰트 샘플 배경색만 업데이트
                            const fontSamples = document.querySelectorAll('.font-sample');
                            fontSamples.forEach(sample => {
                                sample.style.backgroundColor = selectedColor;
                                // 글자색은 항상 검정색으로 고정
                                sample.style.color = '#000000';
                            });
                            
                            // 모든 font-item 배경색도 업데이트
                            const fontItems = document.querySelectorAll('.font-item');
                            fontItems.forEach(item => {
                                item.style.backgroundColor = selectedColor;
                                item.style.border = `1px solid ${selectedColor === '#FFFFFF' ? '#cccccc' : 'transparent'}`;
                                
                                // 폰트 이름 색상은 항상 검정색으로 고정
                                const fontNameElem = item.querySelector('.font-name');
                                if (fontNameElem) {
                                    fontNameElem.style.color = '#000000';
                                }
                            });
                            
                            // 미리보기 업데이트
                            updatePreview();
                        });
                    });
                    
                    // 초기에 흰색 배경에 검정색 텍스트 설정을 적용
                    whiteColorBox.click();
                }
                
                // 폰트 관련 이벤트 리스너 추가
                const letteringTextElement = document.getElementById('letteringText');
                if (letteringTextElement) {
                    letteringTextElement.addEventListener('input', updatePreview);
                }
            }
        })
        .catch(error => {
            console.error('로드 중 오류 발생:', error);
            document.getElementById('main-content').innerHTML = '<p>타투 콘텐츠를 불러오는데 실패했습니다.</p>';
        });
}

// 타투 페이지 네비게이션 초기화 함수
function initTattooPageNavigation() {
    console.log('타투 페이지 네비게이션 초기화 시작');
    
    // 페이지와 버튼 요소 가져오기
    const pages = document.querySelectorAll('.tattoo-page');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    
    if (!pages.length || !prevButton || !nextButton) {
        console.error('타투 페이지 네비게이션 요소를 찾을 수 없습니다');
        return;
    }
    
    console.log(`페이지 갯수: ${pages.length}`);
    
    // 위치 기능 초기화
    initLocationFeatures();
    
    // 현재 페이지 인덱스
    let currentPageIndex = 0;
    
    // 초기 버튼 표시 상태 설정
    updateButtonDisplay();
    
    // 페이지 로드 시 이전 버튼 상태 초기화
    if (currentPageIndex === 0) {
        prevButton.classList.add('hidden');
    } else {
        prevButton.classList.remove('hidden');
    }
    
    // 페이지 인디케이터 도트에 클릭 이벤트 추가
    const dotIndicators = document.querySelectorAll('.dot-indicator');
    dotIndicators.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            // 페이지 이동 중이거나 현재 페이지와 같은 인덱스면 무시
            if (index === currentPageIndex || prevButton.disabled || nextButton.disabled) return;
            
            // 모든 버튼 비활성화
            prevButton.disabled = true;
            nextButton.disabled = true;
            
            // 즉시 도트 인디케이터 상태 업데이트
            dotIndicators.forEach((d, i) => {
                if (i === index) {
                    d.classList.add('active');
                } else {
                    d.classList.remove('active');
                }
            });
            
            // 이전 버튼 표시/숨김 처리 - 현재 페이지와 함께 애니메이션
            // 첫 페이지로 이동하는 경우 숨김
            if (index === 0) {
                prevButton.classList.add('hidden');
            } else {
                prevButton.classList.remove('hidden');
            }
            
            // 현재 페이지 페이드 아웃
            const currentPage = pages[currentPageIndex];
            currentPage.classList.add('fade-out');
            
            // 애니메이션 후 페이지 전환
            requestAnimationFrame(() => {
                setTimeout(() => {
                    // 현재 페이지 숨기기
                    currentPage.style.display = 'none';
                    currentPage.classList.remove('fade-out');
                    
                    // 직접 목표 페이지로 이동
                    currentPageIndex = index;
                    const targetPage = pages[currentPageIndex];
                    
                    // 목표 페이지 준비
                    targetPage.style.opacity = '0';
                    targetPage.style.display = 'block';
                    
                    // 강제 리플로우 발생
                    void targetPage.offsetWidth;
                    
                    // 페이드인 애니메이션 적용
                    targetPage.style.opacity = '';
                    targetPage.classList.add('fade-in');
                    
                    // 특정 페이지로 이동할 때 추가 동작
                    if (targetPage.id === 'page-review') {
                        updateReviewData();
                    } else if (targetPage.id === 'page-dimension') {
                        updateDimensionPage();
                    }
                    
                    // 애니메이션 완료 후 클래스 제거 및 버튼 활성화
                    setTimeout(() => {
                        targetPage.classList.remove('fade-in');
                        prevButton.disabled = false;
                        nextButton.disabled = false;
                        
                        // 페이지 전환 완료 후 버튼 상태만 업데이트 (인디케이터는 이미 업데이트됨)
                        if (currentPageIndex === 0) {
                            prevButton.classList.add('hidden');
                        } else {
                            prevButton.classList.remove('hidden');
                        }
                        
                        if (currentPageIndex === pages.length - 1) {
                            nextButton.innerHTML = 'NEXT';
                        } else {
                            nextButton.innerHTML = 'NEXT';
                        }
                    }, 300);
                }, 300);
            });
        });
    });
    
    // 버튼에 이벤트 리스너 등록
    prevButton.addEventListener('click', goToPreviousPage);
    nextButton.addEventListener('click', goToNextPage);
    
    // 이미지리 스타일 체크박스 이벤트 리스너 등록
    const useImageryStyleCheckbox = document.getElementById('useImageryStyle');
    if (useImageryStyleCheckbox) {
        useImageryStyleCheckbox.addEventListener('change', toggleImageryStyle);
    }
    
    // Cover-up 체크박스 이벤트 리스너 등록
    const useCoverupCheckbox = document.getElementById('useCoverup');
    if (useCoverupCheckbox) {
        useCoverupCheckbox.addEventListener('change', toggleCoverup);
    }
    
    // 제출 버튼 이벤트 리스너 등록
    const submitButton = document.getElementById('submit-request');
    if (submitButton) {
        submitButton.addEventListener('click', handleTattooSubmit);
    }
    
    console.log('네비게이션 버튼 이벤트 리스너 등록 완료');
    
    // 다음 페이지로 이동하는 함수
    function goToNextPage() {
        console.log(`다음 페이지로 이동: 현재 ${currentPageIndex}`);
        if (currentPageIndex < pages.length - 1) {
            // 이동 중 버튼 비활성화
            prevButton.disabled = true;
            nextButton.disabled = true;
            
            // 현재 페이지 페이드 아웃
            const currentPage = pages[currentPageIndex];
            currentPage.classList.add('fade-out');
            
            // 즉시 도트 인디케이터 상태 업데이트 (다음 페이지로)
            const dotIndicators = document.querySelectorAll('.dot-indicator');
            dotIndicators.forEach((dot, i) => {
                if (i === currentPageIndex + 1) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
            
            // 다음 페이지로 이동할 때 이전 버튼을 보이게 함 (첫 페이지에서 2페이지로 이동하는 경우)
            if (currentPageIndex === 0) {
                // 페이지 전환과 동일한 애니메이션 효과로 표시
                // 실제로는 화면 전환이 완료된 후 보이게 함
                setTimeout(() => {
                    prevButton.classList.remove('hidden');
                }, 300);
            }
            
            // requestAnimationFrame 사용하여 렌더링 최적화
            requestAnimationFrame(() => {
                setTimeout(() => {
                    // 현재 페이지 숨기기
                    currentPage.style.display = 'none';
                    currentPage.classList.remove('fade-out');
                    
                    // 다음 페이지 준비
                    currentPageIndex++;
                    const nextPage = pages[currentPageIndex];
                    
                    // 다음 페이지를 보여주기 전에 기본 스타일 지정
                    nextPage.style.opacity = '0';
                    nextPage.style.display = 'block';
                    
                    // 강제 리플로우 발생
                    void nextPage.offsetWidth;
                    
                    // 페이드인 애니메이션 적용
                    nextPage.style.opacity = '';
                    nextPage.classList.add('fade-in');
                    
                    // 특정 페이지로 이동할 때 추가 동작
                    if (nextPage.id === 'page-review') {
                        updateReviewData();
                    } else if (nextPage.id === 'page-dimension') {
                        // Dimension 페이지로 이동 시 Cover-up 체크 상태에 따라 추가 설명 표시
                        updateDimensionPage();
                    }
                    
                    // 애니메이션 완료 후 클래스 제거 및 버튼 활성화
                    setTimeout(() => {
                        nextPage.classList.remove('fade-in');
                        prevButton.disabled = false;
                        nextButton.disabled = false;
                        
                        // 페이지 전환 완료 후 버튼 상태만 업데이트
                        if (currentPageIndex === 0) {
                            prevButton.classList.add('hidden');
                        } else {
                            prevButton.classList.remove('hidden');
                        }
                        
                        if (currentPageIndex === pages.length - 1) {
                            nextButton.innerHTML = 'NEXT';
                        } else {
                            nextButton.innerHTML = 'NEXT';
                        }
                    }, 300);
                }, 300); // 페이드 아웃 애니메이션 시간과 동일하게 설정
            });
        }
    }
    
    // 이전 페이지로 이동하는 함수
    function goToPreviousPage() {
        console.log(`이전 페이지로 이동: 현재 ${currentPageIndex}`);
        if (currentPageIndex > 0) {
            // 이동 중 버튼 비활성화
            prevButton.disabled = true;
            nextButton.disabled = true;
            
            // 현재 페이지 페이드 아웃
            const currentPage = pages[currentPageIndex];
            currentPage.classList.add('fade-out');
            
            // 즉시 도트 인디케이터 상태 업데이트 (이전 페이지로)
            const dotIndicators = document.querySelectorAll('.dot-indicator');
            dotIndicators.forEach((dot, i) => {
                if (i === currentPageIndex - 1) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
            
            // 첫 페이지로 돌아가는 경우 이전 버튼 숨김
            if (currentPageIndex - 1 === 0) {
                // 페이지 전환과 동일한 애니메이션으로 숨김
                prevButton.classList.add('hidden');
            }
            
            // requestAnimationFrame 사용하여 렌더링 최적화
            requestAnimationFrame(() => {
                setTimeout(() => {
                    // 현재 페이지 숨기기
                    currentPage.style.display = 'none';
                    currentPage.classList.remove('fade-out');
                    
                    // 이전 페이지 준비
                    currentPageIndex--;
                    const prevPage = pages[currentPageIndex];
                    
                    // 이전 페이지를 보여주기 전에 기본 스타일 지정
                    prevPage.style.opacity = '0';
                    prevPage.style.display = 'block';
                    
                    // 강제 리플로우 발생
                    void prevPage.offsetWidth;
                    
                    // 페이드인 애니메이션 적용
                    prevPage.style.opacity = '';
                    prevPage.classList.add('fade-in');
                    
                    // 특정 페이지로 이동할 때 추가 동작
                    if (prevPage.id === 'page-dimension') {
                        // Dimension 페이지로 이동 시 Cover-up 체크 상태에 따라 추가 설명 표시
                        updateDimensionPage();
                    }
                    
                    // 애니메이션 완료 후 클래스 제거 및 버튼 활성화
                    setTimeout(() => {
                        prevPage.classList.remove('fade-in');
                        prevButton.disabled = false;
                        nextButton.disabled = false;
                        
                        // 페이지 전환 완료 후 버튼 상태만 업데이트
                        if (currentPageIndex === 0) {
                            prevButton.classList.add('hidden');
                        } else {
                            prevButton.classList.remove('hidden');
                        }
                        
                        if (currentPageIndex === pages.length - 1) {
                            nextButton.innerHTML = 'NEXT';
                        } else {
                            nextButton.innerHTML = 'NEXT';
                        }
                    }, 300);
                }, 300); // 페이드 아웃 애니메이션 시간과 동일하게 설정
            });
        }
    }
    
    // 버튼 표시 상태 업데이트
    function updateButtonDisplay() {
        // 첫 페이지에서는 이전 버튼 숨김
        if (currentPageIndex === 0) {
            prevButton.classList.add('hidden');
        } else {
            prevButton.classList.remove('hidden');
        }
        
        // 마지막 페이지에서는 다음 버튼 텍스트 변경
        if (currentPageIndex === pages.length - 1) {
            nextButton.innerHTML = 'NEXT';
        } else {
            nextButton.innerHTML = 'NEXT';
        }
        
        // 현재 페이지 인디케이터 업데이트
        const dotIndicators = document.querySelectorAll('.dot-indicator');
        dotIndicators.forEach((dot, index) => {
            if (index === currentPageIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        console.log(`버튼 상태 업데이트: 현재 페이지 ${currentPageIndex}, 이전 버튼 상태: ${!prevButton.classList.contains('hidden')}, 다음 버튼 텍스트 ${nextButton.innerHTML}`);
    }
    
    // 리뷰 데이터 업데이트 함수
    function updateReviewData() {
        console.log('리뷰 데이터 업데이트 시작');
        
        // Experience Level 정보 업데이트
        const firstYes = document.getElementById('first-yes');
        const firstNo = document.getElementById('first-no');
        const firstNoMany = document.getElementById('first-no-many');
        const firstNoExtreme = document.getElementById('first-no-extreme');
        const reviewExperience = document.getElementById('review-experience');
        
        if (reviewExperience) {
            let experienceHTML = '';
            
            if (firstYes && firstYes.checked) {
                experienceHTML = `<div class="review-detail">Yes, this is my first tattoo</div>`;
            } else if (firstNo && firstNo.checked) {
                experienceHTML = `<div class="review-detail">No, I have tattoo(s) already</div>`;
            } else if (firstNoMany && firstNoMany.checked) {
                experienceHTML = `<div class="review-detail">I've lost count. My body is the canvas now</div>`;
            } else if (firstNoExtreme && firstNoExtreme.checked) {
                experienceHTML = `<div class="review-detail">Even my tattoos have tattoos</div>`;
            } else {
                experienceHTML = `<div class="review-detail">Experience level not selected</div>`;
            }
            
            reviewExperience.innerHTML = experienceHTML;
        }
        
        // 위치 정보 업데이트
        const locationInput = document.getElementById('location-input');
        const travelDistanceValue = document.getElementById('travel-distance-value');
        const requestMobileService = document.getElementById('request-mobile-service');
        const reviewLocation = document.getElementById('review-location');
        
        if (locationInput && reviewLocation) {
            const locationValue = locationInput.value.trim();
            let locationHTML = '';
            
            // 위치 정보가 입력된 경우 위치 표시
            if (locationValue) {
                locationHTML += `<div class="review-detail">${locationValue}</div>`;
                
                // 방문 가능 거리 정보 추가
                if (travelDistanceValue) {
                    locationHTML += `<div class="review-detail">Maximum travel distance: ${travelDistanceValue.textContent}km</div>`;
                }
                
                // 출장 서비스 정보 추가
                if (requestMobileService && requestMobileService.checked) {
                    locationHTML += `<div class="review-detail review-mobile-service">✓ Mobile tattooing service requested</div>`;
                }
            } else {
                locationHTML = `<div class="review-detail">Location not selected</div>`;
            }
            
            reviewLocation.innerHTML = locationHTML;
        }
        
        // 치수 정보 업데이트
        const widthInput = document.getElementById('width');
        const heightInput = document.getElementById('height');
        const reviewWidth = document.getElementById('review-width');
        const reviewHeight = document.getElementById('review-height');
        const reviewArea = document.getElementById('review-area');
        const reviewDimension = document.querySelector('.review-item:nth-child(3) .review-content');
        
        if (widthInput && heightInput && reviewDimension) {
            const width = parseFloat(widthInput.value);
            const height = parseFloat(heightInput.value);
            
            // 치수 섹션 전체 내용 업데이트
            let dimensionHTML = ``;
            
            if (!isNaN(width)) {
                const useCoverup = document.getElementById('useCoverup');
                if (useCoverup && useCoverup.checked) {
                    // Cover-up이 체크된 경우 Existing tattoo width로 표시
                    dimensionHTML += `<div id="review-width" class="review-detail">Existing tattoo width: ${width} cm</div>`;
                } else {
                    dimensionHTML += `<div id="review-width" class="review-detail">Width: ${width} cm</div>`;
                }
            } else {
                dimensionHTML += `<div id="review-width" class="review-detail">Width: -</div>`;
            }
            
            if (!isNaN(height)) {
                const useCoverup = document.getElementById('useCoverup');
                if (useCoverup && useCoverup.checked) {
                    // Cover-up이 체크된 경우 Existing tattoo height로 표시
                    dimensionHTML += `<div id="review-height" class="review-detail">Existing tattoo height: ${height} cm</div>`;
                } else {
                    dimensionHTML += `<div id="review-height" class="review-detail">Height: ${height} cm</div>`;
                }
            } else {
                dimensionHTML += `<div id="review-height" class="review-detail">Height: -</div>`;
            }
            
            if (!isNaN(width) && !isNaN(height)) {
                const area = width * height;
                const areaFormatted = area.toFixed(1);
                
                const useCoverup = document.getElementById('useCoverup');
                if (useCoverup && useCoverup.checked) {
                    // Cover-up이 체크된 경우 Existing tattoo area로 표시
                    dimensionHTML += `<div id="review-area" class="review-detail review-existing-area">Existing tattoo area: ${areaFormatted} cm²</div>`;
                    
                    // 10% 추가된 면적과 20% 추가된 면적 계산
                    const minSuggestedArea = (area * 1.1).toFixed(1);
                    const maxSuggestedArea = (area * 1.2).toFixed(1);
                    
                    // 추정 면적 추가
                    dimensionHTML += `<div id="review-suggested-area" class="review-detail">✔︎ Estimated total area: ${minSuggestedArea} ~ ${maxSuggestedArea} cm²</div>`;
                } else {
                    // 일반 면적 표시
                    dimensionHTML += `<div id="review-area" class="review-detail review-total-area">✔︎ Total Area: ${areaFormatted} cm²</div>`;
                }
            } else {
                dimensionHTML += `<div id="review-area" class="review-detail">✔︎ Total Area: -</div>`;
            }
            
            reviewDimension.innerHTML = dimensionHTML;
        }
        
        // 아트워크 스타일 정보 업데이트
        const useImageryStyle = document.getElementById('useImageryStyle');
        const tattooStyles = document.getElementById('tattooStyles');
        const colorStyles = document.getElementById('colorStyles');
        const otherColorInput = document.getElementById('otherColorInput');
        const imagePreviewArea = document.getElementById('imagePreviewArea');
        
        const reviewArtworkEnabled = document.getElementById('review-artwork-enabled');
        const reviewArtworkStyle = document.getElementById('review-artwork-style');
        const reviewArtworkColorVibe = document.getElementById('review-artwork-colorvibe');
        const reviewReferenceImage = document.getElementById('review-reference-image');
        
        if (useImageryStyle && reviewArtworkEnabled) {
            if (useImageryStyle.checked) {
                // 아트워크가 선택된 경우 Artwork 헤더 표시
                reviewArtworkEnabled.textContent = 'Artwork';
                reviewArtworkEnabled.style.display = 'block';
                
                // 아트워크 세부 정보 표시
                if (reviewArtworkStyle) reviewArtworkStyle.style.display = 'block';
                if (reviewArtworkColorVibe) reviewArtworkColorVibe.style.display = 'block';
                if (reviewReferenceImage) reviewReferenceImage.style.display = 'block';
                
                // 스타일 정보 업데이트
                if (tattooStyles && reviewArtworkStyle) {
                    const selectedStyle = tattooStyles.options[tattooStyles.selectedIndex];
                    if (selectedStyle && selectedStyle.value) {
                        reviewArtworkStyle.textContent = `Type: ${selectedStyle.text}`;
                    } else {
                        reviewArtworkStyle.textContent = 'Type: Not Selected';
                    }
                }
                
                // 컬러 바이브 정보 업데이트
                if (colorStyles && reviewArtworkColorVibe) {
                    const selectedColor = colorStyles.options[colorStyles.selectedIndex];
                    if (selectedColor && selectedColor.value) {
                        if (selectedColor.value === 'others' && otherColorInput) {
                            const customColor = otherColorInput.value.trim();
                            if (customColor) {
                                reviewArtworkColorVibe.textContent = `Color Vibe: ${customColor}`;
                            } else {
                                reviewArtworkColorVibe.textContent = 'Color Vibe: Others';
                            }
                        } else {
                            reviewArtworkColorVibe.textContent = `Color Vibe: ${selectedColor.text}`;
                        }
                    } else {
                        reviewArtworkColorVibe.textContent = 'Color Vibe: Not Selected';
                    }
                }
                
                // 참조 이미지 업로드 상태 확인
                if (imagePreviewArea && reviewReferenceImage) {
                    const hasImage = imagePreviewArea.querySelector('img');
                    if (hasImage) {
                        // 이미지가 업로드된 경우 Reference Image:만 표시
                        reviewReferenceImage.textContent = 'Reference Image:';
                        reviewReferenceImage.style.display = 'block';
                        
                        // 리뷰 페이지에 이미지 표시
                        const reviewImageContainer = document.getElementById('review-reference-image-container');
                        if (reviewImageContainer) {
                            reviewImageContainer.style.display = 'block';
                            
                            // 기존 이미지 제거
                            reviewImageContainer.innerHTML = '';
                            
                            // 이미지 복제하여 추가
                            const imageClone = hasImage.cloneNode(true);
                            reviewImageContainer.appendChild(imageClone);
                        }
                    } else {
                        reviewReferenceImage.textContent = 'Reference Image: Not Uploaded';
                        reviewReferenceImage.style.display = 'block';
                        
                        // 이미지 컨테이너 숨기기
                        const reviewImageContainer = document.getElementById('review-reference-image-container');
                        if (reviewImageContainer) {
                            reviewImageContainer.style.display = 'none';
                        }
                    }
                }
            } else {
                // 아트워크가 선택되지 않은 경우 전체 표시 숨기기
                reviewArtworkEnabled.style.display = 'none';
                
                // 아트워크 관련 디테일 모두 숨기기
                if (reviewArtworkStyle) reviewArtworkStyle.style.display = 'none';
                if (reviewArtworkColorVibe) reviewArtworkColorVibe.style.display = 'none';
                if (reviewReferenceImage) reviewReferenceImage.style.display = 'none';
                
                // 이미지 컨테이너 숨기기
                const reviewImageContainer = document.getElementById('review-reference-image-container');
                if (reviewImageContainer) {
                    reviewImageContainer.style.display = 'none';
                }
            }
        }
        
        // 글자 스타일 정보 업데이트
        const useCustomFont = document.getElementById('useCustomFont');
        const letteringText = document.getElementById('letteringText');
        const fontSelectionArea = document.getElementById('fontSelectionArea');
        
        const reviewLetteringEnabled = document.getElementById('review-lettering-enabled');
        const reviewLetteringText = document.getElementById('review-lettering-text');
        const reviewLetteringFont = document.getElementById('review-lettering-font');
        const reviewFontPreviewContainer = document.getElementById('review-font-preview-container');
        const reviewFontPreview = document.getElementById('review-font-preview');
        
        if (useCustomFont && reviewLetteringEnabled) {
            if (useCustomFont.checked) {
                // 레터링이 선택된 경우 레터링 헤더 표시
                reviewLetteringEnabled.textContent = 'Lettering';
                reviewLetteringEnabled.style.display = 'block';
                
                // 텍스트 정보 업데이트
                let letteringTextValue = '';
                if (letteringText && reviewLetteringText) {
                    letteringTextValue = letteringText.value.trim();
                    if (letteringTextValue) {
                        reviewLetteringText.textContent = `Text: "${letteringTextValue}"`;
                        reviewLetteringText.style.display = 'block';
                    } else {
                        reviewLetteringText.textContent = 'Text: Not Entered';
                        reviewLetteringText.style.display = 'block';
                        letteringTextValue = 'Sample Text'; // 미리보기용 기본 텍스트
                    }
                }
                
                // 폰트 정보 업데이트
                let selectedFontName = '';
                let selectedFontUrl = '';
                if (reviewLetteringFont) {
                    reviewLetteringFont.style.display = 'block';
                    const selectedFontItem = fontSelectionArea ? fontSelectionArea.querySelector('.font-item.selected') : null;
                    if (selectedFontItem) {
                        selectedFontName = selectedFontItem.getAttribute('data-font-name');
                        selectedFontUrl = selectedFontItem.getAttribute('data-font-url');
                        
                        if (selectedFontName) {
                            reviewLetteringFont.textContent = `Font: ${selectedFontName.replace(/%20/g, ' ')}`;
                        } else {
                            reviewLetteringFont.textContent = 'Font: Selected';
                        }
                        
                        // 폰트 미리보기 컨테이너 표시
                        if (reviewFontPreviewContainer && reviewFontPreview) {
                            reviewFontPreviewContainer.style.display = 'block';
                            
                            // 선택된 피부색 가져오기
                            const selectedSkinTone = document.querySelector('.skin-color-box.selected');
                            const skinColor = selectedSkinTone ? selectedSkinTone.getAttribute('data-color') : '#FFFFFF';
                            
                            // 미리보기 스타일 적용
                            reviewFontPreview.style.backgroundColor = skinColor;
                            reviewFontPreview.style.border = skinColor === '#FFFFFF' ? '1px solid #cccccc' : 'none';
                            reviewFontPreview.style.color = '#000000'; // 글자색은 항상 검정색
                            reviewFontPreview.style.borderRadius = 'var(--border-radius)';
                            
                            // 폰트 적용 전 미리보기 텍스트 설정
                            reviewFontPreview.textContent = letteringTextValue;
                            
                            // 폰트 로드 및 적용
                            if (selectedFontUrl) {
                                let fontUrl = selectedFontUrl;
                                // 상대 경로인 경우 카테고리 폴더 경로 추가
                                const fontCategory = document.getElementById('font-category-select');
                                if (fontCategory && fontCategory.value && !fontUrl.startsWith('/') && !fontUrl.includes('://')) {
                                    fontUrl = `fonts/${fontCategory.value}/${fontUrl}`;
                                }
                                
                                // 폰트 로드
                                const fontFaceName = selectedFontName.replace(/\.(ttf|otf)$/i, '');
                                const safeFontName = fontFaceName.replace(/[^a-zA-Z0-9]/g, '_');
                                
                                try {
                                    const fontFace = new FontFace(safeFontName, `url('${fontUrl}')`);
                                    fontFace.load().then(loadedFace => {
                                        document.fonts.add(loadedFace);
                                        reviewFontPreview.style.fontFamily = `'${safeFontName}', sans-serif`;
                                        
                                        // 3페이지에서 설정된 폰트 사이즈 가져오기
                                        const fontSample = document.querySelector(`.font-item.selected .font-sample`);
                                        if (fontSample) {
                                            // 3페이지의 폰트 스타일 그대로 복사
                                            reviewFontPreview.style.fontSize = fontSample.style.fontSize;
                                        } else {
                                            // 3페이지 스타일을 찾지 못한 경우 기존 자동 조정 사용
                                            adjustReviewFontSize(reviewFontPreview);
                                        }
                                    }).catch(error => {
                                        console.error('리뷰 페이지 폰트 로드 실패:', error);
                                        reviewFontPreview.style.fontFamily = 'sans-serif';
                                    });
                                } catch (error) {
                                    console.error('폰트 로드 중 오류:', error);
                                    reviewFontPreview.style.fontFamily = 'sans-serif';
                                }
                            } else {
                                reviewFontPreview.style.fontFamily = 'sans-serif';
                            }
                        }
                    } else {
                        reviewLetteringFont.textContent = 'Font: Not Selected';
                        // 폰트를 선택하지 않았으므로 미리보기 숨기기
                        if (reviewFontPreviewContainer) {
                            reviewFontPreviewContainer.style.display = 'none';
                        }
                    }
                }
            } else {
                // 레터링이 선택되지 않은 경우 전체 표시 숨기기
                reviewLetteringEnabled.style.display = 'none';
                
                // 레터링 관련 디테일 모두 숨기기
                if (reviewLetteringText) reviewLetteringText.style.display = 'none';
                if (reviewLetteringFont) reviewLetteringFont.style.display = 'none';
                
                // 레터링이 선택되지 않았으므로 미리보기 숨기기
                if (reviewFontPreviewContainer) {
                    reviewFontPreviewContainer.style.display = 'none';
                }
            }
        }
        
        // 리뷰 페이지에 Notes & Requirements 섹션 추가
        const reviewCard = document.querySelector('.review-card');
        
        // 기존 Notes & Requirements 섹션이 있으면 제거
        const existingNotesSection = document.querySelector('.review-item.notes-review');
        if (existingNotesSection) {
            existingNotesSection.remove();
        }
        
        // 새 Notes & Requirements 섹션 생성
        const notesReviewItem = document.createElement('div');
        notesReviewItem.className = 'review-item notes-review';
        
        const notesHeader = document.createElement('h3');
        notesHeader.textContent = 'Skin Profile';
        notesReviewItem.appendChild(notesHeader);
        
        const notesContent = document.createElement('div');
        notesContent.className = 'review-content';
        
        // 피부 상태 추가
        const skinText = document.createElement('div');
        skinText.className = 'review-notes-detail';
        skinText.innerHTML = ''; // 라벨 제거
        
        // 모든 피부 상태 체크박스 가져오기
        const sensitiveSkin = document.getElementById('sensitive-skin');
        const skinAllergy = document.getElementById('skin-allergy');
        const skinKeloid = document.getElementById('skin-keloid');
        const skinEczema = document.getElementById('skin-eczema');
        const skinMedication = document.getElementById('skin-medication');
        
        let skinConditions = [];
        if (sensitiveSkin && sensitiveSkin.checked) {
            skinConditions.push('Sensitive skin');
        }
        if (skinAllergy && skinAllergy.checked) {
            skinConditions.push('Allergies to certain inks');
        }
        if (skinKeloid && skinKeloid.checked) {
            skinConditions.push('History of keloid scarring');
        }
        if (skinEczema && skinEczema.checked) {
            skinConditions.push('Eczema or psoriasis');
        }
        if (skinMedication && skinMedication.checked) {
            skinConditions.push('Currently taking skin-related medication (e.g. Accutane)');
        }
        
        // 선택된 피부 상태가 있는 경우에만 섹션 표시
        if (skinConditions.length > 0) {
            skinText.innerHTML = skinConditions.join('<br>');
            notesContent.appendChild(skinText);
        }
        // 선택된 항목이 없으면 섹션 자체를 표시하지 않음
        
        // 일정 관련 제약사항 추가
        const schedulingPreferences = document.getElementById('scheduling-preferences');
        if (schedulingPreferences) {
            const schedulingText = document.createElement('div');
            schedulingText.className = 'review-notes-detail';
            
            if (schedulingPreferences.value.trim()) {
                schedulingText.innerHTML = schedulingPreferences.value.trim();
            } else {
                schedulingText.innerHTML = 'None specified';
            }
            notesContent.appendChild(schedulingText);
        }
        
        // 피부색 및 선탠 상태 추가
        const skinTone = document.getElementById('skin-tone');
        const tanningStatus = document.getElementById('tanning-status');
        const skinToneNotes = document.getElementById('skin-tone-notes');
        const skinToneSlider = document.getElementById('skin-tone-slider');
        const skinTonePreview = document.getElementById('skin-tone-preview');
        
        // 스킨톤 텍스트 엘리먼트 생성
        const skinToneText = document.createElement('div');
        skinToneText.className = 'review-notes-detail';
        skinToneText.innerHTML = ''; // 라벨 제거
        
        // 스킨톤 미리보기 및 이름 추가 (항상 실행)
        if (skinToneSlider && skinTonePreview) {
            const skinToneValue = skinToneSlider.value;
            
            // 피부톤 값과 관련 데이터 (script.js의 initSkinToneSlider 함수와 같은 배열 사용)
            const skinTones = [
                { value: 1, color: '#FFF4E0', text: 'Extremely light', selectValue: 'extremely-light' },
                { value: 2, color: '#FFDBAC', text: 'Very light', selectValue: 'very-light' },
                { value: 3, color: '#F1C27D', text: 'Light', selectValue: 'light' },
                { value: 4, color: '#E0AC69', text: 'Medium light', selectValue: 'medium-light' },
                { value: 5, color: '#C68642', text: 'Medium', selectValue: 'medium' },
                { value: 6, color: '#8D5524', text: 'Medium deep', selectValue: 'medium-deep' },
                { value: 7, color: '#5D4037', text: 'Deep', selectValue: 'deep' },
                { value: 8, color: '#3E2723', text: 'Very deep', selectValue: 'very-deep' },
                { value: 9, color: '#1A0D09', text: 'Extremely deep', selectValue: 'extremely-deep' }
            ];
            
            const index = parseInt(skinToneValue) - 1;
            if (index >= 0 && index < skinTones.length) {
                const tone = skinTones[index];
                
                // 스킨톤 미리보기와 텍스트를 포함하는 컨테이너 생성
                const skinTonePreviewContainer = document.createElement('div');
                skinTonePreviewContainer.className = 'review-skin-tone-preview-container';
                skinTonePreviewContainer.style.display = 'flex';
                skinTonePreviewContainer.style.alignItems = 'center';
                skinTonePreviewContainer.style.gap = '10px';
                skinTonePreviewContainer.style.marginTop = '0';
                skinTonePreviewContainer.style.marginBottom = '0';
                skinTonePreviewContainer.style.marginLeft = '0';
                skinTonePreviewContainer.style.marginRight = '0';
                
                // 스킨톤 미리보기 원 생성
                const skinToneCircle = document.createElement('div');
                skinToneCircle.className = 'review-skin-tone-circle';
                skinToneCircle.style.width = '40px';
                skinToneCircle.style.height = '40px';
                skinToneCircle.style.borderRadius = '50%';
                skinToneCircle.style.backgroundColor = tone.color;
                skinToneCircle.style.border = '0';
                skinToneCircle.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.2)';
                skinToneCircle.style.margin = '0';
                
                // 스킨톤 텍스트 생성
                const skinToneTextElement = document.createElement('span');
                skinToneTextElement.textContent = tone.text;
                skinToneTextElement.style.fontSize = '14px';
                skinToneTextElement.style.color = 'var(--text-primary)';
                
                // 컨테이너에 추가
                skinTonePreviewContainer.appendChild(skinToneCircle);
                skinTonePreviewContainer.appendChild(skinToneTextElement);
                
                // 스킨톤 정보에 미리보기 컨테이너 추가
                skinToneText.appendChild(skinTonePreviewContainer);
            }
        }
        
        // 탠닝 상태 정보 추가
        let skinToneInfo = [];
        if (tanningStatus && tanningStatus.value && tanningStatus.value !== '') {
            const selectedOption = tanningStatus.options[tanningStatus.selectedIndex];
            skinToneInfo.push(`Tanning status: ${selectedOption.text}`);
        }
        
        // 추가 메모 정보 추가
        if (skinToneNotes && skinToneNotes.value.trim()) {
            skinToneInfo.push(`Additional notes: ${skinToneNotes.value.trim()}`);
        }
        
        // 탠닝 상태나 추가 메모가 있으면 추가
        if (skinToneInfo.length > 0) {
            skinToneText.innerHTML += '<br>' + skinToneInfo.join('<br>');
        }
        
        // 스킨톤 정보 섹션 항상 추가 (미리보기가 있거나 탠닝/메모 정보가 있을 때)
        notesContent.appendChild(skinToneText);
        
        notesReviewItem.appendChild(notesContent);
        
        // 리뷰 카드에 노트 섹션 추가 (스타일 섹션 앞에)
        const styleSection = document.querySelector('.review-item:last-child');
        if (styleSection) {
            reviewCard.appendChild(notesReviewItem);
        } else {
            reviewCard.appendChild(notesReviewItem);
        }
        
        // Cover-up 정보 업데이트
        const useCoverup = document.getElementById('useCoverup');
        const coverupNotes = document.getElementById('coverup-notes');
        const coverupImagePreviewArea = document.getElementById('coverupImagePreviewArea');
        
        const reviewCoverupEnabled = document.getElementById('review-coverup-enabled');
        const reviewCoverupNotes = document.getElementById('review-coverup-notes');
        const reviewCoverupImage = document.getElementById('review-coverup-image');
        const reviewCoverupImageContainer = document.getElementById('review-coverup-image-container');
        
        if (useCoverup && reviewCoverupEnabled) {
            if (useCoverup.checked) {
                // Cover-up이 선택된 경우 Cover-up 헤더 표시
                reviewCoverupEnabled.textContent = 'Cover-up';
                reviewCoverupEnabled.style.display = 'block';
                
                // 노트 정보 업데이트
                if (coverupNotes && reviewCoverupNotes) {
                    const notesValue = coverupNotes.value.trim();
                    if (notesValue) {
                        reviewCoverupNotes.textContent = `Notes: ${notesValue}`;
                        reviewCoverupNotes.style.display = 'block';
                    } else {
                        reviewCoverupNotes.style.display = 'none';
                    }
                }
                
                // 커버업 이미지 업로드 상태 확인
                const hasImage = coverupImagePreviewArea ? coverupImagePreviewArea.querySelector('img') : null;
                
                // 이미지 표시 처리
                if (hasImage && reviewCoverupImageContainer) {
                    // 이미지가 업로드된 경우
                    reviewCoverupImageContainer.style.display = 'block';
                    
                    // 기존 이미지 제거
                    reviewCoverupImageContainer.innerHTML = '';
                    
                    // 이미지 복제하여 추가
                    const imageClone = hasImage.cloneNode(true);
                    imageClone.style.width = '100%';
                    imageClone.style.height = 'auto';
                    imageClone.style.display = 'block';
                    imageClone.style.objectFit = 'cover';
                    reviewCoverupImageContainer.appendChild(imageClone);
                    
                    // 이미지 메시지는 숨김
                    if (reviewCoverupImage) {
                        reviewCoverupImage.style.display = 'none';
                    }
                } else {
                    // 이미지가 없는 경우
                    reviewCoverupImageContainer.style.display = 'none';
                    
                    // 이미지 업로드되지 않음 메시지 표시
                    if (reviewCoverupImage) {
                        reviewCoverupImage.textContent = 'Cover-up Image: Not Uploaded';
                        reviewCoverupImage.style.display = 'block';
                    }
                }
            } else {
                // Cover-up이 선택되지 않은 경우 전체 표시 숨기기
                reviewCoverupEnabled.style.display = 'none';
                
                // Cover-up 관련 디테일 모두 숨기기
                if (reviewCoverupNotes) reviewCoverupNotes.style.display = 'none';
                if (reviewCoverupImage) reviewCoverupImage.style.display = 'none';
                if (reviewCoverupImageContainer) reviewCoverupImageContainer.style.display = 'none';
            }
        }
        
        console.log('리뷰 데이터 업데이트 완료');
    }
    
    // 리뷰 페이지의 폰트 크기를 자동으로 조정하는 함수
    function adjustReviewFontSize(element) {
        // 텍스트 길이에 따라 글자 크기 조정
        const text = element.textContent || '';
        
        if (text.length > 30) {
            element.style.fontSize = '20px';
        } else if (text.length > 20) {
            element.style.fontSize = '24px';
        } else if (text.length > 10) {
            element.style.fontSize = '28px';
        } else {
            element.style.fontSize = '32px';
        }
        
        // 최소 높이 설정
        if (element.clientHeight < 60) {
            element.style.minHeight = '60px';
        }
    }
    
    // 타투 신청 처리 함수
    function handleTattooSubmit() {
        console.log('타투 신청 처리');
        alert('타투 요청이 성공적으로 제출되었습니다!');
        // 여기에 실제 제출 처리 로직을 추가할 수 있습니다.
    }
}

// 이미지리 스타일 토글 함수
function toggleImageryStyle() {
    const useImageryStyle = document.getElementById('useImageryStyle').checked;
    const styleSelectorContainer = document.querySelector('.style-selector-container');
    
    if (useImageryStyle) {
        // 체크박스가 선택된 경우
        styleSelectorContainer.style.display = 'flex';
        
        // 이전에 추가된 fade-out 클래스가 있다면 제거
        styleSelectorContainer.classList.remove('fade-out');
        
        // requestAnimationFrame을 사용하여 렌더링 타이밍에 맞춰 애니메이션 클래스 추가
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                styleSelectorContainer.classList.add('fade-in');
            });
        });
    } else {
        // 체크박스가 해제된 경우
        styleSelectorContainer.classList.remove('fade-in');
        styleSelectorContainer.classList.add('fade-out');
        
        // 애니메이션 완료 후 요소 숨김 (0.4초로 시간 단축)
        setTimeout(() => {
            styleSelectorContainer.style.display = 'none';
            
            // 클래스 정리
            styleSelectorContainer.classList.remove('fade-out');
        }, 400); // 페이드 아웃 애니메이션 시간(0.4초)과 동일하게 설정
    }
}

// Cover-up 토글 함수
function toggleCoverup() {
    const useCoverup = document.getElementById('useCoverup').checked;
    const coverupContainer = document.querySelector('.coverup-container');
    
    if (useCoverup) {
        // 체크박스가 선택된 경우
        coverupContainer.style.display = 'block';
        
        // 이전에 추가된 fade-out 클래스가 있다면 제거
        coverupContainer.classList.remove('fade-out');
        
        // requestAnimationFrame을 사용하여 렌더링 타이밍에 맞춰 애니메이션 클래스 추가
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                coverupContainer.classList.add('fade-in');
            });
        });
        
        // Cover-up 이미지 업로드 기능 초기화
        initCoverupImageUpload();
        
        // 현재 페이지가 Dimension 페이지인 경우 면적 계산 업데이트
        const currentPage = document.querySelector('.tattoo-page[style*="display: block"]');
        if (currentPage && currentPage.id === 'page-dimension') {
            // 현재 입력된 값으로 면적 계산 업데이트
            calculateArea();
        }
    } else {
        // 체크박스가 해제된 경우
        coverupContainer.classList.remove('fade-in');
        coverupContainer.classList.add('fade-out');
        
        // 애니메이션 완료 후 요소 숨김 (0.4초로 시간 단축)
        setTimeout(() => {
            coverupContainer.style.display = 'none';
            
            // 클래스 정리
            coverupContainer.classList.remove('fade-out');
        }, 400); // 페이드 아웃 애니메이션 시간(0.4초)과 동일하게 설정
        
        // 현재 페이지가 Dimension 페이지인 경우 면적 계산 업데이트
        const currentPage = document.querySelector('.tattoo-page[style*="display: block"]');
        if (currentPage && currentPage.id === 'page-dimension') {
            // 현재 입력된 값으로 면적 계산 업데이트
            calculateArea();
        }
    }
}

// Cover-up 이미지 업로드 기능 초기화
function initCoverupImageUpload() {
    const imageInput = document.getElementById('coverupImageUpload');
    const previewArea = document.getElementById('coverupImagePreviewArea');
    const removeBtn = document.getElementById('removeCoverupBtn');
    
    if (!imageInput || !previewArea) return;
    
    // 이미지 미리보기 영역 클릭 시 파일 선택 다이얼로그 열기
    previewArea.addEventListener('click', function(e) {
        // 삭제 버튼 클릭 시 이벤트 전파 방지
        if (e.target === removeBtn || e.target.closest('#removeCoverupBtn')) {
            return;
        }
        imageInput.click();
    });
    
    // 파일 선택 시 이미지 미리보기
    imageInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            
            // 파일 확장자 검사
            const validExtensions = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!validExtensions.includes(file.type)) {
                alert('Please select a valid image file (JPG, PNG, GIF or WEBP)');
                return;
            }
            
            // 파일 크기 제한 (10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert('Image size should be less than 10MB');
                return;
            }
            
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // 기존 미리보기 이미지가 있으면 제거
                const existingImg = previewArea.querySelector('img');
                if (existingImg) {
                    existingImg.remove();
                }
                
                // 새 이미지 생성
                const img = document.createElement('img');
                img.src = e.target.result;
                previewArea.appendChild(img);
                
                // 업로드 아이콘과 텍스트 숨기기
                previewArea.classList.add('has-image');
                
                // 삭제 버튼 표시
                if (removeBtn) {
                    removeBtn.style.display = 'flex';
                }
            }
            
            reader.readAsDataURL(file);
        }
    });
    
    // 이미지 삭제 기능
    if (removeBtn) {
        removeBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // 이벤트 전파 방지
            
            // 이미지 삭제
            const img = previewArea.querySelector('img');
            if (img) {
                img.remove();
            }
            
            // 파일 인풋 초기화
            imageInput.value = '';
            
            // 업로드 아이콘과 텍스트 다시 표시
            previewArea.classList.remove('has-image');
            
            // 삭제 버튼 숨기기
            removeBtn.style.display = 'none';
        });
    }
}

// Collection 페이지 로드 함수
function loadCollectionContent() {
    fetch('ContentCollection.html') // HTML 파일 경로
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('main-content').innerHTML = data; // HTML 내용 삽입
        })
        .catch(error => console.error('Error loading content:', error));
}

// Account 페이지 로드 함수
function loadAccountContent() {
    fetch('ContentAccount.html') // HTML 파일 경로
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('main-content').innerHTML = data; // HTML 내용 삽입
            initAccountPage(); // 계정 페이지 초기화
            initLoginModal(); // 로그인 모달 초기화
        })
        .catch(error => console.error('Error loading content:', error));
}

// 계정 페이지 초기화 함수 (모든 사용자에게 동일한 UI 표시)
function initAccountPage() {
    // 사용자 로그인 상태 확인
    const isLoggedIn = localStorage.getItem('needleG_login') === 'true';
    
    // 로그인 상태에 따라 UI 업데이트
    updateUIBasedOnLoginStatus(isLoggedIn);
    
    // 갤러리 탭 초기화
    initGalleryTabs();
}

// 로그인 상태에 따라 UI 업데이트
function updateUIBasedOnLoginStatus(isLoggedIn) {
    // 프로필 영역 업데이트
    const profileActions = document.getElementById('profile-actions');
    
    if (isLoggedIn) {
        // 로그인된 경우 - 사용자 정보 표시
        const userData = JSON.parse(localStorage.getItem('needleG_userData') || '{}');
        
        // 프로필 정보 업데이트
        document.getElementById('user-name').textContent = userData.name || 'User';
        document.getElementById('tattoo-count').textContent = userData.tattoos || 0;
        document.getElementById('appointment-count').textContent = userData.appointments || 0;
        document.getElementById('artist-count').textContent = userData.artists || 0;
        
        // 혜택 정보 업데이트
        document.getElementById('user-tier').textContent = userData.tier || 'Bronze';
        document.getElementById('user-points').textContent = `${userData.points || 0} P`;
        document.getElementById('user-coupons').textContent = userData.coupons || 0;
        
        // 프로필 이미지 업데이트 (만약 있다면)
        if (userData.avatar) {
            document.getElementById('user-avatar').src = userData.avatar;
        }
        
        // 등급에 따른 혜택 정보 업데이트
        updateTierBenefits(userData.tier || 'Bronze');
        
        // 프로필 액션 버튼 업데이트 (로그아웃 버튼 추가)
        profileActions.innerHTML = `
            <button class="edit-profile-btn">Edit Profile</button>
            <button class="logout-btn" onclick="handleLogout()">Logout</button>
        `;
        
        // 갤러리 메시지 및 버튼 업데이트
        document.getElementById('tattoos-message').textContent = 'No tattoos added yet';
        document.getElementById('tattoos-action-btn').textContent = 'Start Designing';
        document.getElementById('tattoos-action-btn').onclick = null;
        
        document.getElementById('saved-message').textContent = 'No saved designs';
        document.getElementById('saved-action-btn').textContent = 'Browse Tattoos';
        document.getElementById('saved-action-btn').onclick = null;
        
        document.getElementById('appointments-message').textContent = 'No scheduled appointments';
        document.getElementById('appointments-action-btn').textContent = 'Schedule Appointment';
        document.getElementById('appointments-action-btn').onclick = null;
        
        // 콘텐츠 로드
        loadGridContent('tattoos');
    } else {
        // 로그인되지 않은 경우 - 게스트 정보 표시
        document.getElementById('user-name').textContent = 'Guest';
        document.getElementById('tattoo-count').textContent = '0';
        document.getElementById('appointment-count').textContent = '0';
        document.getElementById('artist-count').textContent = '0';
        
        // 혜택 정보 업데이트 (게스트 상태)
        document.getElementById('user-tier').textContent = 'Guest';
        document.getElementById('user-points').textContent = '0 P';
        document.getElementById('user-coupons').textContent = '0';
        
        // 기본 프로필 이미지
        document.getElementById('user-avatar').src = 'assets/default-avatar.png';
        
        // 게스트 혜택 안내
        const benefitsList = document.getElementById('tier-benefits-list');
        benefitsList.innerHTML = '<li>Login to view membership benefits</li>';
        
        // 프로필 액션 버튼 업데이트 (로그인 버튼 표시)
        profileActions.innerHTML = `
            <button class="login-profile-btn" onclick="showLoginModal()">Login</button>
        `;
        
        // 갤러리 메시지 및 버튼 업데이트
        document.getElementById('tattoos-message').textContent = 'Login to start your tattoo gallery';
        document.getElementById('tattoos-action-btn').textContent = 'Login';
        document.getElementById('tattoos-action-btn').onclick = showLoginModal;
        
        document.getElementById('saved-message').textContent = 'Login to save your favorite designs';
        document.getElementById('saved-action-btn').textContent = 'Login';
        document.getElementById('saved-action-btn').onclick = showLoginModal;
        
        document.getElementById('appointments-message').textContent = 'Login to schedule appointments';
        document.getElementById('appointments-action-btn').textContent = 'Login';
        document.getElementById('appointments-action-btn').onclick = showLoginModal;
    }
}

// 로그인 모달 초기화
function initLoginModal() {
    const modal = document.getElementById('login-modal');
    const closeBtn = document.querySelector('.close-modal');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// 로그인 모달 표시 함수
function showLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.style.display = 'block';
        
        // 사용자명 입력 필드에 포커스
        setTimeout(() => {
            const usernameInput = document.getElementById('username');
            if (usernameInput) {
                usernameInput.focus();
            }
        }, 300);
    }
}

// 로그인 처리 함수
function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        alert('사용자 이름과 비밀번호를 입력해주세요.');
        return;
    }
    
    // 실제 환경에서는 서버에 로그인 요청을 보내야 합니다.
    // 여기서는 데모를 위해 로컬 스토리지에 저장합니다.
    localStorage.setItem('needleG_login', 'true');
    localStorage.setItem('needleG_username', username);
    
    // 데모용 사용자 정보 저장
    const demoUserData = {
        name: username,
        avatar: 'assets/default-avatar.png',
        tattoos: 3,
        appointments: 1,
        artists: 2,
        tier: 'Silver',
        points: '1,200',
        coupons: '2'
    };
    localStorage.setItem('needleG_userData', JSON.stringify(demoUserData));
    
    // 로그인 모달 닫기
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    // UI 업데이트
    updateUIBasedOnLoginStatus(true);
    
    // 로그인 폼 초기화
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// 로그아웃 함수
function handleLogout() {
    localStorage.removeItem('needleG_login');
    localStorage.removeItem('needleG_username');
    localStorage.removeItem('needleG_userData');
    
    // UI 업데이트
    updateUIBasedOnLoginStatus(false);
}

// 사용자 프로필 데이터 로드 함수
function loadUserProfile() {
    // 로컬 스토리지에서 사용자 데이터 로드
    const userDataStr = localStorage.getItem('needleG_userData');
    if (!userDataStr) return;
    
    const userData = JSON.parse(userDataStr);
    
    // 프로필 정보 업데이트
    document.getElementById('user-name').textContent = userData.name;
    document.getElementById('tattoo-count').textContent = userData.tattoos;
    document.getElementById('appointment-count').textContent = userData.appointments;
    document.getElementById('artist-count').textContent = userData.artists;
    
    // 혜택 정보 업데이트
    document.getElementById('user-tier').textContent = userData.tier;
    document.getElementById('user-points').textContent = `${userData.points} P`;
    document.getElementById('user-coupons').textContent = `${userData.coupons}장`;
    
    // 프로필 이미지 업데이트 (만약 있다면)
    if (userData.avatar) {
        document.getElementById('user-avatar').src = userData.avatar;
    }
    
    // 등급에 따른 혜택 정보 업데이트
    updateTierBenefits(userData.tier);
}

// 등급별 혜택 정보 업데이트 함수
function updateTierBenefits(tier) {
    const benefitsList = document.getElementById('tier-benefits-list');
    if (!benefitsList) return;
    
    // 등급별 혜택 데이터
    const tierBenefits = {
        'Bronze': [
            'Birthday coupon',
            'Access to member events'
        ],
        'Silver': [
            '10% discount on services',
            'Birthday coupon',
            'Priority booking'
        ],
        'Gold': [
            '15% discount on services',
            'Birthday coupon',
            'Priority booking',
            'Artist consultation'
        ],
        'Platinum': [
            '20% discount on services',
            'Birthday coupon',
            'Priority booking',
            'Artist consultation',
            'VIP care service'
        ]
    };
    
    // 해당 등급의 혜택 목록 가져오기
    const benefits = tierBenefits[tier] || tierBenefits['Bronze'];
    
    // 혜택 목록 렌더링
    benefitsList.innerHTML = '';
    benefits.forEach(benefit => {
        const li = document.createElement('li');
        li.textContent = benefit;
        benefitsList.appendChild(li);
    });
}

// 갤러리 탭 초기화 함수
function initGalleryTabs() {
    const galleryTabs = document.querySelectorAll('.gallery-tab');
    if (!galleryTabs.length) return;
    
    galleryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 활성 탭 클래스 제거
            galleryTabs.forEach(t => t.classList.remove('active'));
            
            // 클릭한 탭 활성화
            this.classList.add('active');
            
            // 탭에 해당하는 그리드 표시
            const tabName = this.getAttribute('data-tab');
            showGalleryGrid(tabName);
        });
    });
    
    // 기본으로 '내 타투' 탭 활성화
    showGalleryGrid('tattoos');
}

// 갤러리 그리드 표시 함수
function showGalleryGrid(tabName) {
    // 모든 그리드 숨기기
    const allGrids = document.querySelectorAll('.gallery-grid');
    allGrids.forEach(grid => {
        grid.style.display = 'none';
    });
    
    // 선택한 그리드만 표시
    const selectedGrid = document.getElementById(`${tabName}-grid`);
    if (selectedGrid) {
        selectedGrid.style.display = 'grid';
        
        // 필요한 경우 그리드에 콘텐츠 로드
        loadGridContent(tabName);
    }
}

// 그리드 콘텐츠 로드 함수
function loadGridContent(gridType) {
    // 이 함수에서는 실제 데이터를 가져와 그리드에 콘텐츠를 로드합니다.
    // 현재는 데모 데이터만 표시합니다.
    
    const grid = document.getElementById(`${gridType}-grid`);
    if (!grid) return;
    
    // 기존의 empty state가 아닌 항목들 모두 제거
    const items = grid.querySelectorAll('.gallery-item');
    items.forEach(item => item.remove());
    
    // 데모 데이터 배열 (각 탭 유형에 따라 다른 데이터 사용)
    let demoData = [];
    
    // userDataStr에서 해당 유형의 데이터 수 확인
    const userDataStr = localStorage.getItem('needleG_userData');
    if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        
        if (gridType === 'tattoos' && userData.tattoos > 0) {
            // 타투 데모 데이터
            demoData = Array(userData.tattoos).fill().map((_, i) => ({
                id: i + 1,
                imageUrl: `https://picsum.photos/500/500?random=${i + 10}`,
                title: `타투 디자인 #${i + 1}`
            }));
        } else if (gridType === 'appointments' && userData.appointments > 0) {
            // 예약 데모 데이터
            demoData = Array(userData.appointments).fill().map((_, i) => ({
                id: i + 1,
                date: new Date(Date.now() + (i + 1) * 86400000).toLocaleDateString(),
                artist: `아티스트 ${i + 1}`,
                status: '예약 확정'
            }));
        }
        // saved는 빈 상태로 유지
    }
    
    // 데이터가 있으면 그리드 아이템 생성하고 빈 상태 숨기기
    if (demoData.length > 0) {
        // 빈 상태 요소 숨기기
        const emptyState = grid.querySelector('.empty-state');
        if (emptyState) {
            emptyState.style.display = 'none';
        }
        
        // 그리드 아이템 추가
        demoData.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            if (gridType === 'tattoos') {
                // 타투 이미지 표시
                galleryItem.innerHTML = `<img src="${item.imageUrl}" alt="${item.title}">`;
            } else if (gridType === 'appointments') {
                // 예약 정보 표시
                galleryItem.innerHTML = `
                    <div class="appointment-item">
                        <div class="appointment-date">${item.date}</div>
                        <div class="appointment-artist">${item.artist}</div>
                        <div class="appointment-status">${item.status}</div>
                    </div>
                `;
            }
            
            grid.insertBefore(galleryItem, emptyState);
        });
    } else {
        // 데이터가 없으면 빈 상태 표시
        const emptyState = grid.querySelector('.empty-state');
        if (emptyState) {
            emptyState.style.display = 'flex';
        }
    }
}

// 면적 계산 함수
function calculateArea() {
    const width = parseFloat(document.getElementById('width').value);
    const height = parseFloat(document.getElementById('height').value);
    const useCoverup = document.getElementById('useCoverup');
    const answerElement = document.getElementById('answer');
    const suggestedAreaElement = document.getElementById('suggested-area');
    
    if (!isNaN(width) && !isNaN(height)) {
        const area = width * height;
        const areaFormatted = area.toFixed(1);
        
        if (useCoverup && useCoverup.checked) {
            // Cover-up이 체크된 경우: 현재 면적과 추천 면적 표시
            answerElement.innerText = `Existing tattoo area: ${areaFormatted} cm²`;
            
            // 10% 추가된 면적과 20% 추가된 면적 계산
            const minSuggestedArea = (area * 1.1).toFixed(1);
            const maxSuggestedArea = (area * 1.2).toFixed(1);
            
            // 추천 면적 표시
            if (suggestedAreaElement) {
                suggestedAreaElement.innerText = `✔︎ Estimated total area: ${minSuggestedArea} ~ ${maxSuggestedArea} cm²`;
                suggestedAreaElement.style.display = 'block';
            }
        } else {
            // Cover-up이 체크되지 않은 경우: 일반 면적만 표시
            answerElement.innerText = `✔︎ Total Area: ${areaFormatted} cm²`;
            
            // 추천 면적 숨기기
            if (suggestedAreaElement) {
                suggestedAreaElement.style.display = 'none';
            }
        }
    } else {
        // 유효하지 않은 입력 시 결과 지우기
        answerElement.innerText = '';
        if (suggestedAreaElement) {
            suggestedAreaElement.style.display = 'none';
        }
    }
}

// Placeholder 업데이트 함수
function updatePlaceholder(input, unitId) {
    let unit = document.getElementById(unitId);
    unit.style.display = input.value ? 'inline' : 'none';
}

// 레퍼런스 이미지 업로드 기능 초기화
function initReferenceImageUpload() {
    const imageInput = document.getElementById('referenceImageUpload');
    const previewArea = document.getElementById('imagePreviewArea');
    const removeBtn = document.getElementById('removeImageBtn');
    
    if (!imageInput || !previewArea) return;
    
    // 이미지 미리보기 영역 클릭 시 파일 선택 다이얼로그 열기
    previewArea.addEventListener('click', function(e) {
        // 삭제 버튼 클릭 시 이벤트 전파 방지
        if (e.target === removeBtn || e.target.closest('#removeImageBtn')) {
            return;
        }
        imageInput.click();
    });
    
    // 파일 선택 시 이미지 미리보기
    imageInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            
            // 파일 확장자 검사
            const validExtensions = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!validExtensions.includes(file.type)) {
                alert('Please select a valid image file (JPG, PNG, GIF or WEBP)');
                return;
            }
            
            // 파일 크기 제한 (10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert('Image size should be less than 10MB');
                return;
            }
            
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // 기존 미리보기 이미지가 있으면 제거
                const existingImg = previewArea.querySelector('img');
                if (existingImg) {
                    existingImg.remove();
                }
                
                // 새 이미지 생성
                const img = document.createElement('img');
                img.src = e.target.result;
                previewArea.appendChild(img);
                
                // 업로드 아이콘과 텍스트 숨기기
                previewArea.classList.add('has-image');
                
                // 삭제 버튼 표시
                if (removeBtn) {
                    removeBtn.style.display = 'flex';
                }
            }
            
            reader.readAsDataURL(file);
        }
    });
    
    // 이미지 삭제 기능
    if (removeBtn) {
        removeBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // 이벤트 전파 방지
            
            // 이미지 삭제
            const img = previewArea.querySelector('img');
            if (img) {
                img.remove();
            }
            
            // 파일 인풋 초기화
            imageInput.value = '';
            
            // 업로드 아이콘과 텍스트 다시 표시
            previewArea.classList.remove('has-image');
            
            // 삭제 버튼 숨기기
            removeBtn.style.display = 'none';
        });
    }
}

// Dimension 페이지 업데이트 함수
function updateDimensionPage() {
    const useCoverup = document.getElementById('useCoverup');
    const coverupInfo = document.getElementById('coverup-dimension-info');
    const dimensionInstruction = document.querySelector('.dimension-section .instruction-text');
    const widthUnit = document.getElementById('width-unit');
    const heightUnit = document.getElementById('height-unit');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    
    if (useCoverup) {
        if (useCoverup.checked) {
            // Cover-up이 체크되어 있으면 추가 설명 표시 및 지시 문구 변경
            if (coverupInfo) {
                coverupInfo.style.display = 'block';
            }
            if (dimensionInstruction) {
                dimensionInstruction.textContent = 'Enter the current size of the tattoo you want to cover';
            }
            
            // 단위 레이블 변경
            if (widthUnit) widthUnit.textContent = 'cm (Existing tattoo width)';
            if (heightUnit) heightUnit.textContent = 'cm (Existing tattoo height)';
            
            // 플레이스홀더 변경
            if (widthInput) widthInput.placeholder = 'Width of existing tattoo (cm)';
            if (heightInput) heightInput.placeholder = 'Height of existing tattoo (cm)';
            
            // 현재 입력된 값으로 면적 계산 업데이트
            calculateArea();
        } else {
            // Cover-up이 체크되어 있지 않으면 추가 설명 숨기기 및 기본 지시 문구 복원
            if (coverupInfo) {
                coverupInfo.style.display = 'none';
            }
            if (dimensionInstruction) {
                dimensionInstruction.textContent = 'Please enter your desired size';
            }
            
            // 단위 레이블 복원
            if (widthUnit) widthUnit.textContent = 'cm (Width)';
            if (heightUnit) heightUnit.textContent = 'cm (Height)';
            
            // 플레이스홀더 복원
            if (widthInput) widthInput.placeholder = 'Width (cm)';
            if (heightInput) heightInput.placeholder = 'Height (cm)';
            
            // 현재 입력된 값으로 면적 계산 업데이트
            calculateArea();
        }
    }
}

// 메모 및 요구사항 정보 업데이트
const firstYesRadio = document.getElementById('first-yes');
const firstNoRadio = document.getElementById('first-no');
const sensitiveSkin = document.getElementById('sensitive-skin');
const skinAllergy = document.getElementById('skin-allergy');
const skinCondition = document.getElementById('skin-condition');

// 메모 및 요구사항 정보 업데이트
const updateNotesInfo = function() {
    const firstYesRadio = document.getElementById('first-yes');
    const firstNoRadio = document.getElementById('first-no');
    const sensitiveSkin = document.getElementById('sensitive-skin');
    const skinAllergy = document.getElementById('skin-allergy');
    const skinCondition = document.getElementById('skin-condition');
    
    // DOM 요소가 존재할 때만 이벤트 리스너 추가 등의 처리를 수행
};

// 피부색 슬라이더 초기화 및 이벤트 처리 함수
function initSkinToneSlider() {
    const skinToneSlider = document.getElementById('skin-tone-slider');
    const skinTonePreview = document.getElementById('skin-tone-preview');
    const skinToneText = document.getElementById('skin-tone-text');
    const skinToneSelect = document.getElementById('skin-tone');
    
    if (!skinToneSlider || !skinTonePreview || !skinToneText || !skinToneSelect) return;
    
    // 피부색 값과 관련 데이터
    const skinTones = [
        { value: 1, color: '#FFF4E0', text: 'Extremely light', selectValue: 'extremely-light' },
        { value: 2, color: '#FFDBAC', text: 'Very light', selectValue: 'very-light' },
        { value: 3, color: '#F1C27D', text: 'Light', selectValue: 'light' },
        { value: 4, color: '#E0AC69', text: 'Medium light', selectValue: 'medium-light' },
        { value: 5, color: '#C68642', text: 'Medium', selectValue: 'medium' },
        { value: 6, color: '#8D5524', text: 'Medium deep', selectValue: 'medium-deep' },
        { value: 7, color: '#5D4037', text: 'Deep', selectValue: 'deep' },
        { value: 8, color: '#3E2723', text: 'Very deep', selectValue: 'very-deep' },
        { value: 9, color: '#1A0D09', text: 'Extremely deep', selectValue: 'extremely-deep' }
    ];
    
    // 초기 설정
    updateSkinToneUI(skinToneSlider.value);
    
    // 슬라이더 값 변경 이벤트 처리
    skinToneSlider.addEventListener('input', function() {
        updateSkinToneUI(this.value);
    });
    
    // UI 업데이트 함수
    function updateSkinToneUI(value) {
        const index = parseInt(value) - 1;
        if (index >= 0 && index < skinTones.length) {
            const tone = skinTones[index];
            
            // 색상 미리보기 업데이트
            skinTonePreview.style.backgroundColor = tone.color;
            
            // 텍스트 업데이트
            skinToneText.textContent = tone.text;
            
            // 히든 드롭다운 업데이트
            for (let i = 0; i < skinToneSelect.options.length; i++) {
                if (skinToneSelect.options[i].value === tone.selectValue) {
                    skinToneSelect.selectedIndex = i;
                    break;
                }
            }
        }
    }
}

// 위치 관련 기능 초기화
function initLocationFeatures() {
    // 위치 자동 감지 버튼
    const detectLocationBtn = document.getElementById('detect-location-btn');
    const locationInput = document.getElementById('location-input');
    const locationStatus = document.getElementById('location-status');
    
    if (detectLocationBtn && locationInput && locationStatus) {
        detectLocationBtn.addEventListener('click', function() {
            // 위치 상태 업데이트
            locationStatus.textContent = 'Detecting your location...';
            locationStatus.style.color = 'var(--accent-color)';
            
            // Geolocation API가 사용 가능한지 확인
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    // 성공 시
                    function(position) {
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;
                        
                        // 좌표로 주소 검색 (간단한 표시용)
                        locationInput.value = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                        
                        // 실제 서비스에서는 Geocoding API를 사용하여 좌표를 주소로 변환
                        // 여기서는 간단히 성공 메시지만 표시
                        locationStatus.textContent = 'Location detected successfully!';
                        locationStatus.style.color = 'green';
                        
                        // 3초 후 상태 메시지 제거
                        setTimeout(() => {
                            locationStatus.textContent = '';
                        }, 3000);
                    },
                    // 실패 시
                    function(error) {
                        console.error('위치 감지 오류:', error);
                        locationStatus.textContent = 'Could not detect location. Please enter manually.';
                        locationStatus.style.color = 'red';
                    }
                );
            } else {
                locationStatus.textContent = 'Geolocation is not supported by your browser.';
                locationStatus.style.color = 'red';
            }
        });
    }
    
    // 거리 슬라이더
    const travelDistanceSlider = document.getElementById('travel-distance');
    const travelDistanceValue = document.getElementById('travel-distance-value');
    
    if (travelDistanceSlider && travelDistanceValue) {
        // 초기값 설정
        travelDistanceValue.textContent = travelDistanceSlider.value;
        
        // 슬라이더 값 변경 시 표시 업데이트
        travelDistanceSlider.addEventListener('input', function() {
            travelDistanceValue.textContent = this.value;
        });
    }
    
    // 출장 서비스 체크박스
    const requestMobileService = document.getElementById('request-mobile-service');
    const mobileServiceInfo = document.getElementById('mobile-service-info');
    
    if (requestMobileService && mobileServiceInfo) {
        // 체크박스 상태 변경 시 정보 표시/숨김
        requestMobileService.addEventListener('change', function() {
            if (this.checked) {
                // 체크되면 정보 표시 (페이드 인 효과)
                mobileServiceInfo.style.display = 'block';
                mobileServiceInfo.style.opacity = '0';
                
                // 강제 리플로우 발생
                void mobileServiceInfo.offsetWidth;
                
                // 페이드 인
                mobileServiceInfo.style.opacity = '1';
                mobileServiceInfo.style.transition = 'opacity 0.3s ease';
            } else {
                // 체크 해제되면 정보 숨김 (페이드 아웃 효과)
                mobileServiceInfo.style.opacity = '0';
                mobileServiceInfo.style.transition = 'opacity 0.3s ease';
                
                // 애니메이션 완료 후 display 속성 변경
                setTimeout(() => {
                    mobileServiceInfo.style.display = 'none';
                }, 300);
            }
        });
    }
}








