import Card from '../common/Card.jsx';

function DueCard({ title, subtitle, icon: Icon, tone, action }) {
  const styles = tone === 'blue' ? 'bg-blue-50 text-[#2563EB]' : 'bg-orange-50 text-[#F97316]';
  const button = tone === 'blue' ? 'bg-[#2563EB]' : 'bg-[#F97316]';

  return (
    <Card>
      <div className={`grid h-16 w-16 place-items-center rounded-3xl ${styles}`}>
        <Icon className="h-9 w-9" />
      </div>
      <h3 className="mt-5 text-2xl font-black text-slate-900">{title}</h3>
      <p className="mt-2 font-bold text-slate-500">{subtitle}</p>
      <button className={`mt-6 rounded-3xl ${button} px-5 py-3 font-black text-white shadow-lg transition hover:-translate-y-1`}>
        {action}
      </button>
    </Card>
  );
}

export default DueCard;
