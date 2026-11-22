# Cora 全站统一音色

当前音色：**Jessica — Playful, Bright, Warm**，Voice ID `cgSgspJ2msm6clMCkdW9`。该声音来自当前账户实际返回的 premade 列表，偏年轻、活泼、温暖。中英文共 20 段 MP3 已生成，manifest 已发布。语音输出统一使用这些 ElevenLabs 音频，不再调用浏览器 SpeechSynthesis，不人为升高音调或加速播放。

原先指定的 Belle（`cNYrMw9glwJZXR8RwbuR`）在当前免费账户生成时返回 HTTP 402，`payment_required`：免费用户不能通过 API 使用语音库音色。用户随后授权直接选择相似声音，现已替换为 API 可用的 Jessica。

## 配置与生成

1. 当前登录已完成。若需重新接入，在项目目录运行 `npx -y @elevenlabs/cli@latest onboard init` 并按提示登录，再通过 `onboard check --answered --env-path .env.local` 验证。不要输出 env 文件或将密钥发送到聊天。
2. 确认该账户的计划允许通过 API 使用指定音色。此项目使用私有环境变量 `ELEVENLABS_API_KEY`，`.env.local` 已被 Git 忽略；不要使用 `VITE_` 前缀。Node 启动生成脚本时通过 `--env-file=.env.local` 加载密钥。
3. 需要更新台词或重新生成时，在项目目录运行（Node 24 或更新版本）：

```sh
npm run voice:generate -- --dry-run  # 只检查台词数量，不请求 API
npm run voice:generate -- --sample   # 先生成中英文各一段；不发布不完整索引
npm run voice:generate             # 使用本地密钥生成真实 MP3
npm run voice:check                # 校对音色、双语台词与全部音频文件
npm run build
```

生成脚本通过 `@elevenlabs/elevenlabs-js` 调用 [ElevenLabs Create speech](https://elevenlabs.io/docs/api-reference/text-to-speech/convert)，使用 `eleven_multilingual_v2` 和 `mp3_44100_128`。该模型不传 language_code，分别通过现有英文、中文台词生成。生成会使用账户额度。

音频输出到 `public/audio/cora/`。生成成功后再原子更新 manifest；失败时保留原有索引。相同音色、模型、语言和文字的已有文件会复用。修改文案后重新运行脚本即可补齐变更。

## 覆盖范围

共 20 段，英文和中文各 10 段：Home 两段欢迎语、陪伴问候与四种心情回复、三项语音任务回复。台词直接来自现有 i18n 资源，没有另外维护翻译副本。后续新增语音场景时，在 collectCoraVoiceLines 中加入对应台词。

当前回复会静默预加载，用户点击才播放。重复播放复用已缓冲的音频，减少首次点击等待与重复加载；网页没有实时 TTS 请求。切换台词、语言、演示或离开页面会停止播放。各入口共用单一播放通道，重复点击可停止。音频加载失败保留文字和播放按钮，可再次点击重试；音频缺失时显示未就绪提示。

## 部署

生成后，MP3 和 manifest 随 dist 一起部署。线上不需要额外后端、ElevenLabs 密钥或实时合成请求。密钥仅供本地生成工具使用。静态托管与原来一致。

主要文件：src/config/coraVoice.ts、src/lib/coraAudio.ts、src/hooks/useCoraVoice.ts、scripts/generate-cora-voice.mjs。浏览器检查使用 scripts/cora-audio-mock.mjs 模拟音频，避免消耗 API 额度；模拟检查通过不代表已生成或听过真实音色。

## 本轮实际检查

- `onboard check`：密钥有效，SDK 已声明并被生成脚本导入，Node env-file 加载方式已识别。
- Jessica 的英文、中文样本均生成成功，随后生成全部 20 段 MP3。`npm run voice:check` 校对音色、语言、台词及文件均通过。
- `npm test`：10 项通过；`npm run build`：通过，保留现有的大体积 chunk 提示。
- Tech & Scenarios 浏览器回归：7 组通过，包括语音指令、识别流程、二维码、模块、拍照、移动及双语响应式检查。此回归使用模拟播放器；真实 MP3 播放另行检查。
- 原生 Chrome Audio 验证：20 段真实 MP3 均可解码且含有效声音；逐一通过 Home、Companion、Voice 对应中英文入口播放。Home 中英文首段自然播放完成，重复播放、手动停止、切换语言、情绪及演示均正确取消。390px 手机端播放、停止及布局通过，无运行时或媒体错误。结果保存在 `test-results/voice/native-report.json`。
- 手机端阻断 MP3 请求后，页面保留原文并提示重试；恢复请求后，点击原按钮可正常播放及停止。没有恢复浏览器合成或切换到其他音色。
