# Thư mục `hooks`

Mục đích: chứa các custom React hooks để tái sử dụng logic (fetch, auth, forms).

Cách dùng chuẩn:

- `hooks/useAuth.js` — logic đăng nhập/đăng xuất, lưu token (sử dụng `services/`).
- `hooks/useFetch.js` — generic fetch hook dùng `services` hoặc `rootApi`.
- `hooks/admin/` và `hooks/user/` — hooks đặc thù cho từng domain (ví dụ `useAdminUsers`, `useUserBorrows`).

Quy tắc:

- Hooks có thể gọi `services/*`, xử lý trạng thái loading/error và trả UI-friendly API.
- Tránh trực tiếp thao tác DOM trong hooks nếu không phải hook React.
