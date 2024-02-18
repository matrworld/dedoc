
const sleep = (t: number) => new Promise((r) => setTimeout(r, t));

export async function getProjects() {
    await sleep(3000);

    return [
        {
            name: "Api Docs",
            mint: "d7Hq..."
        },
        {
            name: "User Docs",
            mint: "Ku3w..."
        },
        {
            name: "Getting Started",
            mint: "a8Rt..."
        },
        {
            name: "Internal Docs",
            mint: "l2S7..."
        },
    ]
}