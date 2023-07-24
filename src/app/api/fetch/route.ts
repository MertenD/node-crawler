export async function POST(request: Request) {

    const responseHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }

    try {
        const body = await request.json();

        const response = await fetch(body.url);
        if (!response.ok) {
            throw new Error(`Status code was: ${response.status}`);
        }

        const data = await response.text();

        return new Response(data, {
            status: 200,
            headers: responseHeaders
        });
    } catch (error) {
        if (error instanceof Error) {
            return new Response(error.toString(), {
                status: 500,
                headers: responseHeaders
            });
        } else {
            return new Response("An unexpected error occurred", {
                status: 500,
                headers: responseHeaders
            });
        }
    }
}
