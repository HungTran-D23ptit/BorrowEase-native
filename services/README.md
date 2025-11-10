# Thư mục `services`

Mục đích: chứa các wrapper cho API (HTTP calls). Đây là nơi duy nhất để gọi API, xử lý token, và normalize lỗi.

Cách dùng chuẩn:

- `services/rootApi.js` — axios instance + interceptors (gắn token, refresh token, xử lý lỗi chung).
- `services/user/` — api endpoints dành cho user (auth, profile, book requests).
- `services/admin/` — api endpoints dành cho admin (user management, book management, reports).
- `services/index.js` (tùy chọn) — barrel export để dễ import: `import { login } from 'services/user';`

Quy tắc:

- Không xuất logic business-level ở đây (chỉ HTTP + mapping lỗi). Business orchestration đặt trong `hooks/` hoặc `store/`.
- Trả về data đã normalized (ví dụ `response.data`) hoặc ném lỗi được chuẩn hóa.
