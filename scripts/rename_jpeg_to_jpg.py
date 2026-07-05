#!/usr/bin/env python3
import os
import sys
import argparse

def rename_jpeg_to_jpg(target_dir):
    if not os.path.exists(target_dir):
        print(f"錯誤：找不到資料夾 {target_dir}")
        return
    
    count = 0
    # 遞迴遍歷資料夾，自動尋找 .jpeg 與 .JPEG 檔案並重新命名為 .jpg
    for root, dirs, files in os.walk(target_dir):
        for file in files:
            name, ext = os.path.splitext(file)
            if ext.lower() == '.jpeg':
                old_path = os.path.join(root, file)
                new_path = os.path.join(root, name + '.jpg')
                
                # 避免覆蓋已存在的同名 .jpg 檔案
                if os.path.exists(new_path):
                    print(f" ⚠️ 警告：{new_path} 已存在，跳過 {file}")
                    continue
                
                os.rename(old_path, new_path)
                print(f" ✅ 重新命名：{old_path} -> {new_path}")
                count += 1
                    
    print(f"\n處理完成！共重新命名了 {count} 個檔案。")

def main():
    parser = argparse.ArgumentParser(description="自動將指定資料夾底下的所有 .jpeg 檔案重新命名為 .jpg")
    parser.add_argument('directory', nargs='?', default='image', help="目標資料夾路徑 (預設為 'image')")
    args = parser.parse_args()
    
    rename_jpeg_to_jpg(args.directory)

if __name__ == '__main__':
    main()
