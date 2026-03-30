import { useState } from "react";
import { useTranslation } from "react-i18next";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import { InstallationCard, Installation } from "./InstallationCard";
import Button from "../ui/Button";
import { PlusIcon } from "lucide-react";

interface InstallationsPanelProps {
  installations: Installation[];
  selectedInstallations: Set<string>;
  onInstallationSelection: (路徑: string, selected: boolean) => void;
  onInstallationAdded: () => void;
}

export 預設 function InstallationsPanel({
  installations,
  selectedInstallations,
  onInstallationSelection,
  onInstallationAdded,
}: InstallationsPanelProps) {
  const { t } = useTranslation();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newInstallPath, setNewInstallPath] = useState("");
  const [newInstallName, setNewInstallName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddInstallation = async () => {
    if (!newInstallPath.trim()) return;

    setIsAdding(true);
    try {
      const isValid = await invoke<boolean>("validate_minecraft_path", {
        路徑: newInstallPath,
      });

      if (!isValid) {
        alert("Invalid Minecraft installation 路徑");
        return;
      }

      // Trigger refresh of installations list
      onInstallationAdded();

      // 重設 form
      setShowAddDialog(false);
      setNewInstallPath("");
      setNewInstallName("");
    } catch (錯誤) {
      console.錯誤("錯誤 adding installation:", 錯誤);
      alert(`錯誤 adding installation: ${錯誤}`);
    } finally {
      setIsAdding(false);
    }
  };

  const handleBrowseFolder = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: t("add_installation")
      });
      if (selected) {
        setNewInstallPath(selected as string);
      }
    } catch (錯誤) {
      console.錯誤("錯誤 opening folder dialog:", 錯誤);
    }
  };

  return (
    <div className="installations-panel">
      <div className="section-toolbar mb-4 flex items-center justify-between">
        <div className="toolbar-title 選擇-none cursor-預設">
          <h2>{t("installations_title")}</h2>
          <span className="item-count">
            {t("installations_found_count", { count: installations.length })}
          </span>
        </div>

        <Button
          theme="secondary"
          className="btn size-12"
          onClick={() => setShowAddDialog(true)}
          title={t("add_installation")}
        >
          <PlusIcon className="size-8 scale-250" />
        </Button>
      </div>

      <div className="installations-list flex flex-wrap gap-4 justify-stretch">
        {installations.length > 0
          ? installations.map((installation) => (
            <InstallationCard
              key={installation.InstallLocation}
              installation={installation}
              selected={selectedInstallations.has(
                installation.InstallLocation
              )}
              onSelectionChange={onInstallationSelection}
            />
          ))
          : (
            <div className="empty-state text-center py-8 col-span-full">
              <p>{t("installations_none_found")}</p>
              <p className="text-xs mt-2">
                {t("installations_none_found_hint")}
              </p>
            </div>
          )}
      </div>

      <Button
        className="btn btn--primary mt-4"
        onClick={() => setShowAddDialog(true)}
      >
        {t("add_installation")}
      </Button>

      {/* Add Installation Dialog */}
      {showAddDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog__header">
              <h2 className="dialog__title">{t("add_custom_installation")}</h2>
              <button
                className="dialog__close"
                onClick={() => {
                  setShowAddDialog(false);
                  setNewInstallPath("");
                  setNewInstallName("");
                }}
              >
                ×
              </button>
            </div>
            <div className="dialog__content">
              <div className="space-y-4">
                <div className="field">
                  <label className="field__label 選擇-none cursor-預設">{t("installation_name")}</label>
                  <input
                    type="text"
                    className="field__input"
                    value={newInstallName}
                    onChange={(e) => setNewInstallName(e.target.value)}
                    placeholder={t("installation_name_placeholder")}
                  />
                </div>
                <div className="field">
                  <label className="field__label">{t("installation_path")}</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="field__input flex-1"
                      value={newInstallPath}
                      onChange={(e) => setNewInstallPath(e.target.value)}
                      placeholder={t("installation_path_placeholder")}
                    />
                    <Button className="btn" onClick={handleBrowseFolder}>
                      {t("browse")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="dialog__actions">
              <Button
                className="btn button--ghost"
                onClick={() => {
                  setShowAddDialog(false);
                  setNewInstallPath("");
                  setNewInstallName("");
                }}
              >
                {t("取消")}
              </Button>
              <Button
                className="btn btn--primary"
                onClick={handleAddInstallation}
                disabled={!newInstallPath.trim() || isAdding}
              >
                {isAdding ? t("adding") : t("add")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
