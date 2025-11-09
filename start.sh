#!/bin/sh

set -e

(cd ./apps/backend && air) &
(cd ./apps/frontend && pnpm dev) &
wait
