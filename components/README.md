# Thư mục `components`

Mục đích: chứa các component UI có thể tái sử dụng.

Cách dùng chuẩn:

- `components/ui/` — các atoms, icons, buttons, inputs, collapse.
- `components/common/` — các component ghép (Card, Header, Form) được cấu thành từ atoms.

Subfolders `admin/` và `user/`:

- `components/admin/` — component đặc thù cho dashboard/admin panels.
- `components/user/` — component dành cho giao diện user (profile card, borrow card).

Quy tắc:

- Components chỉ nhận props và render; tránh side-effects. Side-effects đặt vào `hooks/` hoặc `services/`.
- Tên files: PascalCase cho component, ví dụ `UserCard.tsx` hoặc `UserCard.js`.
