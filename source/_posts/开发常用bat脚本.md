---
title: 开发常用bat脚本
comments: false
date: 2024-12-19 11:04:32
cover: https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/20241219153920804.png
top_img: https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/20241219153920804.png
tags: ["Bat","脚本","恢复"]
categories: ["脚本"]
---

# Bat脚本

​	[批处理](https://baike.baidu.com/item/批处理/1448600?fromModule=lemma_inlink)文件，在DOS和Windows（任意）[系统](https://baike.baidu.com/item/系统/479832?fromModule=lemma_inlink)中，.bat文件是[可执行文件](https://baike.baidu.com/item/可执行文件/2885816?fromModule=lemma_inlink)，由一系列命令构成，其中可以包含对其他程序的调用。这个文件的每一行都是一条[DOS](https://baike.baidu.com/item/DOS/32025?fromModule=lemma_inlink)命令（大部分时候就好像我们在DOS提示符下执行的[命令行](https://baike.baidu.com/item/命令行/196110?fromModule=lemma_inlink)一样），你可以使用DOS下的Edit或者Windows的记事本([notepad](https://baike.baidu.com/item/notepad/291297?fromModule=lemma_inlink))等任何[文本文件](https://baike.baidu.com/item/文本文件/747597?fromModule=lemma_inlink)编辑工具创建和修改批处理文件。

[	批处理](https://baike.baidu.com/item/批处理/1448600?fromModule=lemma_inlink)(Batch)，也称为批处理脚本。顾名思义，批处理就是对某对象进行批量的处理，通常被认为是一种简化的[脚本语言](https://baike.baidu.com/item/脚本语言/1379708?fromModule=lemma_inlink)，它应用于DOS和Windows系统中。批处理文件的[扩展名](https://baike.baidu.com/item/扩展名/103577?fromModule=lemma_inlink)为bat 或cmd。比较常见的批处理包含两类：DOS批处理和PS批处理。PS批处理是基于强大的图片编辑软件Photoshop的，用来批量处理图片的脚本；而DOS批处理则是基于DOS命令的，用来自动地批量地执行DOS命令以实现特定操作的脚本。更复杂的情况，需要使用if、for、goto等命令[控制程序](https://baike.baidu.com/item/控制程序/56101793?fromModule=lemma_inlink)的运行过程，如同C、Basic等[高级语言](https://baike.baidu.com/item/高级语言/299113?fromModule=lemma_inlink)一样。如果需要实现更复杂的应用，利用[外部程序](https://baike.baidu.com/item/外部程序/53440733?fromModule=lemma_inlink)是必要的，这包括系统本身提供的[外部命令](https://baike.baidu.com/item/外部命令/10871360?fromModule=lemma_inlink)和第三方提供的工具或者软件。[批处理程序](https://baike.baidu.com/item/批处理程序/2192936?fromModule=lemma_inlink)虽然是在命令行环境中运行，但不仅仅能使用命令行软件，任何当前系统下可运行的程序都可以放在批处理文件中运行。

## 用Idea打开

### 效果：

​	在文件夹上右键可使用idea打开

![{57F16B05-8E24-4830-8439-E87B9EAD9889}](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/20241219112300840.png)

### 使用方法：
​	在idea 安装目录bin文件夹下新建.bat文件**(注意确保文件编码为ANSI（GBK）**,粘贴下方脚本，使用管理员权限打开输入数字1添加到注册表

![](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/20241219111847766.png)

![image-20241219112148970](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/20241219112149076.png)

### 脚本：

```bat
@ECHO OFF
SETLOCAL

:: 提升权限
NET FILE 1>NUL 2>&1 || (ECHO. & ECHO 请求管理员权限... & powershell -Command "Start-Process '%~s0' -Verb RunAs" & EXIT /B)

:: 检查Windows版本
VER | FINDSTR "5\.[0-9]\.[0-9][0-9]*" > NUL && (
    ECHO 当前版本不支持WinXP
    PAUSE>NUL
    EXIT
)

:MENU
CLS
ECHO.
ECHO 1、添加系统右键 用IDEA2024 打开项
ECHO 2、移除系统右键 用IDEA2024 打开项
ECHO.
CHOICE /C 12 /N /M "请选择一项: "
IF ERRORLEVEL 2 GOTO RemoveMenu
IF ERRORLEVEL 1 GOTO AddMenu

:AddMenu
:: 检查是否已存在
reg query "HKEY_LOCAL_MACHINE\SOFTWARE\Classes\Directory\shell\用IDEA2024打开" >NUL 2>&1
IF %ERRORLEVEL%==0 (
    ECHO 右键菜单项 "用IDEA2024打开" 已存在。
    CHOICE /C YN /N /M "是否重新添加? [Y/N]: "
    IF ERRORLEVEL 2 GOTO MENU
    IF ERRORLEVEL 1 GOTO RemoveAndReadd
) ELSE (
    GOTO AddNewMenu
)

:RemoveAndReadd
:: 移除现有右键菜单项
reg delete "HKEY_LOCAL_MACHINE\SOFTWARE\Classes\Directory\shell\用IDEA2024打开" /f >NUL 2>NUL

:AddNewMenu
:: 添加右键菜单项
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Classes\Directory\shell\用IDEA2024打开" /f /v "" /d "用 &IDEA2024 打开" >NUL 2>NUL

:: 设置图标 - 注意这里没有使用双引号，因为路径中没有空格
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Classes\Directory\shell\用IDEA2024打开" /f /v "Icon" /d "%~dp0idea64.exe" >NUL 2>NUL

:: 添加命令
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Classes\Directory\shell\用IDEA2024打开\command" /f /v "" /d "\"%~dp0idea64.exe\" \"%%V\"" >NUL 2>NUL

ECHO 添加完成
TIMEOUT /t 2 >NUL
GOTO MENU

:RemoveMenu
:: 移除右键菜单项
reg delete "HKEY_LOCAL_MACHINE\SOFTWARE\Classes\Directory\shell\用IDEA2024打开" /f >NUL 2>NUL

ECHO 移除完成
TIMEOUT /t 2 >NUL
GOTO MENU

:END
ENDLOCAL
```

## 杀死进程

### 效果：

​	很多时候因为Windows系统和部分软件问题，我们需要强制关闭应用。手动在任务管理器中找进程过于繁琐，可使用这个脚本进行查杀。

### 使用方法

​	在任意目录下新建.bat文件，复制代码保存**(注意确保文件编码为ANSI（GBK）**。bat文件右键发送到桌面快捷方式。



![image-20241219112539053](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/20241219112539197.png)

​	快捷方式右键-属性-快捷方式-高级-用管理员身份允许。

![image-20241219112657806](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/20241219112657987.png)

​	启动后输入1使用端口杀死，2为名称查找选择进程杀死。

![image-20241219153006830](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/20241219153006892.png)

### 脚本：

```bat
@echo off
setlocal enabledelayedexpansion

:: 提升权限
NET FILE 1>NUL 2>&1 || (ECHO. & ECHO 请求管理员权限... & powershell -Command "Start-Process '%~s0' -Verb RunAs" & EXIT /B)

:MENU
CLS
ECHO.
ECHO 请选择一项:
ECHO 1. 通过端口查找并终止进程
ECHO 2. 通过进程名称模糊查找并终止进程
ECHO.
CHOICE /C 12 /N /M "请输入选项 [1/2]: "
IF ERRORLEVEL 2 GOTO FindByName
IF ERRORLEVEL 1 GOTO FindByPort

:FindByPort
ECHO.
set /p port=请输入要检查的端口号: 

:: 查找使用指定端口的进程ID (PID)
set pid=
for /f "tokens=5 delims= " %%i in ('netstat -ano ^| findstr :%port%') do (
    set pid=%%i
    goto FoundProcess
)

:: 如果没有找到进程
if not defined pid (
    echo 没有进程在使用端口 %port%。
    pause
    goto MENU
)

:FoundProcess
:: 询问用户是否终止进程
set /p confirm=发现一个进程正在使用端口 %port%，其 PID 为 %pid%。您是否要终止该进程？ (y/n): 

if /i "%confirm%"=="y" (
    :: 终止进程
    taskkill /F /PID %pid% /T >NUL 2>&1
    if errorlevel 1 (
        echo 终止进程失败。可能是权限不足或进程无法终止。
    ) else (
        echo 进程已成功终止。
    )
) else (
    echo 您选择不终止进程。
)

pause
goto MENU

:FindByName
ECHO.
set /p procname=请输入要查找的进程名称（支持模糊匹配，例如，idea）: 

:RefreshProcessesName
:: 使用模糊匹配查找指定名称的所有进程
set count=0
ECHO.
ECHO 找到以下进程:
ECHO.

:: 创建一个临时文件来存储匹配的进程信息
set tempFile=%TEMP%\processes.txt
tasklist | findstr /I /C:"%procname%" > "%tempFile%"

:: 读取临时文件并解析进程信息
for /f "tokens=1,2 delims= " %%a in ('type "%tempFile%"') do (
    set /a count+=1
    set "proc[!count!].name=%%a"
    set "proc[!count!].pid=%%b"
    echo !count!. %%a (PID: %%b)
)

:: 删除临时文件
if exist "%tempFile%" (
    del "%tempFile%" >NUL 2>&1
)

if %count%==0 (
    echo 没有运行中的进程匹配 %procname%。
    pause
    goto MENU
)

:TerminateLoopName
set /p choice=请选择要终止的进程编号或按 'q' 退出: 
if /i "%choice%"=="q" (
    echo 您选择退出。
    goto MENU
)

if "%choice%"=="" (
    echo 您选择不终止任何进程。
    goto TerminateLoopName
)

if %choice% gtr %count% (
    echo 无效的选择。
    goto TerminateLoopName
)

:: 获取用户选择的进程PID
call set "selected_pid=%%proc[%choice%].pid%%"
call set "selected_name=%%proc[%choice%].name%%"

:: 询问用户是否确认终止
set /p confirm=您是否要终止 %selected_name% PID: %selected_pid%？ (y/n): 
if /i "%confirm%"=="y" (
    :: 终止进程
    taskkill /F /PID %selected_pid% /T
    if errorlevel 1 (
        echo 终止进程失败。可能是权限不足或进程无法终止。
        pause
    ) else (
        echo 进程 %selected_name% PID: %selected_pid% 已成功终止。
        pause
        goto RefreshProcessesName
    )
) else (
    echo 您选择不终止进程。
    goto TerminateLoopName
)

:end
endlocal
pause
```

