export default function getRandomCategory(categories) {
    const keys = Object.keys(categories);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return randomKey;
}