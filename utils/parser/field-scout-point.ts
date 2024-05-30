import { NewFieldsScoutPoints } from '~/lib/db/schemas/fields-scout-points.schema';

export function scoutPointsParser(data: Marker[]): NewFieldsScoutPoints[] {
  const fieldsScoutPoints: NewFieldsScoutPoints[] = data.map((marker) => {
    return {
      id: marker.id,
      fieldId: marker.fieldId,
      category: marker.issueCategory,
      severity: marker.issueSeverity,
      location: marker.markerLocation,
      date: new Date(marker.markerDate),
      photosKeys: marker.photos,
      notes: marker.notes,
      lastUpdate: marker.lastView,
      reply: marker.reply,
      voiceNoteKey: marker.voiceNote,
      voiceReplyKey: marker.voiceReply,
    };
  });
  return fieldsScoutPoints;
}
