// 1. 필요한 요소들을 가져옵니다.
const reviewInput = document.getElementById('review-input');
const saveBtn = document.getElementById('save-btn');
const reviewList = document.getElementById('review-list');

// 2. 등록 버튼을 눌렀을 때 실행될 기능을 만듭니다.
saveBtn.addEventListener('click', function() {
    
    // 입력된 내용 가져오기
    const content = reviewInput.value;

    // 빈 칸 검사 (아무것도 안 쓰고 등록 누르면 경고창)
    if (content === '') {
        alert("내용을 입력해주세요!");
        return;
    }

    // 3. 새로운 리뷰 박스(HTML 태그) 만들기
    const newReview = document.createElement('div');
    newReview.classList.add('review-item'); // CSS 꾸미기 적용
    newReview.innerText = "익명: " + content; // 내용 넣기

    // 4. 목록에 붙이기 (최신순으로 위에 붙이려면 prepend 사용)
    reviewList.prepend(newReview);

    // 5. 입력창 비우기 (다음 글 작성을 위해)
    reviewInput.value = '';
});

// 엔터키 쳤을 때도 등록되게 하기 (보너스 기능)
reviewInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        saveBtn.click();
    }
});