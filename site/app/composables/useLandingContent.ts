type LandingLocale = 'zh' | 'en'

const landingContent = {
  zh: {
    seo: {
      htmlLang: 'zh-CN',
      ogLocale: 'zh_CN',
      title: 'BigSmart AI 助手',
      description: 'BigSmart 是基于 ESP32-S3-WROOM-1-N16R8 的联网语音与多媒体终端，集成双麦克风、扬声器、2.8 英寸触摸屏、摄像头、六轴 IMU 与 MicroSD；仓库提供硬件工程文件、外壳源文件和中英文文档。',
      imageAlt: '橙色 BigSmart 设备，屏幕显示语音监听状态',
      category: 'ESP32-S3 联网语音终端与开发平台'
    },
    hero: {
      eyebrow: 'ESP32-S3 联网语音终端与开发平台',
      title: 'BigSmart AI 助手',
      description: '采用 ESP32-S3-WROOM-1-N16R8 模组，集成双麦克风、扬声器、2.8 英寸触摸屏、GC0308 摄像头、六轴 IMU 与 MicroSD。仓库提供电路工程文件、外壳源文件及中英文文档。',
      imageAlt: '橙色 BigSmart 设备，屏幕显示语音监听状态',
      quickStartLabel: '快速使用指南',
      hardwareLabel: '硬件资料',
      repositoryLabel: 'GitHub 仓库'
    },
    proof: {
      ariaLabel: 'BigSmart 核心参数',
      facts: [
        {
          value: 'ESP32-S3',
          label: '16 MB Flash · 8 MB PSRAM'
        },
        {
          value: '2.8 英寸',
          label: '320 × 240 · GT911 电容触摸'
        },
        {
          value: '双麦输入',
          label: 'ES7210 ADC · ES8311 DAC'
        },
        {
          value: '2 个已合并 PR',
          label: 'xiaozhi-esp32 · esp-brookesia'
        }
      ]
    },
    hardware: {
      eyebrow: '板载硬件',
      title: '关键器件与接口配置',
      description: '当前硬件以 ESP32-S3-WROOM-1-N16R8 为核心，音频、显示、摄像头、存储与电源管理配置如下。',
      imageSrc: '/images/device-layout-front-sketch.png',
      imageFullSrc: '/images/device-layout-sketch.png',
      imageAlt: 'BigSmart 正面硬件布局，标注 2.8 英寸触摸屏、双麦克风、RGB 灯与三个按键',
      imageOpenLabel: '打开完整设备布局图',
      docsLabel: '查看完整 GPIO 与接口分配',
      explorer: {
        title: '3D 主板视图',
        status: '模型已就绪，可旋转、缩放或按位号定位器件。',
        overview: {
          name: '整板总览',
          model: 'BigSmart-CORE V4.0',
          role: '集成主控、音频输入与输出、运动传感、MicroSD 和 USB 接口的核心主板。',
          interface: '连接显示屏、触摸面板、摄像头、麦克风按键副板、扬声器与电池。'
        },
        loading: '正在加载 3D 主板模型...',
        error: '3D 主板模型加载失败。',
        retry: '重新加载',
        gestureHint: '提示：双指旋转或缩放主板模型',
        componentSelectAria: '选择要查看的主板器件',
        fields: {
          model: '型号',
          role: '主要作用',
          interface: '接口与连接'
        },
        controls: {
          reset: '重置视角',
          rotateLeft: '向左旋转主板',
          rotateRight: '向右旋转主板',
          zoomIn: '放大视图',
          zoomOut: '缩小视图'
        },
        components: [
          {
            id: 'u1',
            ref: 'U1',
            name: '主控模组',
            model: 'ESP32-S3-WROOM-1-N16R8',
            role: '承担应用处理、无线连接与外设调度，板载 16 MB Flash 和 8 MB PSRAM。',
            interface: '2.4 GHz Wi-Fi / Bluetooth LE · USB / I2C / I2S / SPI / DVP / SDMMC'
          },
          {
            id: 'u10',
            ref: 'U10',
            name: '麦克风 ADC',
            model: 'ES7210',
            role: '采集 MIC1 与 MIC2 两颗实体麦克风；MIC3 接 AEC 参考，MIC4 预留。',
            interface: '四通道 ADC · I2S · I2C（7 位地址 0x41）'
          },
          {
            id: 'u9',
            ref: 'U9',
            name: '音频 DAC',
            model: 'ES8311',
            role: '将数字音频转换为扬声器功放的模拟输入，并向 ES7210 提供 AEC 参考。',
            interface: 'I2S · I2C（地址 0x18）'
          },
          {
            id: 'u14',
            ref: 'U14',
            name: '扬声器功放',
            model: 'NS4150B',
            role: 'Class D 单声道功放，驱动扬声器输出，额定配置为 3 W @ 4 Ω。',
            interface: '模拟音频输入 · PCA9557 IO1（PA_EN）'
          },
          {
            id: 'u3',
            ref: 'U3',
            name: '六轴 IMU',
            model: 'QMI8658',
            role: '测量三轴加速度与三轴角速度，用于姿态和晃动检测。',
            interface: 'I2C（地址 0x6A）'
          },
          {
            id: 'u6',
            ref: 'U6',
            name: 'MicroSD 卡槽',
            model: 'TF-123-ARP9H17',
            role: '连接可移除 MicroSD 存储，用于本地媒体与资源文件。',
            interface: 'SDMMC 1-bit（CLK / CMD / DAT0）'
          },
          {
            id: 'usb1',
            ref: 'USB1',
            name: 'USB Type-C 接口',
            model: 'TYPEC-304-ACP16',
            role: '提供 5 V 供电、串口日志、固件烧录与原生 USB 数据连接。',
            interface: 'VBUS 5 V · 原生 USB（D- GPIO19 / D+ GPIO20）'
          }
        ]
      },
      groups: [
        {
          title: '计算与连接',
          items: [
            { label: '主控模组', value: 'ESP32-S3-WROOM-1-N16R8' },
            { label: '存储配置', value: '16 MB Flash / 8 MB PSRAM' },
            { label: '无线连接', value: '2.4 GHz Wi-Fi / Bluetooth LE' },
            { label: 'USB', value: 'Type-C · 5 V 供电 · 原生 USB（D- GPIO19 / D+ GPIO20）' }
          ]
        },
        {
          title: '音频链路',
          items: [
            { label: '物理麦克风', value: '2 个（MIC1 主麦 / MIC2 副麦）' },
            { label: '输入通道', value: 'ES7210 四通道 ADC；MIC3 为 AEC 参考，MIC4 预留' },
            { label: '扬声器链路', value: 'ES8311 DAC / NS4150B 功放' },
            { label: '数字音频', value: 'I2S（MCLK / WS / BCLK / DIN / DOUT）' }
          ]
        },
        {
          title: '显示与传感',
          items: [
            { label: '显示屏', value: '2.8 英寸 ST7789 · 320 × 240 · RGB565' },
            { label: '触摸', value: 'GT911 电容触摸 · I2C' },
            { label: '摄像头', value: 'GC0308 · DVP · 640 × 480 @ 16 FPS' },
            { label: '姿态传感', value: 'QMI8658 六轴 IMU · I2C' }
          ]
        },
        {
          title: '存储、电源与控制',
          items: [
            { label: '扩展存储', value: 'MicroSD · SDMMC 1-bit（CLK / CMD / DAT0）' },
            { label: '电池与充电', value: '3.7 V 单节锂电池 · TP4057' },
            { label: '供电路径与检测', value: 'USB/电池自动切换 · 充电状态与电池电压检测' },
            { label: '按键与指示', value: '电源键 · Boot（GPIO0）· 自定义键（GPIO10）· WS2812B（GPIO43）' }
          ]
        }
      ]
    },
    audience: {
      eyebrow: '固件与文档',
      title: '固件、文档与二次开发资料',
      description: '仓库提供预编译合并固件、使用文档与可编辑工程文件。RYMCU V2.3.28 固件包含联网语音、本地音乐、内置游戏和 NES 启动器；文档记录首次配置、功能使用与烧录流程。',
      demos: [
        {
          src: '/images/landing/advanced.webp',
          alt: 'BigSmart 高级设置界面',
          title: '语音服务配置',
          description: '预置服务商选择、自定义服务器配置与设备绑定'
        },
        {
          src: '/images/landing/music.webp',
          alt: 'BigSmart 本地音乐播放界面',
          title: '本地音乐播放',
          description: '从 MicroSD 读取并播放 MP3'
        },
        {
          src: '/images/landing/games.webp',
          alt: 'BigSmart 游戏选择界面',
          title: '内置游戏与 NES',
          description: '运行内置游戏，或从 MicroSD 加载 NES ROM'
        }
      ],
      paths: [
        {
          icon: 'i-lucide-power',
          title: '首次配置',
          description: '按照指南完成开机、2.4 GHz Wi-Fi 配网和语音服务配置。',
          label: '快速使用指南',
          link: { type: 'docs', slug: 'quick-start' }
        },
        {
          icon: 'i-lucide-panels-top-left',
          title: '功能说明',
          description: '查阅音频、触摸、摄像头、MicroSD、IMU 与 MQTT 等功能的使用条件和操作说明。',
          label: '用户手册',
          link: { type: 'docs', slug: 'user-manual' }
        },
        {
          icon: 'i-lucide-circuit-board',
          title: '硬件与结构改版',
          description: '使用主板、麦克风按键副板 EDA 工程、STEP 结构模型及 Fusion 360 外壳源文件进行改版。',
          label: '查看工程文件',
          link: {
            type: 'external',
            to: 'https://github.com/rymcu/BigSmart-Open',
            target: '_blank'
          }
        },
        {
          icon: 'i-lucide-git-pull-request-arrow',
          title: '参与维护',
          description: '通过 Issues 反馈可复现问题、文档缺漏与改进建议；代码和设计改动通过 Pull Request 提交。',
          label: '打开 Issues',
          link: {
            type: 'external',
            to: 'https://github.com/rymcu/BigSmart-Open/issues',
            target: '_blank'
          }
        }
      ]
    },
    project: {
      resourcesEyebrow: '工程文件',
      resourcesTitle: '主板、副板与外壳工程文件',
      resourcesDescription: '仓库提供主板与麦克风按键副板的立创 EDA 专业版工程、PDF 原理图与 STEP 结构模型，以及 Fusion 360 外壳源文件。中英文文档记录器件、接口、GPIO 与固件烧录要求。',
      resources: [
        '主板 EDA 工程与原理图',
        '麦克风按键副板 EDA 工程与原理图',
        '主板与副板 STEP 结构模型',
        'Fusion 360 外壳源文件',
        '中英文硬件与烧录文档'
      ],
      hardwareDirectoryLabel: '打开硬件目录',
      enclosureDirectoryLabel: '打开结构目录',
      hardwareDocsLabel: '硬件说明',
      boardImageAlt: 'RYMCU BigSmart 主板三维渲染图',
      upstreamEyebrow: '上游适配',
      upstreamTitle: '两项 BigSmart 板级适配已合入上游',
      upstreamDescription: '公开 Pull Request 分别记录 xiaozhi-esp32 板级支持与 esp-brookesia HMI 适配的代码变更、审查和合并状态。',
      mergedLabel: '已合并',
      upstreams: [
        {
          project: '78/xiaozhi-esp32',
          description: 'PR #1958：新增 BigSmart 板级支持。',
          pr: 'PR #1958',
          to: 'https://github.com/78/xiaozhi-esp32/pull/1958'
        },
        {
          project: 'espressif/esp-brookesia',
          description: 'PR #94：新增 BigSmart HMI 适配。',
          pr: 'PR #94',
          to: 'https://github.com/espressif/esp-brookesia/pull/94'
        }
      ]
    },
    release: {
      eyebrow: '开始使用',
      title: '首次配置与固件烧录',
      description: '快速使用指南记录 2.4 GHz Wi-Fi 配网、语音服务配置和 MicroSD 资源准备流程。固件说明列出可用合并固件、Flash 偏移地址 0x0 及回退版本。',
      quickStartLabel: '快速使用指南',
      firmwareLabel: '查看固件说明'
    }
  },
  en: {
    seo: {
      htmlLang: 'en',
      ogLocale: 'en_US',
      title: 'BigSmart AI Assistant',
      description: 'BigSmart is an ESP32-S3-WROOM-1-N16R8 connected voice and multimedia terminal with two microphones, a speaker, a 2.8-inch touchscreen, a camera, a six-axis IMU, and MicroSD. The repository provides hardware engineering files, enclosure source files, and documentation in Chinese and English.',
      imageAlt: 'Orange BigSmart device displaying its voice listening screen',
      category: 'ESP32-S3 connected voice terminal and development platform'
    },
    hero: {
      eyebrow: 'ESP32-S3 connected voice terminal and development platform',
      title: 'BigSmart AI Assistant',
      description: 'Built around the ESP32-S3-WROOM-1-N16R8 module, BigSmart integrates two microphones, a speaker, a 2.8-inch touchscreen, a GC0308 camera, a six-axis IMU, and MicroSD. The repository includes electrical engineering files, enclosure source files, and documentation in Chinese and English.',
      imageAlt: 'Orange BigSmart device displaying its voice listening screen',
      quickStartLabel: 'Quick Start',
      hardwareLabel: 'Hardware Resources',
      repositoryLabel: 'GitHub Repository'
    },
    proof: {
      ariaLabel: 'BigSmart key specifications',
      facts: [
        {
          value: 'ESP32-S3',
          label: '16 MB Flash · 8 MB PSRAM'
        },
        {
          value: '2.8-inch',
          label: '320 × 240 · GT911 capacitive touch'
        },
        {
          value: 'Two-mic input',
          label: 'ES7210 ADC · ES8311 DAC'
        },
        {
          value: '2 upstream merges',
          label: 'xiaozhi-esp32 · esp-brookesia'
        }
      ]
    },
    hardware: {
      eyebrow: 'Onboard hardware',
      title: 'Key components and interfaces',
      description: 'The current hardware is built around the ESP32-S3-WROOM-1-N16R8 module. Its audio, display, camera, storage, and power configurations are listed below.',
      imageSrc: '/images/device-layout-front-sketch-en.png',
      imageFullSrc: '/images/device-layout-sketch-en.png',
      imageAlt: 'BigSmart front hardware layout showing the 2.8-inch touchscreen, two microphones, RGB LED, and three buttons',
      imageOpenLabel: 'Open complete device layout',
      docsLabel: 'View complete GPIO and interface map',
      explorer: {
        title: '3D mainboard view',
        status: 'Model ready. Rotate, zoom, or locate a component by reference designator.',
        overview: {
          name: 'Mainboard overview',
          model: 'BigSmart-CORE V4.0',
          role: 'Core mainboard integrating compute, audio input and output, motion sensing, MicroSD, and USB.',
          interface: 'Connects the display, touch panel, camera, microphone/button daughterboard, speaker, and battery.'
        },
        loading: 'Loading the 3D mainboard model...',
        error: 'The 3D mainboard model could not be loaded.',
        retry: 'Reload model',
        gestureHint: 'Tip: use two fingers to rotate or zoom the board model',
        componentSelectAria: 'Select a mainboard component to inspect',
        fields: {
          model: 'Model',
          role: 'Role',
          interface: 'Interfaces'
        },
        controls: {
          reset: 'Reset view',
          rotateLeft: 'Rotate mainboard left',
          rotateRight: 'Rotate mainboard right',
          zoomIn: 'Zoom in',
          zoomOut: 'Zoom out'
        },
        components: [
          {
            id: 'u1',
            ref: 'U1',
            name: 'MCU module',
            model: 'ESP32-S3-WROOM-1-N16R8',
            role: 'Runs application logic, wireless connectivity, and peripheral control with 16 MB Flash and 8 MB PSRAM onboard.',
            interface: '2.4 GHz Wi-Fi / Bluetooth LE · USB / I2C / I2S / SPI / DVP / SDMMC'
          },
          {
            id: 'u10',
            ref: 'U10',
            name: 'Microphone ADC',
            model: 'ES7210',
            role: 'Captures the two physical microphones on MIC1 and MIC2; MIC3 carries the AEC reference and MIC4 is reserved.',
            interface: 'Four-channel ADC · I2S · I2C (7-bit address 0x41)'
          },
          {
            id: 'u9',
            ref: 'U9',
            name: 'Audio DAC',
            model: 'ES8311',
            role: 'Converts digital audio for the speaker amplifier and supplies the AEC reference to the ES7210.',
            interface: 'I2S · I2C (address 0x18)'
          },
          {
            id: 'u14',
            ref: 'U14',
            name: 'Speaker amplifier',
            model: 'NS4150B',
            role: 'Class-D mono amplifier that drives the speaker at a rated configuration of 3 W into 4 Ω.',
            interface: 'Analog audio input · PCA9557 IO1 (PA_EN)'
          },
          {
            id: 'u3',
            ref: 'U3',
            name: 'Six-axis IMU',
            model: 'QMI8658',
            role: 'Measures three-axis acceleration and angular velocity for orientation and shake detection.',
            interface: 'I2C (address 0x6A)'
          },
          {
            id: 'u6',
            ref: 'U6',
            name: 'MicroSD slot',
            model: 'TF-123-ARP9H17',
            role: 'Connects removable MicroSD storage for local media and resource files.',
            interface: 'SDMMC 1-bit (CLK / CMD / DAT0)'
          },
          {
            id: 'usb1',
            ref: 'USB1',
            name: 'USB Type-C port',
            model: 'TYPEC-304-ACP16',
            role: 'Provides 5 V power, serial logging, firmware flashing, and native USB data connectivity.',
            interface: '5 V VBUS · native USB (D- GPIO19 / D+ GPIO20)'
          }
        ]
      },
      groups: [
        {
          title: 'Compute and connectivity',
          items: [
            { label: 'Module', value: 'ESP32-S3-WROOM-1-N16R8' },
            { label: 'Memory', value: '16 MB Flash / 8 MB PSRAM' },
            { label: 'Wireless', value: '2.4 GHz Wi-Fi / Bluetooth LE' },
            { label: 'USB', value: 'Type-C · 5 V power · native USB (D- GPIO19 / D+ GPIO20)' }
          ]
        },
        {
          title: 'Audio path',
          items: [
            { label: 'Physical mics', value: '2 (MIC1 primary / MIC2 secondary)' },
            { label: 'Input channels', value: 'ES7210 four-channel ADC; MIC3 is the AEC reference, MIC4 is reserved' },
            { label: 'Speaker path', value: 'ES8311 DAC / NS4150B amplifier' },
            { label: 'Digital audio', value: 'I2S (MCLK / WS / BCLK / DIN / DOUT)' }
          ]
        },
        {
          title: 'Display and sensing',
          items: [
            { label: 'Display', value: '2.8-inch ST7789 · 320 × 240 · RGB565' },
            { label: 'Touch', value: 'GT911 capacitive touch · I2C' },
            { label: 'Camera', value: 'GC0308 · DVP · 640 × 480 @ 16 FPS' },
            { label: 'Motion', value: 'QMI8658 six-axis IMU · I2C' }
          ]
        },
        {
          title: 'Storage, power, and controls',
          items: [
            { label: 'Storage', value: 'MicroSD · SDMMC 1-bit (CLK / CMD / DAT0)' },
            { label: 'Battery', value: '3.7 V single-cell Li-ion · TP4057 charging' },
            { label: 'Power path and sensing', value: 'Automatic USB/battery switching · charge-state and battery-voltage sensing' },
            { label: 'Controls', value: 'Power · Boot (GPIO0) · custom (GPIO10) · WS2812B (GPIO43)' }
          ]
        }
      ]
    },
    audience: {
      eyebrow: 'Firmware and documentation',
      title: 'Firmware, documentation, and development resources',
      description: 'The repository provides a prebuilt merged firmware image, operating documentation, and editable engineering files. RYMCU V2.3.28 includes connected voice services, local music playback, built-in games, and an NES launcher; the documentation covers initial setup, feature requirements, and flashing procedures.',
      demos: [
        {
          src: '/images/landing/advanced.webp',
          alt: 'BigSmart advanced settings screen',
          title: 'Voice service configuration',
          description: 'Provider presets, custom server settings, and device binding'
        },
        {
          src: '/images/landing/music.webp',
          alt: 'BigSmart local music player screen',
          title: 'Local music playback',
          description: 'Read and play MP3 files from MicroSD'
        },
        {
          src: '/images/landing/games.webp',
          alt: 'BigSmart game selection screen',
          title: 'Built-in games and NES',
          description: 'Run built-in games or load NES ROM files from MicroSD'
        }
      ],
      paths: [
        {
          icon: 'i-lucide-power',
          title: 'Initial setup',
          description: 'Follow the guide to power on the device, connect to a 2.4 GHz Wi-Fi network, and configure a voice service.',
          label: 'Quick Start',
          link: { type: 'docs', slug: 'quick-start' }
        },
        {
          icon: 'i-lucide-panels-top-left',
          title: 'Feature reference',
          description: 'Review requirements and operating instructions for audio, touch, camera, MicroSD, IMU, MQTT, and other features.',
          label: 'User Manual',
          link: { type: 'docs', slug: 'user-manual' }
        },
        {
          icon: 'i-lucide-circuit-board',
          title: 'Hardware and enclosure revisions',
          description: 'Use the board EDA projects, STEP structural models, and Fusion 360 enclosure source as the basis for revisions.',
          label: 'View engineering files',
          link: {
            type: 'external',
            to: 'https://github.com/rymcu/BigSmart-Open',
            target: '_blank'
          }
        },
        {
          icon: 'i-lucide-git-pull-request-arrow',
          title: 'Contribute',
          description: 'Use Issues for reproducible defects, documentation gaps, and proposed improvements. Submit code and design changes through pull requests.',
          label: 'Open Issues',
          link: {
            type: 'external',
            to: 'https://github.com/rymcu/BigSmart-Open/issues',
            target: '_blank'
          }
        }
      ]
    },
    project: {
      resourcesEyebrow: 'Engineering files',
      resourcesTitle: 'Mainboard, daughterboard, and enclosure engineering files',
      resourcesDescription: 'The repository includes LCSC EDA Professional projects, PDF schematics, and STEP structural models for the mainboard and microphone/button daughterboard, plus the Fusion 360 enclosure source. The Chinese and English documentation records components, interfaces, GPIO assignments, and firmware flashing requirements.',
      resources: [
        'Mainboard EDA project and schematic',
        'Microphone/button daughterboard EDA project and schematic',
        'Mainboard and daughterboard STEP structural models',
        'Fusion 360 enclosure source files',
        'Chinese and English hardware and flashing documentation'
      ],
      hardwareDirectoryLabel: 'Open hardware directory',
      enclosureDirectoryLabel: 'Open enclosure directory',
      hardwareDocsLabel: 'Hardware documentation',
      boardImageAlt: 'Three-dimensional rendering of the RYMCU BigSmart mainboard',
      upstreamEyebrow: 'Upstream integration',
      upstreamTitle: 'Two BigSmart board integrations merged upstream',
      upstreamDescription: 'The public pull requests record the code changes, review history, and merge status for BigSmart board support in xiaozhi-esp32 and the BigSmart HMI integration in esp-brookesia.',
      mergedLabel: 'Merged',
      upstreams: [
        {
          project: '78/xiaozhi-esp32',
          description: 'PR #1958 adds BigSmart board support.',
          pr: 'PR #1958',
          to: 'https://github.com/78/xiaozhi-esp32/pull/1958'
        },
        {
          project: 'espressif/esp-brookesia',
          description: 'PR #94 adds the BigSmart HMI integration.',
          pr: 'PR #94',
          to: 'https://github.com/espressif/esp-brookesia/pull/94'
        }
      ]
    },
    release: {
      eyebrow: 'Get started',
      title: 'Initial setup and firmware flashing',
      description: 'The Quick Start covers 2.4 GHz Wi-Fi provisioning, voice service configuration, and MicroSD resource preparation. The firmware notes list the available merged images, the 0x0 Flash offset, and the retained fallback release.',
      quickStartLabel: 'Quick Start',
      firmwareLabel: 'Firmware Notes'
    }
  }
} as const satisfies Record<LandingLocale, object>

export function useLandingContent() {
  const { locale, docsPath } = useSiteLocale()
  const content = computed(() => landingContent[locale.value])

  return {
    content,
    docsPath
  }
}
