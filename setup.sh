#!/bin/bash

# 1. Scaffold Next.js
npx create-next-app@latest biw-dtm-frontend --typescript --tailwind --app --src-dir --import-alias "@/*" --use-npm

# 2. Go to directory
cd biw-dtm-frontend

# 3. Install 3D and utility dependencies
npm install three @types/three @react-three/fiber @react-three/drei
npm install axios lucide-react clsx tailwind-merge

# 4. Initialize shadcn/ui
npx shadcn-ui@latest init

# 5. Add shadcn components
npx shadcn-ui@latest add card badge button progress table tabs alert tooltip
