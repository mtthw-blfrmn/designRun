# Security

## Supported versions

Security fixes are applied to the current `main` branch while designRun is pre-1.0. No older release line is currently maintained.

## Local-first boundary

designRun is intended to operate on local files. Repository instructions never authorize an agent to publish, deploy, upload, connect accounts, rotate credentials, or mutate external systems.

## Sensitive information

Do not store secrets, API keys, authentication exports, private customer data, or licensed source assets in tracked files. Use ignored local folders for sensitive research material and summarize only what can safely be committed.

## Reporting a vulnerability

Report vulnerabilities privately through [GitHub’s security-advisory flow](https://github.com/mtthw-blfrmn/designRun/security/advisories/new). Do not open a public issue for a vulnerability and do not include live credentials or private user data.

Include the affected path or version, impact, safe reproduction, and any suggested mitigation. You should receive an acknowledgment within seven days. Disclosure timing will be coordinated after impact and a safe fix are understood.

## Security-relevant behavior

The control center binds to a local address, reads a constrained set of workspace files, and uses allowlisted paths, modification-time conflict checks, same-origin writes, file-size limits, and atomic replacement. A report is especially useful when it demonstrates a path escape, unintended network exposure, secret or private-file indexing, unauthorized write, cross-origin mutation, or dependency compromise.

An agent following an explicit user instruction to edit an authorized local file is not by itself a vulnerability. Prompt injection from imported content, silent external action, or access outside the documented workspace boundary may be.
