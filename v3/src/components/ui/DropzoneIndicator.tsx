import { cx } from "classix";
import { FileUp } from "lucide-react";

interface DropzoneIndicatorProps {
  isDragging: boolean;
}

export 預設 function DropzoneIndicator({ isDragging }: DropzoneIndicatorProps) {
  return (
    <div className={cx(
      "dropzone-overlay",
      isDragging ? "dropzone-overlay--active" : "dropzone-overlay--hidden"
    )}>
      <div className="dropzone-overlay__glow">
        <div className="dropzone-overlay__content">
          <FileUp size={64} className="dropzone-overlay__icon" />
          <p className="dropzone-overlay__text">Drop .rtpack file to 安裝</p>
        </div>
      </div>
    </div>
  );
}
