export default <T>(object: T): T => JSON.parse(JSON.stringify(object));
