# Referral Frame

Referrals on Farcaster using frames

<img width="300" alt="image" src="https://github.com/jakim929/referral-frame/assets/9677071/8bf1cdbe-3841-495a-9dd2-ce2ccd96beec">


```mermaid
flowchart TD
    ENTRYPOINT1 --> CREATE_PROJECT

    CREATE_PROJECT[create-project] -- enter project name and click create project --> WARPCAST[redirects to warpcast with a cast intent with invite frame]

    ENTRYPOINT2 --> INITIAL_SCREEN

    INITIAL_SCREEN[initial-screen] -- accept invite --> SUCCESSFULLY_JOINED[successfully-joined]
    
    SUCCESSFULLY_JOINED -- create my own project --> CREATE_PROJECT

    SUCCESSFULLY_JOINED -- invite my friends --> WARPCAST

```

## How it works
- Create a project
- Issue an invite frame and share it on Farcaster
- People can accept the invite, and create their own frames to share


## Notes
- this is centralized: referrals, project names, and signed up users are stored in a centralized database
- on Cloudflare Worker + D1 - was trying out an alternative to nextjs
