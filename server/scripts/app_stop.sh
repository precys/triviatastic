#!/bin/bash
pgrap -l -f "node index.js" | cut -d ' ' -f 1 | xargs sudo kill