# n8n 集成指南

## 自动触发页面更新

当 n8n 工作流更新视频数据后，可以自动触发网站页面重新生成，让新内容立即展示给用户。

## 配置步骤

### 1. 设置 Revalidation Secret

在您的部署环境（Vercel）中设置环境变量：

**变量名**: `REVALIDATE_SECRET`
**变量值**: 生成一个强随机字符串，例如：`a8f3d9e2b7c4f1e6d3a9b8c7e4f1d2a3`

#### Vercel 设置方法：
1. 打开项目的 Vercel Dashboard
2. 进入 **Settings** → **Environment Variables**
3. 添加新变量：
   - Name: `REVALIDATE_SECRET`
   - Value: `your-super-secret-random-string`
   - Environment: Production, Preview, Development (全选)
4. 保存并重新部署项目

### 2. 在 n8n 中添加 HTTP Request 节点

在您的 n8n 工作流的 **最后一步** 添加 HTTP Request 节点：

#### 节点配置

```
节点名称: Trigger Website Revalidation
节点类型: HTTP Request

Method: POST
URL: https://icebreakgames.video/api/revalidate?secret=YOUR_SECRET_KEY

Headers:
  Content-Type: application/json

Body (可选):
  {
    "source": "n8n",
    "workflow": "{{ $workflow.name }}"
  }
```

**重要**: 将 `YOUR_SECRET_KEY` 替换为您设置的实际 secret 值。

### 3. n8n 工作流示例

完整的工作流结构：

```
1. Schedule Trigger (定时触发)
   ↓
2. HTTP Request - YouTube Search API
   ↓
3. Code - Extract Video IDs
   ↓
4. HTTP Request - YouTube Videos API
   ↓
5. Code - Clean & Classify Videos
   ↓
6. Postgres - Upsert Videos
   ↓
7. HTTP Request - Trigger Revalidation ⭐ (新增)
```

### 4. 测试验证

#### 手动测试 API

使用 curl 命令测试：

```bash
curl -X POST "https://icebreakgames.video/api/revalidate?secret=YOUR_SECRET_KEY"
```

成功响应：
```json
{
  "success": true,
  "message": "Successfully revalidated all pages",
  "paths": ["/", "/long-form", "/shorts"],
  "timestamp": "2025-10-27T10:30:00.000Z"
}
```

失败响应（错误的 secret）：
```json
{
  "success": false,
  "message": "Invalid or missing secret token",
  "timestamp": "2025-10-27T10:30:00.000Z"
}
```

#### 在 n8n 中测试

1. 手动执行 n8n 工作流
2. 查看最后一个 HTTP Request 节点的输出
3. 确认收到 `"success": true` 响应
4. 访问网站，刷新页面查看新数据

## 高级配置

### 仅重新验证特定页面

如果只想重新验证特定页面（例如只更新了长视频），可以添加 `path` 参数：

```
URL: https://icebreakgames.video/api/revalidate?secret=YOUR_SECRET_KEY&path=/long-form
```

可用的路径：
- `/` - 首页（所有视频）
- `/long-form` - 长视频页
- `/shorts` - 短视频页

### 条件触发

在 n8n 中添加 IF 节点，只在数据实际更新时触发重新验证：

```
IF Node (条件判断)
├─ 如果有新视频添加 → 触发 Revalidation
└─ 如果没有变化 → 跳过 Revalidation
```

这样可以节省不必要的页面重新生成。

## 监控和调试

### 查看 n8n 执行日志

在 n8n Execution 页面查看：
- HTTP Request 是否成功
- 响应状态码（应该是 200）
- 响应内容

### 常见问题

#### 1. 401 Unauthorized

**原因**: Secret 不正确或缺失
**解决**: 检查 URL 中的 secret 参数是否与环境变量一致

#### 2. 500 Internal Server Error

**原因**: 服务器内部错误
**解决**: 检查网站日志，确认 API 路由正常工作

#### 3. 网站没有更新

**原因**: 缓存尚未过期或用户浏览器缓存
**解决**:
- 等待几秒钟，ISR 是异步的
- 清除浏览器缓存
- 检查 API 响应是否成功

## 最佳实践

1. **保密 Secret**: 不要在公开的代码或文档中暴露 secret 值
2. **定期更新**: 建议每隔几个月更换一次 secret
3. **监控日志**: 定期检查 revalidation 是否成功执行
4. **测试流程**: 在生产环境部署前，先在开发环境测试

## 工作流程图

```
n8n 更新数据
    ↓
调用 /api/revalidate
    ↓
Next.js 后台重新生成页面
    ↓
用户访问网站看到新内容
(整个过程 < 5 秒)
```

## 总结

通过集成 revalidation API，您可以：

✅ **即时更新** - n8n 更新后几秒内网站显示新内容
✅ **自动化** - 无需手动操作
✅ **高性能** - 保持 ISR 缓存的性能优势
✅ **灵活控制** - 可以选择更新所有页面或特定页面

这样就实现了"数据更新不频繁 + 页面加载超快速"的完美平衡！
