import CertificateCard from './CertificateCard.jsx';

function CertificateGrid({ certificates, selectedCertificateId, onSelectCertificate }) {
  return (
    <div className="grid auto-rows-max content-start gap-5">
      {certificates.map((cert) => (
        <CertificateCard
          key={cert.id}
          cert={cert}
          selected={cert.id === selectedCertificateId}
          onSelect={() => onSelectCertificate(cert.id)}
        />
      ))}
    </div>
  );
}

export default CertificateGrid;
