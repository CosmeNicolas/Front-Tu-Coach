import { ProfesorCoachHistoryDetailView } from '@/components/profesor/ProfesorCoachHistoryView';

type Props = {
  params: Promise<{ relationshipId: string; planificationId: string }>;
};

export default async function ProfesorCoachHistoryDetailPage({ params }: Props) {
  const { relationshipId, planificationId } = await params;
  return (
    <ProfesorCoachHistoryDetailView
      relationshipId={relationshipId}
      planificationId={planificationId}
    />
  );
}
