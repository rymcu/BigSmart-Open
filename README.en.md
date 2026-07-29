# RYMCU BigSmart AI Assistant

[中文](README.md) | **English**

RYMCU BigSmart is a smart voice interaction development board based on **ESP32-S3-WROOM-1-N16R8**. It integrates audio, display, camera, sensors, MicroSD storage, battery power, and other peripherals.

## Key Features

- **MCU**: ESP32-S3-WROOM-1-N16R8 (16 MB Flash + 8 MB PSRAM)
- **Audio**: ES8311 DAC + ES7210 four-channel ADC + NS4150B power amplifier
- **Display**: 2.8" ST7789 LCD (320 x 240) + GT911 capacitive touch panel
- **Camera**: GC0308 (640 x 480 @ 16 FPS)
- **Sensor**: QMI8658 six-axis accelerometer/gyroscope
- **Storage**: MicroSD card slot
- **Battery**: 2500mAh 3.7V lithium-ion battery
- **Other**: WS2812B RGB LED, battery charging management, button input

## Showcase

| Home | Xiaozhi |
|------|---------|
| ![BigSmart Home](images/home.jpg) | ![BigSmart Xiaozhi](images/xiaozhi.jpg) |

| Page 1 | Tetris |
|--------|--------|
| ![BigSmart Page 1](images/page1.jpg) | ![BigSmart Tetris](images/tetris.jpg) |

## Third-party Support

RYMCU BigSmart has been merged into the following official open source projects, making it easier to build firmware and validate applications on top of their upstream ecosystems.

| Xiaozhi AI Official | Espressif Official |
|---------------------|--------------------|
| [78/xiaozhi-esp32](https://github.com/78/xiaozhi-esp32)<br>[PR #1958](https://github.com/78/xiaozhi-esp32/pull/1958) | [espressif/esp-brookesia](https://github.com/espressif/esp-brookesia)<br>[PR #94](https://github.com/espressif/esp-brookesia/pull/94) |
| ![RYMCU BigSmart in xiaozhi-esp32](images/xiaozhi-esp32.jpg) | ![RYMCU BigSmart in esp-brookesia](images/espressif.jpg) |

## Open Source Hardware PCB Project

The BigSmart hardware consists of a mainboard and a microphone/button daughter board. Complete open source hardware project files are provided in the hardware folder. Import the corresponding project into LCSC EDA Professional to use it.

| Mainboard | Microphone/Button Board |
|-----------|-------------------------|
| ![BigSmart mainboard PCB](images/mainboard.png) | ![BigSmart microphone/button board PCB](images/mics-keys.png) |

## Open Source Enclosure Project

The enclosure is open source and can be used directly for 3D printing.

| Top Cover | Bottom Shell |
|-----------|--------------|
| <img src="images/top.png" alt="BigSmart top cover" width="549"> | <img src="images/bottom.png" alt="BigSmart bottom shell" width="601"> |

## Repository Layout

```text
BigSmart-Open/
├── hardware/
│   ├── mainboard/          # Mainboard EDA project and schematics
│   └── mics-keys/          # Microphone/button board EDA project and schematics
├── enclosure/              # Fusion 360 enclosure design files
├── docs/
│   ├── zh/                 # Chinese documentation
│   └── en/                 # English documentation
├── firmware/               # Prebuilt merged firmware images
├── images/                 # Images referenced by documentation
├── tools/
│   └── video-converter/    # BigSmart video converter
└── README.md
```

## Documentation

| English | 中文 |
|---------|------|
| [Quick Start Guide](docs/en/quick-start.md) | [快速使用指南](docs/zh/quick-start.md) |
| [Product Brief](docs/en/product-brief.md) | [产品介绍书](docs/zh/product-brief.md) |
| [User Manual](docs/en/user-manual.md) | [用户详细使用手册](docs/zh/user-manual.md) |
| [Hardware Configuration](docs/en/hardware.md) | [硬件配置说明](docs/zh/hardware.md) |
| [Video Converter User Guide](docs/en/video-converter.md) | [视频转换器使用说明](docs/zh/video-converter.md) |

## Firmware

- [RYMCU official firmware](firmware/rymcu-V2.3.28-merged.bin)
- [Xiaozhi AI official firmware](firmware/xiaozhi-esp32-merged.bin)
- [Espressif official firmware](firmware/espressif-brookesia-merged.bin)
- [Firmware flashing guide](firmware/README.en.md)

The recommended image is now `rymcu-V2.3.28-merged.bin`. `rymcu-V2.3.19-merged.bin` remains available as a legacy fallback image.

## Feature Showcase

Tap the `Music app` and `Video app` on the screen to play `mp3` music and videos from the `SD` card.

| Music Playback | Video Playback |
|----------------|----------------|
| <img src="images/music1.png" alt="Music playback screen" width="526"> | <img src="images/video1.png" alt="Video playback screen" width="537"> |

## License

- **Personal DIY / non-commercial use**: licensed under [Apache-2.0](LICENSE).
- **Commercial use**: requires commercial authorization from RYMCU. Contact [RYMCU](mailto:hugh@rymcu.com) for licensing details.
