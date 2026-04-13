# winui

Windows-themed UI components. Svelte 5 and React.

Three packages:

- `@drewrube/winui-svelte` — 14 Svelte 5 components (Desktop, Window, Taskbar, StartMenu, etc.)
- `@drewrube/winui-react` — Same components, ported to React 18/19
- `@drewrube/winui-themes` — Shared CSS themes for Win98, XP, and Vista

## Install

```bash
pnpm install
```

## Packages

### @drewrube/winui-svelte

```bash
npm install @drewrube/winui-svelte
```

```svelte
<script>
  import { Desktop, Window, Taskbar, StartMenu } from '@drewrube/winui-svelte';
  import { wm, theme } from '@drewrube/winui-svelte';
  import '@drewrube/winui-themes/winxp.css';
</script>

<div data-theme={theme.version}>
  <Desktop>
    <Window id="my-window" title="Hello">
      <p>window content goes here</p>
    </Window>
    <Taskbar />
  </Desktop>
</div>
```

### @drewrube/winui-react

```bash
npm install @drewrube/winui-react
```

```tsx
import { Desktop, Window, Taskbar } from '@drewrube/winui-react';
import { useWindowManager, useTheme } from '@drewrube/winui-react';
import '@drewrube/winui-themes/winxp.css';
import '@drewrube/winui-react/styles.css';

function App() {
  const { theme } = useTheme();
  return (
    <div data-theme={theme.version}>
      <Desktop>
        <Window id="my-window" title="Hello">
          <p>window content goes here</p>
        </Window>
        <Taskbar />
      </Desktop>
    </div>
  );
}
```

### @drewrube/winui-themes

Three themes, applied via `[data-theme]` attribute and CSS custom properties:

- `win98` — Windows 98 classic
- `xp` — XP Luna
- `vista` — Vista Aero

Import the CSS for whichever theme(s) you want:

```js
import '@drewrube/winui-themes/win98.css';
import '@drewrube/winui-themes/winxp.css';
import '@drewrube/winui-themes/vista.css';
```

## Components

Desktop, Window, TitleBar, Taskbar, StartMenu, DesktopIcon, Button, ContextMenu, ProgressBar, TextInput, MenuBar, Toolbar, AddressBar, NotificationBalloon

## State

Both frameworks expose the same singletons with the same API:

| Svelte | React | What it does |
|---|---|---|
| `wm` | `useWindowManager()` | open/close/focus/minimize windows |
| `theme` | `useTheme()` | get/set active theme |
| `taskbar` | `useTaskbar()` | pinned items, clock visibility |
| `desktop` | `useDesktop()` | icon layout, selection |
| `notifications` | `useNotifications()` | system tray balloons |

## License

MIT
