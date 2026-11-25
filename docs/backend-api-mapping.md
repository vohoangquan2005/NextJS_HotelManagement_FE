# Bản đồ API backend

Đối chiếu trực tiếp với `HotelManagement/HotelManagement/Controllers`, DTO và các service liên quan trong source hiện tại. Base URL frontend lấy từ `NEXT_PUBLIC_API_URL` (giá trị local đang dùng là `https://localhost:7100/api`). Các response list dưới đây là mảng DTO theo `return Ok(...)`; API không khai báo phân trang.

## API xác thực và chức năng khách hàng

| Chức năng | Endpoint | Method | Request | Response | Quyền truy cập | Trạng thái | Ghi chú |
|---|---|---|---|---|---|---|---|
| Đăng ký | `/Auth/register` | POST | `RegisterDto` JSON | `LoginResponseDto` | Công khai | Đã xác minh | AuthService đăng ký và trả token. |
| Đăng nhập | `/Auth/login` | POST | `LoginDto` JSON | `LoginResponseDto` | Công khai | Đã xác minh | Token JWT dùng Bearer. |
| Hồ sơ hiện tại | `/Auth/profile` | GET | Bearer token | `UserProfileResponseDto` | Đã đăng nhập | Đã xác minh | Có `createAt`/`updateAt`; không cần hiển thị trên profile. |
| Đăng xuất | `/Auth/logout` | POST | Bearer token | `{ message }` | Đã đăng nhập | Đã xác minh | Backend trả xác nhận; JWT bị xóa phía client. |
| Đổi mật khẩu | `/Auth/change-password` | — | — | — | — | Chưa được hỗ trợ | AuthController không khai báo endpoint; frontend hiện thông báo rõ chức năng chưa khả dụng và không gửi request giả. |
| Danh sách phòng | `/Room` | GET | Không có query | `RoomResponseDto[]` | Công khai: action có `[AllowAnonymous]` ghi đè `[Authorize]` cấp controller | Đã xác minh source | Chỉ phòng Active; không phân trang. Catalog public có thể gọi API. |
| Chi tiết phòng | `/Room/{id}` | GET | `id` route | `RoomResponseDto` | Công khai: action có `[AllowAnonymous]` | Đã xác minh source | DTO không có URL ảnh hoặc review. |
| Lọc phòng | `/Room/filter` | GET | `RoomFilterDto`: `RoomTypeId`, `MinPrice`, `MaxPrice`, `MinCapacity`, `MaxCapacity` | `RoomResponseDto[]` | Công khai: action có `[AllowAnonymous]` | Đã xác minh source | Không có tìm kiếm theo từ khóa hay phân trang. |
| Danh sách loại phòng | `/RoomType` | GET | — | `RoomTypeResponseDto[]` | Customer, Staff, Admin (cần token) | Đã xác minh | Controller có `[Authorize]`; chưa cho khách chưa đăng nhập. |
| Danh sách dịch vụ | `/Service` | GET | — | `ServiceResponseDto[]` | Customer, Staff, Admin (cần token) | Đã xác minh | Controller có `[Authorize]`; không thể hiện công khai cho khách chưa đăng nhập. |
| Tìm dịch vụ | `/Service/search` | GET | `ServiceSearchDto` query | `ServiceResponseDto[]` | Customer, Staff, Admin (cần token) | Đã xác minh | Các trường query theo DTO. |
| Chi tiết dịch vụ | `/Service/{id}` | GET | `id` route | `ServiceResponseDto` | Admin, Staff | Đã xác minh | Customer không có quyền endpoint chi tiết. |
| Danh sách gói dịch vụ | `/ServicePackage` | GET | — | response DTO list | Customer, Staff, Admin (cần token) | Đã xác minh | Không công khai anonymous. |
| Tạo đặt phòng online | `/Booking/online` | POST | `BookingCreateOnlineDto` JSON | `BookingResponseDto` (201) | Customer | Đã xác minh | DTO nhận ngày dự kiến, số khách/phòng, promotion/package tùy chọn, ghi chú và `BookingDetails`. Service tính giá ở backend. |
| Đặt phòng của tôi | `/Booking/my-bookings` | GET | Bearer token | `BookingResponseDto[]` | Customer | Đã xác minh | Lọc theo `CustomerId` claim ở backend. |
| Chi tiết đặt phòng của tôi | `/Booking/my-bookings/{bookingId}` | GET | `bookingId` route | `BookingResponseDto` | Customer | Đã xác minh | Backend truy vấn theo customer claim. |
| Danh sách đặt phòng quản lý | `/Booking` | GET | — | `BookingResponseDto[]` | Admin, Staff | Đã xác minh | Không phân trang. |
| Đặt phòng đã xóa | `/Booking/deleted` | GET | — | `BookingResponseDto[]` | Admin | Đã xác minh | Khôi phục bằng `/Booking/{id}/restore`. |
| Xác nhận đặt phòng | `/Booking/{id}/confirm` | PATCH | `id` route | `BookingResponseDto` | Admin, Staff | Đã xác minh | Service chỉ xác nhận khi trạng thái đang Pending. |
| Xóa mềm đặt phòng | `/Booking/{id}/soft-deleted` | PATCH | `id` route | No content | Admin, Staff | Đã xác minh | Endpoint dùng hậu tố `soft-deleted`. |
| Tạo thanh toán | `/Payment` | POST | `PaymentCreateDto` | Payment response (201) | Admin, Staff | Đã xác minh | Không có API cổng thanh toán hoặc xác nhận thanh toán dành cho Customer. |
| Xác nhận/từ chối thanh toán | `/Payment/{id}/confirm`, `/Payment/{id}/reject` | PUT | `id` route | No content | Admin, Staff | Đã xác minh | Không phải luồng xác nhận từ cổng thanh toán. |
| Tạo review | `/Review` | POST | `ReviewCreateDto` | Review response (201) | Customer | Đã xác minh | Không có GET review công khai hoặc theo phòng; kiểm tra thêm điều kiện booking trong ReviewService trước khi triển khai UI. |
| Checkout | — | — | — | — | — | Chưa được hỗ trợ cho Customer | `BookingDetail/{id}/checkout` hiện chỉ Admin/Staff; không có thao tác trả phòng self-service. |

