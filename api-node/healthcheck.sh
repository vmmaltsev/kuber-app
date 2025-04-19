#!/bin/sh
wget --no-verbose --tries=1 --spider http://localhost:3000/healthz || exit 1 