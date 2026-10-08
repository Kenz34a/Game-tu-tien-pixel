# Chợ, giftcode và nạp Tiên ngọc

## Chợ đạo hữu

Mở nút **Chợ** trong game để mua trang bị hoặc rao đồ chưa trang bị. Có tìm theo tên, lọc tin rao của bạn, hủy rao và lịch sử giao dịch. Giá từ 1 đến 100.000.000, chọn một trong 5 loại tiền game. Mua bán tự chuyển tiền và quyền sở hữu trang bị; hai người mua cùng lúc chỉ một người thắng. Chợ không bán vật phẩm bằng tiền thật.

## Giftcode

Vào `/admin` → **Giftcode & Nạp tiền**, điền lý do thao tác, tạo mã 4–40 ký tự (chữ, số, `_`, `-`), số lượt tối đa, hạn dùng và phần thưởng. Có thể tặng tiền game, đan dược hoặc nguyên liệu. Mã tự chuẩn hóa thành chữ hoa. Bấm **Đóng mã** để ngừng nhận. Mã cũ không được tái sử dụng để tránh nhận lại.

Người chơi mở **Giftcode** → nhập mã → **Nhận quà**. Mỗi nhân vật nhận một lần; lượt nhận và phần thưởng được ghi cùng transaction, kể cả khi nhiều người tranh lượt cuối.

## Gói nạp

| Giá VND | Tiên ngọc |
|---|---:|
| 10.000 đ | 100 |
| 50.000 đ | 550 |
| 100.000 đ | 1.200 |

Gói được định nghĩa trên máy chủ trong `lib/rpg/commerce.ts`; sửa giá ở trình duyệt không thay đổi số tiền/ngọc. Tạo yêu cầu, quay lại từ trang thanh toán hoặc gửi ảnh chuyển khoản không tự cộng ngọc.

## Chuyển khoản, admin duyệt

1. Vào `/admin` → **Giftcode & Nạp tiền**, nhập lý do.
2. Điền ngân hàng, số tài khoản, chủ tài khoản, hướng dẫn; bật **Mở chuyển khoản thủ công** và lưu.
3. Người chơi vào **Nạp ngọc**, chọn gói/chuyển khoản, tạo yêu cầu. Chuyển đúng số tiền, dùng nội dung `VTK <mã yêu cầu>` được hiện trong game.
4. Admin đối chiếu khoản tiền thực nhận trong ngân hàng. Nhập mã giao dịch ngân hàng thật rồi bấm **Đã nhận tiền · cộng ngọc**. Nếu không đúng, bấm **Từ chối** cùng lý do.

Mã giao dịch ngân hàng không dùng cho hai yêu cầu. Duyệt lại cùng yêu cầu không cộng lần hai. Duyệt chuyển khoản chỉ có quyền admin; yêu cầu payOS nhận tự động và không có nút duyệt tay.

## payOS tự động trên Render

1. Đăng ký/đăng nhập https://payos.vn, kết nối tài khoản ngân hàng và tạo kênh thanh toán theo hướng dẫn payOS.
2. Lấy **Client ID**, **API Key**, **Checksum Key** của kênh.
3. Trong Render → dịch vụ game → **Environment**, thêm:

| Key | Value |
|---|---|
| `PAYOS_CLIENT_ID` | Client ID của kênh |
| `PAYOS_API_KEY` | API Key của kênh |
| `PAYOS_CHECKSUM_KEY` | Checksum Key của kênh |

Nhập trực tiếp, không thêm dấu ngoặc kép. Không đưa các khóa lên GitHub hoặc vào chat. Lưu và deploy lại. Game chỉ mở tùy chọn payOS khi đủ cả ba khóa.

4. Trong cấu hình kênh payOS, đặt webhook: `https://TEN-DICH-VU.onrender.com/api/payments/webhook` và xác nhận webhook. Thay domain bằng URL Render thật. Nếu dùng domain riêng, đặt `RENDER_EXTERNAL_URL` đúng origin HTTPS của domain đó trên Render.
5. Người chơi chọn payOS, tạo yêu cầu rồi bấm **Thanh toán payOS** ở yêu cầu đang chờ. Game mở checkout payOS để quét QR/chuyển khoản.
6. Webhook xác minh chữ ký bằng SDK chính thức, đối chiếu mã yêu cầu, số tiền, VND và payment link trước khi cộng ngọc. Webhook gửi lại không cộng trùng. Lịch sử và nhật ký admin lưu kết quả.

Cần HTTPS để tạo checkout payOS. Trên máy vẫn dùng chuyển khoản thủ công để thử; dùng dữ liệu kiểm thử, không cấu hình tài khoản ngân hàng thật chỉ để test.

Các khóa tài khoản, kênh webhook và giao dịch payOS thật phải được thiết lập trong tài khoản của chủ game. Bộ kiểm thử dùng khóa và giao dịch giả, chưa thực hiện thu tiền thật.

## Cập nhật schema

Render Node/Neon tự áp dụng các file `postgres/*.sql` chưa chạy khi khởi động; migration mới không xóa nhân vật cũ. Bản chạy máy dùng `npm run play`, tự áp dụng D1 migration `0004_commerce.sql`. Docker SQLite cần deploy lại để startup áp dụng migration.
