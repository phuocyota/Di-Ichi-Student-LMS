import { useState } from 'react';
import CertificateGrid from '../components/CertificatesPage/CertificateGrid.jsx';
import CertificatePreview from '../components/CertificatesPage/CertificatePreview.jsx';
import PageShell from '../components/common/PageShell.jsx';
import { certificates } from '../datas/certificateData.js';

function CertificatesPage() {
  const [selectedCertificateId, setSelectedCertificateId] = useState(certificates[0]?.id);
  const selectedCertificate = certificates.find((certificate) => certificate.id === selectedCertificateId) ?? certificates[0];

  return (
    <PageShell title="Chứng chỉ" subtitle="Xem trước, kiểm tra thông tin và tải về chứng chỉ đã được cấp.">
      <div className="grid items-start gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <CertificateGrid certificates={certificates} selectedCertificateId={selectedCertificate?.id} onSelectCertificate={setSelectedCertificateId} />
        <CertificatePreview certificate={selectedCertificate} />
      </div>
    </PageShell>
  );
}

export default CertificatesPage;
