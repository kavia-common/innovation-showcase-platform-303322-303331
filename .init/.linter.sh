#!/bin/bash
cd /home/kavia/workspace/code-generation/innovation-showcase-platform-303322-303331/innovation_website_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

