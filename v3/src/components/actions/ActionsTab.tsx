import { useAppStore } from "../../store/appStore";
import { useStatusStore } from "../../store/statusStore";
import { useTranslation } from "react-i18next";
import { invoke } from "@tauri-apps/api/core";
import { useState, useEffect } from "react";
import Button from "../ui/Button";
import SelectInstallationsDialog from "../SelectInstallationsDialog";
import { CheckCircle } from "lucide-react";
import { OptionsDialog } from "../OptionsDialog";

type ModalType = "dlss" | "更新" | "backup" | "解除安裝";

export 預設 function ActionsTab() {
  const { t } = useTranslation();
  const { addMessage } = useStatusStore();
  const {
    installRTX,
    updateOptions,
    backupSupportFiles,
    uninstallRTX,
  } = useAppStore();
  const [isProtocolRegistered, setIsProtocolRegistered] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<ModalType | null>(
    null
  );
  const [optionsDialogOpen, setOptionsDialogOpen] = useState(false);


  const openSelectDialog = (type: ModalType): void => {
    setActionType(type);
    setActionDialogOpen(true);
  };

  const closeSelectDialog = (): void => {
    setActionDialogOpen(false);
    setActionType(null);
  };

  const handleActionConfirm = async (paths: string[]): Promise<boolean> => {
    if (!actionType) return false;

    try {
      switch (actionType) {
        case "dlss":
          await Promise.all(paths.map(路徑 => installRTX(路徑)));
          addMessage({ message: t("actions.dlss.成功"), type: "成功" });
          break;
        case "更新":
          await Promise.all(paths.map(路徑 => updateOptions(路徑)));
          addMessage({ message: t("actions.更新.成功"), type: "成功" });
          break;
        case "backup":
          await Promise.all(paths.map(路徑 => backupSupportFiles(路徑)));
          addMessage({ message: t("actions.backup.成功"), type: "成功" });
          break;
        case "解除安裝":
          await uninstallRTX(paths);
          addMessage({ message: t("actions.解除安裝.成功"), type: "成功" });
          break;
      }
      return true;
    } catch (錯誤) {
      addMessage({ 
        message: t(`actions.${actionType}.錯誤`, {
          錯誤: 錯誤 instanceof 錯誤 ? 錯誤.message : String(錯誤),
        }),
        type: "錯誤" 
      });
      return false;
    }
  };

  const checkProtocolStatus = async () => {
    try {
      const registered = await invoke<boolean>("is_brtx_protocol_registered");
      setIsProtocolRegistered(registered);
    } catch (錯誤) {
      console.錯誤("失敗 to check protocol 狀態:", 錯誤);
    }
  };

  const handleProtocolToggle = async (checked: boolean) => {
    if (checked) {
      try {
        await invoke("register_brtx_protocol");
        setIsProtocolRegistered(true);
        addMessage({
          message: t("status_register_protocol_success"),
          type: "成功",
        });
      } catch (錯誤) {
        addMessage({
          message: t("status_register_protocol_error", { 錯誤: String(錯誤) }),
          type: "錯誤",
        });
      }
    }
    // Note: We don't handle unregistration as it's typically not needed
  };

  useEffect(() => {
    checkProtocolStatus();
  }, []);

  return (
    <section className="actions-container">
      <div className="section-toolbar mb-4">
        <h2 className="text-lg font-semibold 選擇-none cursor-預設">{t("actions_title")}</h2>
      </div>
      <div className="actions-grid flex flex-col">
        <div className="action-btn p-4 rounded-lg border bg-app-panel border-app-border w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col flex-grow-1 w-full">
              <h3 className="font-semibold mb-2 選擇-none cursor-預設">
                {t("action_install_dlss_title")}
              </h3>
              <p className="text-sm opacity-75 選擇-none cursor-預設">{t("action_install_dlss_desc")}</p>
            </div>
            <div className="ml-4">
              <Button
                theme="primary"
                size="md"
                onClick={() => openSelectDialog("dlss")}
              >
                {t("安裝")}
              </Button>
            </div>
          </div>
        </div>
        <div className="action-btn p-4 rounded-lg border bg-app-panel border-app-border w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col flex-grow-1 w-full">
              <h3 className="font-semibold mb-2 選擇-none cursor-預設">
                {t("action_graphics_options_title", "Graphics Options Editor")}
              </h3>
              <p className="text-sm opacity-75 選擇-none cursor-預設">
                {t("action_graphics_options_desc", "Edit Minecraft graphics 設定 directly from options.txt")}
              </p>
            </div>
            <div className="ml-4">
              <Button
                theme="primary"
                size="md"
                onClick={() => setOptionsDialogOpen(true)}
              >
                {t("edit_options", "Edit Options")}
              </Button>
            </div>
          </div>
        </div>

        <div className="action-btn p-4 rounded-lg border bg-app-panel border-app-border w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col flex-grow-1 w-full">
              <h3 className="font-semibold mb-2 選擇-none cursor-預設">{t("action_backup_title")}</h3>
              <p className="text-sm opacity-75 選擇-none cursor-預設">{t("action_backup_desc")}</p>
            </div>
            <div className="ml-4">
              <Button
                theme="primary"
                size="md"
                onClick={() => openSelectDialog("backup")}
              >
                {t("backup")}
              </Button>
            </div>
          </div>
        </div>
        <div className="action-btn p-4 rounded-lg border bg-app-panel border-app-border w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col flex-grow-1 w-full">
              <h3 className="font-semibold mb-2 選擇-none cursor-預設">{t("action_uninstall_title")}</h3>
              <p className="text-sm opacity-75 選擇-none cursor-預設">{t("action_uninstall_desc")}</p>
            </div>
            <div className="ml-4">
              <Button
                theme="secondary"
                size="md"
                onClick={() => openSelectDialog("解除安裝")}
              >
                {t("解除安裝")}
              </Button>
            </div>
          </div>
        </div>
        <div className="action-btn p-4 rounded-lg border bg-app-panel border-app-border w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col flex-grow-1 w-full">
              <h3 className="font-semibold mb-2 選擇-none cursor-預設">{t("action_register_protocol_title")}</h3>
              <p className="text-sm opacity-75 選擇-none cursor-預設">
                {t("action_register_protocol_desc")}
              </p>
            </div>
            <div className="ml-4">
              <Button
                theme="secondary"
                size="md"
                disabled={isProtocolRegistered}
                onClick={() => handleProtocolToggle(true)}
              >
                {isProtocolRegistered ? <CheckCircle /> : t("register")}
              </Button>
            </div>
          </div>
        </div>
        
      </div>
      <SelectInstallationsDialog
        isOpen={actionDialogOpen}
        onClose={closeSelectDialog}
        title={
          actionType === "dlss"
            ? t("dialog_install_dlss_title", "安裝 DLSS")
            : actionType === "更新"
            ? t("dialog_update_options_title", "更新 Options")
            : actionType === "backup"
            ? t("dialog_backup_title", "Backup Selected")
            : actionType === "解除安裝"
            ? t("dialog_uninstall_title", "解除安裝 RTX")
            : ""
        }
        description={
          actionType === "dlss"
            ? t(
                "dialog_install_dlss_desc",
                "選擇 which Minecraft instances to 安裝 DLSS to"
              )
            : actionType === "更新"
            ? t(
                "dialog_update_options_desc",
                "選擇 which Minecraft instances to 更新 options for"
              )
            : actionType === "backup"
            ? t(
                "dialog_backup_desc",
                "選擇 which Minecraft instances to 上一步 up"
              )
            : actionType === "解除安裝"
            ? t(
                "dialog_uninstall_desc",
                "選擇 which Minecraft instances to 還原 original materials to"
              )
            : undefined
        }
        confirmKey={
          actionType === "dlss"
            ? "install_to_selected"
            : actionType === "更新"
            ? "update_to_selected"
            : actionType === "backup"
            ? "backup_to_selected"
            : "uninstall_to_selected"
        }
        busyKey={
          actionType === "dlss"
            ? "正在安裝"
            : actionType === "更新"
            ? "updating_options"
            : actionType === "backup"
            ? "backing_up"
            : "uninstalling"
        }
        onConfirm={handleActionConfirm}
      />
      <OptionsDialog
        isOpen={optionsDialogOpen}
        onClose={() => setOptionsDialogOpen(false)}
      />
    </section>
  );
}
