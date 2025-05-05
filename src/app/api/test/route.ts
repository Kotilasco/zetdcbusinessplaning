export async function GET(req) {
    console.log("API route /api/test was hit");

    // Check if the request attempts WebSocket upgrade
    if (req.headers.get("upgrade") === "websocket") {
        console.log("WebSocket upgrade attempt detected!");
        return new Response("WebSockets request not allowed", { status: 400 });
    }

    return new Response(JSON.stringify({ message: "API /api/test is working!" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
