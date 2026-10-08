> Muốn chơi trên máy Windows trước? Xem [hướng dẫn chạy máy và chơi chung Wi-Fi](docs/CHOI-TREN-MAY.md). Bấm đúp `CHAY-GAME-WINDOWS.cmd` hoặc chạy `npm run play`.

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

- 54 linh địa thuộc Hạ giới, Tiên giới, Thần giới; mỗi map ngoài trời rộng 4608 × 3072, với 7 bãi yêu thú tách nhau; 108 NPC.
- 717 nhiệm vụ, gồm 65 nhiệm vụ ẩn; 756 mẫu yêu thú/boss trấn thủ, 1890 cá thể chia 7 bãi × 5 quái mỗi map khi mở đủ, và 3 boss thế giới.
- 45 cảnh giới, mỗi cảnh giới 10 tinh; đột phá và độ kiếp có xác suất, Hộ Kiếp Đan và cơ chế tăng may mắn sau thất bại.
- 6 con đường tu, 6 huyết mạch, 8 linh căn với 5 phẩm; 16 ô trang bị, 8 phẩm, luyện khí và cường hóa.
- 24 pet, 18 thú cưỡi, 152 danh hiệu, 60 thành tích, tân thủ, tông môn/gia tộc, 72 bí tịch/cổ tịch/truyền thừa, đạo lữ NPC trưởng thành.
- 5 tiền tệ, chợ giao dịch nguyên tử, bảng xếp hạng thật, boss thế giới dùng chung HP và đóng góp.
- 18 pháp thân: 9 theo cảnh giới và 9 bí truyền từ cơ duyên; animation sau lưng, 30 tầng lĩnh ngộ và chiêu thức tỉnh tăng 25% sát thương trong 8 giây.
- 5 đan phương; luyện thể, thần thức, đạo ý (50 tầng mỗi nhánh); 7 ủy thác hằng ngày, reset theo UTC.
- Tổ đội tối đa 5 người, mã/link mời, phụ bản 3 đợt boss có HP chung và thưởng riêng; chat Thế giới/Tổ đội/Tông môn có kiểm tra thành viên.

## Điều khiển

Bấm đất hoặc dùng WASD/phím mũi tên để di chuyển. Bấm NPC để trò chuyện, tài nguyên để thu thập, yêu thú để chọn mục tiêu. Phím 1–4 xuất chiêu, 5 thức tỉnh pháp thân, Q bật/dừng tự chiến, R dùng linh đan, B mở hành trang, M mở map, J mở nhật ký, K mở Động Khiếu, P mở nhân vật. Hàng dùng nhanh: R dùng Hồi Linh Đan; 6 mở độ kiếp để chọn Hộ Kiếp Đan; 7 mở đan phòng, 8 mở truyền thừa, 9 mở hành trang. Thiên thư mở toàn bộ hệ thống.

## Kiến trúc và giới hạn

Vinext/React, Cloudflare Workers runtime local (Wrangler/Miniflare) và D1 tương thích SQLite. API `/api/rpg` kiểm tra khoảng cách, hồi chiêu, tài nguyên, cảnh giới, đóng góp và quyền nhận thưởng. Đồng bộ HTTP khoảng 1,4 giây, có phản hồi nhẹ và tạm dừng khi tab ẩn. Header danh tính Sites không được dùng làm thông tin đăng nhập trong runtime độc lập.

Đây là MMORPG nhỏ, chưa kiểm thử tải đông người, chưa có PvP hay anti-cheat chuyên dụng. Quái thường và phụ bản cá nhân thuộc tiến trình nhân vật; boss thế giới và tổ đội dùng trạng thái chung. Map dùng bốn nền gốc kết hợp màu, thời tiết và bố cục riêng. Nhiệm vụ sinh từ các loại hoạt động, chưa phải 717 cốt truyện viết riêng; NPC/quái dùng mẫu sprite và biến thể. Chưa có lãnh địa chiến, quản lý cấp bậc tông môn hoặc kết đạo lữ giữa người chơi.

## Triển khai lâu dài

GitHub lưu mã nguồn; để game chạy liên tục cần một dịch vụ hosting đang hoạt động. Có thể dùng Cloudflare Workers/D1 với tài khoản của bạn: tạo D1, thay `database_id` trong `wrangler.jsonc`, chạy `npx wrangler d1 migrations apply DB --remote --config wrangler.jsonc`, build rồi deploy `dist/server/wrangler.json`. ID D1 mặc định trong repo chỉ dùng cho local. Repository có workflow GitHub Actions để kiểm tra TypeScript, build và migration; workflow không tự triển khai hay cần secret.

Hình ảnh nằm trong `public/art`, `public/rpg`, `public/ui`; sprite/animation ở `lib/rpg/pixels.ts`, `dharma-art.ts`, `scenery.ts`. Font và giấy phép được giữ trong `public/fonts`.

