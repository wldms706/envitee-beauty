// =============================================
// 이 코드를 구글시트 > 확장 프로그램 > Apps Script에 붙여넣으세요
// =============================================

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  // 첫 행이 비어있으면 헤더 추가
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['접수일시', '이름', '연락처', '상호명', '문제점']);
  }

  sheet.appendRow([
    new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
    data.name,
    data.phone,
    data.shop,
    data.problem
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
