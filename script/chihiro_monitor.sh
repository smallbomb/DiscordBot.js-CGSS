#!/bin/sh
mem_threshold=30
echo $$ > ./chihiro_monitor.pid
while true
do
  git pull
  chihiro_status=$(ps aux | grep -v grep | grep 'node .')
  chihiro_mem=$(ps aux | grep -v grep | grep 'node .' | awk '{print $4}')
  if [ -z "$chihiro_status" ]; then
    echo "$(date) start!!" >> chihiro_log
    at now -f ./chihiro_script.sh
  elif [ -n "$chihiro_mem" ] && [ 1 -eq "$(echo "$chihiro_mem > $mem_threshold" | bc)" ]; then
    echo "$(date) restart because of $chihiro_mem(mem) > $mem_threshold(threshold)" >> chihiro_log
    ./chihiro_init restart
  fi
  sleep 600
done