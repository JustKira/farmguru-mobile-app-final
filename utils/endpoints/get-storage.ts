const API_URL = process.env.EXPO_PUBLIC_API;

export default async function getStorage(key: string, actionMaker: string) {
  return fetch(`${API_URL}/storage/get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ Key: key, ActionMaker: actionMaker }),
  }).then(async (res) => {
    if (res.ok) {
      const r = await res.json();
      return r.data as string;
    }
  });
}
