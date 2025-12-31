/**
 * Logger client-side unifie
 * Equivalent du logger backend mais pour le navigateur
 */
const LOG_LEVELS = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
};
const config = {
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
function shouldLog(level) {
    return config.enabled && LOG_LEVELS[level] >= LOG_LEVELS[config.minLevel];
}
function formatPrefix(tag, style) {
    return [`%c[${tag}]`, style];
}
export const Logger = {
    /**
     * Configure le logger
     */
    configure(options) {
        Object.assign(config, options);
    },
    /**
     * Log de debug (developpement uniquement)
     */
    debug(...args) {
        if (shouldLog('debug')) {
            const [prefix, style] = formatPrefix('DEBUG', STYLES.debug);
            console.log(prefix, style, ...args);
        }
    },
    /**
     * Log d'information
     */
    info(...args) {
        if (shouldLog('info')) {
            const [prefix, style] = formatPrefix('INFO', STYLES.info);
            console.log(prefix, style, ...args);
        }
    },
    /**
     * Log de succes
     */
    success(...args) {
        if (shouldLog('info')) {
            const [prefix, style] = formatPrefix('OK', STYLES.success);
            console.log(prefix, style, ...args);
        }
    },
    /**
     * Log d'avertissement
     */
    warn(...args) {
        if (shouldLog('warn')) {
            const [prefix, style] = formatPrefix('WARN', STYLES.warn);
            console.warn(prefix, style, ...args);
        }
    },
    /**
     * Log d'erreur (toujours affiche)
     */
    error(...args) {
        const [prefix, style] = formatPrefix('ERROR', STYLES.error);
        console.error(prefix, style, ...args);
    },
    /**
     * Log specifique aux lecons
     */
    lesson(lessonId, message) {
        if (shouldLog('info')) {
            const [prefix, style] = formatPrefix(`LESSON ${lessonId}`, STYLES.lesson);
            console.log(prefix, style, message);
        }
    }
};
export default Logger;
