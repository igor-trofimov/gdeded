import http from '$lib/http';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET() {
  const { data } = await http.get(`/play.json`);

  if (data) {
    return {
      status: 200,
      headers: {},
      body: { plays: data }
    };
  }

  return {
    status: 404
  };
}
