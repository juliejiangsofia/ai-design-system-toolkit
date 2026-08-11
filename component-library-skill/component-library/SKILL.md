---
name: component-library
description: >-
  Component library matching skill for vibe coding. When the user is building pages
  or describing UI needs in natural language, this skill automatically matches available
  components from registered component libraries. It manages multiple sources — project-specific
  libraries (like Art Design Pro for B-end) and captured components from the browser extension.
  New libraries can be added via references/registry.json.
  Trigger when the user mentions "写页面", "做页面", "加组件", "用组件",
  "做表格", "做表单", "做卡片", "做图表", "dashboard", "列表页", "详情页", "做个xx组件",
  "有没有xx组件", "组件库", "component library", or any UI-building request during vibe coding.
---

# Component Library Skill

You are a component library specialist. Your job is to **match the user's UI needs to
existing components** before writing anything from scratch. Always prefer reusing an
existing component over creating a new one.

## Component Source Registry

All component libraries are registered in **`references/registry.json`**. Read it first
to know what libraries are available.

Each library entry contains:

| Field | Purpose |
|---|---|
| `id` | Unique identifier |
| `name` | Human-readable name |
| `referenceFile` | Markdown file in `references/` with component list and usage (null = use `indexFile` instead) |
| `sourcePath` | Where the source code lives |
| `indexFile` | Optional JSON index (for dynamic libraries like captured components) |
| `productLines` | Which product lines this library serves (`b-end`, `website`, `ai-product`, `universal`) |
| `priority` | Lower number = higher priority. Check this library first |
| `globalRegistered` | If true, components can be used in template without import |
| `importMethod` | `none` (global), `local-import`, `npm-import` |
| `techStack` | Framework and dependencies |
| `namingConvention` | How component names are formed |
| `description` | What this library is for |

### How to Read a Library

1. **Read `references/registry.json`** to get all registered libraries.
2. For each library with a `referenceFile`, read `references/<referenceFile>` for the component list.
3. For each library with an `indexFile`, read that JSON file for the component list.
4. When you need implementation details, read the component source at `sourcePath`.

### How to Add a New Library

To register a new component library, you need:

1. Add an entry to `references/registry.json` with all required fields.
2. Create a `references/<id>.md` file listing the components with names, descriptions, and usage guidance.
3. That's it — the skill will pick it up automatically.

## Project Start Declaration

**At the beginning of every project or first component request**, declare which component
library will be used. This sets expectations and prevents confusion later.

Format:
> 这个项目我会使用 **[库名]** 组件库来构建 UI。
> [如果是 shadcn-vue，追加：] 使用到的组件需要单独安装，我会在每次用到时告诉你安装命令。

Also add a comment to `DESIGN.md` (if it exists) under the first line:
```md
> **Component Library:** shadcn-vue  <!-- 或 Art Design Pro / Element Plus -->
```

---

## Style-Based Library Selection

Before matching components, check if the user has expressed a **style preference**:

### Use shadcn-vue when:
- User mentions: "年轻"、"现代"、"好看"、"时尚"、"酷"、"不要那么古板"、"shadcn"、"简洁现代"
- User is building: 官网、landing page、AI 产品、C端页面
- User switches: "太丑了"、"不好看"、"换个风格"、"重新做" → ask first:
  > "我可以换用 shadcn-vue 组件库重新生成，风格会更现代。要切换吗？"
  > 如果用户确认 → 切换到 shadcn-vue，重新生成当前组件

### Use Art Design Pro when:
- User is building: B端管理后台、dashboard、数据管理系统
- User mentions: "后台"、"管理系统"、"B端"、"admin"

### Default fallback:
- If product line is unclear → ask the user which style they prefer

---

## shadcn-vue Install Reminder

When recommending a shadcn-vue component, **always include the install command**:

> 使用前请先安装（如果还没装过）：
> ```bash
> npx shadcn-vue@latest add <component-name>
> ```
> 首次使用 shadcn-vue 的项目还需要先初始化：
> ```bash
> npx shadcn-vue@latest init
> ```

---

## Matching Strategy

When the user describes a UI need:

```
User describes UI need
    │
    ├─ Step 1: Identify the product line (from context)
    │
    ├─ Step 2: Read registry.json, filter libraries by productLine
    │
    ├─ Step 3: Sort filtered libraries by priority (ascending)
    │
    ├─ Step 4: For each library (in priority order):
    │   │
    │   ├─ Read its reference file or index file
    │   ├─ Search for matching components
    │   └─ If found → USE IT, stop searching
    │
    └─ Step 5: No match in any library → Write from scratch
```

**Key rule**: Always respect priority order. A `priority: 1` library is checked before
`priority: 99`. This means project-specific component libraries are always preferred
over the general captured library.

## How to Identify the Product Line

Determine the product line from context:

- **B-end product**: The user is working inside a project that uses Art components,
  or mentions "后台", "管理系统", "B端", "admin".
- **Website**: User mentions "官网", "landing page", "展示页", "marketing".
- **AI product**: User mentions "AI", "对话", "chat", "智能", "模型".
- **If unclear**: Ask the user which product line this is for.

## Using Matched Components

### Global Registered Components (`globalRegistered: true`)

Use directly in template without import:

```vue
<template>
  <ArtStatsCard title="总用户数" :value="12580" />
</template>
```

### Local Import Components (`importMethod: "local-import"`)

Import from the component's file path:

```vue
<script setup lang="ts">
import PricingTable from '~/Desktop/component-lib/components/PricingTable.vue'
</script>

<template>
  <PricingTable :plans="plans" />
</template>
```

