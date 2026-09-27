import { ProfesorCoachHistoryListView } from '@/components/profesor/ProfesorCoachHistoryView';

type Props = {
  params: Promise<{ relationshipId: string }>;
};

export default async function ProfesorCoachHistoryPage({ params }: Props) {
  const { relationshipId } = await params;
  return <ProfesorCoachHistoryListView relationshipId={relationshipId} />;
}
