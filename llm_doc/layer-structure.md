# レイヤー構造

## オブジェクト間のリンク機構
| リンク方式 | 方向 | 用途 |
|-----------|------|------|
| `parent.guids[]` | 親→子 | 親が子オブジェクトのGUID一覧を保持 |
| `child.relatedPoly` | 子→親 | 子が親Polygonへの参照を保持 |
| `child.clipPath` | 属性 | 親Polygon形状でマスク |

## 構造図
```
キャンバス (canvasGuid)
├─ Panel1 (guid:A, guids:[B,C])
│  ├─ ImageB (relatedPoly:Panel1, clipPath:Polygon)
│  └─ ImageC (relatedPoly:Panel1, clipPath:Polygon)
└─ SpeechBubble (guid:D, guids:[E,F], customType:speechBubbleSVG)
   ├─ Textbox (guid:E, customType:speechBubbleText)
   └─ Rect (guid:F, customType:speechBubbleRect)
```

## リンク確立の流れ
1. `putImageInFrame()` → `findTargetFrame()`でフレーム特定
2. `moveSettings(img, poly)`:
   - `updateClipPath()` → clipPath設定
   - `img.relatedPoly = poly` → 双方向参照
   - `img._clipPathHandler` → イベントハンドラを保存
   - イベントリスナー登録（moving/scaling/rotating/skewing/modified）
   - `img.removeClipPathListeners()` → リスナーのみ解除（guids維持）
   - `img.removeSettings()` → 完全解除（guidsも削除）
3. `setGUID(parentFrame, img)` → `parent.guids[]`に追加

## updateClipPath(img, poly)
- 親Polygonの形状からclipPathを動的生成
- オブジェクト移動/変形時にリスナー経由で自動呼び出し
- 部分削除後にリスナーを解除しないとclipPathが復活する

## リンク削除の流れ
1. `img.removeSettings()`を呼び出し
2. `removeGUID(relatedPoly, img)` → guids配列から削除
3. イベントリスナー削除
4. `relatedPoly`と`removeSettings`プロパティを削除

## 画像置き換え時の注意
- `layer.relatedPoly`で親Polygonを取得してから新画像を配置
- 元画像は`saveHistory=false`を設定してから削除（履歴に残さない）
