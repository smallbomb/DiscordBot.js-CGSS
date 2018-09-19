#!/bin/sh
SCRIPT=$(readlink -f "$0")
dir_path=$(dirname "$SCRIPT")
cd $dir_path/..
node .