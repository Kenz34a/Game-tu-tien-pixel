# Máy chủ Render + Neon và Thiên Chủ quản trị

Render chạy website, game và API Node.js; Neon lưu PostgreSQL. Neon không chạy game. Bạn chưa tạo dịch vụ nên các bước dưới đây cần thực hiện trong tài khoản của bạn.

## 1. Chạy trước trên máy

Cài Node.js 22.13 trở lên, tải repository rồi chạy:

```sh
npm ci --include=dev --include=optional
npm run play
```

Mở địa chỉ được terminal in ra. Bản này vẫn dùng SQLite trong `.wrangler/state` và không cần Neon. Để bật admin, tạo `.dev.vars` ở gốc dự án:

```dotenv
ADMIN_PASSWORD="THAY_BANG_MAT_KHAU_RIENG_DAI_16_DEN_256_KY_TU"
```

Đổi giá trị mẫu thành mật khẩu mạnh, giữ file trên máy và không commit. Khởi động lại game rồi mở `/admin`. Người chơi thường không được quyền chỉnh dữ liệu.

## 2. Tạo Neon

1. Vào https://console.neon.tech và tạo project, chọn PostgreSQL 17 cùng vùng gần dịch vụ Render dự định tạo.
2. Trong **Connect**, chọn database/role của project và bật **Connection pooling**.
3. Sao chép connection string có `sslmode=require`. Lưu trực tiếp vào biến môi trường Render ở bước tiếp theo, không đưa vào mã nguồn, ảnh chụp hoặc chat.

Không tắt SSL cho Neon. Máy chủ xác minh chứng chỉ TLS. PostgreSQL trên localhost có thể dùng `sslmode=disable` để kiểm thử.

## 3. Tạo Render

1. Vào https://dashboard.render.com, chọn **New → Blueprint** và kết nối repository `Kenz34a/Game-tu-tien-pixel`, nhánh `main`.
2. Render đọc `render.yaml`: dịch vụ Node, build `npm ci ... && npm run check && npm run build:render`, chạy `npm run start:neon`, health check `/api/health`.
3. Nhập `DATABASE_URL` bằng connection string Neon và `ADMIN_PASSWORD` bằng mật khẩu riêng dài 16–256 ký tự. Blueprint chọn gói Starter có phí; kiểm tra giá trước khi tạo. Không cần persistent disk vì tiến trình lưu trên Neon.
4. Tạo dịch vụ và chờ deploy. Startup tự áp dụng schema PostgreSQL trong transaction; khởi động lại không xóa dữ liệu.
5. Mở URL Render, kiểm tra `/api/health`, tạo nhân vật và chơi. Mở `<URL_RENDER>/admin` để đăng nhập Thiên Chủ.

Render tự cung cấp `RENDER_EXTERNAL_URL`; máy chủ dùng biến này để kiểm tra nguồn yêu cầu và đặt cookie Secure khi HTTPS được Render xử lý. Nếu dùng domain riêng, đặt `RENDER_EXTERNAL_URL` đúng origin HTTPS của domain đó trong cấu hình dịch vụ.

Neon mới bắt đầu với dữ liệu trống. Dữ liệu SQLite đang chơi trên máy không tự chuyển sang Neon; giữ bản sao `.wrangler/state` trước khi chuyển. Không dùng việc đổi DATABASE_URL để thay thế một thao tác nhập dữ liệu.

## 4. Chức năng admin

- Tìm nhân vật, chỉnh tên, môn phái, cảnh giới, tầng, tu vi, tiền, đan dược, map, bí kíp, linh sủng và tọa kỵ.
- Cấp trang bị theo vị trí, phẩm chất và cấp; hồi sinh lực/chân nguyên.
- Khóa/mở tài khoản, cấm/mở chat theo số giờ.
- Thông báo toàn máy chủ, bảo trì và hệ số tu vi 0.1–10.
- Mỗi thay đổi yêu cầu lý do và ghi nhật ký trước/sau. Nhân vật đang xử lý hành động được khóa để tránh sửa trùng.

Phiên quản trị hết hạn sau 8 giờ, cookie HttpOnly, chỉ lưu hash token trong database. Đổi ADMIN_PASSWORD và restart dịch vụ sẽ vô hiệu hóa phiên cũ. API quản trị xác thực quyền trên máy chủ, không dựa vào nút ẩn trong giao diện.

## 5. Kiểm tra và xử lý lỗi

- Build không thành công: mở Render **Logs** và kiểm tra phiên bản Node, npm install và lỗi build. Blueprint Node không dùng Dockerfile SQLite cũ.
- Startup báo DATABASE_URL: kiểm tra biến đã lưu và chọn đúng pooled URL Neon. Không in URL vào log.
- Admin báo chưa cấu hình: kiểm tra mật khẩu 16–256 ký tự rồi restart.
- Game báo bảo trì: đăng nhập admin để tắt bảo trì trong tab Máy chủ.
- Neon mất kết nối: kiểm tra trạng thái Neon và URL/vùng; dữ liệu đã commit vẫn nằm trong Neon.

Để kiểm thử PostgreSQL riêng (không dùng database người chơi): build bằng `npm run build:render`, đặt DATABASE_URL cho database kiểm thử rồi chạy `node tests/postgres-admin-smoke.mjs`. Bộ kiểm thử tạo nhân vật và thay đổi cấu hình máy chủ, vì vậy chỉ dùng database kiểm thử.
