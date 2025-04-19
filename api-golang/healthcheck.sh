#!/bin/sh
wget --no-verbose --tries=1 --spider http://localhost:8000/healthz || exit 1 