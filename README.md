# Mondō — JLPT N1 PWA

Ứng dụng quiz HTML đã được đóng gói thành Progressive Web App (PWA). Dữ liệu học vẫn lưu localStorage; GitHub Gist sync hiện có trong app vẫn hoạt động khi người dùng cấu hình.

## Chạy thử local

Service Worker không chạy ổn định với `file://`, nên dùng web server:

```bash
python3 -m http.server 8080
```

Mở `http://localhost:8080` trên trình duyệt.

## Deploy GitHub Pages

1. Tạo repository mới trên GitHub.
2. Upload toàn bộ file/thư mục này, đặc biệt `index.html`, `manifest.webmanifest`, `sw.js`, `icons/`.
3. Vào **Settings → Pages**.
4. Ở **Build and deployment**, chọn **Deploy from a branch**.
5. Chọn branch `main`, folder `/ (root)`, rồi Save.
6. Sau khi GitHub Pages deploy xong, mở URL Pages bằng HTTPS.
7. Trên Android Chrome, chọn **Add to Home screen / Cài đặt ứng dụng**.

## Lưu ý

PWA cần HTTPS để Service Worker hoạt động; GitHub Pages cung cấp HTTPS. Không cần server/backend cho phần quiz này.
