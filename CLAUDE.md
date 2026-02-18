- `llm_doc/coding-rules.md` - コーディング規約、ログ、フォーマット
- `llm_doc/layer-structure.md` - レイヤー構造、リンク機構
- `llm_doc/history-and-data.md` - 履歴管理、画像データ保存
- `llm_doc/translation.md` - 翻訳の書式例
- `llm_doc/chrome.md` - Chrome連携手順

## 基本ルール
- サブエージェントはOpus使用（Sonnet/Haiku禁止）
- `file://`プロトコルで動作必須
- UI変更は既存表示と調和させる
- fallback禁止（ユーザー誤認防止）
- 文言は既存と表記統一（同義で別表記にしない）
- UIはフレキシブル対応を行い固定幅は使わない

## 除外フォルダ
検索・読み込み対象外:
`json_js`, `test`, `third`, `01_build`, `02_images_svg`, `03_images`, `99_doc`, `font`
