#!/bin/sh
mem_threshold=30
SCRIPT=$(readlink -f "$0")
dir_path=$(dirname "$SCRIPT")
echo $$ > $dir_path/../chihiro_monitor.pid
while true
do
  git pull
  chihiro_status=$(ps aux | grep -v grep | grep 'node .')
  chihiro_mem=$(ps aux | grep -v grep | grep 'node .' | awk '{print $4}')
  if [ -z "$chihiro_status" ]; then
    echo "$(date) start!!" >> $dir_path/../chihiro_log
    at now -f  $dir_path/chihiro_script.sh
  elif [ -n "$chihiro_mem" ] && [ 1 -eq "$(echo "$chihiro_mem > $mem_threshold" | bc)" ]; then
    echo "$(date) restart because of $chihiro_mem(mem) > $mem_threshold(threshold)" >> $dir_path/../chihiro_log
    $dir_path/chihiro_init restart
  fi
  sleep 600
done