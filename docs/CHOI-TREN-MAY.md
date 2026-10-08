# Chạy trên máy trước, rồi chơi chung

## Windows: tải và mở game

1. Cài **Node.js LTS phiên bản 22.13 trở lên** từ https://nodejs.org. Sau khi cài, mở lại cửa sổ terminal nếu đang dùng.
2. Trên https://github.com/Kenz34a/Game-tu-tien-pixel chọn **Code → Download ZIP**, rồi giải nén vào một thư mục bình thường, ví dụ `C:\Games\Game-tu-tien-pixel`. Chạy từ thư mục đã giải nén, không chạy trong ZIP. Không cần Docker, Render, tài khoản Cloudflare hay Git.
3. Bấm đúp **CHAY-GAME-WINDOWS.cmd**. Lần đầu cần Internet để tải thư viện. Chương trình cài thư viện nếu thiếu, kiểm tra, build và cập nhật cơ sở dữ liệu; dừng nếu có lỗi.
4. Khi terminal báo máy chủ sẵn sàng, mở **http://localhost:8787** trong Chrome hoặc Edge, nhập đạo danh và vào game. Giữ cửa sổ terminal mở. Ctrl+C để tắt máy chủ.

Có thể dùng terminal trong thư mục game với lệnh `npm run play`; macOS/Linux cũng dùng lệnh này. Mỗi lần chạy sẽ build mã mới, giữ dữ liệu nhân vật cũ. Trước khi cập nhật mã, tắt máy chủ; nếu đã cài thư viện và bản cập nhật thay đổi package-lock.json, chạy `npm run install:ci` rồi chạy lại game.

## Cho bạn bè chơi cùng Wi-Fi/LAN

Chỉ **một máy chạy máy chủ**. Các người chơi khác không cần tải game hoặc cài Node.js.

- Sau khi khởi động, terminal in địa chỉ IP nội bộ, ví dụ `http://192.168.1.10:8787`. Điện thoại hoặc máy khác cùng Wi-Fi mở địa chỉ này. `localhost` trên máy bạn bè trỏ tới chính máy của họ, nên phải dùng IP máy chủ.
- Nếu Windows Firewall hỏi, cho phép Node.js trên **mạng riêng (Private)** mà bạn dùng để thử. Nếu không kết nối được, kiểm tra mạng đang là Private, cho phép TCP 8787 trên mạng riêng và kiểm tra router có cô lập các thiết bị/Guest Wi-Fi không. Không tắt toàn bộ firewall.
- Máy chủ cần luôn bật; ngủ máy hoặc đóng terminal sẽ làm mọi người mất kết nối. Nếu có nhiều IP, chọn IP Wi-Fi/Ethernet cùng mạng với bạn bè, không chọn IP VPN.
- Mỗi trình duyệt/thiết bị có nhân vật riêng qua cookie. Có thể dùng cửa sổ thường và ẩn danh để thử hai người. Đạo danh chưa phải tài khoản đăng nhập có mật khẩu; xóa cookie hoặc đóng phiên ẩn danh có thể mất khả năng truy cập nhân vật. Dùng cùng một địa chỉ khi chơi để giữ cookie.
- Trò chuyện, tổ đội, giao dịch và bảng xếp hạng dùng chung máy chủ. Một số trận đánh thường/phụ bản cá nhân vẫn có tiến độ riêng; boss thế giới và cổ cảnh tổ đội là nội dung hợp sức.

Dữ liệu máy chủ nằm trong **.wrangler/state**. Tắt máy chủ trước khi sao lưu cả thư mục này. Không xóa thư mục để cập nhật mã, và không đưa cơ sở dữ liệu chứa người chơi lên GitHub.

## Người chơi ở nơi khác

IP `192.168.x.x`/`10.x.x.x` chỉ dùng trong mạng nội bộ. Để thử từ xa, có thể dùng mạng riêng VPN có hỗ trợ kết nối thiết bị, hoặc đưa **một máy chủ chung** lên VPS/Render và cấp địa chỉ HTTPS. Repo đã có Dockerfile và render.yaml; máy chủ cần ổ lưu trữ bền vững để giữ nhân vật. Không cần đưa bản game đang thử lên Render ngay.

Trước khi phát hành công khai cần bổ sung đăng nhập/khôi phục tài khoản và kiểm tra tải theo số người chơi dự kiến. Bản chạy trên máy phù hợp thử nhóm nhỏ; chưa có kiểm chứng về hàng trăm/hàng nghìn người đồng thời. Không mở thẳng cổng máy cá nhân ra Internet cho bản thử này.
