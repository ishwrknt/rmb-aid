---
title: "Cách tìm câu trả lời về RMB_AID"
description: Sử dụng LLM để tự nhanh chóng trả lời các câu hỏi về RMB_AID
sidebar:
        order: 4
---

## Bắt đầu tại đây: RMB_AID-Help

**Cách nhanh nhất để tìm câu trả lời về RMB_AID là dùng skill `rmbaid-help`.** Đây là công cụ hướng dẫn thông minh có thể trả lời hơn 80% các câu hỏi và có sẵn ngay trong IDE khi bạn làm việc.

RMB_AID-Help không chỉ là công cụ tra cứu, nó còn:
- **Kiểm tra dự án của bạn** để xem những gì đã hoàn thành
- **Hiểu ngôn ngữ tự nhiên** - đặt câu hỏi bằng ngôn ngữ bình thường
- **Thay đổi theo module đã cài** - hiển thị các lựa chọn liên quan
- **Tự động chạy sau workflow** - nói rõ bạn cần làm gì tiếp theo
- **Đề xuất tác vụ đầu tiên cần thiết** - không cần đoán nên bắt đầu từ đâu

### Cách dùng RMB_AID-Help

Gọi nó trực tiếp trong phiên AI của bạn:

```text
rmbaid-help
```

:::tip
Bạn cũng có thể dùng `/rmbaid-help` hoặc `$rmbaid-help` tùy nền tảng, nhưng chỉ `rmbaid-help` là cách nên hoạt động mọi nơi.
:::

Kết hợp với câu hỏi ngôn ngữ tự nhiên:

```text
rmbaid-help Tôi có ý tưởng SaaS và đã biết tất cả tính năng. Tôi nên bắt đầu từ đâu?
rmbaid-help Tôi có những lựa chọn nào cho thiết kế UX?
rmbaid-help Tôi đang bị mắc ở workflow PRD
rmbaid-help Cho tôi xem tôi đã làm được gì đến giờ
```

RMB_AID-Help sẽ trả lời:
- Điều gì được khuyến nghị cho tình huống của bạn
- Tác vụ đầu tiên cần thiết là gì
- Phần còn lại của quy trình trông thế nào

## Khi nào nên dùng tài liệu này

Hãy xem phần này khi:
- Bạn muốn hiểu kiến trúc hoặc nội bộ của RMB_AID
- Bạn cần câu trả lời nằm ngoài phạm vi RMB_AID-Help cung cấp
- Bạn đang nghiên cứu RMB_AID trước khi cài đặt
- Bạn muốn tự khám phá source code trực tiếp

## Các bước thực hiện

### 1. Chọn nguồn thông tin

| Nguồn | Phù hợp nhất cho | Ví dụ |
| --- | --- | --- |
| **Thư mục `_rmbaid`** | Cách RMB_AID vận hành: agent, workflow, prompt | "PM agent làm gì?" |
| **Toàn bộ repo GitHub** | Lịch sử, installer, kiến trúc | "v6 thay đổi gì?" |
| **`llms-full.txt`** | Tổng quan nhanh từ tài liệu | "Giải thích bốn giai đoạn của RMB_AID" |

Thư mục `_rmbaid` được tạo khi bạn cài đặt RMB_AID. Nếu chưa có, hãy clone repo thay thế.

### 2. Cho AI của bạn truy cập nguồn thông tin

**Nếu AI của bạn đọc được tệp (Claude Code, Cursor, ...):**

- **Đã cài RMB_AID:** Trỏ đến thư mục `_rmbaid` và hỏi trực tiếp
- **Cần bối cảnh sâu hơn:** Clone [repo đầy đủ](https://github.com/rmbaid-code-org/RMB_AID)

**Nếu bạn dùng ChatGPT hoặc Claude.ai:**

Nạp `llms-full.txt` vào phiên làm việc:

```text
https://rmbaid-code-org.github.io/RMB_AID/llms-full.txt
```

### 3. Đặt câu hỏi

:::note[Ví dụ]
**Q:** "Hãy chỉ tôi cách nhanh nhất để xây dựng một thứ gì đó bằng RMB_AID"

**A:** Dùng Quick Flow: Chạy `rmbaid-quick-dev` - nó sẽ làm rõ ý định, lập kế hoạch, triển khai, review và trình bày kết quả trong một workflow duy nhất, bỏ qua các giai đoạn lập kế hoạch đầy đủ.
:::

## Bạn nhận được gì

Các câu trả lời trực tiếp về RMB_AID: agent hoạt động ra sao, workflow làm gì, tại sao cấu trúc lại được tổ chức như vậy, mà không cần chờ người khác trả lời.

## Mẹo

- **Xác minh những câu trả lời gây bất ngờ** - LLM vẫn có lúc nhầm. Hãy kiểm tra tệp nguồn hoặc hỏi trên Discord.
- **Đặt câu hỏi cụ thể** - "Bước 3 trong workflow PRD làm gì?" tốt hơn "PRD hoạt động ra sao?"

## Vẫn bị mắc?

Đã thử cách tiếp cận bằng LLM mà vẫn cần trợ giúp? Lúc này bạn đã có một câu hỏi tốt hơn để đem đi hỏi.

| Kênh | Dùng cho |
| --- | --- |
| `#rmb-aid-help` | Câu hỏi nhanh (trò chuyện thời gian thực) |
| `help-requests` forum | Câu hỏi chi tiết (có thể tìm lại, tồn tại lâu dài) |
| `#suggestions-feedback` | Ý tưởng và đề xuất tính năng |
| `#report-bugs-and-issues` | Báo cáo lỗi |

**Discord:** [discord.gg/gk8jAdXWmj](https://discord.gg/gk8jAdXWmj)

**GitHub Issues:** [github.com/rmbaid-code-org/RMB_AID/issues](https://github.com/rmbaid-code-org/RMB_AID/issues) (dành cho các lỗi rõ ràng)

*Chính bạn,*
        *đang mắc kẹt*
             *trong hàng đợi -*
                      *đợi*
                              *ai?*

*Mã nguồn*
        *nằm ngay đó,*
                *rõ như ban ngày!*

*Hãy trỏ*
        *cho máy của bạn.*
                    *Thả nó đi.*

*Nó đọc.*
        *Nó nói.*
                *Cứ hỏi -*

*Sao phải chờ*
        *đến ngày mai*
                *khi bạn đã có*
                        *ngày hôm nay?*

*- Claude*
