// =============================================
// 얼리버드 신청폼용 Google Apps Script
//
// [설정 방법]
// 1. 새 구글시트를 만듭니다 (예: "얼리버드 신청")
// 2. 확장 프로그램 > Apps Script 클릭
// 3. 아래 코드를 전부 붙여넣기
// 4. 배포 > 새 배포 > 웹 앱 선택
//    - 실행 주체: 본인
//    - 액세스 권한: 모든 사용자
// 5. 배포 후 나오는 URL을 복사
// 6. js/earlybird.js 파일의 EARLYBIRD_SHEET_URL에 붙여넣기
// =============================================

var MAX_COUNT = 30; // 얼리버드 최대 인원

function getCount(sheet) {
  var lastRow = sheet.getLastRow();
  return lastRow > 1 ? lastRow - 1 : 0; // 헤더 제외
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var action = e.parameter.action;

  // ── 신청 처리 ──
  if (action === 'submit') {
    var lock = LockService.getScriptLock();
    lock.waitLock(10000); // 동시 접속 방지

    try {
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(['접수일시', '번호', '성함', '연락처', '카카오톡ID', '인스타ID', '입금자명']);
      }

      var count = getCount(sheet);

      if (count >= MAX_COUNT) {
        return jsonResponse({ result: 'closed', count: count, limit: MAX_COUNT });
      }

      var name = e.parameter.name || '';
      var phone = e.parameter.phone || '';
      var kakao = e.parameter.kakao || '';
      var insta = e.parameter.insta || '';
      var depositor = e.parameter.depositor || '';

      sheet.appendRow([
        new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
        count + 1,
        name,
        phone,
        kakao,
        insta,
        depositor
      ]);

      return jsonResponse({ result: 'success', count: count + 1, limit: MAX_COUNT });
    } finally {
      lock.releaseLock();
    }
  }

  // ── 기본: 현재 신청 수 반환 ──
  var count = getCount(sheet);
  return jsonResponse({ count: count, limit: MAX_COUNT });
}
