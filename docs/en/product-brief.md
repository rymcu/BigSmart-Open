# RYMCU BigSmart Product Brief

[中文](../zh/product-brief.md)

## Product Positioning

RYMCU BigSmart is a connected voice and embedded multimedia development platform based on ESP32-S3-WROOM-1-N16R8. It integrates dual-microphone input, speaker output, a 2.8-inch touch display, camera, six-axis IMU, MicroSD storage, and battery power; the repository includes electrical and enclosure project files.

It is intended for Xiaozhi AI terminals, smart home controllers, portable media players, and handheld game prototypes. For pin assignments and hardware details, see [Hardware Configuration](hardware.md). For setup and operation, see the [User Manual](user-manual.md).

## Highlights

| Highlight | Description |
|-----------|-------------|
| AI voice interaction | Supports Xiaozhi-style voice assistant firmware, button-triggered conversation, audio capture, speaker playback, and connected services |
| Dual-microphone audio path | ES7210 four-channel ADC with two microphone inputs, one AEC reference, and one reserved channel; ES8311 DAC + NS4150B amplifier |
| Touch display | 2.8-inch ST7789 LCD, 320 x 240 resolution, with GT911 capacitive touch |
| Vision capability | GC0308 DVP camera, 640 x 480 YUV422 capture |
| Portable multimedia | MicroSD card for MP3, video, image, and game resources |
| Motion sensing | QMI8658 six-axis IMU for attitude, shake detection, and interaction triggers |
| Smart home extension | Firmware-side MQTT tools can connect to smart home topics for lights, humidifiers, and other devices |
| Open hardware completeness | Includes mainboard and microphone/button board schematics, EDA files, and Fusion 360 enclosure files |

## Target Users

| User type | Typical use |
|-----------|-------------|
| AIoT developers | Validate voice assistants, MCP tools, camera, and local multimedia features |
| Embedded education and makers | Teach ESP32-S3, audio paths, display/touch, SD cards, sensors, and Bluetooth gamepads |
| Smart home users | Use BigSmart as a desktop voice controller connected to Home Assistant, EMQX, or custom services through MQTT |
| Prototype teams | Evaluate portable AI devices, screen-based voice terminals, interactive toys, or handheld controllers |

## Hardware Overview

| Module | Specification |
|--------|---------------|
| MCU | ESP32-S3-WROOM-1-N16R8, 16 MB Flash + 8 MB PSRAM |
| Audio input | ES7210 four-channel ADC, MIC1 main mic, MIC2 secondary mic, MIC3 AEC reference, MIC4 reserved |
| Audio output | ES8311 DAC + NS4150B amplifier |
| Display/touch | ST7789 2.8-inch LCD, 320 x 240; GT911 capacitive touch |
| Camera | GC0308, DVP interface, 640 x 480 @ 16 FPS |
| Storage | MicroSD card slot, firmware uses SDMMC 1-bit mode |
| Sensor | QMI8658 six-axis accelerometer/gyroscope |
| Lighting | One WS2812B RGB LED |
| Buttons | Power button, Boot/function button, GPIO10 PTT/custom button |
| Power | Battery charging management, charging-state detection, battery-voltage detection |

## Software Capabilities

| Capability | Description |
|------------|-------------|
| Wi-Fi provisioning | Enters provisioning on first boot or when no valid network exists; the Xiaozhi project includes BluFi documentation |
| Voice conversation | Boot button toggles conversation state; GPIO10 can be used for push-to-talk |
| Device-side AEC | When `CONFIG_USE_DEVICE_AEC` is enabled, double-clicking Boot toggles AEC while idle |
| Local music | Plays MP3 files from `/sdcard`, with play, stop, list, previous, next, and status tools |
| Internet radio | Plays network audio streams by station name |
| Weather and Calendar | V2.3.28 firmware provides Weather and Calendar app entries |
| Codex Status | Shows Codex runtime status on the device and lets users configure the bridge address in the app |
| Game entry | Opens firmware-provided game features from the Launcher, including the NES launcher and NES dedicated boot mode |
| RGB light control | Supports direct RGB color setting and MQTT light-control topics |
| Smart Home MQTT/Endpoint | Supports Smart Home MQTT broker configuration and MCP Endpoint routing to the same smart home tools |
| IMU attitude | Reads QMI8658 attitude angles, acceleration, gyroscope data, and shake events |
| Camera | Lazy initialization on first camera request to reduce startup memory pressure |

## Typical Applications

### AI Voice Assistant

BigSmart can act as a desktop Xiaozhi terminal. The dual microphones and AEC reference channel support voice interaction, while the display shows state, expressions, menus, or results, and the speaker plays TTS responses.

### Smart Home Controller

Through MQTT tools, voice or MCP commands can publish messages to lights, humidifiers, air conditioners, and other home automation topics. The onboard RGB LED can also serve as local feedback or as an MQTT light example.

### Portable Media Player

The MicroSD card can store MP3 files. Firmware tools support local playback, stop, file listing, previous/next track, and playback status, making BigSmart suitable for a desktop music terminal or classroom experiment.

### ESP32-S3 Handheld Gaming Experiment

With LCD, speaker, SD card, and Bluetooth HID gamepad support, BigSmart can be used for ESP32-S3 handheld game experiments and custom game demos.

### Multi-sensor Interactive Device

The QMI8658 provides attitude and shake events, the camera captures images, and the touch screen and RGB LED provide feedback, making the board useful for interactive demos and education projects.

## Repository Resources

| Path | Content |
|------|---------|
| `hardware/mainboard/` | Mainboard EDA project and schematics |
| `hardware/mics-keys/` | Microphone/button board EDA project and schematics |
| `enclosure/` | Fusion 360 enclosure files |
| `docs/en/hardware.md` | Hardware components, pin assignments, and GPIO summary |
| `docs/en/user-manual.md` | Unboxing, flashing, network setup, operation, and troubleshooting |
