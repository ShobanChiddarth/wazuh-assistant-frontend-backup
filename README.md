# Wazuh Assistant Frontend

A React frontend for the Wazuh Assistant user interface.

## Run locally

1. Environment variables:

   ```bash
   cp sample.env .env
   nano .env # put backend URL
   set -a
   source .env
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Open the app in your browser:

   ```text
   http://localhost:3000
   ```

The app reloads automatically when you make changes.

## Commands

- `npm start` — run the development server
- `npm test` — run the test suite
- `npm run build` — build the app for production

## Notes

- This project uses Create React App.
- Make sure the backend services required by the chat and query endpoints are available if you want to use the hub views.
