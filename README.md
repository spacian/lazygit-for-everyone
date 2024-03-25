## Features

This extension is a wrapper for `lazygit` (https://github.com/jesseduffield/lazygit). It
should work on both Windows and Unix systems, utilizing `powershell` or `bash`
respectively.

The extension provides three commands:

- `lazygit: lazygit` for the default lazygit window.
- `lazygit: log` to filter lazygit by a repository in the current workspace of your
  choice (similar to calling `git log --oneline` on that repository).
- `lazygit: file history` to filter lazygit by the currently open file.

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
