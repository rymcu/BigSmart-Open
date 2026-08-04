# RYMCU BigSmart AI助手

**中文** | [English](README.en.md)

基于 **ESP32-S3-WROOM-1-N16R8** 的智能语音交互开发板，集成音频系统、显示系统、摄像头、传感器、MicroSD 存储和电池供电等多种外设。

## 主要特性

- **主控**: ESP32-S3-WROOM-1-N16R8 (16 MB Flash + 8 MB PSRAM)
- **音频**: ES8311 DAC + ES7210 四通道 ADC + NS4150B 功放
- **显示**: 2.8" ST7789 LCD (320 x 240) + GT911 电容触摸屏
- **摄像头**: GC0308 (640 x 480 @ 16 FPS)
- **传感器**: QMI8658 六轴加速度计/陀螺仪
- **存储**: MicroSD 卡槽
- **电池**: 2500mAh 3.7V 锂离子电池
- **其他**: WS2812B RGB LED、电池充电管理、按键输入

## 实物展示

| Home | Xiaozhi |
|------|---------|
| ![BigSmart Home](images/home.jpg) | ![BigSmart Xiaozhi](images/xiaozhi.jpg) |

| Page 1 | Tetris |
|--------|--------|
| ![BigSmart Page 1](images/page1.jpg) | ![BigSmart Tetris](images/tetris.jpg) |

## 第三方支持

RYMCU BigSmart 已合并到以下官方开源项目，方便用户基于主线生态进行固件开发和应用验证。

| 小智 AI 官方 | 乐鑫科技 Espressif 官方 |
|--------------|--------------------------|
| [78/xiaozhi-esp32](https://github.com/78/xiaozhi-esp32)<br>[PR #1958](https://github.com/78/xiaozhi-esp32/pull/1958) | [espressif/esp-brookesia](https://github.com/espressif/esp-brookesia)<br>[PR #94](https://github.com/espressif/esp-brookesia/pull/94) |
| ![RYMCU BigSmart in xiaozhi-esp32](images/xiaozhi-esp32.jpg) | ![RYMCU BigSmart in esp-brookesia](images/espressif.jpg) |

## 开源硬件 PCB 工程

`BigSmart` 硬件由主板和麦克风按键副板组成。硬件文件夹下提供了完整开源工程文件，只需将对应工程导入立创 `EDA` 专业版即可使用。

| 主板 | 麦克风按键副板 |
|------|----------------|
| ![BigSmart 主板 PCB](images/mainboard.png) | ![BigSmart 麦克风按键副板 PCB](images/mics-keys.png) |

## 开源外壳工程

外壳开源，直接3D打印即可。

| 外壳上盖 | 外壳底壳 |
|----------|----------|
| <img src="images/top.png" alt="BigSmart 外壳上盖" width="549"> | <img src="images/bottom.png" alt="BigSmart 外壳底壳" width="601"> |

`enclosure/` 同时提供主板与麦克风按键副板的 STEP 结构模型：

- `3D_BigSmart_2026-01-15.step`：主板结构模型，也是网站 3D 主板模型的生成源。
- `3D_bs-mic_2026-02-01.step`：麦克风按键副板结构模型。

修改主板 STEP 后，可在 `site/` 目录运行 `pnpm model:build`，重新生成 `site/public/models/bigsmart-mainboard.glb` 及其元数据。

## 目录结构

```text
BigSmart-Open/
├── hardware/
│   ├── mainboard/          # 主板 EDA 工程及原理图
│   └── mics-keys/          # 麦克风按键板 EDA 工程及原理图
├── enclosure/              # 外壳 3D 设计文件 (Fusion 360)
├── docs/
│   ├── zh/                 # 中文文档
│   └── en/                 # English documentation
├── firmware/               # 预编译合并固件
├── images/                 # 文档引用图片
├── tools/
│   └── video-converter/    # BigSmart 视频转换器
└── README.md
```

## 文档

| 中文 | English |
|------|---------|
| [快速使用指南](docs/zh/quick-start.md) | [Quick Start Guide](docs/en/quick-start.md) |
| [产品介绍书](docs/zh/product-brief.md) | [Product Brief](docs/en/product-brief.md) |
| [用户详细使用手册](docs/zh/user-manual.md) | [User Manual](docs/en/user-manual.md) |
| [硬件配置说明](docs/zh/hardware.md) | [Hardware Configuration](docs/en/hardware.md) |
| [视频转换器使用说明](docs/zh/video-converter.md) | [Video Converter User Guide](docs/en/video-converter.md) |

## 固件

- [RYMCU 官方固件](firmware/rymcu-V2.3.28-merged.bin)
- [小智 AI 官方固件](firmware/xiaozhi-esp32-merged.bin)
- [乐鑫科技官方固件](firmware/espressif-brookesia-merged.bin)
- [固件烧录说明](firmware/README.md)

当前推荐使用 `rymcu-V2.3.28-merged.bin`。仓库仍保留 `rymcu-V2.3.19-merged.bin` 作为旧版回退固件。

## 功能展示

点击屏幕的`Music app`和`Video app`即可播放`SD`卡`mp3`音乐和视频。

| 音乐播放 | 视频播放 |
|----------|----------|
| <img src="images/music1.png" alt="音乐播放界面" width="526"> | <img src="images/video1.png" alt="视频播放界面" width="537"> |

## 许可证

- **个人 DIY / 非商业用途**：遵循 [Apache-2.0](LICENSE) 开源许可证。
- **商业用途**：需取得 RYMCU 商用授权，请联系 [RYMCU 官方](mailto:hugh@rymcu.com) 获取授权详情。
