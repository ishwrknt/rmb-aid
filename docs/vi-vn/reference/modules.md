---
title: Các Module Chính Thức
description: Các module bổ sung để xây agent tùy chỉnh, tăng cường sáng tạo, phát triển game và kiểm thử
sidebar:
  order: 4
---

RMB_AID được mở rộng thông qua các module chính thức mà bạn chọn trong quá trình cài đặt. Những module bổ sung này cung cấp agent, workflow và task chuyên biệt cho các lĩnh vực cụ thể, vượt ra ngoài phần lõi tích hợp sẵn và RMB_AID (Agile suite).

:::tip[Cài đặt module]
Chạy `npx rmb-aid install` rồi chọn những module bạn muốn. Trình cài đặt sẽ tự xử lý phần tải về, cấu hình và tích hợp vào IDE.
:::

## RMB_AID Builder

Tạo agent tùy chỉnh, workflow tùy chỉnh và module chuyên biệt theo lĩnh vực với sự hỗ trợ có hướng dẫn. RMB_AID Builder là meta-module để mở rộng chính framework này.

- **Mã:** `bmb`
- **npm:** [`rmbaid-builder`](https://www.npmjs.com/package/rmbaid-builder)
- **GitHub:** [rmbaid-code-org/rmbaid-builder](https://github.com/rmbaid-code-org/rmbaid-builder)

**Cung cấp:**

- Agent Builder — tạo AI agent chuyên biệt với chuyên môn và quyền truy cập công cụ tùy chỉnh
- Workflow Builder — thiết kế quy trình có cấu trúc với các bước và điểm quyết định
- Module Builder — đóng gói agent và workflow thành các module có thể chia sẻ và phát hành
- Thiết lập có tương tác bằng YAML cùng hỗ trợ publish lên npm

## Creative Intelligence Suite

Bộ công cụ vận hành bởi AI dành cho sáng tạo có cấu trúc, phát ý tưởng và đổi mới trong giai đoạn đầu phát triển. Bộ này cung cấp nhiều agent giúp brainstorming, design thinking và giải quyết vấn đề bằng các framework đã được kiểm chứng.

- **Mã:** `cis`
- **npm:** [`rmbaid-creative-intelligence-suite`](https://www.npmjs.com/package/rmbaid-creative-intelligence-suite)
- **GitHub:** [rmbaid-code-org/rmbaid-module-creative-intelligence-suite](https://github.com/rmbaid-code-org/rmbaid-module-creative-intelligence-suite)

**Cung cấp:**

- Các agent Innovation Strategist, Design Thinking Coach và Brainstorming Coach
- Problem Solver và Creative Problem Solver cho tư duy hệ thống và tư duy bên lề
- Storyteller và Presentation Master cho kể chuyện và pitching
- Các framework phát ý tưởng như SCAMPER, Reverse Brainstorming và problem reframing

## Game Dev Studio

Các workflow phát triển game có cấu trúc, được điều chỉnh cho Unity, Unreal, Godot và các engine tùy chỉnh. Hỗ trợ làm prototype nhanh qua Quick Flow và sản xuất toàn diện bằng sprint theo epic.

- **Mã:** `gds`
- **npm:** [`rmbaid-game-dev-studio`](https://www.npmjs.com/package/rmbaid-game-dev-studio)
- **GitHub:** [rmbaid-code-org/rmbaid-module-game-dev-studio](https://github.com/rmbaid-code-org/rmbaid-module-game-dev-studio)

**Cung cấp:**

- Workflow tạo Game Design Document (GDD)
- Chế độ Quick Dev cho làm prototype nhanh
- Hỗ trợ thiết kế narrative cho nhân vật, hội thoại và world-building
- Bao phủ hơn 21 thể loại game cùng hướng dẫn kiến trúc theo engine

## Test Architect (TEA)

Chiến lược kiểm thử cấp doanh nghiệp, hướng dẫn tự động hóa và quyết định release gate thông qua một agent chuyên gia cùng chín workflow có cấu trúc. TEA vượt xa QA agent tích hợp sẵn nhờ ưu tiên theo rủi ro và truy vết yêu cầu.

- **Mã:** `tea`
- **npm:** [`rmb-aid-test-architecture-enterprise`](https://www.npmjs.com/package/rmb-aid-test-architecture-enterprise)
- **GitHub:** [rmbaid-code-org/rmb-aid-test-architecture-enterprise](https://github.com/rmbaid-code-org/rmb-aid-test-architecture-enterprise)

**Cung cấp:**

- Agent Murat (Master Test Architect and Quality Advisor)
- Các workflow cho test design, ATDD, automation, test review và traceability
- Đánh giá NFR, thiết lập CI và dựng sườn framework kiểm thử
- Ưu tiên P0-P3 cùng tích hợp tùy chọn với Playwright Utils và MCP

## Community Modules

Các module cộng đồng và một chợ module đang được chuẩn bị. Hãy theo dõi [tổ chức RMB_AID trên GitHub](https://github.com/rmbaid-code-org) để cập nhật.
