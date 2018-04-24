#!/bin/sh
cd `dirname $0`
echo "==============build [applive-v1.0] start================"
rm -rf xi
export NODE_ENV=dev
npm run build 
mv ./dist ./xi
ls xi
echo "==============build end , the outout file is================"
echo "$basepath/xi"
echo "============================================================"
exit