## Quản trị, nhân viên và thao tác dữ liệu

| Chức năng | Endpoint | Method | Request | Response | Quyền truy cập | Trạng thái | Ghi chú |
|---|---|---|---|---|---|---|---|
| CRUD phòng | `/Room`, `/Room/{id}` | POST, PUT, PATCH `/{id}/soft-delete`, PATCH `/{id}/restore`, DELETE `/{id}` | Room create/update DTO | DTO khi tạo; No content khi cập nhật/xóa | Admin | Đã xác minh | Xóa cứng riêng với soft delete. |
| Phòng đã xóa | `/Room/deleted` | GET | — | `RoomResponseDto[]` | Admin | Đã xác minh | Dùng endpoint restore hoặc hard delete ở trên. |
| CRUD loại phòng | `/RoomType`, `/RoomType/{id}` | GET/POST/PUT/PATCH soft-delete/restore/DELETE | RoomType DTO | DTO / No content | Các thao tác thay đổi: Admin; list: Customer/Staff/Admin | Đã xác minh | Controller yêu cầu đăng nhập. |
| CRUD dịch vụ | `/Service`, `/Service/{id}` | GET/POST/PUT/PATCH soft-delete/restore/DELETE | Service DTO | DTO / No content | Thay đổi: Admin; list/search: Customer/Staff/Admin; detail: Admin/Staff | Đã xác minh | — |
| Dịch vụ đã xóa | `/Service/deleted` | GET | — | `ServiceResponseDto[]` | Admin | Đã xác minh | Restore và hard delete có endpoint riêng. |
| CRUD gói dịch vụ | `/ServicePackage`, `/ServicePackage/{id}` | GET/POST/PUT/PATCH soft-delete/restore/DELETE | ServicePackage DTO | DTO / No content | Thay đổi: Admin; list: Customer/Staff/Admin | Đã xác minh | — |
| CRUD khuyến mãi | `/Promotion`, `/Promotion/{id}` | GET/POST/PUT/PATCH soft-delete/restore/DELETE | Promotion request DTO | DTO / No content | Xem: Admin/Staff; thay đổi: Admin | Đã xác minh | — |
| Áp dụng khuyến mãi | `/ApplyPromotion`, `/ApplyPromotion/{id}` | GET/DELETE | — | DTO / No content | List: Admin/Staff/Customer; detail: Admin/Staff; xóa: Admin | Đã xác minh | Xóa quan hệ áp dụng, không xóa promotion gốc. |
| Quản lý booking | `/Booking`, `/Booking/{id}` | GET/POST/PUT/PATCH `/{id}/confirm`/PATCH `/{id}/soft-deleted`/PATCH `/{id}/restore`/DELETE | Booking DTO; confirm có `status` action parameter nhưng service gọi `ConfirmAsync` | DTO / No content | Admin/Staff; restore/delete Admin; my-bookings/online Customer | Đã xác minh | Điều kiện trạng thái nằm trong BookingService; online booking không có thanh toán đi kèm. |
| Booking detail / check-in/out | `/BookingDetail`, `/BookingDetail/{id}`, `/{id}/checkin`, `/{id}/checkout` | GET/PUT | DTO tương ứng | DTO / No content | Admin/Staff; DELETE Admin | Đã xác minh | Không phải checkout self-service của Customer. |
| Booking service | `/BookingService`, `/BookingService/{id}` | GET/POST/PUT/DELETE | DTO | DTO / No content | Admin/Staff; xóa Admin | Đã xác minh | — |
| Guest | `/Guest`, `/Guest/{id}` | GET/POST/PUT/DELETE | Guest DTO | DTO / No content | Admin/Staff | Đã xác minh | — |
| Customer | `/Customer`, `/Customer/{id}` | GET/DELETE | — | DTO / No content | GET Admin/Staff; DELETE Admin | Đã xác minh | Không có create/update Customer endpoint trong controller. |
| User | `/User`, `/User/{id}` và `/User/deleted` | GET/POST/PUT/PATCH soft-delete/restore/DELETE | User DTO | DTO / No content | Admin | Đã xác minh | — |
| Role | `/Role`, `/Role/{id}` và `/Role/deleted` | GET/POST/PUT/PATCH soft-delete/restore/DELETE | Role DTO | DTO / No content | Admin | Đã xác minh | — |
| Tài khoản người dùng | `/User`, `/User/deleted`, `/{id}/soft-delete`, `/{id}/restore` | GET/PATCH | User response DTO | User DTO / No content | Admin | Đã xác minh | Frontend hiển thị danh sách, xóa mềm và khôi phục; chưa gửi trường mật khẩu do service lưu nguyên `HashPassword` không mã hóa. |
| Quản lý loại phòng | `/RoomType`, `/RoomType/{id}` và `/RoomType/deleted` | GET/POST/PUT/PATCH soft-delete/restore/DELETE | RoomType DTO | DTO / No content | Đọc: Admin/Staff/Customer (JWT); quản lý: Admin | Đã xác minh | Màn quản trị frontend có CRUD, xóa mềm, khôi phục và xóa cứng. |
| Quản lý vai trò | `/Role`, `/Role/{id}` và `/Role/deleted` | GET/POST/PUT/PATCH soft-delete/restore/DELETE | Role DTO | DTO / No content | Admin | Đã xác minh | Màn quản trị frontend có CRUD, xóa mềm, khôi phục và xóa cứng. |
| Hủy booking | `/Cancellation`, `/Cancellation/{id}`, `/{id}/confirm`, `/{id}/reject` | GET/POST/PUT | Cancellation DTO | DTO / No content | Xem: Admin/Staff; tạo/xóa Admin; confirm/reject Admin/Staff | Đã xác minh | Chưa thấy endpoint Customer yêu cầu hủy. |
| Chính sách hủy | `/CancellationPolicy`, `/CancellationPolicy/{id}`, `/deleted` | GET/POST/PUT/PATCH soft-delete/restore/DELETE | Policy DTO | DTO / No content | Xem: Admin/Staff; thay đổi Admin | Đã xác minh | — |
| Hóa đơn | `/Invoice`, `/Invoice/{id}` | GET/POST/DELETE | Invoice DTO | DTO / No content | Xem/tạo Admin/Staff; xóa Admin | Đã xác minh | Không tự tính tổng ở frontend. |
| Thanh toán | `/Payment`, `/Payment/{id}` | GET/POST/PUT confirm/reject/DELETE | Payment DTO | DTO / No content | Xem/tạo/confirm/reject Admin/Staff; xóa Admin | Đã xác minh | — |
| Ảnh phòng | `/RoomImage`, `/RoomImage/{id}` | GET/POST/PUT/DELETE | Multipart form DTO (`[FromForm]`) | DTO / No content | Admin | Đã xác minh | Không có quyền đọc công khai cho guest. |
| Upload Cloudinary | `/Cloudinary/upload-image`, `/Cloudinary/delete-image` | POST/DELETE | Multipart/body theo action | Theo action | Admin | Đã xác minh | Phải theo đúng DTO/action, không dùng thay cho RoomImage public. |
| Dashboard | `/Dashboard` | GET | — | `DashboardResponseDto` | Controller không gắn `[Authorize]` | Đã xác minh | Public theo controller hiện tại; cân nhắc tránh hiển thị dữ liệu quản trị ở public. |
| Thống kê | `/Statistics/revenue/*`, `/Statistics/occupancy/*` | GET | Query ngày/tháng theo action | Kết quả thống kê | Admin | Đã xác minh | Có date, date-range, month, month-range. |
| Audit log | `/AuditLog` | GET | — | Audit log list | Admin | Đã xác minh | — |

