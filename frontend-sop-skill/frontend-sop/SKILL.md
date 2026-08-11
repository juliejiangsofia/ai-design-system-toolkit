---
name: frontend-sop
description: >-
  Master workflow orchestrator for all frontend/UI tasks. This skill defines the
  mandatory SOP (Standard Operating Procedure) that must be followed before writing
  any page, component, demo, or UI code. It ensures design direction is always
  established first via DESIGN.md, then routes to the appropriate skill.
  Trigger on ANY of these signals — before any other skill activates:
  "写页面", "做页面", "做个demo", "做个组件", "写个界面", "搭界面", "做产品",
  "写前端", "帮我做", "做个xx功能的页面", "dashboard", "管理后台", "官网",
  "landing page", "做UI", "build a page", "create a component", "build UI",
  or ANY request that will result in generating Vue/HTML/CSS code.
---

# Frontend SOP — Design First, Code Second

You are the entry point for all frontend work. Your job is to enforce one rule:

> **No code is written until design direction is established.**

Follow this SOP every time, without exception.

---

## The SOP

```
用户提出任何 UI / 页面 / 产品需求
         │
         ▼
  Step 1: 检查 DESIGN.md
         │
         ├─ 存在 → 读取，提取 token 和设计意图，进入 Step 3
         │
         └─ 不存在 → Step 2: 建立 DESIGN.md
                          │
                          ├─ 用户有参考网站 URL → generate-design-md Skill (Path A)
                          ├─ 用户有截图 → generate-design-md Skill (Path B)
                          └─ 用户没有参考 → generate-design-md Skill (Path C: 默认 token)
                          │
                          ▼
                    DESIGN.md 写入项目根目录
                          │
                          ▼
  Step 3: 建立项目 Cursor Rule
         │
         └─ .cursor/rules/follow-design-system.mdc 是否存在？
              │
              ├─ 存在 → 跳过
              └─ 不存在 → 提示用户复制 cursor-rule-template.mdc
         │
         ▼
  Step 4: 开始构建
         │
         ├─ B端管理后台 → component-library Skill + NoDesk-AI-Design-Guide
         ├─ 官网 / Landing page → NoDesk-AI-Design-Guide (display/landing pattern)
         ├─ AI 产品界面 → NoDesk-AI-Design-Guide (AI product tokens)
         └─ 通用组件 → component-replicate or NoDesk-AI-Design-Guide
```

---

## Step 1: Check for DESIGN.md

First thing, every time:

```
Does <project-root>/DESIGN.md exist?
```

- If **yes**: Read it. Confirm with the user: "我看到这个项目已有 DESIGN.md，将基于它来构建。"
- If **no**: Do NOT start building. Go to Step 2.

---

## Step 2: Establish DESIGN.md

Tell the user:

> 在开始写代码之前，我需要先确定这个项目的设计方向。
> 只需要 1 分钟——这会让后续所有生成的代码在视觉上保持一致。
>
> 你有以下几个选择：
>
> **A. 我有想参考的网站** → 把 URL 发给我，我来提取它的设计系统
> **B. 我有截图** → 把截图发给我，我来分析视觉风格
> **C. 直接用默认配色** → 我用内置的暖白+黄色设计系统帮你生成 DESIGN.md，5 秒完成
>
> 选哪个？

Then follow the corresponding path in `generate-design-md` Skill.

---

## Step 3: Ensure Cursor Rule Exists

After DESIGN.md is created (or confirmed), check if `.cursor/rules/follow-design-system.mdc` exists.

If not, tell the user:

> 还需要最后一步：在项目里添加一条 Cursor Rule，这样以后每次生成代码都会自动遵循
> DESIGN.md，不用每次手动提醒。
>
> 请在你的项目根目录创建 `.cursor/rules/follow-design-system.mdc`，
> 内容复制自 `generate-design-md` Skill 的 `references/cursor-rule-template.mdc`。

---

## Step 4: Scope Check — Split or Go?

Before writing any code, count the modules in the user's request.

**If the request contains more than 1 module / page / distinct section:**

Do NOT output everything at once. Instead:

1. **List all detected modules** and ask the user to confirm the breakdown:

   > 我把你的需求拆成了以下几个模块，你看一下对不对：
   >
   > 1. [模块名] — [一句话说明]
   > 2. [模块名] — [一句话说明]
   > 3. ...
   >
   > 我先做第 1 个「[模块名]」，你确认效果后我们再继续。

2. **Build only the first module.** Output its full code, let the user review.

3. **After the user confirms**, ask:

   > 这个模块效果怎么样？需要调整吗？
   > 如果 OK 的话，我继续做下一个「[模块名]」。

4. Proceed module by module until complete.

**If the request is a single module / component:**

Go directly to building. No need to split.

---

## Step 5: Route to the Right Skill

With DESIGN.md confirmed and scope agreed, identify the product line and route:

| Product line | Primary skill | Notes |
|---|---|---|
| B端管理后台 | `component-library` → `NoDesk-AI-Design-Guide` | Check Art Design Pro components first |
| 官网 / Marketing | `NoDesk-AI-Design-Guide` (display pattern) | Spacious layout, big typography |
| AI 产品 | `NoDesk-AI-Design-Guide` (AI token preset) | Gradient accents, chat layouts |
| 独立组件 | `component-replicate` or `NoDesk-AI-Design-Guide` | Match DESIGN.md tokens |

---

## What to Tell the User When Starting

When you receive a UI/page/product request, open with this — don't jump into planning:

> 好的，在开始规划功能和页面之前，先确认一下设计方向——
> 这个项目有 DESIGN.md 吗？或者你有想参考的网站 / 截图？
> （如果没有也没关系，我用默认配色帮你快速生成一个）

This single question sets the right expectation and prevents jumping into code without design context.

---

## Anti-Pattern: What NOT to Do

```
❌ User: "帮我写一个视频自动化创作的桌面界面"
   AI: "好的，这是一个功能丰富的平台，先问你几个架构问题..." → 直接进入功能规划

✅ User: "帮我写一个视频自动化创作的桌面界面"
   AI: "好的，在规划功能之前先确认设计方向——有参考网站或截图吗，还是用默认配色？"
       → 建立 DESIGN.md → 然后进入功能规划
```

Design and function planning can happen in parallel, but DESIGN.md must exist before
any `.vue` file is written.
