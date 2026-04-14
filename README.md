# 洛克王国伤害计算器 (Roco Damage Calculator)

一个简洁高效的洛克王国对战数据模拟与伤害测算桌面工具。

## 📸 应用预览

![应用截图预览](ui/Snipaste_2026-04-14_16-38-42.png)  
*(界面截图已放在 `ui/`，示例文件：`ui/Snipaste_2026-04-14_16-38-42.png`)*

## ✨ 核心功能

- **属性面板模拟**：一键检索精灵，自定义性格、天赋与努力值，实时预览满级属性区间。
- **实战伤害测算**：支持简单与复杂双模式计算，涵盖增益/克制/天气等乘区，精确还原真实乱数伤害范围。
- **模拟双向对战**：直观的 1v1 对决视图，自动测算双方伤害占比与击倒回合数 (Turns to kill)。

## 🛠 技术栈

基于 `Electron (^29.1.0)` + 原生 `Vanilla JS / HTML / CSS` 构建的无依赖轻量客户端。

## 📁 项目结构

- `index.html`: 应用入口（主窗口）。
- `main.js`: Electron 主进程脚本。
- `src/renderer.js`: 渲染进程脚本。
- `ui/`: 界面相关资源和组件（界面已放在此文件夹）。
- `style.css`: 全局样式。
- `package.json`: 项目配置与启动脚本。
- `start-app.cmd` / `start-app.sh`: 平台启动脚本。

## 🚀 快速启动

```bash
# 1. 下载并进入目录
git clone <本项目地址>
cd roco-desktop

# 2. 安装与运行
npm install
npm start
```
