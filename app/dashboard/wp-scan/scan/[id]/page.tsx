export const dynamic = 'force-dynamic';

import ScanDetailClient from './scan-detail-client';

export default function ScanDetailPage({ params }: { params: { id: string } }) {
  return <ScanDetailClient scanId={params.id} />;
}
