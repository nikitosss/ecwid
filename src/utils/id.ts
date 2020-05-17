/**
 * Генерация ID
 */
export default (): string => `f${(Math.random() * 1e8).toString(16)}`;
