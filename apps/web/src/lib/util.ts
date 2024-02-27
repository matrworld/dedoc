export function randomId() {
    const generate = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return generate() + generate() + generate() + generate();
}