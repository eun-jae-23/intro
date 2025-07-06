//호출
$(document).ready(function(){
    
    headerClickOn();

    scrollOnePage();

});

//전역변수, 전역함수
// 스크롤 애니메이션 상태 추적 플래그
let isScrolling = false;

//headerClickOn 함수////////////////////////////////////////
//설명
//1. 탭메뉴의 a를 클릭하면 해당 a에 on클래스 부여하여 디자인 입히고, 나머지 a 형제들에게는 on클래스 제거
//2. 해당 a의 인덱스값을 통해 스크롤탑값을 얻은 후 animate 통해 부드럽게 바꾸기
function headerClickOn () {

    $('header .tabMenu a').on('click',function(evt){
        evt.preventDefault();

        $(this).addClass('on').siblings().removeClass('on');

        // 클릭한 a의 인덱스에 따라 해당 섹션으로 스크롤
        let index = $(this).index();
        let targetSection;
        
        switch(index) {
            case 0:
                targetSection = '#intro';
                break;
            case 1:
                targetSection = '#about';
                break;
            case 2:
                targetSection = '#work';
                break;
            case 3:
                targetSection = '#contact';
                break;
        }
        
        // 스크롤 애니메이션 시작 시 플래그 설정
        isScrolling = true;
        
        // 부드러운 스크롤 애니메이션
        $('html, body').animate({
            scrollTop: $(targetSection).offset().top
        }, 1000, function() {
            // 애니메이션 완료 후 플래그 해제
            isScrolling = false;
        });

    })
}



//scrollOnePage 함수 ////////////////////////////
//설명
// 1. 마우스로 스크롤바를 클릭해서 스크롤이 움직이게 하는 것은 하지 못하게 막는다
// 2. 마우스 휠이 아래로 발생 or 키보드 아래 키를 클릭했을 때 화면 높이(100vh)만큼 스크롤탑값이 animate되게 하며 animate중에는 마우스 휠을 아래로 내리든 위로 올리든 혹은 키보드 아래키를 누르든 윗키를 누르든 스크롤탑값이 변하지 않게 막고, animate된 후에 허용시킨다
// 3. 마우스 휠이 위로 발생 or 키보드 윗 키를 클릭했을 때 화면 높이(-100vh)만큼 스크롤탑값이 animate되게 하며 animate중에는 마우스 휠을 아래로 내리든 위로 올리든 혹은 키보드 아래키를 누르든 윗키를 누르든 스크롤탑값이 변하지 않게 막고, animate된 후에 허용시킨다
//4. 스크롤이 변한 페이지의 offset 위치에 따라 header on클래스를 변경시킨다

