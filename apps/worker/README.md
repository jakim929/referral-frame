# Cloudflare Worker for Frame endpoints

## Route convention

For each frame state (ie. `initial-screen`)

`GET /initial-screen/image`: Returns image to render inside the frame

`POST /initial-screen/handle-action`: POST endpoint for frame actions allowed in the `initial-screen` state

`GET /initial-screen`: Returns page - can be SSR or route to a client side rendered SPA. Doesn't need to support this route unless it's an entrypoint (ie. this is the route to be shared on FC)

