#!/bin/sh

set -e
set -u

echo "push-to-repo ENTRY"
SOURCES="$1"
DESTINATION_USERNAME="$2"
DESTINATION_REPO="$3"
DESTINATION_BRANCH="$4"
DESTINATION_DIR="$5"
EMAIL="$6"
COMMIT_USERNAME="$7"
COMMIT_MSG="$8"

if [ -z "$SOURCES" ]
then
  echo "sources can not be empty"
  return 1
fi

if [ -z "$COMMIT_USERNAME" ]
then
  COMMIT_USERNAME="$DESTINATION_USERNAME"
fi

CLONE_DIR=$(mktemp -d)

echo "cloning source repo"

git config --global user.email "$EMAIL"
git config --global user.name "$COMMIT_USERNAME"

rm -rf .git

git clone "https://github.com/$GITHUB_REPOSITORY.git" repo

cd repo
ls -la

echo "cloning destination repo"

git clone --single-branch --branch "$DESTINATION_BRANCH" "https://$TOKEN_GITHUB@github.com/$DESTINATION_USERNAME/$DESTINATION_REPO.git" "$CLONE_DIR"
ls -la "$CLONE_DIR"

echo "copy files/dir to git repo"
mkdir -p "$CLONE_DIR/$DESTINATION_DIR"
cp -rvf $SOURCES "$CLONE_DIR/$DESTINATION_DIR"
cd "$CLONE_DIR"

echo "git commit"
ORIGIN_COMMIT="https://github.com/$GITHUB_REPOSITORY/commit/$GITHUB_SHA"
COMMIT_MESSAGE="${COMMIT_MSG/ORIGIN_COMMIT/$ORIGIN_COMMIT}"

git add .
git status

if ! git diff-index --quiet HEAD; then
  git commit --message "$COMMIT_MSG"
  echo "push"
  git push origin --set-upstream "$DESTINATION_BRANCH"
else
  echo "no changes to commit."
fi
