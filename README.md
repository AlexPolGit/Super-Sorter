# Super Sorter

## Overview
The Super Sorter is a ranking app that allows users to compare items one-to-one. It runs these comparisons through a sorting algorithm in order to generate an accurate ranked list. The primary benefit over other such applications is the automatic importing of data from various sources (like Spotify, Anilist, etc.) and a fully backend-driven sorting engine (meaning all progress is saved in real-time).

Super Sorter is available in [English](#super-sorter) and [Japanese](#スーパーソーター). Please feel free to add support for more languages (instructions WIP). Japanese translation is in-house, by a [non-native speaker](https://github.com/AlexPolGit), so please let us know if there are mistakes.

## Try it Out

The current production deployment of Super Sorter is available at [sort.gg](https://sort.gg). This is not a perfectly stable deployment and currently undergoes a lot of maintenance. It will eventually be deployed somewhere more stable.

## Deploying Dev Environment

### Pre-Requisites
- Docker (with Docker Compose) is installed.

### Running Environment
1. In the `data` folder, duplicate `sorter_empty.db` and rename it to `sorter.db`. This will create your database.
2. Duplicate `.env-template` in the top-level directory and rename it to just `.env`. Fill in the missing values.
3. Run `docker compose up --build` in the top-level directory. This will run Docker images for both the front-end and back-end (in development mode).

## Deploying Prod Environment

WIP

<br/><br/><br/>

# スーパーソーター

## 概要
スーパーソーターとはユーザーがアイテムを一対一で比較する順位アプリです。この比較はソーティングアルゴリズムで一個一個通されて正確な順位表が生成されます。他のアプリより優れている点と言えば、様々な情報源（Spotify、Anilist等々）から自動的にデーターをインポートすることが出来る事と、ソートエンジンは全体的にバックエンドで行われる事です（つまり、進行はリアルタイムで保存されます）。

スーパーソーターには[英語版](#super-sorter)と[日本語版](#スーパーソーター)があります。新しい言語を追加していただければ嬉しいです（詳細WIP）。和訳は[ネイティブではない人](https://github.com/AlexPolGit)に作られたものだから過りを指摘してもらえれば助かります。

## 試用

現在、実稼働環境は[sort.gg](https://sort.gg)で試していただけます。この環境はまだ完全に安定ではなくて整備中です。いつかもっと安定な環境で実行します。

## 開発環境の実行

### 下準備
- Docker（Docker Composeを含む）はインストールされています。

### 環境の稼働
1. `data`というフォルダーで, `sorter_empty.db`を複製しファイル名を`sorter.db`に変更してください。これはデータベースになります。
2. 最上のディレクトリで`.env-template`を複製しファイル名を`.env`に変更してください。そして、空白を埋めてください。
3. 最上のディレクトリで`docker compose up --build`のコマンドを実行してください。これでフロントエンドとバックエンドのDockerイメージが稼働します。

## 実稼働環境の実行

WIP