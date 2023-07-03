# Simple CMS with Deno KV

WIP!

# TODO

- [ ] Posts
- [ ] Image upload with on-client compression
- [ ] Pages
- [ ] user management
- [ ] redesign
- [ ] security

# Nice to have

- [ ] header image
- [ ] logo
- [ ] block based editor for pages
- [ ] demo mode
- [ ] redirect to the admin page after login
- [ ] JSON API as a headless cms

## Development

To develop locally, you must create a GitHub OAuth application and set the
following environment variables in a `.env` file:

```
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

You can create a GitHub OAuth application at
https://github.com/settings/applications/new. Set the callback URL to
`http://localhost:8000/auth/oauth2callback`.

You can then start the local development server:

```
deno task start
```
