![CI](https://github.com/75asa/fondeSlack/workflows/CI/badge.svg)

# 概要

![image](https://user-images.githubusercontent.com/35181442/90799992-fb391d80-e34e-11ea-85ee-f43068fee300.png)


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

## terminal

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

またチームによってslackプロフィールの設定はまちまちだと思うので
プロフィールから区切りたい文字を `src/profile.ts` l. 17 `specialChar` で指定する（regex）
空白はデフォルトで除去されます

もしslackプロフィールのカスタム項目を設定してる場合は、`src/profile.ts` l. 14 の `IGNORE_CUSTOM_FIELDS_LABEL` に検索対象に含めたくないカスタム項目名をいれてください

あとは fondesk から投稿があれば反応

<!-- 会社のルールとしては `/ || ／` で区切って、各フィールドはスペース入れてます
 -->
GAE の cron で毎日 9-18時で slack のプロフィールから DB を更新しています