## Chương mở đầu: Phong ấn Thanh Vân

Map đầu yên bình cho tới khi hoàn thành lời thề ở bia cổ. Gặp Lâm Thanh Huyền ở sân giữa để tự nhận chương I; nhận thưởng sẽ tự mở chương kế tiếp. Năm chương dẫn qua trò chuyện, 3 Thanh Tâm Thảo, bia cổ, 3 Thanh Linh Hồ rồi boss trấn thủ. Ba quái xuất hiện sau chương III, boss sau chương IV; hoàn thành chương V mở lại đầy đủ quái của map. Phụ bản giữ cơ chế quái riêng. ID nhiệm vụ cũ được giữ để tương thích nhân vật đã lưu.

Màn tiên môn dùng phiên nhân vật hiện có; đây không phải đăng nhập bằng mật khẩu. `/restore` vẫn dùng mã khôi phục riêng. Nhạc nền ngũ cung được tổng hợp bằng Web Audio, không cần tải nhạc ngoài; bật/tắt ở nút âm thanh, tự tạm dừng khi ẩn tab. Nhân vật có chuyển động thở và đung đưa khi đứng yên.

## Thiên cơ và Phong Vân Bảng

Bản mở rộng có **12 cơ duyên ẩn viết riêng** ở 10 linh địa: điều tức nghe chuông, hái thảo cứu sen, tìm ngọc, giúp sói trắng, giải đèn hàn đàm, khám phá giếng tiền kiếp, kế thừa cổ kiếm và minh ước tổ đội. Mở **Thiên cơ** để đọc manh mối, xem tọa độ và tiến độ, sau đó bấm dấu ✦ trên map. Máy chủ kiểm tra cảnh giới, khoảng cách và mục tiêu. Khám phá tự nhận nhiệm vụ; nhận thưởng một lần để lấy tinh phách, cổ tịch và mở bí truyền. Nếu bỏ nhiệm vụ, có thể nhận lại nhưng không nhận thưởng lặp.

Có **18 pháp thân**, gồm 6 pháp thân gốc, 3 pháp thân mở theo cảnh giới và 9 bí truyền từ cơ duyên. Các pháp tướng mới có hình học riêng: đạo liên, kiếm trận, nguyệt luân, băng kính, tinh bàn và pháp ấn. Pháp thân gốc giữ nguyên ID và thưởng; tự tiến hóa chọn pháp thân theo cảnh giới, bí truyền cần chọn sau khi hoàn thành cơ duyên. Hiệu ứng thức tỉnh vẫn tăng 25% sát thương trong 8 giây.

**Phong Vân Bảng** có 8 bảng top 100 với phân trang và hạng cá nhân toàn máy chủ. Mỗi bảng cấp danh hiệu riêng cho ba hạng đầu; quyền dùng cập nhật theo thứ hạng. Xem chi tiết ở phần Danh hiệu, xếp hạng và chiêu thức bên dưới.

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

## Sơn hà đồ và trò chuyện

Bản đồ có hai chế độ Giang hồ/Khu vực. Khu vực hiển thị vị trí nhân vật, NPC, tài nguyên, cơ duyên, yêu thú còn sống và người chơi đang hiện diện; có phóng to, về vị trí bản thân, xem mục tiêu và đi tới NPC/tài nguyên/yêu thú bằng cơ chế di chuyển hiện tại. Dấu yêu thú tôn trọng tiến độ mở khóa map đầu.

Chat có bộ lọc Tất cả/Thế giới/Gần Đây/Tổ đội/Tông môn, giờ gửi, biểu cảm, mở rộng/thu gọn và số tin chưa đọc ở các kênh khác bộ lọc đang xem. Kênh Gần Đây chỉ đọc được trong cùng map; máy chủ kiểm tra thành viên khi gửi và đọc kênh tổ đội/tông môn. Tiên báo vinh danh lần đầu hạ boss thường và khi vượt thiên kiếp sang cảnh giới mới.

### Kiểm tra chat nhiều người chơi

Sau khi migrate và khởi động ứng dụng cục bộ trên cổng 8787, chạy `node tests/chat-smoke.mjs`. Bài kiểm tra tạo các nhân vật có tên bắt đầu bằng `QA_MAPCHAT_`, kiểm tra kênh thế giới, Gần Đây theo map, quyền đọc chat tổ đội/tông môn và thời gian gửi. Chỉ chạy với cơ sở dữ liệu phát triển; hồ sơ kiểm tra được giữ lại để chẩn đoán.

## Menu chức năng trên HUD

