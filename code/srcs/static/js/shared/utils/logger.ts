/**
 * Logger client-side unifie
 * Equivalent du logger backend mais pour le navigateur
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
	enabled: boolean;
	minLevel: LogLevel;
}

const LOG_LEVELS: Record<LogLevel, number> = {
	debug: 0,
	info: 1,
	warn: 2,
	error: 3
};

const config: LoggerConfig = {
	enabled: true,
	minLevel: 'debug'
};

const STYLES = {
	debug: 'color: #888; font-weight: normal',
	info: 'color: #2196F3; font-weight: normal',
	success: 'color: #4CAF50; font-weight: bold',
	warn: 'color: #FF9800; font-weight: bold',
	error: 'color: #F44336; font-weight: bold',
	lesson: 'color: #9C27B0; font-weight: bold'
};

function shouldLog(level: LogLevel): boolean {
	return config.enabled && LOG_LEVELS[level] >= LOG_LEVELS[config.minLevel];
}

function formatPrefix(tag: string, style: string): [string, string] {
	return [`%c[${tag}]`, style];
}

export const Logger = {
	/**
	 * Configure le logger
	 */
	configure(options: Partial<LoggerConfig>): void {
		Object.assign(config, options);
	},

	/**
	 * Log de debug (developpement uniquement)
	 */
	debug(...args: unknown[]): void {
		if (shouldLog('debug')) {
			const [prefix, style] = formatPrefix('DEBUG', STYLES.debug);
			console.log(prefix, style, ...args);
		}
	},

	/**
	 * Log d'information
	 */
	info(...args: unknown[]): void {
		if (shouldLog('info')) {
			const [prefix, style] = formatPrefix('INFO', STYLES.info);
			console.log(prefix, style, ...args);
		}
	},

	/**
	 * Log de succes
	 */
	success(...args: unknown[]): void {
		if (shouldLog('info')) {
			const [prefix, style] = formatPrefix('OK', STYLES.success);
			console.log(prefix, style, ...args);
		}
	},

	/**
	 * Log d'avertissement
	 */
	warn(...args: unknown[]): void {
		if (shouldLog('warn')) {
			const [prefix, style] = formatPrefix('WARN', STYLES.warn);
			console.warn(prefix, style, ...args);
		}
	},

	/**
	 * Log d'erreur (toujours affiche)
	 */
	error(...args: unknown[]): void {
		const [prefix, style] = formatPrefix('ERROR', STYLES.error);
		console.error(prefix, style, ...args);
	},

	/**
	 * Log specifique aux lecons
	 */
	lesson(lessonId: string, message: string): void {
		if (shouldLog('info')) {
			const [prefix, style] = formatPrefix(`LESSON ${lessonId}`, STYLES.lesson);
			console.log(prefix, style, message);
		}
	}
};

export default Logger;
