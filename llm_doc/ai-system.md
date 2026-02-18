# AI生成システム

## アーキテクチャ
```
ai-management.js（ルーター）
├─ provider/
│   ├─ ai-provider.js（基底クラス）
│   ├─ local-sdwebui-provider.js
│   ├─ local-comfyui-provider.js
│   ├─ runpod-comfyui-provider.js
│   ├─ runpod-endpoint-provider.js
│   ├─ falai-provider.js
│   └─ provider-registry.js（プロバイダ登録・ロール割り当て）
├─ queue/
│   ├─ task-queue.js（並行実行制御）
│   └─ generation-task-manager.js（aiTaskMap）
├─ comfyui/（ワークフロー、エディタ、v2）
├─ sdwebui/（設定、API呼び出し）
├─ inpainting/（マスクエディタ、ワークフロー）
├─ angle/（カメラアングルエディタ、Three.js使用）
├─ role/（ロール割り当てUI）
└─ prompt/auto/（自動プロンプト生成）
```

## プロバイダ基底クラス（ai-provider.js）
```javascript
class AIProvider{
  async executeT2I(layer,spinnerId)
  async executeI2I(layer,spinnerId)
  async executeRembg(layer,spinnerId)
  async executeUpscale(layer,spinnerId)
  async executeInpaint(layer,spinnerId)
  async executeAngle(layer,spinnerId,anglePrompt)
  async fetchModels()
  async fetchSamplers()
  async fetchUpscalers()
}
```

## TaskQueue（task-queue.js）
Promise-based並行実行。プロバイダ別にキューが分かれる。
| キュー | 対象 | 並行数 |
|--------|------|--------|
| `sdQueue` | SD WebUI | 1 |
| `comfyuiQueue` | ComfyUI | 1 |
| `runpodEndpointQueue` | RunPod Endpoint | 1-10 |
| `falaiQueue` | Fal AI | 1-10 |

## ロール割り当て（provider-registry.js）
タスク種別ごとにどのプロバイダを使うか設定。
- T2I, I2I, UP, BG, IP, ANG, TAG

## タスクライフサイクル（generation-task-manager.js）
→ `layer-structure.md`のAIタスク進捗管理セクション参照

## ComfyUI v2ワークフロー
- `comfyui-workflow-repository.js` でワークフロー保存/読み込み
- `comfyui-workflow-editor.js` でビジュアルエディタ
- `comfyui-object-info-repository.js` でノード情報キャッシュ
- デフォルトワークフロー: t2i, inpaint, angle, upscale, rembg
