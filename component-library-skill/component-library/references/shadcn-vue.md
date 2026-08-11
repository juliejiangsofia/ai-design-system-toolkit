# shadcn-vue Component Reference

**Official site:** https://www.shadcn-vue.com
**Tech stack:** Vue 3 + Tailwind CSS 4
**Install per component:** `npx shadcn-vue@latest add <component-name>`

## 安装说明

使用 shadcn-vue 组件前，需要先初始化（项目首次使用时执行一次）：
```bash
npx shadcn-vue@latest init
```

然后按需安装每个组件：
```bash
npx shadcn-vue@latest add button
npx shadcn-vue@latest add card dialog  # 可以一次安装多个
```

安装后组件会被复制到 `src/components/ui/` 目录，可以直接修改源码。

---

## 完整组件列表

### 基础交互
| 组件 | 安装名 | 用途 |
|---|---|---|
| Button | `button` | 按钮，支持 variant: default/destructive/outline/secondary/ghost/link |
| Input | `input` | 文本输入框 |
| Textarea | `textarea` | 多行文本输入 |
| Checkbox | `checkbox` | 复选框 |
| Radio Group | `radio-group` | 单选组 |
| Switch | `switch` | 开关切换 |
| Slider | `slider` | 滑块 |
| Toggle | `toggle` | 切换按钮 |
| Toggle Group | `toggle-group` | 切换按钮组 |
| Label | `label` | 表单标签 |

### 表单
| 组件 | 安装名 | 用途 |
|---|---|---|
| Form | `form` | 表单容器（基于 vee-validate） |
| Select | `select` | 下拉选择 |
| Combobox | `combobox` | 可搜索下拉 |
| Date Picker | `date-picker` | 日期选择器 |
| Calendar | `calendar` | 日历组件 |

### 数据展示
| 组件 | 安装名 | 用途 |
|---|---|---|
| Card | `card` | 卡片容器，含 Header/Content/Footer/Title/Description |
| Badge | `badge` | 标签徽章，variant: default/secondary/destructive/outline |
| Avatar | `avatar` | 头像，含 AvatarImage/AvatarFallback |
| Table | `table` | 数据表格 |
| Skeleton | `skeleton` | 骨架屏占位 |
| Progress | `progress` | 进度条 |
| Separator | `separator` | 分隔线 |
| Aspect Ratio | `aspect-ratio` | 固定宽高比容器 |
| Scroll Area | `scroll-area` | 自定义滚动条容器 |

### 浮层 & 弹窗
| 组件 | 安装名 | 用途 |
|---|---|---|
| Dialog | `dialog` | 模态对话框 |
| Sheet | `sheet` | 侧边抽屉 |
| Drawer | `drawer` | 底部/侧边抽屉（移动端友好） |
| Popover | `popover` | 气泡弹出层 |
| Tooltip | `tooltip` | 提示气泡 |
| Hover Card | `hover-card` | hover 展示卡片 |
| Alert Dialog | `alert-dialog` | 确认对话框（替代 confirm） |

### 导航
| 组件 | 安装名 | 用途 |
|---|---|---|
| Navigation Menu | `navigation-menu` | 主导航菜单 |
| Breadcrumb | `breadcrumb` | 面包屑 |
| Tabs | `tabs` | 标签页切换 |
| Sidebar | `sidebar` | 侧边栏布局 |
| Pagination | `pagination` | 分页 |

### 菜单 & 命令
| 组件 | 安装名 | 用途 |
|---|---|---|
| Dropdown Menu | `dropdown-menu` | 下拉菜单 |
| Context Menu | `context-menu` | 右键菜单 |
| Menubar | `menubar` | 菜单栏 |
| Command | `command` | 命令面板（⌘K 搜索框风格） |

### 展开 & 折叠
| 组件 | 安装名 | 用途 |
|---|---|---|
| Accordion | `accordion` | 手风琴展开 |
| Collapsible | `collapsible` | 简单折叠 |

### 反馈
| 组件 | 安装名 | 用途 |
|---|---|---|
| Alert | `alert` | 提示横幅，variant: default/destructive |
| Toast (Sonner) | `sonner` | 轻量通知 toast |

---

## 快速匹配表

| 用户说… | 匹配组件 |
|---|---|
| "按钮" | `Button` |
| "卡片" | `Card` |
| "弹窗"、"确认框" | `Dialog` / `Alert Dialog` |
| "侧边栏"、"抽屉" | `Sheet` / `Drawer` / `Sidebar` |
| "表格" | `Table` |
| "标签"、"徽章" | `Badge` |
| "头像" | `Avatar` |
| "搜索框"、"命令面板" | `Command` |
| "下拉菜单" | `Dropdown Menu` / `Select` |
| "导航" | `Navigation Menu` / `Sidebar` |
| "表单" | `Form` + `Input` + `Label` |
| "toast"、"通知" | `Sonner` |
| "骨架屏"、"加载占位" | `Skeleton` |
| "步骤"、"标签页" | `Tabs` |
| "折叠"、"FAQ" | `Accordion` |
| "进度" | `Progress` |
| "日期选择" | `Date Picker` / `Calendar` |

---

## 使用示例

```vue
<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>标题</CardTitle>
    </CardHeader>
    <CardContent class="flex items-center gap-3">
      <Badge variant="secondary">标签</Badge>
      <Button variant="outline">操作</Button>
    </CardContent>
  </Card>
</template>
```
