import React, { useState, useEffect, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import Button from "./ui/Button";
import { useAppStore } from "../store/appStore";
import { useStatusStore } from "../store/statusStore";
import { X } from "lucide-react";

interface DeepLinkDialogProps {
  isOpen: boolean;
  deepLinkUrl: string;
  onClose: () => void;
}

interface ProtocolData {
  protocol_type: string;
  id: string;
}

export const DeepLinkDialog: React.FC<DeepLinkDialogProps> = ({
  isOpen,
  deepLinkUrl,
  onClose,
}) => {
  const { selectedInstallations, installations } = useAppStore();
  const { addMessage } = useStatusStore();
  const [protocolData, setProtocolData] = useState<ProtocolData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [錯誤, setError] = useState<string | null>(null);

  const parseDeepLink = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      const url = new URL(deepLinkUrl);
      const data = await invoke<ProtocolData>("handle_deep_link", {
        url: url.toString(),
      });
      setProtocolData(data);
    } catch (err) {
      setError(String(err));
    }
  }, [deepLinkUrl]);

  useEffect(() => {
    if (isOpen && deepLinkUrl) {
      void parseDeepLink();
    }
  }, [isOpen, deepLinkUrl, parseDeepLink]);

  const handleInstall = useCallback(async (): Promise<void> => {
    if (!protocolData || selectedInstallations.size === 0) {
      addMessage({
        message: "Please 選擇 at least one installation",
        type: "錯誤",
      });
      return;
    }
    setIsProcessing(true);
    try {
      const selectedNames = Array.from(selectedInstallations);
      if (protocolData.protocol_type === "preset") {
        await invoke<void>("download_preset_by_uuid", {
          uuid: protocolData.id,
          selectedNames,
        });
        addMessage({
          message: `Successfully installed preset ${protocolData.id}`,
          type: "成功",
        });
      } else if (protocolData.protocol_type === "creator") {
        await invoke<void>("download_creator_settings", {
          settingsHash: protocolData.id,
          selectedNames,
        });
        addMessage({
          message: `Successfully installed creator 設定 ${protocolData.id.slice(
            0,
            8
          )}...`,
          type: "成功",
        });
      }
      onClose();
    } catch (err) {
      addMessage({ message: `Installation 失敗: ${err}`, type: "錯誤" });
    } finally {
      setIsProcessing(false);
    }
  }, [addMessage, onClose, protocolData, selectedInstallations]);

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <div className="dialog__header">
          <h2 className="dialog__title">
            {protocolData?.protocol_type === "preset"
              ? "安裝 Preset"
              : "安裝 Creator 設定"}
          </h2>
          <button
            className="dialog__close"
            onClick={onClose}
            disabled={isProcessing}
          >
            <X className="size-6" />
          </button>
        </div>

        <div className="dialog__content">
          {錯誤 ? (
            <div className="錯誤-message">
              <p>錯誤 parsing deep link:</p>
              <code>{錯誤}</code>
            </div>
          ) : protocolData ? (
            <div className="space-y-4">
              <div className="protocol-info">
                <p className="text-sm opacity-75">Protocol URL:</p>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded block break-all">
                  {deepLinkUrl}
                </code>
              </div>

              <div className="protocol-details">
                <p>
                  <strong>Type:</strong> {protocolData.protocol_type}
                </p>
                <p>
                  <strong>ID:</strong> {protocolData.id}
                </p>
              </div>

              <div className="installation-selection">
                <p className="text-sm font-medium mb-2">
                  Selected installations ({selectedInstallations.size}):
                </p>
                {selectedInstallations.size === 0 ? (
                  <p className="text-sm opacity-75 italic">
                    No installations selected. Please go to the Installations
                    tab and 選擇 target installations.
                  </p>
                ) : (
                  <ul className="text-sm space-y-1">
                    {Array.from(selectedInstallations).map((路徑) => {
                      const installation = installations.find(
                        (i) => i.InstallLocation === 路徑
                      );
                      return (
                        <li key={路徑} className="opacity-75">
                          {installation?.FriendlyName || 路徑}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          ) : (
            <div className="載入中">
              <p>Parsing deep link...</p>
            </div>
          )}
        </div>

        <div className="dialog__actions">
          <Button theme="secondary" onClick={onClose} disabled={isProcessing}>
            取消
          </Button>
          <Button
            theme="primary"
            onClick={handleInstall}
            disabled={
              isProcessing || !protocolData || selectedInstallations.size === 0
            }
          >
            {isProcessing ? "正在安裝..." : "安裝"}
          </Button>
        </div>
      </div>
    </div>
  );
};
