// --- 1. 영화 데이터 (안정적인 위키백과/공용 파일 서버 경로 사용) ---
const currentmovies = [
    { id: 1, title: '주토피아 2', genre: '애니메이션', year: 2025, img: 'https://en.wikipedia.org/wiki/Special:FilePath/Zootopia_2_(2025_film).jpg?width=300' },
    { id: 2, title: '극장판 주술회전 0', genre: '애니메이션', year: 2021, img: 'https://en.wikipedia.org/wiki/Special:FilePath/Gekij%C5%8D-ban_Jujutsu_Kaisen_0.png?width=300' },
    { id: 3, title: '위키드', genre: '뮤지컬/판타지', year: 2024, img: 'https://en.wikipedia.org/wiki/Special:FilePath/Wicked_2024_whisper_poster.jpg?width=300' },
    { id: 4, title: '무파사: 라이온 킹', genre: '모험/드라마', year: 2024, img: 'https://i.namu.wiki/i/iVjTGmiXpwMBhxWchTin0C5nX17SZDPiFtrgUIOvUNr7QF59Gja_UyD4EpdjEjd1lygeuhpOfiiLmziI8ZxmfO574ZGAeacSf_QaAqIxuAG44c_IQRwjPm3yjMKKGpUSuXvv75UIeGssDC0xrEdQHA.webp' }
];

const koreanmovies = [
    { id: 5, title: '기생충', genre: '드라마/스릴러', year: 2019, img: 'https://i.namu.wiki/i/OSztJWgsdImEDUbQ5HE8rtJCF_bKjLbCUJhdLVWG6zHKcHa-rGeQJOV9KayYu91DliUfQhOFfP-o_ctAQQK-GA.webp' },
    { id: 6, title: '베테랑 2', genre: '액션/범죄', year: 2024, img: 'https://i.namu.wiki/i/epZnvgJRbnXIL0RtJ4kjlpSqLmAAr0fSZxYziNwHu2tOJdh_-fZwtVWsLtmCb5KjL-JMJzGbrwN0X2KkMZio0w.webp' },
    { id: 9, title: '하얼빈', genre: '시대극/액션', year: 2024, img: 'https://en.wikipedia.org/wiki/Special:FilePath/Harbin_movie.jpg?width=300' },
    { id: 10, title: '서울의 봄', genre: '드라마', year: 2023, img: 'https://en.wikipedia.org/wiki/Special:FilePath/12.12-_The_Day.jpg?width=300' }
];

const seriesmovies = [
    { id: 7, title: '더 글로리', genre: '드라마', year: 2023, img: 'https://i.namu.wiki/i/SdJHio7UtRjLALnLn4TLhHAgY5fvfY1mkQhFBA6_6jqglUtW1BTvjIlseI_lpEw2-v3kuUkIwT6YXBYVkGlnOA.webp' },
    { id: 8, title: '기묘한 이야기', genre: '공포/SF', year: 2022, img: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/78/Stranger_Things_season_4.jpg/220px-Stranger_Things_season_4.jpg' },
    { id: 11, title: '오징어 게임 2', genre: '스릴러', year: 2024, img: 'https://en.wikipedia.org/wiki/Special:FilePath/Squid_Game_season_2_poster.png?width=300' },
    { id: 12, title: '무빙', genre: '액션/히어로', year: 2023, img: 'https://i.namu.wiki/i/Z0AGqK3cuZM9JSvek7kONbiOiqh9xEyDCFArvgbKBq2I_7YYWJVkFJwy88xk7UXpsKDFgaNR9CD9ZguIZHZ3Ow.webp' }
];

let currentMovieId = null;
// 전체 영화 데이터 통합
const allMovies = [...currentmovies, ...koreanmovies, ...seriesmovies];

// --- 2. 화면 제어 및 렌더링 ---
document.addEventListener('DOMContentLoaded', () => {
    renderMovies(currentmovies, 'currentmovieGrid');
    renderMovies(koreanmovies, 'koreanmovieGrid');
    renderMovies(seriesmovies, 'seriesmovieGrid');
    
    // 검색 이벤트
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);

    // 헤더 스크롤 효과
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if(header) { 
            if(window.scrollY > 50) header.style.background = '#141414';
            else header.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, transparent 100%)';
        }
    });
});

