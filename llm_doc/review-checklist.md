# レビューチェックリスト

ユーザーから修正ポイントの確認を求められた際に見落とされた項目を蓄積する。
同じ問題が繰り返される場合は回数をインクリメントして優先度の目安とする。

**上限100項目。超過時は回数0の古い項目から削除する。**

## チェック項目

| # | カテゴリ | チェック内容 | 回数 |
|---|---------|-------------|------|
| 1 | DOM | innerHTML代入時にサニタイズしているか | 0 |
| 2 | DOM | テンプレートリテラルで組み立てたHTMLにユーザー入力が混入しないか | 0 |
| 3 | 保存 | 追加したパラメータがSETTINGS_SCHEMA/BASEPROMPT_SCHEMAに含まれているか | 0 |
| 4 | 保存 | 新規オブジェクト属性をcommonPropertiesに追加したか | 0 |
| 5 | i18n | 新規UI文言にi18nキーを設定し8言語分の翻訳を追加したか | 0 |
| 6 | 履歴 | 一時オブジェクトにsetNotSave/excludeFromLayerPanelを設定したか | 0 |
| 7 | UI | 固定幅(px)ではなくフレキシブルレイアウトにしているか | 0 |
| 8 | UI | 既存の表示・表記と統一されているか | 0 |
| 9 | fallback | エラー時にfallback値で動作を続行していないか（fallback禁止） | 0 |
| 10 | file:// | file://プロトコルで動作するか（fetch等HTTP前提APIを使っていないか） | 0 |
| 11 | ログ | console.logではなくSimpleLoggerを使っているか | 0 |
| 12 | 命名 | 変数名がcamelCaseか、APIレスポンスのキーを変換していないか | 0 |
| 13 | format | npm run formatで崩れるスペースを入れていないか | 0 |
| 14 | GUID | 新規オブジェクトにguidを付与しているか | 0 |
| 15 | イベント | EventDelegatorのパターンに従っているか（直接addEventListenerしていないか） | 0 |
| 16 | 性能 | Fabric.jsイベント(object:modified等)ハンドラ内で重い処理を同期実行していないか | 1 |
| 17 | 性能 | canvas.renderAll()が不要な箇所やループ内で繰り返し呼ばれていないか | 1 |
| 18 | 履歴 | saveStateByManual()がイベント連鎖で過剰に発火しないか（changeDoNotSaveHistoryで抑制） | 1 |
| 19 | 性能 | レイヤー操作やオブジェクト一括変更時にrequestRenderAll等でバッチ描画しているか | 1 |
