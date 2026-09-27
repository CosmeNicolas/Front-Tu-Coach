import { CoachRelationshipChatView } from '@/components/coach/CoachRelationshipChatView';

type Props = {
  params: Promise<{ relationshipId: string }>;
};

export default async function ProfesorCoachChatPage({ params }: Props) {
  const { relationshipId } = await params;
  return (
    <CoachRelationshipChatView
      relationshipId={relationshipId}
      currentRole="profesor"
      backHref="/profesor/solicitudes"
      backLabel="Solicitudes"
    />
  );
}