// 네비게이션 뷰 전환 (SPA처럼 동작)
function showView(viewName) {
    const views = ['homeView', 'boxOfficeView', 'myReviewsView', 'searchResultView'];
    const hero = document.getElementById('heroSection');
    
    // 모든 뷰 숨기기
    views.forEach(v => document.getElementById(v).style.display = 'none');

    // 검색어 초기화
    document.getElementById('searchInput').value = '';

    if (viewName === 'home') {
        document.getElementById('homeView').style.display = 'block';
        hero.style.display = 'flex'; // 히어로 섹션 보이기
    } else if (viewName === 'boxoffice') {
        document.getElementById('boxOfficeView').style.display = 'block';
        hero.style.display = 'none';
        renderBoxOffice(); // 박스오피스 렌더링
    } else if (viewName === 'myreviews') {
        document.getElementById('myReviewsView').style.display = 'block';
        hero.style.display = 'none';
        renderMyReviews(); // 내 리뷰 렌더링
    }
}

// 영화 카드 렌더링 (기본)
function renderMovies(movies, containerId) {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    grid.innerHTML = ''; 
    if(movies.length === 0) return;

    movies.forEach(movie => {
        const card = createMovieCard(movie);
        grid.appendChild(card);
    });
}

// 박스오피스 렌더링 (순위 배지 추가)
function renderBoxOffice() {
    const grid = document.getElementById('boxOfficeGrid');
    grid.innerHTML = '';
    
    // 박스오피스 순위를 위해 전체 영화를 섞거나 정렬 (여기선 임의 순서)
    const sortedMovies = [...allMovies].sort((a, b) => a.title.localeCompare(b.title)); // 가나다순 임시 정렬
    
    sortedMovies.forEach((movie, index) => {
        const card = createMovieCard(movie);
        
        // 순위 배지 추가
        const badge = document.createElement('div');
        badge.className = 'rank-badge';
        badge.innerText = index + 1;
        card.appendChild(badge);

        grid.appendChild(card);
    });
}

// 영화 카드 HTML 생성 헬퍼 함수
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    // 이미지 로드 실패 시 대체 이미지(Placehold.co) 보여주는 코드 추가
    card.innerHTML = `
        <img src="${movie.img}" alt="${movie.title}" class="poster" 
             onerror="this.src='https://placehold.co/300x450/333/fff?text=${encodeURIComponent(movie.title)}'">
        <div class="card-info">
            <div class="movie-title">${movie.title}</div>
            <div class="movie-meta">
                <span>${movie.genre}</span>
                <span>${movie.year}</span>
            </div>
        </div>
    `;
    card.onclick = () => openModal(movie);
    return card;
}

// 내 리뷰 모아보기 렌더링
function renderMyReviews() {
    const listDiv = document.getElementById('myReviewsList');
    listDiv.innerHTML = '';

    const reviews = JSON.parse(localStorage.getItem('cineLogReviews')) || [];

    if (reviews.length === 0) {
        listDiv.innerHTML = '<p style="text-align:center; color:#777; font-size:1.2rem; margin-top:50px;">작성한 리뷰가 없습니다. 영화를 클릭해서 리뷰를 남겨보세요!</p>';
        return;
    }

    // 최신순 정렬
    reviews.reverse().forEach(review => {
        // 리뷰의 movieId로 영화 정보 찾기
        const movie = allMovies.find(m => m.id === review.movieId);
        const movieTitle = movie ? movie.title : '알 수 없는 영화';

        // 별점 아이콘
        let stars = '';
        for(let i=0; i<5; i++) {
            stars += i < review.rating ? '<i class="fas fa-star" style="color:#ffd700"></i>' : '<i class="far fa-star" style="color:#555"></i>';
        }

        const reviewCard = document.createElement('div');
        reviewCard.className = 'my-review-card';
        reviewCard.innerHTML = `
            <div class="my-review-title">
                ${movieTitle} 
                <span style="font-size:0.9rem; font-weight:normal; margin-left:10px; color:#aaa;">${review.date}</span>
            </div>
            <div class="my-review-meta">
                <span>작성자: ${review.name}</span>
                <span>${stars}</span>
            </div>
            <div class="my-review-text">${review.text}</div>
        `;
        listDiv.appendChild(reviewCard);
    });
}

