# ネットde顧問の給料明細をダウンロードするぞ

2024/7/31で契約が切れる前に、給料明細を取得しておこう

## 概要

後で書くから(ry..

## 環境

- node.js
- nest.js
- playwright

## ローカルでの実行方法(バックエンド)

```ps
git clone https://github.com/ryohei-ochi-fr/getKomonDeMeisai.git
cd getKomonDeMeisai
npm install
cd backend
npx ts-node index.ts ネットde顧問のID パスワード
```

## linux(ubuntu)の場合

```bash
npx playwright install
sudo npx playwright install-deps
```

## イカメモ

TypeScriptでReactに入門するチュートリアル #create-react-app - Qiita https://qiita.com/yonetty/items/012be4c5c6258a609e35
今からはじめるReact.js〜初めてのコンポーネント〜 #React - Qiita https://qiita.com/kuniken/items/963cb977dffd3e662e40

```ps
npm init
npm init playwright@latest
npm install ts-node @types/node

cd backend
npx ts-node index.ts


npx create-react-app frontend
cd frontend
npm start
```

List of Chromium Command Line Switches « Peter Beverloo https://peter.sh/experiments/chromium-command-line-switches/

Playwright コードスニペット #TypeScript - Qiita https://qiita.com/jyoppomu/items/fab53e0b579d3f18c5ef#%E3%82%BB%E3%83%83%E3%82%B7%E3%83%A7%E3%83%B3%E3%81%AE%E4%BF%9D%E5%AD%98
