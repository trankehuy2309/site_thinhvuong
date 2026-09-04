# Thịnh Vượng Metal - Website

Website tĩnh HTML/CSS thuần (không cần build) cho Thịnh Vượng Metal - Nhà Máy INOX Trang Trí & Gia Công Mạ PVD.

## Cấu trúc trang (theo navigation)

- `index.html` — Trang chủ
- `san-pham.html` — Sản phẩm (danh sách, lọc theo danh mục)
- `san-pham/*.html` — Trang chi tiết riêng cho từng sản phẩm
- `gioi-thieu.html` — Giới thiệu
- `lien-he.html` — Liên hệ

## Tài nguyên dùng chung

- `assets/js/site.js` — menu mobile, filter sản phẩm, slider ảnh, cuộn lên đầu trang

> Không dùng form báo giá. Mọi nút "Báo giá" / liên hệ đều trỏ thẳng tới Zalo `https://zalo.me/0977304316`.
- `src/index.css` — style tuỳ chỉnh (dùng cùng Tailwind CDN đã include trong mỗi trang)
- `src/assets/images/` — hình ảnh

## Chạy thử

Mở trực tiếp bằng extension **Go Live** (VSCode Live Server) trên `index.html`, hoặc dùng server tĩnh bất kỳ
