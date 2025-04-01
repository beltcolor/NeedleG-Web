// 페이지가 로드될 때 기본 콘텐츠를 불러옵니다
document.addEventListener('DOMContentLoaded', function() {
    // 기본적으로 'get-tattoo' 페이지를 로드합니다
    navigateTo('get-tattoo');
});

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
    fetch('ContentTattoo.html') // HTML 파일 경로
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('main-content').innerHTML = data; // HTML 내용 삽입
            
            document.getElementById('width').addEventListener('input', calculateArea);
            document.getElementById('height').addEventListener('input', calculateArea);

            const descriptionMap = {
                traditional: "Bold outlines, limited color palette, and classic designs like anchors, roses, and eagles.",
                "neo-traditional": "A modern take on Traditional tattoos with more colors, shading, and intricate details.",
                "new-school": "Cartoonish and exaggerated designs with vibrant colors and dynamic compositions.",
                realism: "Highly detailed tattoos that resemble photographs, often depicting portraits, animals, or nature.",
                "black-grey-realism": "A monochromatic version of Realism that relies on shading to create depth.",
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

            document.getElementById('tattooStyles').addEventListener('change', function () {
                const style = this.value;
                const description = descriptionMap[style];
                document.getElementById('description').innerText = `💡 ${description}`;
            });


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
                
                if (useCustomFont) {
                    fontSelectionArea.style.display = 'block';
                    createFontDropdowns();
                } else {
                    fontSelectionArea.style.display = 'none';
                }
            }

            // 8개의 폰트 카테고리 드롭다운을 생성하는 함수
            function createFontDropdowns() {
                const fontSelectionArea = document.getElementById('fontSelectionArea');
                fontSelectionArea.innerHTML = ''; // 기존 내용 초기화
                
                Object.keys(fontCategories).forEach(category => {
                    // 카테고리 컨테이너 생성
                    const categoryContainer = document.createElement('div');
                    categoryContainer.className = 'font-category-container';
                    
                    // 카테고리 레이블 생성
                    const categoryLabel = document.createElement('h3');
                    categoryLabel.textContent = category;
                    categoryContainer.appendChild(categoryLabel);
                    
                    // 드롭다운 생성
                    const selectElement = document.createElement('select');
                    selectElement.id = `font-${category}`;
                    selectElement.className = 'font-dropdown';
                    selectElement.addEventListener('change', function() {
                        applySelectedFont(category, this.value);
                    });
                    
                    // 기본 옵션 추가
                    const defaultOption = document.createElement('option');
                    defaultOption.value = '';
                    defaultOption.textContent = `Select ${category} Font`;
                    defaultOption.disabled = true;
                    defaultOption.selected = true;
                    selectElement.appendChild(defaultOption);
                    
                    // 해당 카테고리의 폰트 목록을 비동기적으로 로드
                    loadFontsForCategory(category, selectElement);
                    
                    categoryContainer.appendChild(selectElement);
                    fontSelectionArea.appendChild(categoryContainer);
                });
            }

            // 특정 카테고리의 폰트 목록을 로드하여 드롭다운에 추가하는 함수
            function loadFontsForCategory(category, selectElement) {
                console.log(`폰트 카테고리 로드 시도: ${category}`);
                fetch(`fonts/${category}`)
                    .then(response => {
                        console.log(`응답 상태: ${response.status} ${response.statusText}`);
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.text();
                    })
                    .then(data => {
                        console.log(`받은 데이터: ${data.substring(0, 100)}...`);
                        const parser = new DOMParser();
                        const htmlDoc = parser.parseFromString(data, 'text/html');
                        const fileLinks = htmlDoc.querySelectorAll('a');
                        
                        console.log(`찾은 링크 수: ${fileLinks.length}`);
                        
                        // 첫 번째 링크의 내용 확인 (디버깅용)
                        if (fileLinks.length > 0) {
                            console.log("첫 번째 링크:", fileLinks[0].outerHTML);
                            console.log("첫 번째 링크 href:", fileLinks[0].getAttribute('href'));
                            console.log("첫 번째 링크 텍스트:", fileLinks[0].textContent);
                        }
                        
                        // 폰트 파일만 필터링 (href 속성 기준)
                        let fontCount = 0;
                        fileLinks.forEach(link => {
                            const href = link.getAttribute('href');
                            // href 속성으로 폰트 파일 확인
                            if (href && href.match(/\.(ttf|otf)$/i)) {
                                fontCount++;
                                const fileName = href.split('/').pop(); // 파일 이름만 추출
                                const option = document.createElement('option');
                                option.value = href;
                                option.textContent = fileName.replace(/\.(ttf|otf)$/i, '');
                                selectElement.appendChild(option);
                            }
                        });
                        
                        console.log(`추가된 폰트 수: ${fontCount}`);
                        
                        // 만약 여전히 폰트를 찾지 못한다면, 디버깅용으로 모든 링크 출력
                        if (fontCount === 0 && fileLinks.length > 0) {
                            console.log("모든 링크 href 확인:");
                            fileLinks.forEach((link, index) => {
                                if (index < 5) { // 처음 5개만 표시
                                    console.log(`링크 ${index}: ${link.getAttribute('href')}`);
                                }
                            });
                        }
                    })
                    .catch(error => {
                        console.error(`폰트 목록 로드 중 오류 (${category}):`, error);
                        const option = document.createElement('option');
                        option.textContent = '폰트 로드 실패';
                        option.disabled = true;
                        selectElement.appendChild(option);
                    });
            }

            // 선택된 폰트를 적용하는 함수
            function applySelectedFont(category, fontName) {
                if (!fontName) return;
                
                // fontName이 이미 전체 경로를 포함하고 있는지 확인
                let fontUrl;
                if (fontName.startsWith('/') || fontName.includes('://')) {
                    // 이미 절대 경로인 경우
                    fontUrl = fontName;
                } else {
                    // 상대 경로인 경우 카테고리 폴더 경로 추가
                    fontUrl = `fonts/${category}/${fontName}`;
                }
                
                console.log('폰트 로드 시도:', fontUrl);
                
                const fontFace = new FontFace(fontName.replace(/\.(ttf|otf)$/i, ''), `url('${fontUrl}')`);
                fontFace.load().then(loadedFace => {
                    document.fonts.add(loadedFace);
                    document.getElementById('textPreview').style.fontFamily = `'${fontName.replace(/\.(ttf|otf)$/i, '')}', sans-serif`;
                    console.log('폰트 적용 완료:', fontName);
                }).catch(error => {
                    console.error('폰트 로드 실패:', error);
                });
            }

            // 텍스트 미리보기를 업데이트하는 함수
            function updatePreview() {
                const text = document.getElementById('letteringText').value;
                document.getElementById('textPreview').textContent = text || '텍스트를 입력하세요';
            }

            // 폰트 관련 이벤트 리스너 추가
            const checkboxElement = document.getElementById('useCustomFont');
            if (checkboxElement) {
                checkboxElement.addEventListener('change', toggleFontSelection);
            }
            
            const letteringTextElement = document.getElementById('letteringText');
            if (letteringTextElement) {
                letteringTextElement.addEventListener('input', updatePreview);
            }
        })
        .catch(error => console.error('Error loading content:', error));
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
        })
        .catch(error => console.error('Error loading content:', error));
}

// 면적 계산 함수
function calculateArea() {
    const width = parseFloat(document.getElementById('width').value);
    const height = parseFloat(document.getElementById('height').value);
    
    if (!isNaN(width) && !isNaN(height)) {
        const area = width * height;
        document.getElementById('answer').innerText = `💡 Total Area : ${area} cm²`; // 결과를 answer에 표시
    } else {
        document.getElementById('answer').innerText = ''; // 유효하지 않은 입력 시 결과 지우기
    }
}

// Placeholder 업데이트 함수
function updatePlaceholder(input, unitId) {
    let unit = document.getElementById(unitId);
    unit.style.display = input.value ? 'inline' : 'none';
}







