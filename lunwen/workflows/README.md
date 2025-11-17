### 工作流总览（n8n）

本目录包含两个后端工作流（n8n JSON 导出），分别服务于“测试代码生成”和“测试方案/向量生成”两类需求：

- 代码后端.json：面向芯片测试“代码生成”。
- 方案后端.json：面向芯片测试“方案与测试向量生成”。

两者通过 Webhook 接收外部请求，路由到相应 AI Agent，使用 DeepSeek 模型与 Google Docs 工具协作完成生成，并对响应进行统一格式化与错误处理。

---

### 1) 代码后端.json（测试代码生成）

- 名称：`代码后端`
- 目标：根据用户输入的芯片型号与需求，生成完整、可执行且含注释的测试代码。

核心节点与职责：
- Webhook：`POST /webhook/1e50cbd3-cc31-4ab8-80c4-aa4aadf1e5fc`（节点名：`Webhook测试代码`）
- 路由：`工作流路由` 按 `workflowType` 分发：`code|quick -> AI Agent`，`plan -> AI Agent1`（默认回落到 `code`）
- 语言模型：`DeepSeek Chat Model`/`DeepSeek Chat Model1`（模型：`deepseek-reasoner` 或默认）
- 工具：多份 Google Docs Tool（`test1`~`test5`、`tesst00`）用于读取规范/手册
- Agent：`AI Agent1`（提示词聚焦“生成测试代码”，严格依据手册字段与顺序）
- 响应格式化：`格式化响应` 将 Agent 输出包裹成统一 JSON
- 返回：`Webhook响应` 统一设置 CORS/Content-Type
- 错误处理：`错误处理` 将异常转换为统一 JSON

输入规范（请求体 JSON）：
```json
{
  "workflowType": "code" | "quick" | "plan",  
  "message": "用户自然语言需求，如：为SN74LS08生成测试代码…",
  "webhookUrl": "可选，用于回调转发"
}
```

Agent 关键约束（节选）：
- 若未给出芯片型号，先要求用户提供（如 SN74LS192、SN74LS08 等）。
- 仅使用指定 Google Docs 中的数据手册内容，禁止外部资料。
- 生成顺序固定（init/CON/FUN/VOH/VOL/VIH/VIL/IIH/IIL/II）。
- 代码需“完整、可执行、含详细注释”，并严格按手册参数设置测试条件。

成功响应示例：
```json
{
  "success": true,
  "timestamp": "2025-01-01T00:00:00.000Z",
  "workflowType": "code",
  "output": "…完整测试代码…",
  "message": "测试代码生成完成",
  "status": "completed"
}
```

失败响应示例：
```json
{
  "success": false,
  "timestamp": "2025-01-01T00:00:00.000Z",
  "workflowType": "code",
  "output": null,
  "message": "处理过程中出现错误",
  "error": "错误信息",
  "status": "error"
}
```

---

### 2) 方案后端.json（测试方案与向量生成）

- 名称：`方案后端`
- 目标：根据用户输入的芯片型号与需求，生成“测试方案（VOH/VOL、IOH/IOL、ICC、VIK、CON、FUN）”及“FUN测试向量表格”。

核心节点与职责：
- Webhook：
  - `POST /webhook/1e50cbd3-cc31-4ab8-80c4-aa4aadf1e5fc`（公共入口，配合路由）
  - `POST /webhook/f27ab7f0-1c71-4929-8163-24d372a8761b`（节点名：`Webhook - 测试方案生成`）
- 路由：`工作流路由` 同上，`plan -> AI Agent1`
- 语言模型：`DeepSeek Chat Model1`（模型：`deepseek-reasoner`）
- 工具：`tesst00` 与 `tesst000`（Google Docs Tool）读取数据手册与模板
- Agent：`AI Agent1`（提示词聚焦“生成测试方案+向量”，若缺型号先索取）
- Google Docs 写入：`Google Docs` 节点将 `{{$json.output}}` 插入到目标文档
- 响应格式化：`格式化响应` 按 `workflowType` 选择输出信息
- 返回：`Webhook响应` 统一设置 CORS/Content-Type
- 错误处理：`错误处理` 统一异常结构

