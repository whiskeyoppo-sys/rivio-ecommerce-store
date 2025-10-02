#!/usr/bin/env bash
cd "$(dirname "$0")"   # ensure we run from repo root

invalid_files=()
while IFS= read -r -d '' file; do
  if [ ! -s "$file" ]; then
    invalid_files+=("$file")
    continue
  fi
  if ! node -e "JSON.parse(require('fs').readFileSync('$file','utf8'))" 2>/dev/null; then
    invalid_files+=("$file")
  fi
done < <(find . -type f -name package.json -print0)

for f in "${invalid_files[@]}"; do
  pkg=$(basename "$(dirname "$f")")
  cat > "$f" <<EOF
{
  "name": "@rivio/$pkg",
  "version": "0.1.0",
  "private": true,
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc -p .",
    "test": "jest"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "jest": "^29.0.0"
  }
}
EOF
  echo "✅ Created minimal $f"
done

node - <<'EOSJS'
const fs = require('fs'), path = require('path');
function walk(dir){
  for (const e of fs.readdirSync(dir,{withFileTypes:true})){
    const p = path.join(dir,e.name);
    if(e.isDirectory()) walk(p);
    else if(e.name==='package.json'){
      try{JSON.parse(fs.readFileSync(p,'utf8'))}
      catch(err){console.error('❌ BAD →',p,err.message);process.exit(1);}
    }
  }
}
walk(process.cwd());
console.log('✅ All package.json files are now valid JSON');
EOSJS
