#!/bin/bash

# iOS 构建脚本
PROJECT_DIR="/root/.openclaw/workspace/real-estate-life-game"
IOS_PROJECT_DIR="$PROJECT_DIR/ios/App"
ARCHIVE_PATH="$PROJECT_DIR/build/RealEstateLifeGame.xcarchive"
EXPORT_PATH="$PROJECT_DIR/build/ipa"
EXPORT_OPTIONS_PLIST="$PROJECT_DIR/exportOptions.plist"

# 创建输出目录
mkdir -p "$EXPORT_PATH"

# 生成exportOptions.plist
cat > "$EXPORT_OPTIONS_PLIST" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>ad-hoc</string>
    <key>teamID</key>
    <string>YOUR_TEAM_ID</string>
    <key>uploadSymbols</key>
    <true/>
    <key>uploadBitcode</key>
    <false/>
    <key>compileBitcode</key>
    <false/>
    <key>signingStyle</key>
    <string>automatic</string>
</dict>
</plist>
EOF

echo "=== 开始构建iOS App ==="

# 清理项目
xcodebuild clean -project "$IOS_PROJECT_DIR/App.xcodeproj" -scheme App -configuration Release

# 归档项目
xcodebuild archive -project "$IOS_PROJECT_DIR/App.xcodeproj" -scheme App -configuration Release -archivePath "$ARCHIVE_PATH"

if [ $? -eq 0 ]; then
    echo "✅ 归档成功，开始导出IPA"
    
    # 导出IPA
    xcodebuild -exportArchive -archivePath "$ARCHIVE_PATH" -exportOptionsPlist "$EXPORT_OPTIONS_PLIST" -exportPath "$EXPORT_PATH"
    
    if [ $? -eq 0 ]; then
        echo "✅ IPA导出成功！"
        echo "IPA文件路径: $EXPORT_PATH/RealEstateLifeGame.ipa"
    else
        echo "❌ IPA导出失败"
        exit 1
    fi
else
    echo "❌ 归档失败"
    exit 1
fi
