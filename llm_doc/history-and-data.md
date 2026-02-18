# 履歴管理と画像データ保存

## 履歴管理（Undo/Redo）
- 削除+追加を連続する場合、中間状態を履歴に残さない
- `changeDoNotSaveHistory()` / `changeDoSaveHistory()`で一時無効化
- 最終結果のみ`saveStateByManual()`で保存
- オブジェクト単位: `obj.saveHistory=false`

### 例: オブジェクト置き換え
```javascript
changeDoNotSaveHistory();
canvas.remove(oldObject);
canvas.add(newObject);
changeDoSaveHistory();
saveStateByManual();
```

## 画像データ保存
- `imageMap`には`data:` URLまたはJSON文字列のみ保存
- `blob:` URLはセッション限りのため保存禁止
- 保存時`convertImageMapBlobUrls()`で`blob:`→`data:`に変換済み
- オブジェクト（2D配列等）は`JSON.stringify()`で文字列化して保存
