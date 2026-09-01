/**
 * Nhận dữ liệu form báo giá / liên hệ từ website Thịnh Vượng Metal và ghi vào Google Sheet.
 * Dán code này vào: Google Sheet -> Extensions -> Apps Script.
 * Sau đó Deploy -> New deployment -> Web app (Execute as: Me, Access: Anyone).
 */

// Để trống nếu script được gắn trực tiếp vào Sheet (khuyến nghị).
// Nếu tạo script rời, điền ID của Sheet vào đây.
var SPREADSHEET_ID = '';

// Tên tab (sheet) chứa toàn bộ yêu cầu.
var SHEET_NAME = 'Bao gia';

// Thứ tự cột ưu tiên hiển thị. Cột lạ sẽ được thêm tự động vào cuối.
var PREFERRED_COLUMNS = [
  'Thời gian',
  'Họ và tên',
  'Số điện thoại / Zalo',
  'Sản phẩm / Hạng mục quan tâm',
  'Chi tiết yêu cầu & Kích thước',
  'Nguồn form',
  'Trang'
];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var ss = SPREADSHEET_ID
      ? SpreadsheetApp.openById(SPREADSHEET_ID)
      : SpreadsheetApp.getActiveSpreadsheet();

    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    // Lấy hàng tiêu đề hiện có
    var headers = [];
    if (sheet.getLastColumn() > 0) {
      headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].filter(String);
    }

    // Khởi tạo tiêu đề nếu sheet trống
    if (headers.length === 0) {
      headers = PREFERRED_COLUMNS.slice();
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
      sheet.setFrozenRows(1);
      var pIdx = headers.indexOf('Số điện thoại / Zalo');
      if (pIdx !== -1) sheet.getRange(1, pIdx + 1, sheet.getMaxRows(), 1).setNumberFormat('@');
    }

    // Thêm cột mới cho các key chưa có trong tiêu đề
    Object.keys(data).forEach(function (key) {
      if (headers.indexOf(key) === -1) {
        headers.push(key);
        sheet.getRange(1, headers.length).setValue(key).setFontWeight('bold');
      }
    });

    // Ghép 1 dòng theo đúng thứ tự tiêu đề
    var row = headers.map(function (h) {
      return data[h] !== undefined ? data[h] : '';
    });
    sheet.appendRow(row);

    // Giữ nguyên số 0 đầu của số điện thoại: ép ô này về định dạng văn bản
    var phoneIdx = headers.indexOf('Số điện thoại / Zalo');
    if (phoneIdx !== -1) {
      var phoneCell = sheet.getRange(sheet.getLastRow(), phoneIdx + 1);
      phoneCell.setNumberFormat('@');
      phoneCell.setValue(String(data['Số điện thoại / Zalo'] || ''));
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Cho phép mở URL bằng trình duyệt để kiểm tra deployment còn sống.
function doGet() {
  return ContentService
    .createTextOutput('Thinh Vuong Metal form endpoint - OK')
    .setMimeType(ContentService.MimeType.TEXT);
}
