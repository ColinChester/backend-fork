# Backend Setup
1. Ensure nvm is installed (```nvm -v```)
2. Move to backend dir and check version (```cd backend; nvm use```)
2a. If the correct version is not installed, install it (the command will default to the correct version) (```nvm install```)
2b. I recommend setting the correct version as the default so you don't need to run ```nvm use``` everytime (```nvm alias default 20```)
3. Install dependencies (```npm install```)
4. Run dev server (```npm run dev```). If you see 
```console
Server running at http://localhost:3001
```
everything has been setup correctly.