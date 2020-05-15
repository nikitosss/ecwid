// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default <T extends any>(object: T): T => JSON.parse(JSON.stringify(object));
