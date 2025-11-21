# Icebreaker Games 视频聚合平台技术方案

## 1. 概述与目标

本项目旨在构建一个专业的 Icebreaker Games（破冰游戏）视频聚合与推荐平台。通过自动化工具定时从 YouTube Data API 采集高质量、分类明确的视频数据，并存储于高性能 Serverless 数据库中，最终通过 Next.js 前端应用高效地展示给用户。

**核心目标：**

1. **自动化采集：** 利用 n8n 搭建稳定、可重复执行的视频数据同步流程。
2. **数据分类：** 将视频数据（基于时长）自动区分为 "Short"（短视频）和 "Long"（长视频），以优化前端菜单展示。
3. **高性能展示：** 利用 Next.js 结合 PostgreSQL (Neon) 实现快速、响应式的用户体验。

## 2. 技术栈选型



| **层面**            | **技术栈**                       | **角色定位**                                                 | **优势**                                                     |
| ------------------- | -------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **自动化/后端逻辑** | **n8n**                          | 负责工作流调度、API 调用、数据清洗、分类和数据库写入。       | 低代码、可视化流程编排，高度稳定。                           |
| **数据持久化**      | **Neon (Serverless PostgreSQL)** | 存储清洗后的视频元数据和分类信息。                           | Serverless 架构，自动 Scale-to-Zero，高性能，与 Next.js / Vercel 集成友好。 |
| **前端应用/展示**   | **Next.js (React)**              | 构建用户界面，通过 SSR/SSG 确保快速加载和良好的 SEO。        | 卓越的性能和 SEO 能力，适合内容聚合类网站。                  |
| **数据源**          | **YouTube Data API v3**          | 提供视频搜索 (`search:list`) 和详细信息查询 (`videos:list`) 接口。 | 官方稳定，数据准确。                                         |

## 3. n8n 自动化工作流 (Data Pipeline)

工作流设定为每天或定期执行，以保持数据的实时性。

### 3.1 流程图解

`Cron Trigger` → `HTTP Request (Search)` → `Code (Aggregate IDs)` → `HTTP Request (Details)` → `Code (Split Items)` → `Code (Clean & Classify)` → `Postgres (Upsert)`

### 3.2 关键步骤与逻辑实现

| **步骤**                | **节点类型**   | **关键操作/逻辑**                                            | **关键输出**                                                |
| ----------------------- | -------------- | ------------------------------------------------------------ | ----------------------------------------------------------- |
| **1. Search Videos**    | `HTTP Request` | 调用 `search:list`，参数 `q=ice breaker games`，获取最多 50 个 `videoId`。 | 1 Item (JSON 中包含所有视频 ID)                             |
| **2. Aggregate IDs**    | `Code`         | 将步骤 1 输出中的所有 `videoId` 提取并 `join` 成一个逗号分隔的字符串。 | 1 Item (包含 `videoIdsString`)                              |
| **3. Get Details**      | `HTTP Request` | 调用 `videos:list`，使用 `id={{ $json.videoIdsString }}`，`part=contentDetails,snippet`。 | 1 Item (包含所有视频的完整详情 JSON)                        |
| **4. Split Items**      | `Code`         | **替代 Split Items 节点**。将步骤 3 巨大的 JSON Item 数组 (`json.items`) 拆分为 **N 个独立的 Items**。 | N 个 Items (每个 Item 对应一个视频)                         |
| **5. Clean & Classify** | `Code`         | **隐式循环 N 次**。执行以下操作： 1. **时长转换：** 将 `contentDetails.duration` (ISO 8601) 转换为 `durationSeconds` (整数)。 2. **自动分类：** 根据 `durationSeconds` (例如 <= 90 秒判定为 'short') 设定 `category` 字段。 3. **Slug 生成：** 将 `title` 转换为 URL 友好的 `slug`。 | N 个 Items (包含 `videoId`, `title`, `slug`, `category` 等) |
| **6. Database Upsert**  | `Postgres`     | **隐式循环 N 次**。配置 `Operation=Execute Statement`，执行手动控制格式的 `INSERT ... ON CONFLICT (video_id) DO UPDATE` 语句，将数据写入 Neon DB。 | 成功/失败日志                                               |

## 4. 数据层 Schema (Neon PostgreSQL)

必须在 n8n 运行前创建以下表格，以保证 `Upsert` 逻辑的健壮性。

```sql
CREATE TABLE videos (
    -- 主键：自动递增的唯一标识符
    id SERIAL PRIMARY KEY,

    -- 核心唯一键：用于 n8n 匹配和更新
    video_id VARCHAR(15) UNIQUE NOT NULL,

    -- 内容信息
    title VARCHAR(255) NOT NULL,
    description TEXT,
    channel_title VARCHAR(100),

    -- 分类与 URL
    slug VARCHAR(255) UNIQUE NOT NULL,
    video_url VARCHAR(255) NOT NULL,

    -- 时长与分类
    duration_seconds INTEGER,
    category VARCHAR(20) DEFAULT 'long', -- 'short' 或 'long'

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```
标签表和关系表
```sql
-- 1. 创建标签定义表 (tags)
CREATE TABLE tags (
    tag_id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL, -- 标签的名称，必须唯一
    slug VARCHAR(50) UNIQUE NOT NULL  -- 用于 URL 的友好 slug
);

-- 2. 创建关系表 (video_tags)
CREATE TABLE video_tags (
    video_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    
    -- 复合主键，确保一个视频不会重复添加同一个标签
    PRIMARY KEY (video_id, tag_id), 
    
    -- 外键约束，确保引用的视频和标签存在
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(tag_id) ON DELETE CASCADE
);

-- (可选：删除 videos 表中旧的 TEXT[] 字段，如果你已创建)
-- ALTER TABLE videos DROP COLUMN game_tags;
```
## 5. Next.js 前端展示方案

### 5.1 数据获取策略

Next.js 应用应使用 **Server-Side Rendering (SSR)** 或 **Static Site Generation (SSG)** 结合 **Incremental Static Regeneration (ISR)** 来获取数据。

- **SSR/SSG (推荐):** 在构建或请求时获取数据，而不是在客户端。例如使用 `getStaticProps` 或 `getServerSideProps`。
- **查询：** 使用 ORM (如 drizzle) 或 SQL 客户端连接 Neon DB，根据 `category` 字段进行筛选。

### 5.2 前端路由与组件

为了区分短视频和长视频，建议设置两个主菜单和对应的路由：

1. **长视频页面 (Long-Form)**
   - **路由：** `/long-form`
   - **数据查询：** `SELECT * FROM videos WHERE category = 'long' ORDER BY created_at DESC;`
2. **短视频页面 (Shorts)**
   - **路由：** `/shorts`
   - **数据查询：** `SELECT * FROM videos WHERE category = 'short' ORDER BY created_at DESC;`

### 5.3 视频播放器实现

在单个视频详情页 (`/video/[slug]`)，使用 **YouTube IFrame Player API** 或简单的 `<iframe>` 嵌入，通过数据库中的 `video_id` 来加载视频，确保最佳兼容性和用户体验。