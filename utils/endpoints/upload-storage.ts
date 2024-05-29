const API_URL = process.env.EXPO_PUBLIC_API;

export default async function uploadStorage(data: string, actionMaker: string, type: string) {
  return fetch(`${API_URL}/storage/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ Data: data, ActionMaker: actionMaker, Type: type }),
  }).then(async (res) => {
    if (res.ok) {
      const r = await res.json();
      return r.data as string;
    }
  });
}
