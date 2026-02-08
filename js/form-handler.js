// ========================================
// Form / CTA Handler
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cta-form');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const phone = document.getElementById('form-phone').value.trim();
      const shop = document.getElementById('form-shop').value.trim();
      const problem = document.getElementById('form-problem').value.trim();

      if (!name || !phone) {
        alert('이름과 연락처는 필수 입력 항목입니다.');
        return;
      }

      // Meta Pixel Lead 이벤트 (픽셀 설치 후 활성화)
      // fbq('track', 'Lead', {
      //   content_name: '속눈썹펌 수강 상담',
      //   content_category: 'consultation',
      // });

      // 폼 데이터 (추후 백엔드 연동 시 사용)
      const formData = { name, phone, shop, problem };
      console.log('상담 신청 데이터:', formData);

      // 제출 완료 UI
      form.innerHTML = `
        <div class="form-success">
          <div class="form-success-icon">✓</div>
          <h3>상담 신청이 완료되었습니다</h3>
          <p>${name}님, 빠른 시간 내에 연락드리겠습니다.</p>
        </div>
      `;
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
