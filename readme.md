# ネットde顧問の給料明細をダウンロードするぞ

2024/7/31で契約が切れる前に、給料明細を取得しておこう

## 概要

後で書くから(ry..

## 環境

- node.js
- nest.js
- playwright

## ローカルでの実行方法(バックエンド)

node.js や npm はインストール済みとして

```ps
git clone https://github.com/ryohei-ochi-fr/getKomonDeMeisai.git
cd getKomonDeMeisai
npm install
cd backend
npx ts-node index.ts ネットde顧問のID パスワード
```

## linux(ubuntu)の場合

[【2023年4月版】Ubuntu に node.js と npm を入れたい（バージョン管理も） #Node.js - Qiita](https://qiita.com/nouernet/items/d6ad4d5f4f08857644de)

```bash
sudo apt install -y nodejs npm
sudo npm install n -g
sudo n stable

cd getKomonDeMeisai
npx playwright install
sudo npx playwright install-deps
```

https化するために、いったんapache2を入れとく
AWSのセキュリティーグループも設定しておく
DNSの設定も当然やっとく

```bash
sudo apt -y install apache2
sudo a2enmod ssl
sudo systemctl enable apache2
sudo systemctl start apache2
sudo systemctl status apache2

sudo apt -y install certbot
sudo certbot certonly --webroot -w /var/www/html -d alain.davidovich-pompo.net

Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/alain.davidovich-pompo.net/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/alain.davidovich-pompo.net/privkey.pem


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