## Khoảng trống backend đã xác minh

- `RoomController` cho phép anonymous đọc danh sách/chi tiết/lọc qua `[AllowAnonymous]`; các endpoint quản trị vẫn yêu cầu Admin. `RoomResponseDto` không trả ảnh hoặc khuyến mãi. `RoomImageController` chỉ dành cho Admin. Review API không cung cấp danh sách đọc cho phòng/khách công khai.
- Service, RoomType và ServicePackage yêu cầu JWT; khách chưa đăng nhập không xem được catalog các mục này.
- Luồng `Booking/online` tạo đặt phòng nhưng backend hiện không cung cấp payment gateway/URL hay API thanh toán Customer để xác nhận đặt cọc. Không thể trình bày đây là quy trình thanh toán hoàn chỉnh.
- Customer không có endpoint checkout; endpoint checkout chi tiết đặt phòng chỉ cho Admin/Staff.
- `AuthController` hiện không khai báo đổi mật khẩu; API client frontend có hàm gọi nhưng endpoint đó chưa được xác minh/tồn tại trong controller.
- API list không có pagination. Phòng có thể chia trang phía client sau khi tải toàn bộ list; backend filter chỉ có room type, khoảng giá, sức chứa.
- `DashboardController` không có authorization attribute trong source đang kiểm tra; quyền truy cập cuối cùng cần được xác nhận với chủ hệ thống trước khi đưa các chỉ số lên khu vực công khai.
- `InvoiceService.CheckCreateByUserId` và `PaymentService.CheckCreateByUserId` hiện từ chối khi `RoleName != "Customer"` dù thông báo yêu cầu tài khoản nhân viên; vì vậy chưa tích hợp form tạo hóa đơn/giao dịch từ Admin/Staff. Không gửi `CreatedByUserId` giả.
- `InvoiceService` chỉ cho xóa hóa đơn khi hóa đơn chưa phát sinh bất kỳ giao dịch thanh toán nào; `PaymentService` không cho xóa giao dịch Success. Giao diện dùng nguyên các endpoint và để backend xác thực các điều kiện này.

