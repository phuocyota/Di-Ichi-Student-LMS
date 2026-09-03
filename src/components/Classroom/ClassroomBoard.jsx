import { useEffect, useRef, useState } from 'react';
import { Eraser, PenLine } from 'lucide-react';

function ClassroomBoard({ socket, scheduleId, permissions }) {
  const [strokes, setStrokes] = useState([]);
  const [drawing, setDrawing] = useState(null);
  const strokesRef = useRef(strokes);
  strokesRef.current = strokes;

  useEffect(() => {
    if (!socket) return undefined;
    const receiveStroke = (event) => {
      if (event.scheduleId === scheduleId && event.data?.id) {
        setStrokes((current) => [...current, event.data]);
      }
    };
    const clearBoard = (event) => {
      if (event.scheduleId === scheduleId) setStrokes([]);
    };
    const sendSnapshot = (event) => {
      if (event.scheduleId === scheduleId && permissions.canControlBoard) {
        socket.emit('board:snapshot', { scheduleId, data: strokesRef.current });
      }
    };
    const receiveSnapshot = (event) => {
      if (event.scheduleId === scheduleId && Array.isArray(event.data)) {
        setStrokes(event.data);
      }
    };
    socket.on('board:draw', receiveStroke);
    socket.on('board:clear', clearBoard);
    socket.on('board:snapshot-request', sendSnapshot);
    socket.on('board:snapshot', receiveSnapshot);
    socket.emit('board:snapshot-request', { scheduleId });
    return () => {
      socket.off('board:draw', receiveStroke);
      socket.off('board:clear', clearBoard);
      socket.off('board:snapshot-request', sendSnapshot);
      socket.off('board:snapshot', receiveSnapshot);
    };
  }, [permissions.canControlBoard, scheduleId, socket]);

  function pointFromEvent(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * 1000,
      y: ((event.clientY - rect.top) / rect.height) * 500,
    };
  }

  function startDrawing(event) {
    if (!permissions.canWriteBoard) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDrawing({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      color: '#F97316',
      width: 4,
      points: [pointFromEvent(event)],
    });
  }

  function continueDrawing(event) {
    if (!drawing) return;
    const next = { ...drawing, points: [...drawing.points, pointFromEvent(event)] };
    setDrawing(next);
  }

  function finishDrawing() {
    if (!drawing) return;
    if (drawing.points.length > 1) {
      setStrokes((current) => [...current, drawing]);
      socket?.emit('board:draw', { scheduleId, data: drawing });
    }
    setDrawing(null);
  }

  function clearBoard() {
    if (!permissions.canControlBoard) return;
    setStrokes([]);
    socket?.emit('board:clear', { scheduleId });
  }

  const visibleStrokes = drawing ? [...strokes, drawing] : strokes;
  return (
    <section className="border-t border-white/10 bg-white p-3 text-slate-900">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-black">
          <PenLine className="h-5 w-5 text-orange-500" />
          Bảng tương tác
        </div>
        {permissions.canControlBoard ? (
          <button type="button" onClick={clearBoard} className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-black">
            <Eraser className="h-4 w-4" /> Xóa bảng
          </button>
        ) : null}
      </div>
      <svg
        viewBox="0 0 1000 500"
        className={`h-56 w-full touch-none rounded-2xl border border-slate-200 bg-slate-50 ${permissions.canWriteBoard ? 'cursor-crosshair' : 'cursor-not-allowed'}`}
        onPointerDown={startDrawing}
        onPointerMove={continueDrawing}
        onPointerUp={finishDrawing}
        onPointerCancel={finishDrawing}
      >
        {visibleStrokes.map((stroke) => (
          <polyline
            key={stroke.id}
            points={stroke.points.map((point) => `${point.x},${point.y}`).join(' ')}
            fill="none"
            stroke={stroke.color}
            strokeWidth={stroke.width}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>
      {!permissions.canWriteBoard ? <p className="mt-2 text-center text-xs font-bold text-slate-500">Giáo viên chưa cấp quyền viết bảng.</p> : null}
    </section>
  );
}

export default ClassroomBoard;
