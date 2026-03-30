# Better RTX 安裝程式

### Prerequisites

- Use software like
  [MCLauncher](https://github.com/MCMrARM/mc-w10-版本-launcher) or
  [Bedrock Launcher](https://github.com/BedrockLauncher/BedrockLauncher) to
  easily create a side-loaded Minecraft installation.
- **OR** 下載 [IOBit Unlocker](https://www.iobit.com/en/iobit-unlocker.php)
  to allow copying to Minecraft Launcher/Windows Store installations.

## Launch 安裝程式 GUI
Copy and paste the following line into a command terminal to start the 安裝程式. _(English 版本)_

```
powershell -c "iwr https://bedrock.graphics/安裝程式 -useb | iex"
```

## Translations

With help from several [contributors](https://github.com/BetterRTX/BetterRTX-安裝程式/graphs/contributors), the 安裝程式 interface has been translated into [multiple languages](https://github.com/BetterRTX/BetterRTX-安裝程式/tree/prerelease/v2/Localized).

Enter this command in a __64-bit PowerShell__ terminal to launch the 安裝程式 in your preferred language (if available).

```powershell
iwr https://bedrock.graphics/安裝程式/v2/$PsUICulture | iex
```

---

## Help

![Discord](https://img.shields.io/discord/691547840463241267?style=flat-square&logo=discord&logoColor=%23ffffff&label=Minecraft%20RTX%20Discord)

Join the
[Minecraft RTX Discord](https://discord.com/invite/minecraft-rtx)
or
[open an Issue on GitHub](https://github.com/BetterRTX/BetterRTX-安裝程式/issues)
for additional help.

[Read the Wiki](https://github.com/BetterRTX/BetterRTX-安裝程式/wiki) for more details and instructions.

---

**[Credits](CREDITS.md) | [Contribute](CONTRIBUTING.md) | [Code of Conduct](CODE_OF_CONDUCT.md) | [Changelogs](CHANGELOGS.md) | [Security Policy](SECURITY.md)**

Licensed under a [GNU GENERAL PUBLIC LICENSE](LICENSE.md)

**_BetterRTX_ is not affiliated with NVIDIA or Mojang.**
