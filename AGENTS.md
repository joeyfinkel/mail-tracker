<!-- intent-skills:start -->
## Skill Loading

Use the repository’s installed Intent. If it is unavailable, report the missing dependency instead of downloading a replacement.
Before editing files for a substantial task:

- Run `pnpm exec intent list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `pnpm exec intent load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

# Project agent instructions

<!-- jfdevelops:start -->

## jfdevelops skills

Read each skill before the work it describes:

- [jf-coding-conventions](.agents/skills/jf-coding-conventions/SKILL.md): Apply jfdevelops coding conventions when implementing or reviewing JavaScript, TypeScript, or React code. Read before editing code; use the target project's toolchain and framework.
- [jf-git](.agents/skills/jf-git/SKILL.md): Follow repository Git conventions before initializing history, naming or switching branches, staging changes, writing commits, or creating and updating pull requests.
- [jf-naming-conventions](.agents/skills/jf-naming-conventions/SKILL.md): Choose names for files, directories, packages, functions, types, and public APIs in jfdevelops projects. Read before adding or renaming these elements.

<!-- jfdevelops:end -->

## ui-sdk

Before using ui-sdk, follow the installed `ui-sdk` skill and read `node_modules/@ui-sdk/react/docs/llms.txt`. When building a new component, also search `node_modules/@ui-sdk/react/docs/core.md` by heading and read `node_modules/@ui-sdk/react/docs/rendering.md`.
