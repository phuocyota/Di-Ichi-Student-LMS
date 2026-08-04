import OnlineClassGrid from '../components/OnlinePage/OnlineClassGrid.jsx';
import PageShell from '../components/common/PageShell.jsx';

function OnlinePage() {
  return (
    <PageShell title="Lớp học Online" subtitle="Vào lớp nhanh với nút tham gia lớn, tối ưu cho tablet và mobile.">
      <OnlineClassGrid />
    </PageShell>
  );
}

export default OnlinePage;
