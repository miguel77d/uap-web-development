# 📚 Book Reviews — Tarea 10 (Deploy + CI/CD)

## 🚀 Producción
- Home: https://uap-web-development-rose.vercel.app/
- Detalle de libro: https://uap-web-development-rose.vercel.app/book/As-KDnAthR0C

## ▶️ Local

npm ci
npm run dev
🧱 Build & Start
npm run build
npm start -p 3000
🧪 Tests
npm run test:ci
🔁 GitHub Actions
CI (PR) — .github/workflows/ci.yml
Corre en cada PR: npm ci → lint → typecheck → test:ci → build.

Docker Publish (main) — .github/workflows/docker-publish.yml
Build multi-stage + push a GHCR con tags latest, <sha>, build-<n> (y versión si aplicás la mejora).
Imagen: ghcr.io/miguel77d/uap-web-development:<tag>


🐳 Docker (local)
docker build -t book-reviews:local Tarea10/book-reviews
docker run --rm -p 3000:3000 book-reviews:local
# http://localhost:3000
⚙️ Variables de entorno
GOOGLE_BOOKS_API_KEY (si la app la usa)

Para exponer al cliente: NEXT_PUBLIC_*

Dónde configurarlas

Local: .env.local (no commitear)

Vercel: Project → Settings → Environment Variables (Preview y Production)

CI (si hiciera falta): GitHub → Settings → Secrets and variables → Actions

🧾 Detalles técnicos
Node 20, Next 15 (App Router)

TypeScript estricto

Vitest (jsdom)

ESLint Flat con override para tests

yaml

---

### Próximo paso:
1. Creá el archivo `README.md` dentro de `Tarea10/book-reviews/`.  
2. Pegá el contenido de arriba.  
3. Hacé commit y push:  

git add Tarea10/book-reviews/README.md
git commit -m "docs(tarea10): README final con producción y CI/CD"
git push
