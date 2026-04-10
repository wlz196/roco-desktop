#!/bin/bash

# 切换到脚本所在目录
cd "$(dirname "$0")"

# 检查 Node.js
if ! command -v node >/dev/null 2>&1; then
  echo "[ERROR] Node.js 未安装，请先安装 Node.js LTS 版本。"
  exit 1
fi

# 检查 npm
if ! command -v npm >/dev/null 2>&1; then
  echo "[ERROR] npm 未安装，请先安装 npm。"
  exit 1
fi

# 安装依赖
if [ ! -d "node_modules" ]; then
  echo "[INFO] 未检测到 node_modules，正在安装依赖..."
  npm install || { echo "[ERROR] npm install 失败"; exit 1; }
fi

# 启动应用
npm start || { echo "[ERROR] 应用启动失败"; exit 1; }
