# Third-party notices

## Piper web runtime

- `onnxruntime-web` 1.27.0, MIT License.
- Piper phonemizer WebAssembly assets from `@diffusionstudio/piper-wasm` 1.0.0, served locally from `public/piper/`.
- Piper phonemizer browser glue is derived from `piper-wasm` 0.1.4 (MIT), served locally from `public/piper/`.

## Vietnamese voice

- Voice: `vi_VN-vais1000-medium` from `rhasspy/piper-voices`.
- Model repository license: MIT.
- Source dataset: VAIS1000 Vietnamese Speech Synthesis Corpus, CC BY 4.0.
- Model card: https://huggingface.co/rhasspy/piper-voices/tree/main/vi/vi_VN/vais1000/medium

The voice model and configuration are distributed from `public/voices/` and fetched lazily only when narration is generated.

## Additional speech voices

- Official Piper voice checkpoints are fetched lazily from `rhasspy/piper-voices` and retain their published model-card licenses.
- Registered Vietnamese checkpoints: `vi_VN-vais1000-medium`, `vi_VN-vivos-x_low`, and `vi_VN-25hours_single-low`.
- The English LJSpeech browser-check voice uses Akjava's community Matcha-TTS ONNX quantization (`ljspeech_sim_q8.onnx`, Apache-2.0 repository). The original Matcha-TTS implementation is MIT licensed.
- The pronunciation dictionary in `public/tts/cmudict-0.7b` is the Carnegie Mellon Pronouncing Dictionary and retains its permissive CMU notice.
- Matcha-TTS-VIVOS is intentionally not registered because the referenced public checkpoint no longer exists.

## Korean voice

- Voice: `ko_KR-kss-medium` from `rhasspy/piper-voices`.
- The published folder provides the ONNX model and its JSON configuration; the model is downloaded lazily from the published repository when the user generates Korean narration.
- Model repository license: MIT. The KSS dataset and any downstream use remain subject to their respective source terms.
- Source: https://huggingface.co/rhasspy/piper-voices/tree/main/ko/ko_KR/kss/medium
- No Korean Matcha-TTS entry is registered: the official Matcha code has an ONNX export route, but no specific public Korean checkpoint with an independently verified distributable license and browser-compatible export was available for this release.

## MC. Ngọc Ngân

- Checkpoint: `doof-ferb/matcha_ngngngan`, epoch 420, exported locally to separate acoustic and HiFi-GAN ONNX graphs.
- Checkpoint license: CC BY-NC-SA 4.0. The model card explicitly prohibits commercial use of both the checkpoint and generated audio. The application displays this restriction beside the selected voice.
- Source: https://huggingface.co/doof-ferb/matcha_ngngngan
- Matcha-TTS implementation: MIT. HiFi-GAN retains its upstream terms.

## VieNeu Vietnamese presets

- Runtime/checkpoint: `pnnbao-ump/VieNeu-TTS-v3-Turbo`, Apache-2.0, pinned at commit `75ff82a72f54d55ed389e1eeb12041d3c4bac7d4`.
- The ten named presets use reference-code records published with the project's v3.0.0 release. Backbone, acoustic decoder, embeddings and output heads execute through ONNX Runtime Web/WASM.
- Codec: `OpenMOSS-Team/MOSS-Audio-Tokenizer-Nano-ONNX`, pinned at commit `ceff0d0749bfb3fa2d61149794ec6feef0d1e1ae`.
- Source: https://huggingface.co/pnnbao-ump/VieNeu-TTS-v3-Turbo

Engine and checkpoint metadata is intentionally internal. End users select only friendly voice names in the application.

## Complex segmentation runtime

The known-object, text and MobileSAM lanes bundle verified ONNX artifacts.
Every URL is BASE_URL-relative and is hash/size checked before caching; a
failed check disables only that lane and is surfaced in diagnostics.

When enabling a model, record the exact artifact and license here:

| Lane | Artifact | License | SHA-256 | Bytes | ONNX opset | Providers tested |
|---|---|---|---|---:|---:|---|
| OCR/text | `PaddlePaddle/PP-OCRv5_mobile_det` (`public/segmentation/ppocrv5_mobile_det.onnx`) | Apache-2.0 | `a431985659dc921974177a95adcfbb90fd9e51989a5e04d70d0b75f597b6e61d` | 4,826,518 | 11 | ORT Web WASM probe passed; latest 3.4s synthetic inference |
| known-object detector | `mobilint/YOLOv8n-seg` (`public/segmentation/yolov8n-seg.onnx`) | AGPL-3.0 | `cb1e689c548b3fa019691c9c1762f38a76276981ce75d31f6c5aae396dbff78b` | 13,834,790 | 19 | ORT Web WASM probe passed; latest 9.6s synthetic inference; performance gate fails; WebGPU pending |
| MobileSAM image encoder | `Acly/MobileSAM` (`public/segmentation/mobile_sam_image_encoder.onnx`) | MIT | `580f5fb648ea1062c0aabc26217aed56921985f03f0cbbd852bba81d760cc749` | 28,157,093 | 17 | ORT Web WASM runtime wired; WebGPU attempted when available |
| MobileSAM mask decoder | `Acly/MobileSAM` (`public/segmentation/sam_mask_decoder_single.onnx`) | MIT | `93915fc7c993ab9d59ab8c9ccd3bce37f7509c81ab4150a74abd4d2abbd8570d` | 16,501,323 | 17 | ORT Web WASM runtime wired; WebGPU attempted when available |

The classical Go/WASM cues (foreground, saliency, colour clustering, CCL,
Sobel/Lab and watershed) are first-party project code under AGPL-3.0-only.
