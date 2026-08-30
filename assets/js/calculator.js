// Lux Metal — Instant Quote Cost Calculator (Vanilla JS)
// Legitimate client-side interactivity: computes an estimate from a small
// local price table mirroring PRODUCTS' id/basePricePerUnit/unit fields only.
// This is NOT content rendering — all catalog content already lives in the
// static HTML of san-pham.html.
(function () {
  var CALC_PRODUCTS = [
    { id: 'tam-inox-song-nuoc', name: 'Tấm Inox Sóng Nước 3D (Water Ripple Sheet)', basePricePerUnit: 680000, unit: 'm²' },
    { id: 'vach-ngan-cnc-pvd-gold', name: 'Vách Ngăn Inox CNC Mạ PVD Vàng Kim', basePricePerUnit: 1850000, unit: 'm²' },
    { id: 'nep-inox-chu-t-u-v', name: 'Bộ Nẹp Inox Trang Trí Kiến Trúc (T, U, V, L)', basePricePerUnit: 75000, unit: 'Mét dài' },
    { id: 'tam-inox-bong-guong-8k', name: 'Tấm Inox Mirror 8K Mạ PVD Vàng & Đen', basePricePerUnit: 520000, unit: 'm²' },
    { id: 'gia-cong-laser-fiber-cnc', name: 'Dịch Vụ Cắt Laser Fiber & Chấn Gấp CNC Inox', basePricePerUnit: 150000, unit: 'Bộ' }
  ];

  document.addEventListener('DOMContentLoaded', function () {
    var calcProductSelect = document.getElementById('calc-product-select');
    var calcGradeSelect = document.getElementById('calc-grade-select');
    var calcQuantityInput = document.getElementById('calc-quantity-input');
    var calcPvdSelect = document.getElementById('calc-pvd-select');
    var calcUnitPriceEl = document.getElementById('calc-total-price');
    var calcBreakdownText = document.getElementById('calc-breakdown-text');
    var calcUnitLabel = document.getElementById('calc-unit-label');
    var calcSendZaloBtn = document.getElementById('calc-send-zalo-btn');

    if (!calcProductSelect || !calcQuantityInput || !calcUnitPriceEl) return;

    function update() {
      var productId = calcProductSelect.value;
      var grade = calcGradeSelect ? calcGradeSelect.value : '304';
      var quantity = parseFloat(calcQuantityInput.value) || 1;
      var pvdMult = parseFloat(calcPvdSelect ? calcPvdSelect.value : '1.0');

      var product = null;
      for (var i = 0; i < CALC_PRODUCTS.length; i++) {
        if (CALC_PRODUCTS[i].id === productId) { product = CALC_PRODUCTS[i]; break; }
      }
      var basePrice = product ? product.basePricePerUnit : 680000;
      var unit = product ? product.unit : 'm²';

      if (calcUnitLabel) calcUnitLabel.textContent = unit;

      var gradeMult = grade === '304' ? 1.0 : 0.78;
      var finalPricePerUnit = Math.round(basePrice * gradeMult * pvdMult);
      var totalPrice = Math.round(finalPricePerUnit * quantity);

      var formattedTotal = new Intl.NumberFormat('vi-VN').format(totalPrice) + ' VNĐ';
      var formattedPerUnit = new Intl.NumberFormat('vi-VN').format(finalPricePerUnit) + ' VNĐ / ' + unit;

      calcUnitPriceEl.textContent = formattedTotal;
      if (calcBreakdownText) {
        calcBreakdownText.textContent = 'Đơn giá vật tư ước tính: ' + formattedPerUnit + ' (Mác INOX ' + grade + ')';
      }
      if (calcSendZaloBtn) {
        var textQuery = encodeURIComponent(
          'Chào Lux Metal, tôi muốn Nhận báo giá: ' + (product ? product.name : 'Vật tư Inox') +
          ', Chủng loại: Inox ' + grade + ', Khối lượng: ' + quantity + ' ' + unit +
          ', Tổng ước tính: ' + formattedTotal + '.'
        );
        calcSendZaloBtn.href = 'https://zalo.me/0900000000?text=' + textQuery;
      }
    }

    calcProductSelect.addEventListener('change', update);
    if (calcGradeSelect) calcGradeSelect.addEventListener('change', update);
    calcQuantityInput.addEventListener('input', update);
    if (calcPvdSelect) calcPvdSelect.addEventListener('change', update);

    update();
  });
})();
