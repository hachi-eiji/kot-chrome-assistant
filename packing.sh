#!/bin/bash

set -eu

DIST_DIR='free-kintai-chrome-assistant'
FILE_NAME='free-kintai-chrome-assistant'
VERSION=$(jq -r '.version' manifest.json)

[ ! -d "${DIST_DIR}" ] && mkdir ${DIST_DIR}
rm -rf ${DIST_DIR:?}/*

cp -p LICENSE ${DIST_DIR}/
cp -p manifest.json ${DIST_DIR}/
cp -p modify_headers.json ${DIST_DIR}/
cp -pr node_modules ${DIST_DIR}/
cp -pr src ${DIST_DIR}/
cp -pr icons ${DIST_DIR}/
zip -r "${FILE_NAME}-${VERSION}".zip ${DIST_DIR}

rm -rf ${DIST_DIR:?}