输入规范（请求体 JSON）：
```json
{
  "workflowType": "plan",
  "message": "用户自然语言需求，如：为SN74LS08生成测试方案…",
  "webhookUrl": "可选，用于回调转发"
}
```

Agent 关键约束（节选）：
- 若未给出芯片型号，先要求用户提供。
- 从《tesst00》提取芯片参数；依据《tesst000》模板组织方案。
- 输出包括完整方案、FUN向量表格（网页可读表格）、测试条件与合格标准。

成功响应示例：
```json
{
  "success": true,
  "timestamp": "2025-01-01T00:00:00.000Z",
  "workflowType": "plan",
  "output": "…完整测试方案与测试向量（或文档链接）…",
  "message": "测试方案生成完成",
  "status": "completed"
}
```

---

### 3) 路由与统一响应

- 路由逻辑（两份工作流均包含名为 `工作流路由` 的节点）：
  - `workflowType === 'code' | 'quick'` -> 走代码生成 Agent
  - `workflowType === 'plan'` -> 走方案生成 Agent
  - 其他/缺省 -> 默认按 `code` 处理
- 响应头：统一返回 `application/json`，并开启 `CORS`（`*`，`GET, POST, OPTIONS`）。
- 格式化：分别通过 `格式化响应` 节点包装为统一字段：`success/timestamp/workflowType/output/message/status`（并在错误时返回 `error`）。

---

### 4) 身份与外部依赖

- DeepSeek：需要在 n8n 凭据中配置 `DeepSeek account` 或 `DeepSeek account 2`（对应两个工作流中的不同节点）。
- Google Docs：需要配置 `Google Docs account`，并确保相关文档的访问权限（链接见各节点 `documentURL`）。

---

### 5) 调用示例（本地/服务器反向代理到 n8n）

以“代码生成”为例：
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "workflowType": "code",
    "message": "为SN74LS08生成完整测试代码，含初始化和功能测试",
    "webhookUrl": "https://your-callback.example.com/hook"
  }' \
  https://your-n8n.example.com/webhook/1e50cbd3-cc31-4ab8-80c4-aa4aadf1e5fc
```

以“方案生成”为例：
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "workflowType": "plan",
    "message": "为SN74LS08生成测试方案和FUN测试向量"
  }' \
  https://your-n8n.example.com/webhook/f27ab7f0-1c71-4929-8163-24d372a8761b
```

---

### 6) 自定义与扩展建议

- 增加/替换数据手册：在 Google Docs 新文档中维护，更新节点 `documentURL` 即可。
- 审计输出：在 `格式化响应` 加入输出片段截断、敏感信息移除等。
- 持久化：在 `格式化响应` 后串接数据库节点，落库请求与结果。
- 回调投递：使用 `HTTP Request - 转发到AI Agent` 结合 `webhookUrl` 实现异步回调。
- 更细粒度路由：依据 `message` 关键字或芯片系列，拆分至不同 Agent/Prompt。

---

### 7) 文件与端点速查

- `workflows/代码后端.json`：测试代码生成；主要入口 Webhook：`/webhook/1e50cbd3-cc31-4ab8-80c4-aa4aadf1e5fc`
- `workflows/方案后端.json`：测试方案与向量生成；入口 Webhook：
  - `/webhook/1e50cbd3-cc31-4ab8-80c4-aa4aadf1e5fc`（公共入口，经路由）
  - `/webhook/f27ab7f0-1c71-4929-8163-24d372a8761b`（专用于方案生成）

如需进一步自动化部署与版本化，建议将上述两份 JSON 作为 n8n 的 `import` 源统一管理，并在 CI 中加入校验与快照比对。


