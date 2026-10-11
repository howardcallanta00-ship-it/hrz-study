# Study Mark

Study Mark is a private, browser-based mastery quiz application for four Term 2 subjects: Effective Communication, General Mathematics, PKLP, and General Science. It includes all 191 supplied questions, immediate explanations, non-linear navigation, exact resume behavior, theme preferences, full retakes, and mistake-only practice.

## Technology

- React, TypeScript, and Vite
- Modern responsive CSS with light, dark, and system themes
- Versioned browser `localStorage`; no accounts, database, backend, or paid service
- Vitest for logic and import-validation tests
- React Router with a Render SPA rewrite

## Local setup

Requirements: a current Node.js LTS release and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Other useful commands:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

The production output is written to `dist/`.

## Run with Docker

With Docker Desktop running:

```bash
docker compose up --build -d
```

Open [http://localhost:4173](http://localhost:4173). The container serves the optimized production build through Nginx and supports direct SPA routes. To stop it:

```bash
docker compose down
```

## Quiz data

The original banks are retained in `src/data/banks/`. `src/data/parser.ts` converts the question sections and answer keys into typed quiz objects, then fails loudly on missing answers, invalid four-choice questions, unmapped correct answers, numbering gaps, duplicate IDs, or incorrect counts. Coverage checklists are not imported as questions. Source warnings for PKLP and Science remain content metadata.

To add a quiz:

1. Add a bank using the existing Markdown structure to `src/data/banks/`.
2. Import it and add its metadata and expected count in `src/data/quizzes.ts`.
3. Add the expected count to `src/lib/quiz.test.ts`.
4. Run the full verification commands above.

The model already supports `identification` as a future question type; a renderer and answer-checking policy would be needed before importing one.

## Browser saving

Each subject has one independent, versioned attempt. Setup choices, generated order, selected and checked answers, score, mistake pool, practice rounds, current position, and completion state are saved after each meaningful change. Theme preference is saved separately. Data stays in the current browser only; it does not transfer to another browser or device and disappears if browser storage is cleared. Corrupt or outdated records are ignored safely.

## Publish to GitHub

Create an empty repository on GitHub without adding starter files. In this project directory, run:

```bash
git init
git add .
git commit -m "Build Study Mark quiz application"
git branch -M main
git remote add origin https://github.com/YOUR-USER/study-mark.git
git push -u origin main
```

Replace the example URL with your repository URL. `node_modules` and build output are excluded; no secrets or environment variables are required.

## Deploy on Render

1. Sign in to Render and choose **New → Blueprint**.
2. Connect the GitHub repository and select it.
3. Render reads `render.yaml`, enables the pinned pnpm version, installs the frozen lockfile, runs `pnpm run build`, and publishes `dist`. This is the lockfile-safe equivalent of `npm ci && npm run build`.
4. Confirm the service is a Static Site and deploy it.
5. Leave automatic deploys enabled; each push to the connected branch then triggers a new build.
6. Open the deployed URL directly at `/quiz/general-science` to verify the SPA rewrite, then test a question and refresh.
7. Verify the library, dialogs, navigator, theme control, and results at phone and desktop widths, using keyboard navigation as well as touch/mouse.

## Known limitations

- Correct answers are bundled in the client because this is a personal study tool; the interface does not reveal them before checking.
- Progress is local to one browser profile and has no cloud synchronization.
- The source banks contain no image assets. The data model has optional image and code-block fields for future use.
- The application loads its typefaces from Google Fonts; system fonts remain as a fallback if that request is blocked.

## Deployment configuration

`render.yaml` defines a Render Static Site, publishes `dist`, and rewrites every route to `index.html` so direct client-side navigation does not return a 404.
