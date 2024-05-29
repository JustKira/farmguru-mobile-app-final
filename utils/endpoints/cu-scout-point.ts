const API_URL = process.env.EXPO_PUBLIC_API;

interface CreateScoutPoint {
  Date: string;
  FieldId: string;
  ActionMaker: string;
  IssueCategory: string;
  IssueSeverity: string;
  Location: [number, number];
  Notes?: string;
  Status: string;
  Photos?: string[];
  VoiceNotes?: string;
}

interface UpdateScoutPoint {
  Date?: string;
  FieldId: string;
  ActionMaker: string;
  IssueCategory?: string;
  IssueSeverity?: string;
  Location?: [number, number];
  Notes?: string;
  Status?: string;
  MarkerId?: string;
  Photos?: string[];
  VoiceNotes?: string;
}

export default async function createUpdateScoutPoint(data: CreateScoutPoint | UpdateScoutPoint) {
  return fetch(`${API_URL}/fields/markers/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(async (res) => {
    if (res.ok) {
      const r = await res.json();
      return r.data as string;
    }
  });
}