## Tình trạng tích hợp frontend

- Frontend hiện có danh sách, chi tiết và thao tác yêu thích phòng; danh sách yêu thích chỉ dùng FavoriteRoom API theo Customer claim, không gửi CustomerId.
- Đã có màn quản trị review và xử lý trạng thái; màn yêu cầu hủy cho Admin/Staff; danh sách booking có chi tiết theo Admin/Staff với check-in/check-out; Guest CRUD; Promotion CRUD và gán loại phòng trong payload Promotion; quản lý ảnh phòng tạo/xóa theo multipart API; AuditLog lọc cục bộ.
- Chưa có giao diện ApplyPromotion độc lập; quan hệ áp dụng promotion được gửi lồng trong create/update Promotion. ApplyPromotion controller chỉ list/detail/delete. Đã có màn CancellationPolicy, ServicePackage và BookingService.
- Public service pages vẫn chịu giới hạn xác thực backend: `/Service` và `/ServicePackage` cần JWT; chi tiết `/Service/{id}` chỉ cho Admin/Staff.
- `RoomImageService.UpdateAsync` hiện khởi tạo `newImageUrl`, gán URL mới khi có tệp và dọn ảnh mới nếu cập nhật DB thất bại; UI quản lý ảnh phòng hiện cho sửa cờ ảnh chính/thứ tự và xóa nhưng chưa có điều khiển thay tệp ảnh.
- `GuestCreateDto`/`GuestUpdateDto` đặt `[StringLength(10)]` cho Email dù thông báo ghi 100. Frontend phản ánh giới hạn DTO 10 ký tự; backend cần sửa DTO nếu muốn nhận email thông thường.
- Quản lý User hiện có tạo, liệt kê, xem chi tiết, xóa mềm, khôi phục và xóa vĩnh viễn; giao diện chưa có sửa. Backend Update hiện gán `User.HashPassword` trực tiếp (kể cả null) và luồng UserService không hash mật khẩu. Vì DTO chi tiết không trả hash nên giao diện không thể gửi an toàn trường này khi cập nhật; cần sửa contract/logic backend trước khi bổ sung form sửa.
- Không còn giới hạn truy cập anonymous cho catalog phòng: `GET /Room`, `/Room/{id}` và `/Room/filter` có `[AllowAnonymous]` trong source hiện tại. RoomType, Service và ServicePackage vẫn yêu cầu JWT.
