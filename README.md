# SolidSim Lab

## 中文版

### 项目简介

**SolidSim Lab（固体物理仿真实验室）** 是一个面向固体物理学习与演示的网页仿真合集。项目将多个常见固体物理模型整理成独立交互页面，便于观察参数变化对色散关系、原子链振动、热容、统计分布、热导和能带结构的影响。

### 功能模块

- 一维原子链色散关系仿真
- 一维原子链振动模拟
- Einstein 与 Debye 模型热容对比
- 统计分布函数对比
- 低温下的金属热导
- 低温金属热容曲线
- 平面波展开法能带模拟

### 技术栈

- HTML / CSS / JavaScript
- Node.js 静态文件服务
- Three.js（用于部分三维/可视化页面）
- KaTeX（用于部分公式渲染）

### 快速开始
方法1：双击index.html


方法2：
确保本机已经安装 Node.js，然后在项目根目录运行：

```bash
npm start
```

服务启动后访问：

```text
http://localhost:10001
```

同一局域网内的设备也可以通过终端输出的局域网地址访问。

### 项目结构

```text
.
├── index.html          # 项目入口页
├── style.css           # 入口页样式
├── script.js           # 入口页脚本
├── server.js           # 本地静态文件服务器
├── package.json        # npm 启动脚本
├── page1/              # 一维原子链色散关系仿真
├── page2/              # 一维原子链振动模拟
├── page3/              # Einstein 与 Debye 模型热容对比
├── page4/              # 统计分布函数
├── page5/              # 低温下的金属热导
├── page6/              # 低温金属热容曲线
└── page7/              # 平面波展开法能带模拟
```

### 使用说明

进入首页后，点击对应模块按钮即可打开仿真页面。每个页面通常包含参数控制区、公式说明区和图像/动画展示区，可以通过调节参数观察模型行为变化。

### 备注

当前项目主要用于本地教学演示和课程学习。如果需要部署到线上环境，可以将静态资源交由任意静态托管服务提供访问，或继续使用 `server.js` 作为简单的 Node.js 静态文件服务器。

---

## English Version

### Overview

**SolidSim Lab** is a web-based simulation collection for learning and demonstrating concepts in solid-state physics. It organizes several common physical models into independent interactive pages, making it easier to observe how parameter changes affect dispersion relations, atomic chain vibrations, heat capacity, statistical distributions, thermal conductivity, and energy band structures.

### Modules

- One-dimensional atomic chain dispersion relation simulation
- One-dimensional atomic chain vibration simulation
- Heat capacity comparison between the Einstein and Debye models
- Statistical distribution function comparison
- Low-temperature metal thermal conductivity
- Low-temperature metal heat capacity curve
- Energy band simulation using the plane wave expansion method

### Tech Stack

- HTML / CSS / JavaScript
- Node.js static file server
- Three.js for selected 3D or visualization pages
- KaTeX for selected formula rendering

### Quick Start

Make sure Node.js is installed on your machine, then run the following command in the project root directory:

```bash
npm start
```

After the server starts, open:

```text
http://localhost:10001
```

Devices on the same local network can also access the project through the LAN address printed in the terminal.

### Project Structure

```text
.
├── index.html          # Main entry page
├── style.css           # Styles for the entry page
├── script.js           # Script for the entry page
├── server.js           # Local static file server
├── package.json        # npm start script
├── page1/              # Atomic chain dispersion relation simulation
├── page2/              # Atomic chain vibration simulation
├── page3/              # Einstein and Debye heat capacity comparison
├── page4/              # Statistical distribution functions
├── page5/              # Low-temperature metal thermal conductivity
├── page6/              # Low-temperature metal heat capacity curve
└── page7/              # Energy band simulation with plane wave expansion
```

### Usage

Open the homepage and click a module button to enter the corresponding simulation page. Each page usually contains a parameter control area, formula explanation area, and graph or animation display area. You can adjust the parameters to observe changes in model behavior.

### Notes

This project is mainly intended for local teaching demonstrations and course learning. For online deployment, the static resources can be hosted by any static hosting service, or `server.js` can continue to be used as a simple Node.js static file server.
