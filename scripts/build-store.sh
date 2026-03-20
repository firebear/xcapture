#!/bin/bash

set -e

echo "Building Chrome Web Store package from dist/ ..."
npm run package:store
