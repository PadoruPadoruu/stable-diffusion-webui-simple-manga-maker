# コーディング規約詳細

## 変数名・プロパティ名
- 変数名: camelCase（例: `var promptId=response.prompt_id;`）
- APIレスポンスのプロパティ名はAPI仕様のまま（camelCase変換しない）

## コメント
- コード内コメントは基本不要
- JSファイル先頭にファイル概要のみ記載
- JSDoc不要

## ログ
- `console.log`禁止 → `js/core/logger.js`のSimpleLoggerを使用
- 各モジュールでロガーを作成: `var log=new SimpleLogger('module',LogLevel.DEBUG);`
- レベル: TRACE, DEBUG, INFO, WARN, ERROR, SILENT
- 使用例: `log.debug("msg");`, `log.error("msg");`

## フォーマットスクリプト
```bash
npm run format
```

削除対象:
- 行頭インデント、行末空白
- 演算子周りのスペース
- カンマ/セミコロン後のスペース
- 括弧内側のスペース

保持対象:
- 文字列リテラル内のスペース
- コメント内のスペース
- 改行
