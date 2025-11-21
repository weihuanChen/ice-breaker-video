-- ================================================================
-- 性能优化 - 数据库索引
-- 在执行这些索引创建语句前，请先备份数据库
-- ================================================================

-- ================================================================
-- 1. 视频表索引
-- ================================================================

-- 用于快速查找特定视频 (在 /video/[slug] 页面中使用)
-- 该索引已在 drizzle.ts 中定义为 uniqueIndex，无需重复创建
-- CREATE UNIQUE INDEX idx_videos_slug ON videos(slug);

-- 用于按创建时间排序的查询 (首页列表、API分页)
-- 这是最常用的查询模式，优化排序操作
CREATE INDEX IF NOT EXISTS idx_videos_created_at_desc 
ON videos(created_at DESC);

-- 用于按分类过滤的查询 (long-form 和 shorts 页面)
CREATE INDEX IF NOT EXISTS idx_videos_category 
ON videos(category);

-- ================================================================
-- 2. 视频标签表索引 (视频与标签的关联)
-- ================================================================

-- 用于从标签查找视频 (标签过滤时的关键查询)
CREATE INDEX IF NOT EXISTS idx_video_tags_tag_id 
ON video_tags(tag_id);

-- 用于从视频查找标签 (视频详情页获取视频标签)
CREATE INDEX IF NOT EXISTS idx_video_tags_video_id 
ON video_tags(video_id);

-- 复合索引优化标签过滤性能
-- 用于: WHERE tag_id IN (...) ORDER BY video_id
CREATE INDEX IF NOT EXISTS idx_video_tags_tag_video 
ON video_tags(tag_id, video_id DESC);

-- ================================================================
-- 3. 标签表索引
-- ================================================================

-- 该索引已在 drizzle.ts 中定义为 unique，无需重复创建
-- CREATE UNIQUE INDEX idx_tags_slug ON tags(slug);

-- ================================================================
-- 索引性能验证查询
-- ================================================================

-- 验证索引是否被使用
EXPLAIN ANALYZE
SELECT DISTINCT v.* FROM videos v
INNER JOIN video_tags vt ON v.id = vt.video_id
WHERE vt.tag_id IN (1, 2, 3)
ORDER BY v.created_at DESC
LIMIT 20;

-- 验证单个视频查询
EXPLAIN ANALYZE
SELECT * FROM videos WHERE slug = 'example-slug' LIMIT 1;

-- 验证标签查询
EXPLAIN ANALYZE
SELECT t.*, COUNT(vt.video_id)::int as video_count
FROM tags t
LEFT JOIN video_tags vt ON t.tag_id = vt.tag_id
GROUP BY t.tag_id
ORDER BY COUNT(vt.video_id) DESC;

-- ================================================================
-- 索引维护 (定期执行)
-- ================================================================

-- 分析表统计信息 (查询规划器优化)
-- 建议: 每周执行一次
ANALYZE videos;
ANALYZE tags;
ANALYZE video_tags;

-- 重建碎片化的索引 (按需执行)
-- 注意: 这将锁定表，建议在低峰期执行
-- REINDEX INDEX idx_video_tags_tag_video;
-- REINDEX TABLE videos;

-- ================================================================
-- 索引使用统计 (监控)
-- ================================================================

-- 查看索引使用情况
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan as scan_count,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- 查看未使用的索引
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
  AND idx_scan = 0
  AND indexname NOT LIKE 'pg_toast%'
ORDER BY indexname;

-- ================================================================
-- 清理空间 (定期维护)
-- ================================================================

-- 删除重复或不需要的索引
-- CAUTION: 确保索引确实不再使用
-- DROP INDEX IF EXISTS old_index_name;

-- 真空清理 (删除已删除的行，回收空间)
-- 建议: 每天或每周执行一次
-- VACUUM (ANALYZE) videos;
-- VACUUM (ANALYZE) video_tags;
-- VACUUM (ANALYZE) tags;