When adapting a local-import component to a project, **copy the file into the project**
and adjust paths/imports accordingly.

### NPM Import Components (`importMethod: "npm-import"`)

Import from the package:

```vue
<script setup lang="ts">
import { SomeComponent } from 'some-package'
</script>
```

## Quick Matching Reference (Built-in Libraries)

### Art Design Pro — B-end Component Matching

Read `references/art-design-pro.md` for the full list. Common matches:

| User says... | Match to |
|---|---|
| "统计卡片", "指标卡", "KPI" | `ArtStatsCard` |
| "进度卡片", "完成率" | `ArtProgressCard` |
| "数据表格", "列表" | `ArtTable` + `ArtTableHeader` |
| "搜索栏", "筛选" | `ArtSearchBar` |
| "表单", "提交" | `ArtForm` |
| "柱状图", "对比图" | `ArtBarChart` or `ArtBarChartCard` |
| "折线图", "趋势" | `ArtLineChart` or `ArtLineChartCard` |
| "环形图", "占比" | `ArtRingChart` or `ArtDonutChartCard` |
| "雷达图" | `ArtRadarChart` |
| "散点图" | `ArtScatterChart` |
| "K线图", "股票" | `ArtKLineChart` |
| "时间线", "操作日志" | `ArtTimelineListCard` |
| "数据列表卡片", "排行" | `ArtDataListCard` |
| "图片卡片", "封面" | `ArtImageCard` |
| "富文本", "编辑器" | `ArtWangEditor` |
| "Excel 导出/导入" | `ArtExcelExport` / `ArtExcelImport` |
| "拖拽验证" | `ArtDragVerify` |
| "图片裁剪" | `ArtCutterImg` |
| "视频播放" | `ArtVideoPlayer` |
| "数字动画" | `ArtCountTo` |
| "横幅/banner" | `ArtBasicBanner` or `ArtCardBanner` |
| "水印" | `ArtWatermark` |
| "404/403/500" | `ArtException` |
| "结果页/成功页" | `ArtResultPage` |

### B-end Page Composition Patterns

**Dashboard page:**
```vue
<template>
  <div class="p-4 flex flex-col gap-4">
    <el-row :gutter="16">
      <el-col :span="6" v-for="item in stats" :key="item.label">
        <ArtStatsCard v-bind="item" />
      </el-col>
    </el-row>
    <el-row :gutter="16">
      <el-col :span="14">
        <el-card><ArtLineChart :option="lineOption" /></el-card>
      </el-col>
      <el-col :span="10">
        <ArtDataListCard :data="recentList" />
      </el-col>
    </el-row>
    <el-card>
      <ArtTableHeader />
      <ArtTable :columns="columns" :data="tableData" />
    </el-card>
  </div>
</template>
```

**List page:**
```vue
<template>
  <div class="p-4 flex flex-col gap-4">
    <ArtSearchBar :fields="searchFields" @search="handleSearch" />
    <el-card>
      <ArtTableHeader>
        <template #right>
          <el-button type="primary">新增</el-button>
          <ArtExcelExport :data="tableData" />
        </template>
      </ArtTableHeader>
      <ArtTable :columns="columns" :data="tableData" :pagination="pagination" />
    </el-card>
  </div>
</template>
```

**Form page:**
```vue
<template>
  <el-card class="p-4">
    <ArtForm :model="formData" :rules="formRules" :fields="formFields" />
  </el-card>
</template>
```

### Captured Components

1. Read `~/Desktop/component-lib/index.json` for available components.
2. Match by `description`, `tags`, `category`.
3. Read the `.vue` file, adapt to the target project's tokens and imports.

## Code Generation Rules (When No Match Found)

1. **Use `<script setup lang="ts">`** with Composition API.
2. **Use Element Plus** components as building blocks.
3. **Use Tailwind CSS 4** utility classes for layout.
4. **Use design tokens** from `design-tokens.css` — never hardcode hex colors.
5. **Use scoped SCSS** for complex visual styles.
6. Follow the **NoDesk-AI-Design-Guide** principles.

### Design Token Quick Reference

```css
/* Primary */    --color-primary: #FFCB00;
/* Secondary */  --color-secondary: #D97757;
/* Text */       --color-text-primary: #303133;
                 --color-text-regular: #606266;
                 --color-text-secondary: #909399;
/* Background */ --color-bg-page: #F7F5EE;
                 --color-bg: #FFFFFF;
/* Border */     --color-border: #DCDFE6;
/* Fill */       --color-fill: #F5F4F0;
/* Shadow */     --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.04);
                 --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.06);
/* Radius */     --radius-base: 8px;
                 --radius-round: 20px;
/* AI */         --color-ai-gradient-start: #7c3aed;
                 --color-ai-gradient-end: #6366f1;
/* Brand */      --color-brand-accent: #ff6b35;
```

Full token list: `<project-root>/design-tokens.css`

## Collaboration with Other Skills

| Concern | Handled by |
|---|---|
| "Which component to use?" | **component-library** (this skill) |
| "What style/theme to apply?" | NoDesk-AI-Design-Guide |
| "How to replicate a captured design?" | component-replicate |

## Response Format

When you match a component:

1. **What you matched** — component name, which library it's from.
2. **Why it matches** — brief justification.
3. **How to use it** — code with props/slots filled in.
4. **What to customize** — adjustable props.

When no match is found:

1. Tell the user you're creating from scratch.
2. Follow code generation rules.
3. Suggest capturing similar components: "如果你在网上看到类似的好设计，可以用 Component Capture 插件采集下来，下次就能直接复用了。"
