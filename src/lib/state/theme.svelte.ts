import { THEME_CONFIGS, type ThemeVersion, type ThemeConfig } from '../themes/types.js';

class ThemeState {
	version = $state<ThemeVersion>('xp');

	get config(): ThemeConfig {
		return THEME_CONFIGS[this.version];
	}

	set(version: ThemeVersion) {
		this.version = version;
	}

	cycle() {
		const versions: ThemeVersion[] = ['win98', 'xp', 'vista'];
		const idx = versions.indexOf(this.version);
		this.version = versions[(idx + 1) % versions.length];
	}
}

export const theme = new ThemeState();
