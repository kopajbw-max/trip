/*=============== KAKAOTALK 연결 설정 ===============*/
// 1) JavaScript 키: https://developers.kakao.com → 내 애플리케이션 → 앱 키 → "JavaScript 키"
//    (플랫폼 → Web 에 이 사이트 도메인을 등록해야 공유가 동작합니다)
// 2) 채널 ID: https://center-pf.kakao.com → 채널 → 채널 URL 의 "_xxxxx" 부분
const KAKAO_JS_KEY = 'YOUR_KAKAO_JAVASCRIPT_KEY'
const KAKAO_CHANNEL_ID = '_YOUR_CHANNEL_ID'

const kakaoKeyReady = KAKAO_JS_KEY && !KAKAO_JS_KEY.startsWith('YOUR_')
const kakaoChannelReady = KAKAO_CHANNEL_ID && !KAKAO_CHANNEL_ID.startsWith('_YOUR_')

if (window.Kakao && kakaoKeyReady && !Kakao.isInitialized()) {
    Kakao.init(KAKAO_JS_KEY)
}

/*=============== 카카오톡 공유 ===============*/
function shareKakao() {
    const pageUrl = window.location.href.split('#')[0]
    const imageUrl = new URL('assets/img/home1.jpg', pageUrl).href

    if (window.Kakao && Kakao.isInitialized()) {
        Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: document.title,
                description: 'Explore the best beautiful beaches - 지금 여행지를 확인해 보세요!',
                imageUrl: imageUrl,
                link: { mobileWebUrl: pageUrl, webUrl: pageUrl },
            },
            buttons: [
                { title: '사이트 보기', link: { mobileWebUrl: pageUrl, webUrl: pageUrl } },
            ],
        })
        return
    }

    // 키가 아직 없거나 SDK 로드 실패 시: 기본 공유 / 링크 복사로 대체
    if (navigator.share) {
        navigator.share({ title: document.title, url: pageUrl }).catch(() => {})
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(pageUrl)
            .then(() => alert('링크가 복사되었습니다. 카카오톡에 붙여넣어 공유하세요.'))
            .catch(() => prompt('아래 링크를 복사하세요', pageUrl))
    } else {
        prompt('아래 링크를 복사하세요', pageUrl)
    }
}

document.querySelectorAll('.kakao-share').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault()
        shareKakao()
    })
})

/*=============== 카카오톡 채널 상담 ===============*/
const kakaoChat = document.getElementById('kakao-chat')
if (kakaoChat) {
    if (kakaoChannelReady) {
        kakaoChat.href = `https://pf.kakao.com/${KAKAO_CHANNEL_ID}/chat`
    } else {
        kakaoChat.addEventListener('click', e => {
            e.preventDefault()
            alert('카카오톡 채널 ID를 assets/js/kakao.js 에 설정해 주세요.')
        })
    }
}
