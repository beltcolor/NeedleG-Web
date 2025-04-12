// Home 페이지 로드 함수
function loadHomeContent() {
    fetch('ContentHome.html') // HTML 파일 경로
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