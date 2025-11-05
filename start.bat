@echo off
REM VisionLine 产品原型项目启动脚本 (Windows)
REM 使用方法: start.bat

echo ================================================
echo    VisionLine 产品原型项目
echo    正在启动开发服务器...
echo ================================================
echo.

REM 检查 Node.js 是否安装
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 错误: 未检测到 Node.js
    echo 请先安装 Node.js (https://nodejs.org/)
    pause
    exit /b 1
)

echo ✅ Node.js 版本:
node --version
echo ✅ npm 版本:
npm --version
echo.

REM 检查 node_modules 是否存在
if not exist "node_modules" (
    echo 📦 首次运行，正在安装依赖...
    echo 这可能需要几分钟时间，请耐心等待...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo ❌ 依赖安装失败
        echo 请检查网络连接或尝试使用淘宝镜像:
        echo npm config set registry https://registry.npmmirror.com
        pause
        exit /b 1
    )
    echo.
    echo ✅ 依赖安装完成
    echo.
)

REM 清理缓存（可选）
echo 🧹 清理缓存...
if exist ".umi" rd /s /q .umi
if exist ".umi-production" rd /s /q .umi-production
echo.

REM 启动开发服务器
echo 🚀 启动开发服务器...
echo.
echo ================================================
echo    服务器启动后，请访问:
echo    http://localhost:8000
echo.
echo    按 Ctrl+C 停止服务器
echo ================================================
echo.

call npm run dev

pause

