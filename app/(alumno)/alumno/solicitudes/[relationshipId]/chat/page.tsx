import { CoachRelationshipChatView } from '@/components/coach/CoachRelationshipChatView';

type Props = {
  params: Promise<{ relationshipId: string }>;
};

export default async function AlumnoCoachChatPage({ params }: Props) {
  const { relationshipId } = await params;
  return (
    <CoachRelationshipChatView
      relationshipId={relationshipId}
      currentRole="alumno"
      backHref="/alumno/solicitudes"
      backLabel="Mis coaches"
    />
  );
}
