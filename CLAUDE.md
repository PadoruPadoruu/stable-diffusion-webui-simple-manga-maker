- `llm_doc/project-structure.md` - ディレクトリ構成、グローバル変数、モジュール間通信
- `llm_doc/ui-patterns.md` - UIユーティリティ、イベント委譲、モーダル、CSS変数、i18n
- `llm_doc/ai-system.md` - AIプロバイダ、TaskQueue、ロール割り当て
- `llm_doc/layer-structure.md` - レイヤー構造、リンク機構、AIタスク進捗管理
- `llm_doc/coding-rules.md` - コーディング規約、ログ、フォーマット
- `llm_doc/history-and-data.md` - 履歴管理、画像データ保存
- `llm_doc/translation.md` - 翻訳の書式例
- `llm_doc/chrome.md` - Chrome連携手順

## 基本ルール
- サブエージェントはOpus/Sonnet使用（Haiku禁止）
- `file://`プロトコルで動作必須
- UI変更は既存表示と調和させる
- fallback禁止（ユーザー誤認防止）
- 文言は既存と表記統一（同義で別表記にしない）
- UIはフレキシブル対応を行い固定幅は使わない
- 機能修正時は関連する`llm_doc/`も更新する

## 除外フォルダ
検索・読み込み対象外:
`json_js`, `test`, `third`, `01_build`, `02_images_svg`, `03_images`, `99_doc`, `font`
