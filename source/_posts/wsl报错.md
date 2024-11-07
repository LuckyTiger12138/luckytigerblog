---
title: wsl报错
date: 2023-11-28 13:35:42
cover: https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202311101346217.webp
top_img: https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202311101346217.webp
tags: ["wsl报错"]
categories: ["wsl"]
---
# Echarts

## https://github.com/microsoft/WSL/issues/10764

1. Press Win+R and type "regedit"
   ![image](https://jsd.onmicrosoft.cn/gh/LuckyTiger12138/images//img/202311300222621.png)
2. Navigate to Computer\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services
3. Look for "WslService" -> Right click on folder icon -> Delete
4. Restart PC
5. Install https://github.com/microsoft/WSL/releases/tag/2.0.5



