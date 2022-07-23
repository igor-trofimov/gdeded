import http from "$lib/http";

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({ params }) {
  const { data } = await http.get(`/play/${params.id}.json`);

  if (data) {
    return {
      status: 200,
      headers: {},
      body: { play: data }
    };
  }

  return {
    status: 404
  };
}
