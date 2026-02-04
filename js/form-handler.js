// ========================================
// Form / CTA Button Handler
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  const ctaButton = document.getElementById('cta-button');

  if (ctaButton) {
    ctaButton.addEventListener('click', (e) => {
      e.preventDefault();

      // 옵션 1: 카카오톡 오픈채팅 링크로 이동
      // window.open('https://open.kakao.com/your-link', '_blank');

      // 옵션 2: 인스타그램 DM으로 이동
      // window.open('https://www.instagram.com/your-account/', '_blank');

      // 옵션 3: 기본 알림 (실제 링크 연결 전 테스트용)
      alert('상담 신청 링크를 연결해주세요!\n\n카카오톡 오픈채팅 또는 인스타그램 DM 링크를 js/form-handler.js 파일에서 설정할 수 있습니다.');
    });
  }

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});