// 검색 기능
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    const hero = document.getElementById('heroSection');
    const homeView = document.getElementById('homeView');
    const searchResultView = document.getElementById('searchResultView');
    const boxOfficeView = document.getElementById('boxOfficeView');
    const myReviewsView = document.getElementById('myReviewsView');
    const noResultMsg = document.getElementById('noResultMsg');

    // 다른 뷰들 숨기기
    boxOfficeView.style.display = 'none';
    myReviewsView.style.display = 'none';

    if (searchTerm === '') {
        homeView.style.display = 'block';
        hero.style.display = 'flex';
        searchResultView.style.display = 'none';
    } else {
        homeView.style.display = 'none';
        hero.style.display = 'none';
        searchResultView.style.display = 'block';

        const filteredMovies = allMovies.filter(movie => 
            movie.title.toLowerCase().includes(searchTerm)
        );

        renderMovies(filteredMovies, 'searchResultGrid');

        if (filteredMovies.length === 0) {
            noResultMsg.style.display = 'block';
        } else {
            noResultMsg.style.display = 'none';
        }
    }
}

// --- 3. 모달 제어 ---
const modal = document.getElementById('reviewModal');
const modalTitle = document.getElementById('modalTitle');
const reviewListDiv = document.getElementById('reviewList');

function openModal(movie) {
    currentMovieId = movie.id;
    modalTitle.innerText = `${movie.title} 리뷰 남기기`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; 
    loadReviews(movie.id); 
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    document.getElementById('reviewForm').reset();
}

window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

// --- 4. 리뷰 저장 로직 ---
document.getElementById('reviewForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('reviewerName').value;
    const text = document.getElementById('reviewText').value;
    const ratingInput = document.querySelector('input[name="rating"]:checked');
    const rating = ratingInput ? ratingInput.value : 0;

    if (rating === 0) {
        alert("별점을 선택해주세요!");
        return;
    }

    const review = {
        id: Date.now(),
        movieId: currentMovieId,
        name: name,
        text: text,
        rating: rating,
        date: new Date().toLocaleDateString('ko-KR', {year: 'numeric', month: '2-digit', day: '2-digit'}).replace(/\./g, '').replace(/ /g, '.') // 2024.01.01 형식
    };

    saveReviewToStorage(review);
    addReviewToDOM(review);
    document.getElementById('reviewForm').reset();
});

function saveReviewToStorage(review) {
    let reviews = JSON.parse(localStorage.getItem('cineLogReviews')) || [];
    reviews.push(review);
    localStorage.setItem('cineLogReviews', JSON.stringify(reviews));
}

function loadReviews(movieId) {
    reviewListDiv.innerHTML = '';
    let reviews = JSON.parse(localStorage.getItem('cineLogReviews')) || [];
    const movieReviews = reviews.filter(r => r.movieId === movieId);
    
    if (movieReviews.length === 0) {
        reviewListDiv.innerHTML = '<p style="color:#777; text-align:center;">아직 작성된 리뷰가 없습니다.</p>';
    } else {
        movieReviews.reverse().forEach(review => addReviewToDOM(review));
    }
}

function addReviewToDOM(review) {
    // '아직 작성된 리뷰가 없습니다' 메시지가 있다면 제거
    if (reviewListDiv.innerHTML.includes('아직 작성된 리뷰가 없습니다.')) {
        reviewListDiv.innerHTML = '';
    }

    const div = document.createElement('div');
    div.className = 'review-item';
    
    let stars = '';
    for(let i=0; i<5; i++) {
        stars += i < review.rating ? '<i class="fas fa-star" style="color:#ffd700"></i>' : '<i class="far fa-star" style="color:#555"></i>';
    }

    div.innerHTML = `
        <div class="review-header">
            <span>${review.name}</span>
            <span>${stars}</span>
        </div>
        <div style="color: #ddd; margin-bottom:5px;">${review.text}</div>
        <div style="font-size: 0.75rem; color: #666; text-align: right;">${review.date}</div>
    `;
    
    // 가장 최근 리뷰가 맨 위에 오도록
    reviewListDiv.insertBefore(div, reviewListDiv.firstChild);
}
