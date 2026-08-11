# Art Design Pro 组件清单

源码位置: `<project-root>/src/components/core/`

所有组件已通过 `unplugin-vue-components` 全局注册，可直接在 template 中使用，无需 import。

## 基础 Base

| 组件 | 用途 |
|------|------|
| `ArtBackToTop` | 回到顶部按钮 |
| `ArtLogo` | Logo 展示 |
| `ArtSvgIcon` | SVG 图标 |

## 横幅 Banners

| 组件 | 用途 |
|------|------|
| `ArtBasicBanner` | 基础横幅 |
| `ArtCardBanner` | 卡片样式横幅 |

## 数据卡片 Cards

| 组件 | 用途 | 适用场景 |
|------|------|----------|
| `ArtStatsCard` | 统计数据卡片 | Dashboard 顶部关键指标 |
| `ArtProgressCard` | 进度卡片 | 目标完成进度、任务进度 |
| `ArtBarChartCard` | 柱状图卡片 | 对比数据 |
| `ArtLineChartCard` | 折线图卡片 | 趋势数据 |
| `ArtDonutChartCard` | 环形图卡片 | 占比数据 |
| `ArtDataListCard` | 数据列表卡片 | 最近活动、排行榜 |
| `ArtTimelineListCard` | 时间线列表卡片 | 操作日志、时间轴 |
| `ArtImageCard` | 图片卡片 | 图片展示、封面 |

## 图表 Charts

| 组件 | 用途 |
|------|------|
| `ArtBarChart` | 柱状图 |
| `ArtHBarChart` | 水平柱状图 |
| `ArtLineChart` | 折线图 |
| `ArtDualBarCompareChart` | 双柱对比图 |
| `ArtRadarChart` | 雷达图 |
| `ArtRingChart` | 环形图 |
| `ArtScatterChart` | 散点图 |
| `ArtKLineChart` | K 线图 |

## 表单 Forms

| 组件 | 用途 | 适用场景 |
|------|------|----------|
| `ArtForm` | 通用表单容器 | 所有表单页面 |
| `ArtSearchBar` | 搜索栏 | 列表页顶部筛选 |
| `ArtButtonMore` | 更多操作按钮 | 操作列溢出 |
| `ArtButtonTable` | 表格操作按钮 | 表格行内操作 |
| `ArtDragVerify` | 拖拽验证 | 登录、安全验证 |
| `ArtExcelExport` | Excel 导出 | 数据导出 |
| `ArtExcelImport` | Excel 导入 | 数据导入 |
| `ArtWangEditor` | 富文本编辑器 | 内容编辑 |

## 表格 Tables

| 组件 | 用途 | 适用场景 |
|------|------|----------|
| `ArtTable` | 数据表格 | 列表页主体 |
| `ArtTableHeader` | 表格头部工具栏 | 表格上方操作区 |

## 媒体 Media

| 组件 | 用途 |
|------|------|
| `ArtCutterImg` | 图片裁剪 |
| `ArtVideoPlayer` | 视频播放器 |

## 文字效果 Text Effect

| 组件 | 用途 |
|------|------|
| `ArtCountTo` | 数字滚动动画 |
| `ArtTextScroll` | 文字滚动 |
| `ArtFestivalTextScroll` | 节日文字滚动 |

## 布局 Layouts

| 组件 | 用途 |
|------|------|
| `ArtHeaderBar` | 顶部导航栏 |
| `ArtSidebarMenu` | 侧边栏菜单 |
| `ArtHorizontalMenu` | 水平菜单 |
| `ArtMixedMenu` | 混合菜单 |
| `ArtBreadcrumb` | 面包屑导航 |
| `ArtWorkTab` | 标签页导航 |
| `ArtPageContent` | 页面内容容器 |
| `ArtGlobalSearch` | 全局搜索 |
| `ArtNotification` | 通知 |
| `ArtScreenLock` | 锁屏 |
| `ArtFastEnter` | 快捷入口 |
| `ArtSettingsPanel` | 设置面板 |
| `ArtUserMenu` | 用户菜单 |
| `ArtChatWindow` | 聊天窗口 |

## 其他 Others

| 组件 | 用途 |
|------|------|
| `ArtIconButton` | 图标按钮 |
| `ArtMenuRight` | 右键菜单 |
| `ArtWatermark` | 水印 |

## 视图 Views

| 组件 | 用途 |
|------|------|
| `ArtException` | 异常页面 (404/403/500) |
| `ArtResultPage` | 结果页 (成功/失败) |
| `AuthTopBar` | 登录页顶栏 |
| `LoginLeftView` | 登录页左侧 |
