import type { NoosModule } from "../types/noos";

export const NOOS_MODULES: NoosModule[] = [
  {
    id: "identity",
    title: "Định danh",
    subtitle: "MeaningID · phiên bản con người trong NOOS",
    icon: "◎",
  },
  {
    id: "companion",
    title: "AI đồng hành",
    subtitle: "Không hành động tự do — luôn có consent & audit",
    icon: "◇",
  },
  {
    id: "search",
    title: "Tìm kiếm",
    subtitle: "Ngữ nghĩa, không chỉ từ khóa",
    icon: "⌕",
  },
  {
    id: "flow",
    title: "Flow",
    subtitle: "Intent → workflow → evidence",
    icon: "↯",
  },
  {
    id: "twin",
    title: "Twin",
    subtitle: "Trạng thái & lịch sử twin",
    icon: "⬡",
  },
  {
    id: "map",
    title: "Super Map",
    subtitle: "Mười lớp thực tại (placeholder)",
    icon: "⬚",
  },
  {
    id: "governance",
    title: "Quản trị",
    subtitle: "Policy · veto · rollback",
    icon: "⚖",
  },
  {
    id: "economy",
    title: "Kinh tế",
    subtitle: "Quyền & phạm vi trong hệ",
    icon: "◈",
  },
  {
    id: "learning",
    title: "Học tập",
    subtitle: "Lộ trình có cấu trúc từ intent",
    icon: "◐",
  },
];
