#!/usr/bin/env python3
from pathlib import Path

checks = {
    'mobile/.env': ['EXPO_PUBLIC_API_URL', 'EXPO_PUBLIC_SUPABASE_URL', 'EXPO_PUBLIC_SUPABASE_ANON_KEY'],
    'backend/.env': ['OPENAI_API_KEY', 'OPENAI_MODEL', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'DATABASE_URL'],
}

ok = True
for file_path, keys in checks.items():
    path = Path(file_path)
    if not path.exists():
        print(f'❌ Missing {file_path}. Copy from {file_path}.example first.')
        ok = False
        continue
    content = path.read_text()
    for key in keys:
        if f'{key}=' not in content:
            print(f'❌ {file_path} missing key: {key}')
            ok = False

if ok:
    print('✅ Setup files look good. You can start backend and mobile now.')
else:
    raise SystemExit(1)
