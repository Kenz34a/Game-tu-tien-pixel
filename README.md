# Vân Thiên Ký · Game tu tiên pixel trên web

Toàn bộ bản game pháp thân và tổ đội được chuyển từ Sites sang repository **Kenz34a/Game-tu-tien-pixel**. Mã nguồn, hình ảnh gốc, font và giấy phép, schema và migration đều có trong repository. Bản này chạy độc lập trong Cloud Environment hoặc GitHub Codespaces, không cần Sites, dịch vụ connector hay đăng nhập ChatGPT.

## Chạy trong cloud environment

Cần Node.js 22.13 trở lên (khuyến nghị Node 22 LTS) và Python 3 nếu nhập dữ liệu cũ.

```sh
npm run install:ci
npm run check
npm run build
npm run db:migrate
npm start
```

Mở **cổng 8787** trong mục Ports của môi trường. Máy chủ lắng nghe `0.0.0.0`; nếu chạy trên máy cá nhân, mở `http://localhost:8787`. API và các tài nguyên hình ảnh được phục vụ cùng origin. Nhiều người cùng truy cập một máy chủ dùng chung cơ sở dữ liệu; mỗi trình duyệt có phiên nhân vật riêng qua cookie HttpOnly.

### GitHub Codespaces

Mở [repository](https://github.com/Kenz34a/Game-tu-tien-pixel), chọn **Code → Codespaces → Create codespace on main**. Cấu hình `.devcontainer/devcontainer.json` tự cài dependencies, build, áp dụng migration, khởi động game và mở cổng 8787. Codespaces có thể tính phí theo gói GitHub của bạn.

Cổng Codespaces mặc định riêng tư. Nếu muốn người khác chơi, đổi Visibility của cổng 8787 sang Public trong mục Ports. Codespaces phù hợp phát triển và thử nghiệm; máy chủ dừng khi codespace ngủ hoặc bị tắt. Đây chưa phải hosting MMO hoạt động liên tục.

### Phát triển

```sh
npm run db:migrate
npm run dev
```

Mở cổng 5173. Sau khi sửa schema, dùng `npm run db:generate`, xem migration rồi chạy `npm run db:migrate`. Không sửa migration đã áp dụng. Wrangler ghi nhận các migration trong bảng `d1_migrations`, nên lệnh migrate có thể chạy lại an toàn.

## Dữ liệu và khôi phục nhân vật

Cơ sở dữ liệu SQLite nằm trong `.wrangler/state`. Tiến trình giữ được sau khi dừng và chạy lại máy chủ trong cùng workspace; cần sao lưu nếu xóa cloud environment. Không commit `.wrangler`, `.migration`, dữ liệu tài khoản hay các mã khôi phục lên repository công khai.

Bản dữ liệu từ Sites được lưu riêng trong cloud environment hiện tại tại `.migration/sites-live-snapshot.json`. Khi tạo môi trường khác, chuyển file này riêng tư vào `.migration/`, rồi nhập vào một cơ sở dữ liệu **trống**, trước lần chạy game đầu tiên:

```sh
npm run db:migrate
npm run db:import
npm start
```

Script nhập tất cả bảng trong một transaction, kiểm tra schema và số dòng; từ chối nếu cơ sở dữ liệu đích đã có dữ liệu. Lưu bản snapshot gốc. Khóa thao tác, trạng thái online và thời điểm thao tác cũ được đặt về 0.

Danh tính ChatGPT của máy chủ Sites không thể tự đăng nhập ở origin mới. Script chuyển những danh tính đó sang các phiên ngẫu nhiên và lưu mã truy cập riêng trong `.migration/session-recovery.json` (quyền file 0600). Chủ game cung cấp **đúng mã của từng người chơi** qua kênh riêng; người chơi mở `/restore` và nhập mã để tiếp tục nhân vật cũ. Mã này là thông tin đăng nhập, tuyệt đối không đưa lên GitHub hoặc gửi công khai. Nhân vật khách cũ cũng nằm trong snapshot; cookie của tên miền cũ không tự chuyển sang tên miền mới.

Bản Sites hiện tại được giữ nguyên làm bản dự phòng. `docs/sites-origin.json` chỉ ghi lại nguồn gốc dự án; không tham gia vào runtime này. Không có credential Sites/GitHub trong repository.

## Nội dung

- 54 linh địa thuộc Hạ giới, Tiên giới, Thần giới; 108 NPC.
- 714 nhiệm vụ, gồm 65 nhiệm vụ ẩn; 756 yêu thú/boss trấn thủ và 3 boss thế giới.
- 45 cảnh giới, mỗi cảnh giới 10 tinh; đột phá và độ kiếp có xác suất, Hộ Kiếp Đan và cơ chế tăng may mắn sau thất bại.
- 6 con đường tu, 6 huyết mạch, 8 linh căn với 5 phẩm; 16 ô trang bị, 8 phẩm, luyện khí và cường hóa.
- 24 pet, 18 thú cưỡi, 8 danh hiệu, 60 thành tích, tân thủ, tông môn/gia tộc, 72 bí tịch/cổ tịch/truyền thừa, đạo lữ NPC trưởng thành.
- 5 tiền tệ, chợ giao dịch nguyên tử, bảng xếp hạng thật, boss thế giới dùng chung HP và đóng góp.
- 18 pháp thân: 9 theo cảnh giới và 9 bí truyền từ cơ duyên; animation sau lưng, 30 tầng lĩnh ngộ và chiêu thức tỉnh tăng 25% sát thương trong 8 giây.
- 5 đan phương; luyện thể, thần thức, đạo ý (50 tầng mỗi nhánh); 7 ủy thác hằng ngày, reset theo UTC.
- Tổ đội tối đa 5 người, mã/link mời, phụ bản 3 đợt boss có HP chung và thưởng riêng; chat Thế giới/Tổ đội/Tông môn có kiểm tra thành viên.

## Điều khiển

Bấm đất hoặc dùng WASD/phím mũi tên để di chuyển. Bấm NPC để trò chuyện, tài nguyên để thu thập, yêu thú để chọn mục tiêu. Phím 1–4 xuất chiêu, 5 thức tỉnh pháp thân, Q bật/dừng tự chiến, R dùng linh đan, B mở hành trang, M mở map. Thiên thư mở toàn bộ hệ thống.

## Kiến trúc và giới hạn

Vinext/React, Cloudflare Workers runtime local (Wrangler/Miniflare) và D1 tương thích SQLite. API `/api/rpg` kiểm tra khoảng cách, hồi chiêu, tài nguyên, cảnh giới, đóng góp và quyền nhận thưởng. Đồng bộ HTTP khoảng 1,4 giây, có phản hồi nhẹ và tạm dừng khi tab ẩn. Header danh tính Sites không được dùng làm thông tin đăng nhập trong runtime độc lập.

Đây là MMORPG nhỏ, chưa kiểm thử tải đông người, chưa có PvP hay anti-cheat chuyên dụng. Quái thường và phụ bản cá nhân thuộc tiến trình nhân vật; boss thế giới và tổ đội dùng trạng thái chung. Map dùng bốn nền gốc kết hợp màu, thời tiết và bố cục riêng. Nhiệm vụ sinh từ các loại hoạt động, chưa phải 714 cốt truyện viết riêng; NPC/quái dùng mẫu sprite và biến thể. Chưa có lãnh địa chiến, quản lý cấp bậc tông môn hoặc kết đạo lữ giữa người chơi.

## Triển khai lâu dài

GitHub lưu mã nguồn; để game chạy liên tục cần một dịch vụ hosting đang hoạt động. Có thể dùng Cloudflare Workers/D1 với tài khoản của bạn: tạo D1, thay `database_id` trong `wrangler.jsonc`, chạy `npx wrangler d1 migrations apply DB --remote --config wrangler.jsonc`, build rồi deploy `dist/server/wrangler.json`. ID D1 mặc định trong repo chỉ dùng cho local. Repository có workflow GitHub Actions để kiểm tra TypeScript, build và migration; workflow không tự triển khai hay cần secret.

Hình ảnh nằm trong `public/art`, `public/rpg`, `public/ui`; sprite/animation ở `lib/rpg/pixels.ts`, `dharma-art.ts`, `scenery.ts`. Font và giấy phép được giữ trong `public/fonts`.

## Chương mở đầu: Phong ấn Thanh Vân

Map đầu yên bình cho tới khi hoàn thành lời thề ở bia cổ. Gặp Lâm Thanh Huyền ở sân giữa để tự nhận chương I; nhận thưởng sẽ tự mở chương kế tiếp. Năm chương dẫn qua trò chuyện, 3 Thanh Tâm Thảo, bia cổ, 3 Thanh Linh Hồ rồi boss trấn thủ. Ba quái xuất hiện sau chương III, boss sau chương IV; hoàn thành chương V mở lại đầy đủ quái của map. Phụ bản giữ cơ chế quái riêng. ID nhiệm vụ cũ được giữ để tương thích nhân vật đã lưu.

Màn tiên môn dùng phiên nhân vật hiện có; đây không phải đăng nhập bằng mật khẩu. `/restore` vẫn dùng mã khôi phục riêng. Nhạc nền ngũ cung được tổng hợp bằng Web Audio, không cần tải nhạc ngoài; bật/tắt ở nút âm thanh, tự tạm dừng khi ẩn tab. Nhân vật có chuyển động thở và đung đưa khi đứng yên.

## Thiên cơ và Phong Vân Bảng

Bản mở rộng có **12 cơ duyên ẩn viết riêng** ở 10 linh địa: điều tức nghe chuông, hái thảo cứu sen, tìm ngọc, giúp sói trắng, giải đèn hàn đàm, khám phá giếng tiền kiếp, kế thừa cổ kiếm và minh ước tổ đội. Mở **Thiên cơ** để đọc manh mối, xem tọa độ và tiến độ, sau đó bấm dấu ✦ trên map. Máy chủ kiểm tra cảnh giới, khoảng cách và mục tiêu. Khám phá tự nhận nhiệm vụ; nhận thưởng một lần để lấy tinh phách, cổ tịch và mở bí truyền. Nếu bỏ nhiệm vụ, có thể nhận lại nhưng không nhận thưởng lặp.

Có **18 pháp thân**, gồm 6 pháp thân gốc, 3 pháp thân mở theo cảnh giới và 9 bí truyền từ cơ duyên. Các pháp tướng mới có hình học riêng: đạo liên, kiếm trận, nguyệt luân, băng kính, tinh bàn và pháp ấn. Pháp thân gốc giữ nguyên ID và thưởng; tự tiến hóa chọn pháp thân theo cảnh giới, bí truyền cần chọn sau khi hoàn thành cơ duyên. Hiệu ứng thức tỉnh vẫn tăng 25% sát thương trong 8 giây.

**Phong Vân Bảng** hiển thị top 100 với phân trang, hai bảng tu vi/lực chiến và hạng cá nhân toàn máy chủ. Tu vi xếp theo cảnh giới, tinh rồi XP; hạng bằng nhau dùng ID để giữ thứ tự ổn định. Huy hiệu ba hạng đầu là trang trí trong bảng, không cấp danh hiệu hay thưởng cạnh tranh giả.

**Cài đặt** lưu tại trình duyệt: tỉ lệ HUD, cỡ chữ thiên thư, viền an toàn, âm lượng, giảm chuyển động, tên NPC/quái và số sát thương. Giao diện thiên thư có thanh chuyển hệ thống; danh sách chức năng trên điện thoại cuộn để đủ chỗ.

Kiểm thử hồi quy nội dung (không cần cơ sở dữ liệu):

```sh
./node_modules/.bin/esbuild tests/opening-story.test.ts --bundle --platform=node --format=esm --outfile=/tmp/opening-story-test.mjs
node /tmp/opening-story-test.mjs
./node_modules/.bin/esbuild tests/expansion.test.ts --bundle --platform=node --format=esm --outfile=/tmp/expansion-test.mjs
node /tmp/expansion-test.mjs
```

Đây là bản mở rộng gameplay và giao diện, chưa có kết quả kiểm thử tải đông người. Để mở cộng đồng cần triển khai máy chủ hoạt động liên tục và đo tải API/D1; số lượng nội dung không thay thế kiểm thử vận hành.

## Động Khiếu và Bách Khoa

**Động Khiếu** có 6 nhánh, mỗi nhánh 18 khiếu: Khí Hải tăng linh lực, Kinh Mạch tăng tốc độ, Tứ Chi tăng công kích, Ngũ Tạng tăng khí huyết, Thần Đình tăng bạo kích và Mệnh Môn tăng phòng ngự. Khiếu đầu cần Luyện Khí 2 tinh; các khiếu tiếp theo yêu cầu bậc tu hành cao hơn. Kinh nghiệm riêng nhận từ điều tức (+8), quái thường (+3), boss thường (+18), nhiệm vụ (+8, ẩn +15) và thưởng cổ cảnh tổ đội (+25). Khai khiếu dùng kinh nghiệm, linh thạch và tinh phách ở tầng cao; máy chủ kiểm tra toàn bộ điều kiện trước khi trừ tài nguyên.

Đủ 24 khiếu mở một tuyến chủ đạo: Kiếm Ý tăng 3% công, Kim Thân tăng 3% khí huyết hoặc Tụ Linh tăng 3% linh lực. Đổi tuyến miễn phí, chỉ một tuyến có hiệu lực. Dữ liệu được lưu trong profile; nhân vật cũ tự được thêm các nhánh ở mức 0, không mất tiến trình.

**Bách Khoa** có 8 nhóm: nhân vật, quái vật, vùng đất, vật phẩm, võ học, thế lực, bí ẩn và chỉ dẫn. Bố cục gồm nhóm, danh sách tìm kiếm/phân trang và trang chi tiết có hình, gốc gác, dữ liệu và liên kết tới chức năng liên quan. Tìm kiếm chấp nhận tiếng Việt không dấu. Trạng thái xác minh theo hoạt động của nhân vật; truyện cơ duyên chỉ hiển thị sau khi khám phá. Số liệu lấy từ catalog game, không tạo NPC, quái hay vật phẩm giả để lấp danh sách.

```sh
./node_modules/.bin/esbuild tests/meridians-codex.test.ts --bundle --platform=node --format=esm --outfile=/tmp/meridians-codex-test.mjs
node /tmp/meridians-codex-test.mjs
```
