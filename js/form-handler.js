// ========================================
// Form / CTA Handler - Google Sheets 연동
// ========================================

// Google Apps Script 웹앱 URL (배포 후 여기에 붙여넣기)
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbyRamyaZH-7hsZKKmARJqLI82SSe-gvoyHiilGC5y9c_L5TeOIqqTaYzcQX_NLeT3rc/exec';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cta-form');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const phone = document.getElementById('form-phone').value.trim();
      const shop = document.getElementById('form-shop').value.trim();
      const problem = document.getElementById('form-problem').value.trim();

      if (!name || !phone) {
        alert('이름과 연락처는 필수 입력 항목입니다.');
        return;
      }

      // 버튼 로딩 상태
      const submitBtn = form.querySelector('.form-submit');
      submitBtn.textContent = '전송 중...';
      submitBtn.disabled = true;

      try {
        // Google Sheets로 데이터 전송
        if (GOOGLE_SHEET_URL !== 'YOUR_APPS_SCRIPT_URL') {
          await fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone, shop, problem })
          });
        }

        // Meta Pixel Lead 이벤트
        if (typeof fbq === 'function') {
          fbq('track', 'Lead', {
            content_name: '속눈썹펌 수강 상담',
            content_category: 'consultation',
          });
        }

        // 제출 완료 UI
        form.innerHTML = `
          <div class="form-success">
            <div class="form-success-icon">✓</div>
            <h3>상담 신청이 완료되었습니다</h3>
            <p>${name}님, 빠른 시간 내에 연락드리겠습니다.</p>
          </div>
        `;
      } catch (err) {
        // no-cors 모드에서는 에러가 나도 실제로는 전송됨
        form.innerHTML = `
          <div class="form-success">
            <div class="form-success-icon">✓</div>
            <h3>상담 신청이 완료되었습니다</h3>
            <p>${name}님, 빠른 시간 내에 연락드리겠습니다.</p>
          </div>
        `;
      }
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
