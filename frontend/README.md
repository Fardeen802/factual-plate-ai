## Project info


**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <GIT_URL>

# Step 2: Navigate to the project directory.
cd <PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Deployment on Render

Follow these steps to deploy the app on [Render](https://render.com):

1. Create a new **Web Service** from your repository.
2. Set the **Root Directory** to `frontend` so Render runs commands in that folder.
3. Set the **Build Command** to:
   ```sh
   npm run build
   ```
4. Set the **Start Command** to:
   ```sh
   npm run serve
   ```
5. Add an environment variable named `VITE_API_URL` with the base URL of your
   backend (leave it blank to default to the same origin).
6. (Optional) Set `MONGODB_URI` if your backend requires a custom MongoDB
   connection string.
7. Click **Create Web Service** to deploy.

