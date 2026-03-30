#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from __future__ import annotations
import argparse
from pathlib import Path
import re
import sys

TEXT_EXTS = {".md", ".txt", ".json", ".jsonc",
             ".js", ".ts", ".tsx", ".jsx", ".html",
             ".cs", ".xaml", ".xml", ".ini", ".cfg"}
SKIP_DIRS = {".git", "node_modules", "dist", "build", "bin", "obj",
             ".next", ".nuxt", ".cache", "coverage", ".venv", "venv"}
REPLACEMENTS = [
  (r"\bInstall\b", "\u5b89\u88dd"),
  (r"\bInstalling\b", "\u6b63\u5728\u5b89\u88dd"),
  (r"\bInstaller\b", "\u5b89\u88dd\u7a0b\u5f0f"),
  (r"\bUninstall\b", "\u89e3\u9664\u5b89\u88dd"),
  (r"\bUpdate\b", "\u66f4\u65b0"),
  (r"\bSettings\b", "\u8a2d\u5b9a"),
  (r"\bEnable\b", "\u555f\u7528"),
  (r"\bDisable\b", "\u505c\u7528"),
  (r"\bApply\b", "\u5957\u7528"),
  (r"\bReset\b", "\u91cd\u8a2d"),
  (r"\bRestore\b", "\u9084\u539f"),
  (r"\bConfirm\b", "\u78ba\u8a8d"),
  (r"\bCancel\b", "\u53d6\u6d88"),
  (r"\bClose\b", "\u95dc\u9589"),
  (r"\bDownload\b", "\u4e0b\u8f09"),
  (r"\bError\b", "\u932f\u8aa4"),
  (r"\bWarning\b", "\u8b66\u544a"),
  (r"\bSuccess\b", "\u6210\u529f"),
  (r"\bFailed\b", "\u5931\u6557"),
  (r"\bVersion\b", "\u7248\u672c"),
  (r"\bLoading\b", "\u8f09\u5165\u4e2d"),
  (r"\bDone\b", "\u5b8c\u6210"),
  (r"\bNext\b", "\u4e0b\u4e00\u6b65"),
  (r"\bBack\b", "\u4e0a\u4e00\u6b65"),
  (r"\bFinish\b", "\u5b8c\u6210"),
  (r"\bSelect\b", "\u9078\u64c7"),
  (r"\bDefault\b", "\u9810\u8a2d"),
  (r"\bPath\b", "\u8def\u5f91"),
  (r"\bStatus\b", "\u72c0\u614b"),
  (r"\bSkip\b", "\u7565\u904e"),
]

def should_skip(path):
  return any(part in SKIP_DIRS for part in path.parts)

def is_text_target(path):
  return path.suffix.lower() in TEXT_EXTS

def transform_text(text):
  changed = 0
  out = text
  for pattern, repl in REPLACEMENTS:
    out_new, n = re.subn(pattern, repl, out, flags=re.IGNORECASE)
    if n > 0:
      changed += n
      out = out_new
  return out, changed

def main():
  parser = argparse.ArgumentParser()
  parser.add_argument("--apply", action="store_true")
  parser.add_argument("--root", default=".")
  args = parser.parse_args()
  root = Path(args.root).resolve()
  total = changed_files = total_replacements = 0
  for path in root.rglob("*"):
    if not path.is_file(): continue
    if should_skip(path): continue
    if not is_text_target(path): continue
    total += 1
    try:
      original = path.read_text(encoding="utf-8")
    except Exception:
      continue
    transformed, n = transform_text(original)
    if n > 0 and transformed != original:
      changed_files += 1
      total_replacements += n
      if args.apply:
        path.write_text(transformed, encoding="utf-8")
  print(f"scanned={total}, changed_files={changed_files}, replacements={total_replacements}")
  return 0

if __name__ == "__main__":
  sys.exit(main())