Menu chính có 12 lối tắt và bảng **Thêm** gồm Linh sủng, Tiên duyên, Bí tịch, Đan đạo, Chợ giao dịch, Pháp thân, Động Khiếu, Đạo tâm, Cảnh giới, Nhân vật, Hành trang và Cài đặt. Các mục mở hệ thống gameplay tương ứng. Nhiệm vụ/Nhật khóa hiện số thưởng đã đủ điều kiện và chưa nhận. Bảng Thêm hỗ trợ bàn phím, Escape, đóng khi bấm ra ngoài và bố cục điện thoại; Thiên thư vẫn mở toàn bộ danh mục chức năng.

## Danh hiệu, xếp hạng và chiêu thức

Có **152 danh hiệu**: 8 danh hiệu cũ giữ nguyên ID/điều kiện, 120 danh hiệu theo 10 con đường và 24 danh hiệu Phong Vân. Danh hiệu thường mở theo trảm yêu, boss, khám phá, bí tịch, nhiệm vụ, điều tức, cơ duyên, cổ cảnh tổ đội, thu thập và khai khiếu. Mỗi danh hiệu có màu, bậc, khung tên nhiều lớp với cánh, ngọc, mây cuộn và họa tiết riêng theo hệ; có một trong 6 hiệu ứng: vân khí, kiếm quang, hỏa diễm, tinh hà, thanh liên, lôi quang. Có tìm kiếm không dấu, lọc, phân trang và xem trước; chỉ danh hiệu đang đeo và đủ điều kiện cộng công cơ bản.

Phong Vân chia thành **8 top**: Tu vi, Lực chiến, Trảm yêu, Săn boss, Tiên lộ, Thiên cơ, Chu thiên, Đồng đạo. Mỗi bảng có danh hiệu riêng cho hạng 1/2/3; các bảng thành tích chỉ xếp người có thành tích lớn hơn 0. Khi bằng điểm, ID máy chủ dùng làm thứ tự ổn định. Danh hiệu top là vinh danh tạm thời, không cộng chỉ số; quyền sử dụng cập nhật trong vòng 10 giây và kiểm tra lại ngay khi trang bị. Ra khỏi vị trí tương ứng sẽ mất hiệu ứng dù ID trang bị cũ vẫn được giữ. Nút Trang bị danh hiệu ở hàng của bạn trang bị danh hiệu theo thứ hạng đó.

Chiêu thức có 24 biến thể cho 6 môn phái × 4 chiêu: pháp ấn khi xuất chiêu, vệt bay từ nhân vật tới mục tiêu, va chạm, hào quang và tàn dư. Kiếm tu dùng kiếm khí, pháp tu dùng lôi trận, thể tu dùng cương ấn, quyền tu dùng quyền ảnh, thương tu dùng thương mang, y tu dùng thanh liên. Chế độ giảm chuyển động giữ dấu va chạm tĩnh; sát thương, linh lực và hồi chiêu vẫn do máy chủ quyết định.

```sh
./node_modules/.bin/esbuild tests/titles.test.ts --bundle --platform=node --format=esm --outfile=/tmp/titles-test.mjs
node /tmp/titles-test.mjs
```

## Triển khai Docker với SQLite (tùy chọn)

Dockerfile mới build đúng thư mục `dist`; không sao chép `/app/release` hoặc `server-build` không tồn tại. Máy chủ dùng Node 22, áp dụng migration trước khi chạy, nghe trên `0.0.0.0:$PORT`, kiểm tra sức khỏe tại `/api/health` và lưu SQLite theo `RPG_STATE_DIR`.

Để triển khai Render với Neon, dùng Blueprint Node trong `render.yaml` và làm theo [hướng dẫn Render + Neon](docs/RENDER-NEON-ADMIN.md). Dockerfile vẫn dành cho bản SQLite tự lưu trữ; cấu hình này cần ổ đĩa bền vững và `RPG_STATE_DIR`.

Giữ một instance dùng disk này; các instance với SQLite riêng không chia sẻ tiến trình. Không dùng ổ đĩa tạm để giữ nhân vật qua deploy. Có thể kiểm tra Docker tại máy cá nhân bằng:

```sh
docker build -t van-thien-ky .
docker run --rm -p 8787:8787 -v cultivation-state:/var/data van-thien-ky
```

### Trải nghiệm tân thủ · Nhập Đạo 02

Nhân vật mới xuất hiện tại **Thanh Vân Tân Thôn** và nhận sẵn nhiệm vụ đầu. Khu tân thủ có đèn lồng đung đưa, cánh hoa, linh khí và Tụ Linh Đài; nhân vật/NPC có chuyển động áo tóc và vận khí. Chính tuyến gồm **8 bước**: 5 bước phong ấn Thanh Vân, rồi phục hồi Ngọc Ấn, đến Trúc Lâm và nhận Thanh Vân Kiếm Quyết. Người chơi cũ có thể dùng nút **Về tân thôn** để quay lại mà giữ tiến độ. Nếu chế độ giảm chuyển động đang bật, có nút **Bật animation** ngay trong game.

