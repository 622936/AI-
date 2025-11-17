# 戴煦 - AI驱动芯片测试技术项目

## 📋 项目概述

这是一个展示AI驱动芯片测试技术的完整项目，包含个人网站、N8N工作流自动化平台集成，以及相关的技术文档。项目展示了如何将人工智能技术融入传统芯片测试流程，提高测试效率和准确性。

## 🏗️ 项目结构

```
lunwen/
├── 📁 website/                    # 网站相关文件
│   ├── 戴煦个人网站.html          # 主网站文件
│   ├── simple_test.html           # 简单测试页面
│   ├── test.html                  # 基础测试页面
│   ├── server.js                  # 本地HTTP服务器
│   ├── package.json               # 项目配置
│   ├── start.bat                  # Windows启动脚本
│   ├── start.sh                   # Linux/Mac启动脚本
│   └── README.md                  # 网站说明文档
├── 📁 workflows/                  # N8N工作流文件
│   ├── 代码后端.json                    # 代码生成工作流
│   ├── 方案后端.json                    # 测试方案与向量生成工作流
│   └── README.md                       # 工作流详细说明
├── 📁 docs/                       # 技术文档
│   ├── N8N集成配置说明.md         # N8N集成配置文档
│   ├── 工作流集成配置说明.md      # 工作流配置文档
│   ├── lunwen.txt                 # 论文内容
│   ├── lunwenmofang.txt           # 论文模板
│   └── 大语言模型赋能的创意写作：应用框架与案例实践_卢淑怡.pdf
├── 📁 .vscode/                    # VS Code配置
│   └── launch.json                # 调试配置
└── README.md                      # 项目主文档
```

## 🚀 快速开始

### 1. 启动网站

#### 方法一：使用启动脚本（推荐）

**Windows用户：**
```cmd
cd website
start.bat
```

**Linux/Mac用户：**
```bash
cd website
chmod +x start.sh
./start.sh
```

#### 方法二：手动启动
```bash
cd website
node server.js
```

#### 方法三：VS Code调试
1. 在VS Code中打开项目
2. 按F5键
3. 选择以下配置之一：
   - "Open 戴煦个人网站.html (Chrome)" - 使用Chrome浏览器
   - "Open 戴煦个人网站.html (Edge)" - 使用Edge浏览器
   - "Open with Local Server (Chrome)" - 通过本地服务器访问

### 2. 访问网站

启动服务器后，在浏览器中访问：
- **主网站**：http://localhost:3000
- **测试页面**：http://localhost:3000/simple_test.html

## 🔧 N8N工作流配置

### 工作流说明

1. **代码生成工作流** (`workflows/代码后端.json`)
   - Webhook URL: `http://localhost:5678/webhook/1e50cbd3-cc31-4ab8-80c4-aa4aadf1e5fc`
   - 功能：生成芯片测试代码
   - 支持：CON, FUN, VOH, VOL, VIH, VIL, IIH, IIL, II测试

2. **测试方案生成工作流** (`workflows/方案后端.json`)
   - Webhook URL: `http://localhost:5678/webhook/f27ab7f0-1c71-4929-8163-24d372a8761b`
   - 功能：生成测试方案和测试向量
   - 支持：测试方案、测试向量、测试条件

### 导入工作流

1. 启动N8N实例（http://localhost:5678）
2. 在N8N界面中导入对应的工作流JSON文件
3. 配置Google Docs和DeepSeek API凭据
4. 激活工作流

## 🎯 功能特性

### 网站功能
- 🚀 **AI芯片测试代码生成** - 基于DeepSeek模型的智能代码生成
- 📋 **测试方案和测试向量生成** - 完整的测试方案制定
- 🔧 **N8N工作流集成** - 自动化工作流处理
- 💬 **智能聊天界面** - 交互式AI助手
- 📱 **响应式设计** - 适配各种设备
- 🎨 **现代化UI** - 基于Tailwind CSS的美观界面

### 技术特性
- **AI模型集成**：DeepSeek Chat Model
- **知识库**：Google Docs集成
- **自动化**：N8N工作流平台
- **前端技术**：HTML5, CSS3, JavaScript, Tailwind CSS
- **动画效果**：AOS (Animate On Scroll)
- **图标库**：Font Awesome

## 🛠️ 技术栈

### 前端技术
- **HTML5** - 页面结构
- **CSS3** - 样式设计
- **JavaScript (ES6+)** - 交互逻辑
- **Tailwind CSS** - 样式框架
- **Font Awesome** - 图标库
- **AOS** - 滚动动画

### 后端技术
- **N8N** - 工作流自动化平台
- **DeepSeek API** - AI模型服务
- **Google Docs API** - 知识库集成
- **Node.js** - 本地服务器

### 开发工具
- **VS Code** - 代码编辑器
- **Git** - 版本控制
- **Chrome DevTools** - 调试工具

## 📚 文档说明

### 技术文档
- `docs/N8N集成配置说明.md` - N8N平台集成配置指南
- `docs/工作流集成配置说明.md` - 工作流配置详细说明
- `docs/lunwen.txt` - 论文内容
- `docs/lunwenmofang.txt` - 论文模板

### 工作流文档
- `workflows/` - 包含所有N8N工作流文件
- `workflows/README.md` - 两个核心工作流的节点职责、输入规范、路由与调用示例

## 🔧 配置说明

### 环境要求
- Node.js 14+
- N8N实例运行在 http://localhost:5678
- 现代浏览器（Chrome, Firefox, Safari, Edge）

### API配置
1. **DeepSeek API**：需要在N8N中配置API密钥
2. **Google Docs API**：需要配置OAuth2凭据
3. **Webhook URLs**：确保N8N工作流正确配置

### 浏览器兼容性
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🚨 故障排除

### 常见问题

1. **网站无法访问**
   - 检查Node.js是否正确安装
   - 确认端口3000未被占用
   - 检查防火墙设置

2. **N8N工作流无响应**
   - 确认N8N实例正在运行
   - 检查Webhook URL配置
   - 验证API凭据设置

3. **浏览器连接问题**
   - 尝试使用不同的浏览器
   - 检查CORS设置
   - 清除浏览器缓存

### 调试方法
1. 打开浏览器开发者工具（F12）
2. 查看控制台错误信息
3. 检查网络请求状态
4. 查看N8N执行日志

## 📞 联系方式

- **邮箱**：3350222390@qq.com
- **电话**：19397018449
- **项目地址**：当前目录

## 📄 许可证

MIT License

## 🙏 致谢

感谢以下开源项目和技术：
- N8N - 工作流自动化平台
- DeepSeek - AI模型服务
- Tailwind CSS - CSS框架
- Font Awesome - 图标库
- AOS - 动画库

---

**注意**：本项目仅用于学习和演示目的，请确保在生产环境中进行适当的安全配置。
