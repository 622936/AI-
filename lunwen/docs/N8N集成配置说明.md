# N8N工作流与网站集成配置说明

## 🎯 集成概述

您的网站现在已经集成了N8N工作流功能，可以通过聊天界面调用您的芯片测试工作流。

## 📋 工作流分析

根据您的`192 (1).json`文件，您有两个主要工作流：

### 1. AI Agent工作流（测试代码生成）
- **Webhook ID**: `1e50cbd3-cc31-4ab8-80c4-aa4aadf1e5fc`
- **功能**: 生成芯片测试代码（CON, FUN, VOH, VOL, VIH, VIL, IIH, IIL, II）
- **目标芯片**: SN74LS192

### 2. AI Agent1工作流（测试方案生成）
- **Webhook ID**: `f27ab7f0-1c71-4929-8163-24d372a8761b`
- **功能**: 生成测试方案和测试向量
- **输出**: 测试方案文档和测试向量表格

## 🔧 配置步骤

### 步骤1: 更新N8N配置

在您的网站文件中，找到以下配置并更新：

```javascript
const N8N_CONFIG = {
    // 替换为您的实际N8N实例URL
    baseUrl: 'https://your-n8n-instance.com',
    webhookUrls: {
        codeGen: 'https://your-n8n-instance.com/webhook/1e50cbd3-cc31-4ab8-80c4-aa4aadf1e5fc',
        testPlan: 'https://your-n8n-instance.com/webhook/f27ab7f0-1c71-4929-8163-24d372a8761b'
    }
};
```

### 步骤2: 获取您的N8N实例URL

1. 登录您的N8N实例
2. 复制您的实例URL（例如：`https://n8n.yourdomain.com`）
3. 将URL替换到配置中

### 步骤3: 验证Webhook配置

确保您的N8N工作流中的Webhook节点配置正确：

#### Webhook节点配置
- **HTTP Method**: POST
- **Path**: 使用默认路径或自定义路径
- **Response Mode**: 选择"On Received"或"Using 'Respond to Webhook' Node"

#### HTTP Request节点配置
- **Method**: POST
- **URL**: 您的N8N实例URL + webhook路径

## 🚀 功能特性

### 聊天界面功能
1. **工作流选择**: 用户可以选择不同的工作流类型
2. **实时状态**: 显示工作流执行状态
3. **快速输入**: 预设的快速输入模板
4. **响应式设计**: 适配各种设备

### 支持的工作流类型
- **测试代码生成**: 生成完整的芯片测试代码
- **测试方案生成**: 生成测试方案和测试向量
- **快速测试**: 基础功能验证

## 📝 使用说明

### 用户操作流程
1. 点击网站上的"开始技术交流"按钮
2. 选择工作流类型（测试代码生成/测试方案生成）
3. 输入芯片型号或测试需求
4. 系统自动调用对应的N8N工作流
5. 查看生成的结果

### 快速输入模板
- `SN74LS192`: 生成SN74LS192的测试代码
- `SN74LS08`: 生成SN74LS08的测试方案
- `测试向量`: 生成测试向量表格

## 🔍 故障排除

### 常见问题

1. **Webhook无法访问**
   - 检查N8N实例是否正常运行
   - 验证Webhook URL是否正确
   - 确认网络连接正常

2. **工作流执行失败**
   - 检查N8N工作流配置
   - 验证Google Docs连接
   - 确认DeepSeek API配置

3. **CORS错误**
   - 在N8N中配置CORS设置
   - 或使用代理服务器

### 调试方法
1. 打开浏览器开发者工具
2. 查看Console中的错误信息
3. 检查Network标签页中的请求状态
4. 验证N8N工作流执行日志

## 📊 数据流程

```
用户输入 → 网站聊天界面 → N8N Webhook → AI Agent → Google Docs → DeepSeek → 结果返回
```

## 🎨 自定义配置

### 添加新的工作流
1. 在N8N中创建新的工作流
2. 添加Webhook节点
3. 在网站配置中添加新的webhook URL
4. 更新工作流选择按钮

### 修改界面样式
- 编辑CSS样式类
- 调整颜色和布局
- 添加新的功能按钮

## 📞 技术支持

如果您在集成过程中遇到问题，可以：
1. 检查N8N工作流执行日志
2. 验证所有API连接
3. 测试Webhook端点
4. 联系技术支持

---

**注意**: 请确保您的N8N实例和所有相关服务都正常运行，并且网络连接稳定。
