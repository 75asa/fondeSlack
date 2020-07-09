# 概要

_fondesk のメッセージ内容から担当者をメンションしてくれる slackApp_

# 導入

## slackApp OAuth Permission

- app_mentions:read
- channels:history
- channels:read
- chat:write
- im:history
- incoming-webhook
- users.profile:read
- users:read

## firestore

- firebase でプロジェクトを作成
- Database を作成
- sdk json を DL し `firebase.json` に名称変更

## GAE

- gcloud をインストール
  - ない場合は `brew install gcloud`
- プロジェクトを作成
  - `gcloud projects create fondeSlack --set-as-default`
- `.env.example` の内容を `secret.yml`  で記述（ポートはいらない）

## teminal

- run `$yarn`
- ローカル開発
  - `$yarn dev`
  - `$ngrok http 3333` （ポート番号はお好きに）
  - ngrok の URL を slackApp に貼り付け suffix に `/slack/events` を忘れずに
- GAE にデプロイ
  - run `$yarn deploy`
  - cron も一緒にする場合
    - run `$yarn deploy:cron`

# 使い方

fondesk がいるチャンネルに招待する

チャンネルのIDを env の CHANNEL_ID にいれる

会社のルールとしては `/ || ／` で区切って、各フィールドはスペース入れてます

GAE の cron で毎日 slack のプロフィールから DB を更新しています
