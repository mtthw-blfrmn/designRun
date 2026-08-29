# Support

designRun is an open-source local workspace, not a hosted service or managed design engagement.

## Ask or report

- Use [GitHub Discussions](https://github.com/mtthw-blfrmn/designRun/discussions) for setup questions, workflow ideas, and examples of how you are adapting the workspace.
- Use the structured [issue forms](https://github.com/mtthw-blfrmn/designRun/issues/new/choose) for reproducible bugs and scoped feature proposals.
- Use the private process in [SECURITY.md](./SECURITY.md) for security concerns.

Before reporting a bug, use Node.js 22.13 or newer and run:

```bash
node --version
npm ci
npm run validate
npm run check
```

Include the operating system, Node version, agent harness, exact command or interaction, expected result, actual result, and the smallest safe reproduction. Remove product data, account information, credentials, private logs, and non-redistributable media.

Maintainers cannot troubleshoot private product repositories or guarantee that every third-party agent harness discovers repository instructions identically. A generic reproduction inside a fresh designRun copy is the most useful support artifact.