function scrollOnePage() {
    
    // 화면 높이 (100vh)
    let viewportHeight = $(window).height();
    
    // 문서 전체 높이
    let documentHeight = $(document).height();
    
    // 현재 스크롤 위치
    let currentScrollTop = $(window).scrollTop();
    
    // 1. 마우스로 스크롤바를 클릭해서 스크롤이 움직이게 하는 것은 하지 못하게 막는다
    $('body').css('overflow', 'hidden');
    
    // 통합된 스크롤 이벤트 처리
    $(window).on('scroll', function(){
        // 스크롤 위치에 따른 헤더 탭 업데이트
        updateHeaderTab();
        
        // 스크롤 애니메이션 중일 때는 추가 처리 무시
        if (isScrolling) {
            return;
        }
    });
    
    // 2. 마우스 휠이 아래로 발생 or 키보드 아래 키를 클릭했을 때 화면 높이(100vh)만큼 스크롤탑값이 animate되게 하며 animate중에는 마우스 휠을 아래로 내리든 위로 올리든 혹은 키보드 아래키를 누르든 윗키를 누르든 스크롤탑값이 변하지 않게 막고, animate된 후에 허용시킨다
    // 3. 마우스 휠이 위로 발생 or 키보드 윗 키를 클릭했을 때 화면 높이(-100vh)만큼 스크롤탑값이 animate되게 하며 animate중에는 마우스 휠을 아래로 내리든 위로 올리든 혹은 키보드 아래키를 누르든 윗키를 누르든 스크롤탑값이 변하지 않게 막고, animate된 후에 허용시킨다
    // 마우스 휠 이벤트 처리
    $(window).on('wheel', function(e) {
        e.preventDefault(); // 기본 스크롤 동작 방지
        
        if (isScrolling) {
            return; // 애니메이션 중일 때는 무시
        }
        
        // 휠 방향 확인 (deltaY > 0: 아래로, deltaY < 0: 위로)
        if (e.originalEvent.deltaY > 0) {
            // 아래로 스크롤
            scrollToNextPage();
        } else {
            // 위로 스크롤
            scrollToPrevPage();
        }
    });
    
    // 키보드 이벤트 처리 (2,3번 기능 포함)
    $(document).on('keydown', function(e) {
        if (isScrolling) {
            return; // 애니메이션 중일 때는 무시
        }
        
        // 화살표 키와 Page Up/Down 키 처리
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            scrollToNextPage();
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            scrollToPrevPage();
        }
    });
    
    // 4. 스크롤이 변한 페이지의 offset 위치에 따라 header on클래스를 변경시킨다
    // 헤더 탭 업데이트 함수
    function updateHeaderTab() {
        //변수///////////////////////////////////////
        //현재 사용자의 스크롤탑값
        let winTop = $(window).scrollTop();
        
        //각각 영역의 스크롤탑값 (offset().top 사용)
        let introTop = $('#intro').offset().top;
        let aboutTop = $('#about').offset().top;
        let workTop = $('#work').offset().top;
        let contactTop = $('#contact').offset().top;

        //함수///////////////////////////////////////
        //winTop의 범위 설정
        //1. introTop <= winTop < aboutTop 일 경우, $('a[href="#intro"]').addClass('on').siblings().removeClass('on');
        //2. aboutTop <= winTop < workTop 일 경우, $('a[href="#about"]').addClass('on').siblings().removeClass('on');
        //3. workTop <= winTop < contactTop 일 경우, $('a[href="#work"]').addClass('on').siblings().removeClass('on');
        //4. contactTop <= winTop 일 경우, $('a[href="#contact"]').addClass('on').siblings().removeClass('on');
        
        if (introTop <= winTop && winTop < aboutTop) {
            $('a[href="#intro"]').addClass('on').siblings().removeClass('on');
        } else if (aboutTop <= winTop && winTop < workTop) {
            $('a[href="#about"]').addClass('on').siblings().removeClass('on');
        } else if (workTop <= winTop && winTop < contactTop) {
            $('a[href="#work"]').addClass('on').siblings().removeClass('on');
        } else if (contactTop <= winTop) {
            $('a[href="#contact"]').addClass('on').siblings().removeClass('on');
        }
    }
    
    // 다음 페이지로 스크롤
    function scrollToNextPage() {
        if (isScrolling) return;
        
        currentScrollTop = $(window).scrollTop();
        let targetScrollTop = currentScrollTop + viewportHeight;
        
        // 문서 끝을 넘어가지 않도록 제한
        if (targetScrollTop >= documentHeight - viewportHeight) {
            targetScrollTop = documentHeight - viewportHeight;
        }
        
        // 현재 위치와 목표 위치가 같으면 스크롤하지 않음
        if (currentScrollTop === targetScrollTop) return;
        
        isScrolling = true;
        
        $('html, body').animate({
            scrollTop: targetScrollTop
        }, 1000, function() {
            isScrolling = false;
        });
    }
    
    // 이전 페이지로 스크롤
    function scrollToPrevPage() {
        if (isScrolling) return;
        
        currentScrollTop = $(window).scrollTop();
        let targetScrollTop = currentScrollTop - viewportHeight;
        
        // 문서 시작보다 위로 가지 않도록 제한
        if (targetScrollTop < 0) {
            targetScrollTop = 0;
        }
        
        // 현재 위치와 목표 위치가 같으면 스크롤하지 않음
        if (currentScrollTop === targetScrollTop) return;
        
        isScrolling = true;
        
        $('html, body').animate({
            scrollTop: targetScrollTop
        }, 1000, function() {
            isScrolling = false;
        });
    }
}