## Map rộng và thân pháp 04

Camera theo nhân vật trên máy tính và điện thoại; giới hạn di chuyển, bản đồ nhỏ, Sơn hà đồ và khoảng cách chiến đấu dùng chung tọa độ. Mỗi map có 7 bãi cách nhau ít nhất 600 đơn vị, mỗi bãi 5 quái, gồm bãi trấn thủ có một boss và bốn hộ vệ. Bấm số bãi hoặc tên bãi trong bản đồ khu vực rồi chọn **Đi tới mục tiêu** để đi bộ đến đó. Quái bổ sung có trạng thái chết/hồi sinh riêng và vẫn tính vào nhiệm vụ đúng loài. Tân thôn mới không có quái; nhiệm vụ mở lần lượt 3 quái, boss rồi đủ 7 bãi. Cổ cảnh cá nhân giữ đấu trường riêng và đưa người chơi về sân khi ra khỏi cảnh.

Nhân vật dùng các tư thế toàn thân cho bước chân và vung kiếm; các lớp khác/NPC chuyển động theo khớp vai, hông với điểm nối chồng dưới thân áo. Không uốn hình theo từng dải ngang. Đứng yên thở nhẹ với chân chạm đất; đánh có lấy đà, ra đòn và thu thế, hướng về mục tiêu, tạm dừng bước trong 620 ms ra chiêu. Người chơi và quái phản ứng khi trúng đòn; giảm chuyển động giữ tư thế tĩnh. Đây vẫn là sprite 2D; bộ hình hiện tại chưa có tư thế lưng riêng đầy đủ cho mọi lớp.

Kiểm tra bổ sung: bundle/chạy `tests/map-layout.test.ts` như các bài TypeScript ở trên; sau khi chạy game local, `node tests/wide-maps-smoke.mjs` kiểm tra chiến đấu thật ở bãi xa, tiến độ loài, giới hạn tốc độ và vào/ra cổ cảnh. Bài smoke chỉ dùng hồ sơ `QA_CAMPS_` trong cơ sở dữ liệu phát triển.

### Render + Neon và quản trị admin

Xem [hướng dẫn thiết lập Render, Neon và bảng Thiên Chủ](docs/RENDER-NEON-ADMIN.md). Blueprint `render.yaml` hiện chạy Node.js với PostgreSQL Neon; bản `npm run play` trên máy vẫn dùng SQLite. Dashboard quản trị tại `/admin`, yêu cầu `ADMIN_PASSWORD` riêng trên máy chủ.

### Tiến trình kỹ năng

Tân thủ chỉ có chiêu cơ bản. Chiêu thứ hai mở ở cấp tu hành 5; chiêu thứ ba ở cấp 11 và cảnh giới thứ hai; tuyệt kỹ ở cấp 31 và cảnh giới thứ tư. Cấp tu hành = cảnh giới × 10 + tầng hiện tại. Mỗi cấp tăng thêm 1 điểm kỹ năng, mỗi lần lên cảnh giới cộng thêm 2 điểm. Thanh kỹ năng hiển thị điều kiện khóa và cho nâng từng chiêu tối đa 5 bậc, mỗi bậc thêm 12% sát thương. Máy chủ kiểm tra cả mở khóa, điểm nâng và hồi chiêu; tự chiến chỉ chọn chiêu đã mở. Tiến trình cũ không cần xóa và điểm được tính từ cấp tu hành hiện có.

### Chợ, giftcode và nạp tiền

Có chợ trang bị giữa người chơi với tìm kiếm/lịch sử, giftcode do admin phát hành, chuyển khoản do admin duyệt và payOS tự động. Xem [hướng dẫn vận hành và cấu hình payOS trên Render](docs/COMMERCE-PAYOS.md). Các chức năng thu tiền chỉ mở sau khi bạn cấu hình ngân hàng hoặc khóa payOS.

### Vạn Bảo Các · Shop

Nút **Shop** mua trang bị, linh đan, nguyên liệu và cổ tịch bằng 5 loại tiền game; **Chợ** vẫn dành cho giao dịch giữa người chơi. Shop có 16 bộ phận và 8 phẩm trang bị, mở theo cảnh giới, giá trang bị theo cấp tu hành. Tiên ngọc dùng ngay từ tân thủ để mua đồ Phàm phẩm, túi hành trang và vật tư tu luyện. Chọn hàng → xác nhận mua; đồ tự vào hành trang hoặc kho nguyên liệu. Giá/gói cố định được kiểm tra trên máy chủ và tiền/vật phẩm lưu cùng transaction. Danh mục, giá và gói quà nằm trong `lib/rpg/shop.ts`, không cần thêm migration database.
