/**
 * FURSYS Rental - Google Apps Script (GAS) Backend Service
 * 
 * Supports both Korean & English Column Headers for Google Sheets:
 * - Products: 상품ID, 카테고리코드, 카테고리명, 상품명, 모델명, 규격, 이미지URL, 월렌탈료, 소비자가격, 상태, 상품설명
 * - Inquiries: 접수일시, 접수번호, 회사명, 담당자명, 연락처, 이메일, 렌탈유형, 이용기간(개월), 선택상품목록, 총월렌탈료, 추가메모, 첨부파일
 */

// Configuration
var SPREADSHEET_ID = "1afDWmodND6r8ku7zpRWQV6S_E9-GkI_w30ePXxaPA58";
var SHEET_NAME_PRODUCTS = "Products";
var SHEET_NAME_INQUIRIES = "Inquiries";
var ADMIN_EMAIL = "admin@fursysrental.com"; // Replace with notification email
var SLACK_WEBHOOK_URL = ""; // Optional: Add Slack Webhook URL

function getSpreadsheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss && SPREADSHEET_ID) {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  return ss;
}

/**
 * Handle GET Requests (Fetch Products JSON)
 * Supports both Korean & English headers seamlessly.
 */
function doGet(e) {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME_PRODUCTS);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "'Products' 시트를 찾을 수 없습니다. 시트 탭 이름을 'Products'로 설정해 주세요."
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var data = sheet.getDataRange().getValues();
    if (data.length < 2) {
      return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
    }
    
    var headers = data[0].map(function(h) { return String(h).trim(); });
    
    // Header Index Mapping (Supports Korean & English)
    function findIdx(names, defaultIdx) {
      for (var i = 0; i < names.length; i++) {
        var idx = headers.indexOf(names[i]);
        if (idx !== -1) return idx;
      }
      return defaultIdx;
    }
    
    var idxId = findIdx(["상품ID", "ID", "id"], 0);
    var idxCat = findIdx(["카테고리코드", "Category", "category"], 1);
    var idxCatName = findIdx(["카테고리명", "CategoryName", "categoryName"], 2);
    var idxName = findIdx(["상품명", "Name", "name"], 3);
    var idxCode = findIdx(["모델명", "Code", "code"], 4);
    var idxSpec = findIdx(["규격", "Spec", "spec"], 5);
    var idxImg = findIdx(["이미지URL", "Image", "image"], 6);
    var idxFee = findIdx(["월렌탈료", "MonthlyFee", "monthlyFee"], 7);
    var idxPrice = findIdx(["소비자가격", "RetailPrice", "retailPrice"], 8);
    var idxStatus = findIdx(["상태", "Status", "status"], 9);
    var idxDesc = findIdx(["상품설명", "Description", "description"], 10);

    var products = [];
    
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[idxId] && !row[idxName]) continue; // Skip empty rows
      
      var product = {
        id: String(row[idxId] || ""),
        category: String(row[idxCat] || "chair"),
        categoryName: String(row[idxCatName] || "의자"),
        name: String(row[idxName] || ""),
        code: String(row[idxCode] || ""),
        spec: String(row[idxSpec] || ""),
        image: String(row[idxImg] || ""),
        monthlyFee: Number(row[idxFee] || 0),
        retailPrice: Number(row[idxPrice] || 0),
        status: String(row[idxStatus] || "검수 완료"),
        description: String(row[idxDesc] || "")
      };
      products.push(product);
    }
    
    return ContentService.createTextOutput(JSON.stringify(products))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle POST Requests (Inquiry Submission)
 * Appends rows with Korean headers if sheet is empty or newly created.
 */
function doPost(e) {
  try {
    var postData = JSON.parse(e.postData.contents);
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME_INQUIRIES);
    
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME_INQUIRIES);
    }
    
    // If sheet is new or empty, append Korean Header Row
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "접수일시", "접수번호", "회사명", "담당자명", 
        "연락처", "이메일", "렌탈유형", "이용기간(개월)", 
        "선택상품목록", "총월렌탈료", "추가메모", "첨부파일"
      ]);
    }
    
    var timestamp = new Date();
    var inquiryNo = "FR-" + Utilities.formatDate(timestamp, "GMT+9", "yyyyMMddHHmmss");
    var cartItemsSummary = "";
    
    if (postData.cart && Array.isArray(postData.cart)) {
      cartItemsSummary = postData.cart.map(function(item) {
        return item.name + " (" + item.qty + "개 / 월 " + (item.monthlyFee * item.qty).toLocaleString() + "원)";
      }).join("\n");
    }
    
    sheet.appendRow([
      timestamp,
      inquiryNo,
      postData.companyName || "",
      postData.managerName || "",
      postData.phone || "",
      postData.email || "",
      postData.rentalType || "일반 문의",
      postData.duration || 12,
      cartItemsSummary,
      postData.totalMonthlyFee || 0,
      postData.notes || "",
      postData.fileName || "첨부파일 없음"
    ]);
    
    // Notification Email
    if (ADMIN_EMAIL) {
      var emailSubject = "[퍼시스 렌탈] 신규 렌탈 문의 접수 (" + (postData.companyName || "미입력") + ")";
      var emailBody = "신규 렌탈 문의가 접수되었습니다.\n\n" +
        "• 접수번호: " + inquiryNo + "\n" +
        "• 회사명: " + postData.companyName + "\n" +
        "• 담당자: " + postData.managerName + " (" + postData.phone + " / " + postData.email + ")\n" +
        "• 렌탈 유형: " + postData.rentalType + " / 예상 기간: " + postData.duration + "개월\n" +
        "• 예상 월 렌탈료: 월 " + Number(postData.totalMonthlyFee).toLocaleString() + "원 (VAT 별도)\n\n" +
        "선택 상품 목록:\n" + cartItemsSummary + "\n\n" +
        "추가 메모:\n" + (postData.notes || "없음");
        
      MailApp.sendEmail(ADMIN_EMAIL, emailSubject, emailBody);
    }
    
    // Optional Slack Notification
    if (SLACK_WEBHOOK_URL) {
      var payload = {
        text: "🚨 *[퍼시스 렌탈] 신규 문의 접수*\n• *회사명:* " + postData.companyName + " (" + postData.managerName + "님)\n• *연락처:* " + postData.phone + " / " + postData.email + "\n• *예상 월 렌탈료:* 월 " + Number(postData.totalMonthlyFee).toLocaleString() + "원"
      };
      UrlFetchApp.fetch(SLACK_WEBHOOK_URL, {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify(payload)
      });
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      inquiryNo: inquiryNo,
      message: "문의가 정상 접수되었습니다."
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
