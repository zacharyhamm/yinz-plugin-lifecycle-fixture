# Yinz Git plugin lifecycle fixture

Two TypeScript plugins render a version and the `greeting` KDL configuration value.
`main.ts` renders a literal version; `nested/main.ts` imports `../shared.ts`.
The `v1` tag contains version 1; `main` advances to version 2.
No permissions or external dependencies are required.

Use an isolated directory and a Yinz binary built with its builtin plugins:

```sh
fixture_config=$(mktemp -d)
cat > "$fixture_config/config.kdl" <<'KDL'
load_plugins clear-defaults=true {}
show_release_notes false
detachable_panes false
plugins {
    hello repo="https://github.com/zacharyhamm/yinz-plugin-lifecycle-fixture.git" { greeting "CONFIGURED"; }
    nested repo="https://github.com/zacharyhamm/yinz-plugin-lifecycle-fixture.git" entrypoint="nested/main.ts" { greeting "NESTED_CONFIG"; }
    tagged repo="https://github.com/zacharyhamm/yinz-plugin-lifecycle-fixture.git" tag="v1" { greeting "TAG_CONFIG"; }
}
KDL
export XDG_CONFIG_HOME="$fixture_config" XDG_DATA_HOME="$fixture_config" XDG_CACHE_HOME="$fixture_config" YINZ_SOCKET_DIR="$fixture_config" TMPDIR="$fixture_config"
yinz --config-dir "$fixture_config" plugins status
yinz --config-dir "$fixture_config" plugins install
yinz --config-dir "$fixture_config" plugins check nested
yinz --config-dir "$fixture_config" attach --create plugin-lifecycle
```

From a second terminal with the same environment, load the plugins:

```sh
yinz --config-dir "$fixture_config" --session plugin-lifecycle action launch-or-focus-plugin hello
yinz --config-dir "$fixture_config" --session plugin-lifecycle action launch-or-focus-plugin nested
yinz --config-dir "$fixture_config" plugins update
yinz --config-dir "$fixture_config" --session plugin-lifecycle plugins reload hello
yinz --config-dir "$fixture_config" --session plugin-lifecycle plugins reload nested
yinz --config-dir "$fixture_config" plugins status tagged
yinz --config-dir "$fixture_config" kill-session plugin-lifecycle
```

To reproduce the transition, install while `main` is at the `v1` commit, then
push the v2 commit. Reinstall retains v1. Update selects v2, but running panes
retain v1 until reload. Reload preserves the pane ID and greeting. The tag alias
stays at v1. For commit pinning, add an alias with `commit` set to
`git rev-parse v1` instead of `tag`. A first launch also installs an absent repository.

For local edits, clone this repository and set `repo` to its absolute checkout
path without a revision selector. Edit `main.ts` and `shared.ts` without committing,
then update and reload. Yinz reads the dirty checkout without changing its Git state.
