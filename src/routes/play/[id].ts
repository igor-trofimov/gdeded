import http from "$lib/http";

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET({ params }) {
  const { data } = await http.get(`/play/${params.id}.json`);
  const res = await http.get(`/speeches.json?play_id=${params.id}`);

  if (data) {
    return {
      status: 200,
      headers: {},
      body: { play: data, speeches: res.data }
    };
  }

  return {
    status: 404
  };
}
