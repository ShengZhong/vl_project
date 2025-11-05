#!/bin/bash

# VisionLine 产品原型项目启动脚本 (Mac/Linux)
# 使用方法: ./start.sh

echo "================================================"
echo "   VisionLine 产品原型项目"
echo "   正在启动开发服务器..."
echo "================================================"
echo ""

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null
then
    echo "❌ 错误: 未检测到 Node.js"
    echo "请先安装 Node.js (https://nodejs.org/)"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"
echo "✅ npm 版本: $(npm --version)"
echo ""

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，正在安装依赖..."
    echo "这可能需要几分钟时间，请耐心等待..."
    echo ""
    npm install
    if [ $? -ne 0 ]; then
        echo ""
        echo "❌ 依赖安装失败"
        echo "请检查网络连接或尝试使用淘宝镜像:"
        echo "npm config set registry https://registry.npmmirror.com"
        exit 1
    fi
    echo ""
    echo "✅ 依赖安装完成"
    echo ""
fi

# 清理缓存（可选）
echo "🧹 清理缓存..."
rm -rf .umi .umi-production
echo ""

# 启动开发服务器
echo "🚀 启动开发服务器..."
echo ""
echo "================================================"
echo "   服务器启动后，请访问:"
echo "   http://localhost:8000"
echo ""
echo "   按 Ctrl+C 停止服务器"
echo "================================================"
echo ""

npm run dev

