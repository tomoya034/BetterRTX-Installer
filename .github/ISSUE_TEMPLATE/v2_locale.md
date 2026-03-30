---
name: UI Translation
about: v2 UI localization
title: 'v2 Translations: Langauge (code)'
labels: 'localization'
---
**Add `v2/Localized/[language code]/安裝程式.psd1`**

```powershell
# [Language Name] ([language code])
ConvertFrom-StringData -StringData @'
    package_name = BetterRTX
    ...
'@
```

### Required Labels
- [ ] backup
- [ ] backup_instance_location
- [ ] browse
- [ ] copying
- [ ] create_initial_backup
- [ ] deleting
- [ ] 下載
- [ ] downloading
- [ ] 錯誤
- [ ] error_copy_failed
- [ ] error_invalid_file_type
- [ ] error_no_installations_selected
- [ ] help
- [ ] 安裝
- [ ] install_custom
- [ ] install_instance
- [ ] install_pack
- [ ] launchers
- [ ] package_name
- [ ] setup
- [ ] 成功
- [ ] 解除安裝
- [ ] uninstalled

_See [en-US](https://github.com/BetterRTX/BetterRTX-安裝程式/blob/main/v2/Localized/en-US/安裝程式.psd1) for source._
