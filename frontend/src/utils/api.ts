import env from "../env";

export default abstract class API {
    static async POST(path: string, body: object) {
        const data = await fetch(env.apiUrl + path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!data.ok) {
            const content = await data.text();
            throw new Error(content);
        }

        const json = await data.json();
        return json;
    }

    static async GET(path: string) {
        const data = await fetch(env.apiUrl + path, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!data.ok) {
            const content = await data.text();
            throw new Error(content);
        }

        const json = await data.json();
        return json;
    }
}
