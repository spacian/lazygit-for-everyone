## Features

This extension is a wrapper for `lazygit` (https://github.com/jesseduffield/lazygit). It
should work on both Windows and Unix systems, utilizing `powershell` or `bash`
respectively.

The extension provides five commands:

- `lazygit: lazygit` for the default lazygit window for a repository in your workspace
  of your choice
- `lazygit: lazygit for repository of current file` to open lazygit for the repository
  of the currently opened file
- `lazygit: log` to filter lazygit by a repository in the current workspace of your
  choice (similar to calling `git log --oneline` on that repository).
- `lazygit: log for repository of current file` to open the log for the repository of
  the currently opened file
- `lazygit: file history` to show lazygit's file history of the currently opened file

The extension does not come with predefined shortcuts. You can define custom shortcuts
in the VSCode shortcut editor.

## Requirements

To use `lazygit`, you need `lazygit` installed and in your path. You can find install
instructions for `lazygit` at https://github.com/jesseduffield/lazygit.

## Release Notes

### 0.0.2

- Choose repository if multiple are available.

### 0.0.1

- Initial release.
