# AGENTS.md

## 專案概況

- 這是 React 19、TypeScript 與 Vite 組成的純前端 Issue Tracker。
- 應用程式碼位於 `src/`；入口為 `src/main.tsx`，根元件為 `src/App.tsx`，全域樣式為 `src/styles.css`。
- 測試使用 Vitest、jsdom、React Testing Library 與 jest-dom；測試初始化位於 `src/test/setup.ts`。

## 指令與套件管理

- 僅使用 npm，並維護 `package-lock.json`；不要混用其他套件管理工具。
- 安裝套件：`npm install`
- 啟動開發伺服器：`npm run dev`
- 執行測試：`npm test`
- 正式建置（包含 TypeScript 檢查）：`npm run build`
- 提交前完整檢查：`npm run check`（依序執行完整測試與正式建置）
- 專案目前沒有 lint 設定或 lint 指令；不要假設 `npm run lint` 可用。

## 命名與程式風格

- React 元件及其檔名使用 PascalCase，例如 `App`、`App.tsx`。
- 測試檔使用 `*.test.tsx`，與被測元件放在同一目錄。
- 使用函式元件、ES modules、單引號、不加分號，並保留多行結構的尾逗號。
- 測試使用 `describe`/`it` 組織案例，透過 Testing Library 依角色或可見文字查詢畫面；需要 DOM matcher 時沿用 `src/test/setup.ts`。
- 遵守 TypeScript `strict` 模式；瀏覽器端程式放在 `src/`，Vite 設定留在 `vite.config.ts`。

## 修改範圍與禁止事項

- 僅修改完成目前任務所需的檔案，不要改動無關檔案。
- 不要自行加入後端、資料庫或登入功能。
- 新增正式環境套件（`dependencies`）前先詢問使用者。
- 不要猜測或建立 repository 尚不存在的架構、指令或團隊慣例。

## 完成前驗證

- 確認變更僅涵蓋任務要求，且沒有意外修改其他檔案。
- 執行與變更相關的測試；目前完整測試指令為 `npm test`。
- 功能完成後執行 `npm run check`，完整驗證測試、TypeScript 檢查與正式建置。
- 若測試或建置失敗，回報失敗指令與原因；不要將失敗描述為已完成。
- 若任務涉及 lint，先確認專案是否已新增明確的 lint 設定與指令；目前沒有可執行的 lint 指令。
