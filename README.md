# Issue Tracker

以 React、TypeScript 與 Vite 建立的純前端 Issue Tracker，可在瀏覽器中新增、搜尋、篩選任務並更新任務狀態。

## 已完成功能

- 新增任務；標題會自動移除前後空白，新任務預設為「待處理」
- 阻止新增空白標題，並顯示驗證訊息
- 將任務狀態切換為「待處理」、「進行中」或「已完成」
- 依標題關鍵字搜尋；英文搜尋不分大小寫
- 依任務狀態篩選，或顯示全部任務
- 同時套用標題搜尋與狀態篩選
- 顯示空清單與篩選無結果的提示
- 在重新載入頁面後保留任務與狀態

## 主要技術

- React 19 與 React DOM
- TypeScript（strict mode）
- Vite
- Vitest 與 jsdom
- React Testing Library 與 jest-dom

## 執行環境

需要安裝 Node.js 與 npm。專案以 npm 管理套件，並提供 `package-lock.json`；請不要混用其他套件管理工具。

Repository 沒有宣告 Node.js 或 npm 的最低支援版本。GitHub Actions 目前使用 Node.js 24 執行 CI，但這不代表專案已宣告最低版本為 Node.js 24。

## 安裝與啟動

1. 在 repository 根目錄安裝相依套件：

   ```bash
   npm install
   ```

2. 啟動 Vite 開發伺服器：

   ```bash
   npm run dev
   ```

3. 依終端機顯示的本機網址，在瀏覽器中開啟應用程式。

在畫面上輸入任務標題並選擇「新增任務」。任務建立後，可從任務旁的選單更新狀態；也可使用「搜尋標題」與「狀態篩選」縮小清單範圍。

## 測試與建置

```bash
npm test
```

以 Vitest 執行完整測試一次。測試在 jsdom 環境中執行，並使用 React Testing Library 與 jest-dom 驗證畫面及互動。

```bash
npm run build
```

先執行 TypeScript project build 進行型別檢查，再由 Vite 建立正式版本。

```bash
npm run check
```

依序執行 `npm test` 與 `npm run build`，用於提交前完整檢查。專案目前沒有 lint 設定或 lint script，因此此指令不包含 lint。

## 專案結構

```text
.
├── .github/workflows/ci.yml  # GitHub Actions CI
├── src/
│   ├── test/setup.ts         # jest-dom 測試初始化
│   ├── App.tsx               # 主要畫面與任務互動
│   ├── App.test.tsx          # 畫面、操作與資料保存測試
│   ├── main.tsx              # React 應用程式入口
│   ├── styles.css            # 全域與畫面樣式
│   └── taskStorage.ts        # 任務型別與 localStorage 讀寫
├── index.html                # Vite HTML 入口
├── package.json              # npm scripts 與套件清單
├── package-lock.json         # npm 鎖定檔
├── tsconfig*.json            # TypeScript 設定
└── vite.config.ts            # Vite 與 Vitest 設定
```

## 資料保存方式與限制

任務以 JSON 儲存在目前瀏覽器的 `localStorage`，使用的 key 為 `issue-tracker-tasks`。新增任務或更新狀態後，資料會寫入該儲存空間，重新載入頁面時再讀回。

此專案沒有後端或資料庫，因此資料只存在使用該應用程式的瀏覽器儲存空間，不會提供跨瀏覽器或跨裝置同步。清除該網站的瀏覽器儲存資料會移除任務。無法解析或格式不符的已儲存項目不會載入；缺少有效狀態的舊任務會以「待處理」載入。

## GitHub Actions

CI 會在推送至 `main`，以及以 `main` 為目標的 pull request 上執行。流程使用 `ubuntu-latest` 與 Node.js 24，依序執行：

```bash
npm ci
npm run check
```

因此 CI 會驗證完整測試、TypeScript 型別檢查與 Vite 正式建置。
