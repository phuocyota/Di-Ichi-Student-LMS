import OnlineClassCard from './OnlineClassCard.jsx';
import { onlineClasses } from '../../datas/lmsData.js';

function OnlineClassGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {onlineClasses.map((item) => (
        <OnlineClassCard key={item.className} item={item} />
      ))}
    </div>
  );
}

export default OnlineClassGrid;
