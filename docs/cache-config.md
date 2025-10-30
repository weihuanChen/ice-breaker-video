# 缓存配置说明

## 当前配置

所有列表页使用 **ISR (Incremental Static Regeneration)** 策略，缓存时间为 **4 小时**。

```typescript
// 在以下文件中配置
// app/page.tsx, app/long-form/page.tsx, app/shorts/page.tsx, app/video/[slug]/page.tsx
export const revalidate = 14400  // 4 hours (14400 seconds)
```

## 如何调整缓存时间

根据您的 n8n 工作流更新频率，可以修改各页面的 `revalidate` 值：

### 推荐配置

| 更新频率 | Revalidate 值 | 说明 |
|---------|--------------|------|
| 一天多次 | `3600` | 1 小时 - 早期开发阶段 |
| 一天一次 | `14400` | 4 小时 - 当前配置（推荐） |
| 一周一次 | `86400` | 24 小时 - 上线后最佳性能 |

### 修改步骤

编辑以下文件，修改 `revalidate` 的值：

1. `app/page.tsx` - 首页
2. `app/long-form/page.tsx` - 长视频页
3. `app/shorts/page.tsx` - 短视频页
4. `app/video/[slug]/page.tsx` - 视频详情页

例如，改为 24 小时：

```typescript
export const revalidate = 86400  // 24 hours
```

## 手动触发更新

如果 n8n 更新了数据，想立即在网站上看到，可以调用 API：

```bash
curl -X POST "https://icebreakgames.video/api/revalidate?secret=YOUR_SECRET_KEY"
```

### n8n 集成

在 n8n 工作流的最后添加 **HTTP Request** 节点：

- **Method**: POST
- **URL**: `https://icebreakgames.video/api/revalidate?secret=YOUR_SECRET_KEY`

这样每次更新数据后，页面会自动重新生成。

## 性能提升

使用 ISR 后：

- ✅ **响应速度**: 从 500-1000ms 降低到 20-50ms（**50倍提升**）
- ✅ **数据库负载**: 大幅降低，只在重新验证时查询
- ✅ **用户体验**: 页面加载几乎瞬时完成
- ✅ **成本优化**: 减少数据库连接和服务器计算
