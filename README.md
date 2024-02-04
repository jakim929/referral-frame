# Referral Frame

Referrals on Farcaster using frames

<img width="250" alt="Screenshot 2024-02-04 at 6 16 58 PM" src="https://github.com/jakim929/referral-frame/assets/9677071/5eadf7c3-bf5f-4cb2-8d3b-0ee8d90a270f">

<img width="250" alt="Screenshot 2024-02-04 at 6 17 20 PM" src="https://github.com/jakim929/referral-frame/assets/9677071/250920ca-936d-42b9-b8a3-98ad12e82ba8">

<img width="250" alt="Screenshot 2024-02-04 at 6 17 34 PM" src="https://github.com/jakim929/referral-frame/assets/9677071/8b9a865c-2985-4f0f-afa5-8eb5723929a2">

## How it works
- Create a project
- Issue an invite frame and share it on Farcaster (using Warpcast intents)
- People can accept the invite, and create their own frames to share

```mermaid
flowchart TD
    ENTRYPOINT1 --> CREATE_PROJECT

    CREATE_PROJECT[create-project] -- enter project name and click create project --> WARPCAST[redirects to warpcast with a cast intent with invite frame]

    ENTRYPOINT2 --> INITIAL_SCREEN

    INITIAL_SCREEN[initial-screen] -- accept invite --> SUCCESSFULLY_JOINED[successfully-joined]
    
    SUCCESSFULLY_JOINED -- create my own project --> CREATE_PROJECT

    SUCCESSFULLY_JOINED -- invite my friends --> WARPCAST

```



## Notes
- this is centralized: referrals, project names, and signed up users are stored in a centralized database
- on Cloudflare Worker + D1 - was trying out an alternative to nextjs
