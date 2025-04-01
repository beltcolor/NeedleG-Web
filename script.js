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
                const textInputContainer = document.querySelector('.text-input-container');
                
                if (useCustomFont) {
                    // 체크박스가 선택된 경우 즉시 보이기
                    textInputContainer.classList.remove('hiding');
                    fontSelectionArea.classList.remove('hiding');
                    textInputContainer.style.display = 'flex';
                    fontSelectionArea.style.display = 'block';
                    createCategorySelector();
                } else {
                    // 체크박스가 해제된 경우 애니메이션 후 숨기기
                    textInputContainer.classList.add('hiding');
                    fontSelectionArea.classList.add('hiding');
                    
                    // 애니메이션 완료 후 display 속성 변경
                    setTimeout(() => {
                        textInputContainer.style.display = 'none';
                        fontSelectionArea.style.display = 'none';
                        // 애니메이션 클래스 제거
                        textInputContainer.classList.remove('hiding');
                        fontSelectionArea.classList.remove('hiding');
                    }, 400); // 애니메이션 시간과 동일하게 설정
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
                categoryLabel.textContent = '폰트 스타일 선택:';
                categoryLabel.className = 'category-label';
                categorySelectContainer.appendChild(categoryLabel);
                
                // 카테고리 선택 드롭다운 생성
                const categorySelect = document.createElement('select');
                categorySelect.id = 'font-category-select';
                categorySelect.className = 'category-select';
                
                // 기본 옵션 추가
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = '폰트 스타일을 선택하세요';
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
                
                // 폰트 리스트를 표시할 컨테이너 생성
                const fontListContainer = document.createElement('div');
                fontListContainer.id = 'font-list-container';
                fontListContainer.className = 'font-list-container';
                fontSelectionArea.appendChild(fontListContainer);
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
                fetch(`fonts/${category}`)
                    .then(response => {
                        console.log(`응답 상태: ${response.status} ${response.statusText}`);
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.text();
                    })
                    .then(data => {
                        // 로딩 메시지 제거
                        fontListContainer.innerHTML = '';
                        
                        console.log(`받은 데이터: ${data.substring(0, 100)}...`);
                        const parser = new DOMParser();
                        const htmlDoc = parser.parseFromString(data, 'text/html');
                        const fileLinks = htmlDoc.querySelectorAll('a');
                        
                        console.log(`찾은 링크 수: ${fileLinks.length}`);
                        
                        // 현재 입력된 텍스트 가져오기
                        const currentText = document.getElementById('letteringText').value || 'AaBbCc 123';
                        
                        // 현재 선택된 피부색 가져오기 (기본값 흰색으로 설정)
                        const selectedSkinTone = document.querySelector('.skin-color-box.selected');
                        const skinColor = selectedSkinTone ? selectedSkinTone.getAttribute('data-color') : '#FFFFFF';
                        const textColor = getContrastColor(skinColor);
                        
                        // 폰트 그리드 컨테이너 생성
                        const fontGrid = document.createElement('div');
                        fontGrid.className = 'font-grid';
                        
                        // 폰트 파일만 필터링 (href 속성 기준)
                        let fontCount = 0;
                        fileLinks.forEach(link => {
                            const href = link.getAttribute('href');
                            // href 속성으로 폰트 파일 확인
                            if (href && href.match(/\.(ttf|otf)$/i)) {
                                fontCount++;
                                const fileName = href.split('/').pop(); // 파일 이름만 추출
                                const fontName = fileName.replace(/\.(ttf|otf)$/i, '');
                                
                                // 각 폰트 아이템 생성
                                const fontItem = document.createElement('div');
                                fontItem.className = 'font-item';
                                fontItem.setAttribute('data-font-url', href);
                                fontItem.setAttribute('data-font-name', fontName);
                                fontItem.style.backgroundColor = skinColor;
                                fontItem.style.border = `1px solid ${skinColor === '#FFFFFF' ? '#cccccc' : 'transparent'}`;
                                
                                // 폰트 이름 표시
                                const fontNameElem = document.createElement('div');
                                fontNameElem.className = 'font-name';
                                fontNameElem.textContent = fontName;
                                fontNameElem.style.color = textColor;
                                fontNameElem.style.opacity = '0.7';
                                fontItem.appendChild(fontNameElem);
                                
                                // 폰트 샘플 표시 (사용자 입력 텍스트 사용)
                                const fontSample = document.createElement('div');
                                fontSample.className = 'font-sample';
                                fontSample.textContent = currentText;
                                fontSample.style.backgroundColor = skinColor;
                                fontSample.style.color = textColor;
                                fontItem.appendChild(fontSample);
                                
                                // 폰트 로드 및 적용
                                loadAndApplyFontToElement(category, href, fontName, fontSample);
                                
                                // 폰트 선택 이벤트
                                fontItem.addEventListener('click', function() {
                                    // 선택된 클래스 토글
                                    document.querySelectorAll('.font-item').forEach(item => {
                                        item.classList.remove('selected');
                                    });
                                    fontItem.classList.add('selected');
                                    
                                    // 선택된 폰트를 미리보기에 적용
                                    applySelectedFont(category, href);
                                });
                                
                                fontGrid.appendChild(fontItem);
                            }
                        });
                        
                        fontListContainer.appendChild(fontGrid);
                        
                        console.log(`추가된 폰트 수: ${fontCount}`);
                        
                        if (fontCount === 0) {
                            const noFontsMessage = document.createElement('p');
                            noFontsMessage.textContent = '이 카테고리에 사용 가능한 폰트가 없습니다.';
                            noFontsMessage.className = 'no-fonts-message';
                            fontListContainer.appendChild(noFontsMessage);
                        }
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
                // fontUrl이 이미 전체 경로를 포함하고 있는지 확인
                let fullFontUrl;
                if (fontUrl.startsWith('/') || fontUrl.includes('://')) {
                    // 이미 절대 경로인 경우
                    fullFontUrl = fontUrl;
                } else {
                    // 상대 경로인 경우 카테고리 폴더 경로 추가
                    fullFontUrl = `fonts/${category}/${fontUrl}`;
                }
                
                console.log('폰트 로드 시도 (요소용):', fullFontUrl);
                
                const fontFace = new FontFace(fontName, `url('${fullFontUrl}')`);
                fontFace.load().then(loadedFace => {
                    document.fonts.add(loadedFace);
                    element.style.fontFamily = `'${fontName}', sans-serif`;
                }).catch(error => {
                    console.error('폰트 로드 실패 (요소용):', error);
                    element.textContent = '로드 실패';
                    element.classList.add('font-load-error');
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
                
                const fontFaceName = fontName.replace(/\.(ttf|otf)$/i, '');
                const fontFace = new FontFace(fontFaceName, `url('${fontUrl}')`);
                fontFace.load().then(loadedFace => {
                    document.fonts.add(loadedFace);
                    
                    // 현재 입력된 텍스트 가져오기
                    const currentText = document.getElementById('letteringText').value || 'AaBbCc 123';
                    
                    // 폰트 샘플 미리보기들도 업데이트
                    const fontSamples = document.querySelectorAll('.font-sample');
                    fontSamples.forEach(sample => {
                        sample.textContent = currentText;
                    });
                    
                    console.log('폰트 적용 완료:', fontName);
                }).catch(error => {
                    console.error('폰트 로드 실패:', error);
                });
            }

            // 텍스트 미리보기를 업데이트하는 함수
            function updatePreview() {
                const text = document.getElementById('letteringText').value;
                const previewText = text || 'AaBbCc 123';
                
                // 폰트 샘플 미리보기들도 업데이트
                const fontSamples = document.querySelectorAll('.font-sample');
                fontSamples.forEach(sample => {
                    sample.textContent = previewText;
                    
                    // 텍스트 길이에 따라 글자 크기 자동 조정
                    if (text.length > 30) {
                        sample.style.fontSize = '24px';
                    } else if (text.length > 20) {
                        sample.style.fontSize = '28px';
                    } else if (text.length > 10) {
                        sample.style.fontSize = '30px';
                    } else {
                        sample.style.fontSize = '32px';
                    }
                });
            }

            // 배경색에 따라 대비되는 텍스트 색상 반환 함수
            function getContrastColor(hexColor) {
                // HEX 색상에서 RGB 추출
                const r = parseInt(hexColor.substr(1, 2), 16);
                const g = parseInt(hexColor.substr(3, 2), 16);
                const b = parseInt(hexColor.substr(5, 2), 16);
                
                // 밝기 계산 (YIQ 공식)
                const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
                
                // 밝기에 따라 어두운색 또는 밝은색 반환
                return (yiq >= 128) ? '#000000' : '#ffffff';
            }
            
            // 폰트 관련 이벤트 리스너 추가
            const checkboxElement = document.getElementById('useCustomFont');
            if (checkboxElement) {
                checkboxElement.addEventListener('change', function() {
                    toggleFontSelection();
                    
                    // 체크박스가 체크되면 피부색 선택기 초기화
                    if (this.checked) {
                        setTimeout(() => {
                            initSkinToneSelector();
                        }, 100);
                    }
                });
            }
            
            const letteringTextElement = document.getElementById('letteringText');
            if (letteringTextElement) {
                letteringTextElement.addEventListener('input', updatePreview);
            }

            // 피부색 선택 상자 기능 초기화
            function initSkinToneSelector() {
                const skinColorBoxes = document.querySelectorAll('.skin-color-box');
                const letteringTextElement = document.getElementById('letteringText');
                
                skinColorBoxes.forEach(box => {
                    box.addEventListener('click', function() {
                        // 선택 표시 업데이트
                        skinColorBoxes.forEach(b => b.classList.remove('selected'));
                        this.classList.add('selected');
                        
                        const selectedColor = this.getAttribute('data-color');
                        
                        // 모든 폰트 샘플 배경색 업데이트
                        const fontSamples = document.querySelectorAll('.font-sample');
                        fontSamples.forEach(sample => {
                            sample.style.backgroundColor = selectedColor;
                            
                            // 피부색에 따라 글자색 자동 설정
                            const textColor = getContrastColor(selectedColor);
                            sample.style.color = textColor;
                        });
                        
                        // 모든 font-item 배경색도 업데이트
                        const fontItems = document.querySelectorAll('.font-item');
                        fontItems.forEach(item => {
                            item.style.backgroundColor = selectedColor;
                            item.style.border = `1px solid ${selectedColor === '#FFFFFF' ? '#cccccc' : 'transparent'}`;
                            
                            // 폰트 이름 색상도 대비색으로 업데이트
                            const fontNameElem = item.querySelector('.font-name');
                            if (fontNameElem) {
                                fontNameElem.style.color = getContrastColor(selectedColor);
                            }
                        });
                    });
                });
                
                // 기본적으로 흰색 선택 (마지막 색상)
                if (skinColorBoxes.length > 0) {
                    skinColorBoxes[skinColorBoxes.length - 1].click();
                }
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







