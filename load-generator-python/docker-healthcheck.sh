#!/bin/sh

if pgrep -f main.py > /dev/null; then
  exit 0
else
  echo "main.py not running"
  exit 1
fi
