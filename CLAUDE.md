詳細は `llm_doc/` 配下を参照。

## 基本ルール
- サブエージェントはOpus使用（Sonnet/Haiku禁止）
- `file://`プロトコルで動作必須
- UI変更は既存表示と調和させる
- fallback禁止（ユーザー誤認防止）
- 文言は既存と表記統一（同義で別表記にしない）
- UIにハードコード値を使わない

## 除外フォルダ
検索・読み込み対象外:
`json_js`, `test`, `third`, `01_build`, `02_images_svg`, `03_images`, `99_doc`, `font`

## コーディング規約
- 変数名: camelCase
- APIレスポンスのプロパティ名はAPI仕様のまま（camelCase変換しない）
- インデント禁止（タブ・スペースの字下げなし）
- 不要な半角スペースは削除
- コード内コメントは基本不要、JSファイル先頭に概要のみ
- JSDoc不要
- `console.log`禁止 → `SimpleLogger`使用（`js/core/logger.js`）
- フォーマット: `npm run format`

→ 詳細: `llm_doc/coding-rules.md`

## 翻訳
- `js/ui/third/i18next.js`の`const resources`に追加
- キー: `yyyyMMddHHmmss_SSS`形式
- 全8言語対応（ja, en, ko, fr, zh, ru, es, de）
- 1行1エントリ、短文推奨、新エントリは既存の上に配置

→ 書式例: `llm_doc/translation.md`

## 履歴管理（Undo/Redo）
- 削除+追加の連続時は中間状態を履歴に残さない
- `changeDoNotSaveHistory()` / `changeDoSaveHistory()`で一時無効化
- 最終結果のみ`saveStateByManual()`で保存
- オブジェクト単位: `obj.saveHistory=false`

## 画像データ保存
- `imageMap`には`data:` URLまたはJSON文字列のみ
- `blob:` URLはセッション限りのため保存禁止
- 保存時`convertImageMapBlobUrls()`で変換済み

→ 詳細: `llm_doc/history-and-data.md`

## レイヤー構造
親子リンク:
- `parent.guids[]`: 親→子GUID一覧
- `child.relatedPoly`: 子→親Polygon参照
- `child.clipPath`: 親Polygon形状でマスク

→ 詳細: `llm_doc/layer-structure.md`

## Chrome連携
- `navigate`ツールは`file://`非対応
- `tabs_context_mcp`でタブグループ作成後、手動でファイルを開いてもらう

→ 詳細: `llm_doc/chrome.md`
