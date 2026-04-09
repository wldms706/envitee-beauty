// ========================================
// 얼리버드 신청 핸들러
// - 실시간 카운트 표시
// - 30명 마감 시 자동 폼 닫기
// ========================================

// ⬇️ 구글 Apps Script 배포 URL을 여기에 붙여넣으세요

const EARLYBIRD_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzPPsWvjMfjoyBaLbnTjX6_bmvlNK9if0ZAhl76eytGxUC6BD_VYpbJ0gY8dDfemppv/exec';

const EB_LIMIT = 30;

// ── DOM 요소 ──
function getEls() {
  return {
    section: document.getElementById('earlybird'),
    form: document.getElementById('earlybird-form'),
    remaining: document.getElementById('earlybird-remaining'),
    count: document.getElementById('earlybird-count'),
    progress: document.getElementById('earlybird-progress'),
    formWrap: document.getElementById('earlybird-form-wrap'),
    closedWrap: document.getElementById('earlybird-closed'),
  };
}

// ── 카운트 업데이트 UI ──
function updateCountUI(count) {
  const els = getEls();
  const remaining = Math.max(0, EB_LIMIT - count);
  const percent = Math.min(100, (count / EB_LIMIT) * 100);

  if (els.remaining) els.remaining.textContent = remaining;
  if (els.count) els.count.textContent = count;
  if (els.progress) els.progress.style.width = percent + '%';

  // 긴급도에 따라 색상 변경
  if (els.remaining) {
    if (remaining <= 5) {
      els.remaining.classList.add('urgent');
    } else if (remaining <= 10) {
      els.remaining.classList.add('warning');
    }
  }

  // 마감 처리
  if (remaining <= 0) {
    showClosed();
  }
}

// ── 마감 상태 표시 ──
function showClosed() {
  const els = getEls();
  if (els.formWrap) els.formWrap.style.display = 'none';
  if (els.closedWrap) els.closedWrap.style.display = 'block';
}

// ── 서버에서 카운트 가져오기 ──
async function fetchCount() {
  if (EARLYBIRD_SHEET_URL === 'YOUR_EARLYBIRD_APPS_SCRIPT_URL') {
    // 아직 URL 미설정 → 데모 모드 (카운트 0)
    updateCountUI(0);
    return 0;
  }

  try {
    const res = await fetch(EARLYBIRD_SHEET_URL);
    const data = await res.json();
    updateCountUI(data.count || 0);
    return data.count || 0;
  } catch (err) {
    console.warn('얼리버드 카운트 조회 실패:', err);
    return 0;
  }
}

// ── 신청 제출 ──
async function submitEarlybird(formData) {
  const params = new URLSearchParams({
    action: 'submit',
    name: formData.name,
    phone: formData.phone,
    kakao: formData.kakao,
    insta: formData.insta,
    depositor: formData.depositor,
  });

  const url = EARLYBIRD_SHEET_URL + '?' + params.toString();

  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('응답 읽기 실패:', err);
    return { result: 'success' };
  }
}

// ── 초기화 ──
document.addEventListener('DOMContentLoaded', () => {
  const els = getEls();

  // 1. 페이지 로드 시 카운트 가져오기
  fetchCount();

  // 2. 30초마다 카운트 자동 새로고침 (라이브 중 실시간 반영)
  setInterval(fetchCount, 30000);

  // 3. 폼 제출 처리
  if (els.form) {
    els.form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('eb-name').value.trim();
      const phone = document.getElementById('eb-phone').value.trim();
      const kakao = document.getElementById('eb-kakao').value.trim();
      const insta = document.getElementById('eb-insta').value.trim();
      const nda = document.getElementById('eb-nda').checked;
      const privacy = document.getElementById('eb-privacy').checked;
      const depositor = document.getElementById('eb-depositor').value.trim();

      if (!name || !phone || !kakao || !insta || !depositor) {
        alert('모든 필수 항목을 입력해주세요.');
        return;
      }

      if (!nda || !privacy) {
        alert('비밀 유지 서약과 개인정보 수집 동의에 체크해주세요.');
        return;
      }

      // 버튼 로딩
      const btn = els.form.querySelector('.earlybird-submit');
      const originalText = btn.textContent;
      btn.textContent = '신청 중...';
      btn.disabled = true;

      const result = await submitEarlybird({ name, phone, kakao, insta, depositor });

      if (result.result === 'closed') {
        // 이미 마감
        updateCountUI(result.count || EB_LIMIT);
        showClosed();
        return;
      }

      // Meta Pixel 이벤트
      if (typeof fbq === 'function') {
        fbq('track', 'Lead', {
          content_name: '얼리버드 특가 신청',
          content_category: 'earlybird',
        });
      }

      // 성공 UI
      if (els.formWrap) {
        els.formWrap.innerHTML = `
          <div class="earlybird-success">
            <div class="earlybird-success-icon">✓</div>
            <h3>${name}님, 신청이 완료되었습니다!</h3>
            <p>입금 확인 후 순차적으로 단톡방 입장 안내 도와드리겠습니다.</p>
          </div>
        `;
      }

      // 카운트 업데이트
      if (result.count) {
        updateCountUI(result.count);
      } else {
        fetchCount();
      }
    });
  }
});
