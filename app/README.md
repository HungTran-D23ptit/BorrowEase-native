# Thư mục `app`

Mục đích: chứa các screen, navigation và layout của ứng dụng.

Cách dùng chuẩn:

- `app/screens/` — chứa các trang (screens/pages) theo route. Mỗi screen là một file component chịu trách nhiệm layout và tương tác với hooks/services.
- `app/navigation/` — cấu hình navigation (stack/tab/drawer). Giữ logic điều hướng ở đây.
- `app/layout/` — các wrapper layout chung (AppLayout, ModalContainer).

Subfolders `admin/` và `user/`:

- `app/admin/` — screens dành cho phần admin (dashboard, quản lý users, reports).
- `app/user/` — screens dành cho user (home, profile, borrow flows).

Quy tắc:

- Screen orchestration (kết hợp nhiều components) -> đặt trong `app/screens` hoặc `app/admin`/`app/user`.
- Không viết logic gọi API trực tiếp trong UI; dùng `hooks/` hoặc `services/`.
