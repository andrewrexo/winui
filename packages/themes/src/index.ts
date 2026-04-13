export type ThemeVersion = 'win98' | 'xp' | 'vista';

export interface ThemeConfig {
	version: ThemeVersion;
	label: string;
	wallpaperCSS: string;
}

export const THEME_CONFIGS: Record<ThemeVersion, ThemeConfig> = {
	win98: {
		version: 'win98',
		label: 'Windows 98',
		wallpaperCSS: 'background: #008080;'
	},
	xp: {
		version: 'xp',
		label: 'Windows XP',
		wallpaperCSS: `background:
			radial-gradient(ellipse at 50% 120%, #4a8f29 0%, #5ca632 15%, #78b84a 30%, transparent 55%),
			radial-gradient(ellipse at 30% 80%, #3d7a22 0%, transparent 40%),
			radial-gradient(ellipse at 70% 85%, #5a9e35 0%, transparent 35%),
			linear-gradient(180deg, #3672c0 0%, #5a9ed6 25%, #8ec3e8 45%, #b5d8f0 55%, #d1e8f5 62%, #88c56a 63%, #6ab344 75%, #4a8f29 100%);
			background-color: #3672c0;`
	},
	vista: {
		version: 'vista',
		label: 'Windows Vista',
		wallpaperCSS: `background:
			radial-gradient(ellipse at 50% 60%, #1a3a6a 0%, transparent 70%),
			radial-gradient(ellipse at 80% 20%, #2a1848 0%, transparent 50%),
			linear-gradient(180deg, #0a0a1a 0%, #0c1830 30%, #1a3060 60%, #0c1830 100%);
			background-color: #0a0a1a;`
	}
};
