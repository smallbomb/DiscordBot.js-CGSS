#!/bin/sh

cmd=$1

restart() {
  stop
  start
}

stop() {
  pid=$(cat ./chihiro_monitor.pid)
  if [ -n "$pid" ]; then
    kill -9 $pid
  fi
  pid=$(ps aux | grep 'node .' | grep -v grep | awk '{print $2}')
  if [ -n "$pid" ]; then
    kill -9 $pid
  fi
}

start() {
  if [ -f "./chihiro_monitor.pid" ]; then
    echo "file exist"
    stop
  fi
  at now -f ./chihiro_monitor.sh
}


if [ "$cmd" = "start" ]; then
  start
elif [ "$cmd" = "stop" ]; then
  stop
elif [ "$cmd" = "restart" ]; then
  restart
else
  echo error input 
fi