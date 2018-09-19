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
    rm -f ./chihiro_monitor.pid
  fi
  pid=$(ps aux | grep 'node .' | grep -v grep | awk '{print $2}')
  if [ -n "$pid" ]; then
    kill -9 $pid
  fi
}

start() {
  pid=$(cat ./chihiro_monitor.pid)
  procss=$(ps aux | grep $pid | grep -v grep)
  if [ -n "$procss" ]; then
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