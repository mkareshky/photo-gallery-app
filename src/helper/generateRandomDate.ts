// src/helper/generateRandomDate.ts
// This function generates a random date between January 1, 2020, and the current date.
const generateRandomDate = () => {
    const start = new Date(2020, 0, 1).getTime();
    const end = new Date().getTime();
    const timestamp = Math.floor(Math.random() * (end - start) + start);
    return new Date(timestamp).toISOString();
}
export default generateRandomDate;