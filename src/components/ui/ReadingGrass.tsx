import { useMemo } from 'react';
import { format, subDays, startOfWeek, differenceInWeeks } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { ReadingActivity } from '../../types';

interface ReadingGrassProps {
  activities: ReadingActivity[];
}

function ReadingGrass({ activities }: ReadingGrassProps) {
  const today = new Date();
  const startDate = subDays(today, 364);
  const weekStart = startOfWeek(startDate, { weekStartsOn: 0 });
  const totalWeeks = differenceInWeeks(today, weekStart) + 1;

  const activityMap = useMemo(() => {
    const map = new Map<string, number>();
    activities.forEach((a) => map.set(a.date, a.count));
    return map;
  }, [activities]);

  const getColor = (count: number): string => {
    if (count === 0) return '#161b22';
    if (count === 1) return '#0e4429';
    if (count === 2) return '#006d32';
    if (count === 3) return '#26a641';
    return '#39d353';
  };

  const weeks = useMemo(() => {
    const result: { date: Date; count: number }[][] = [];
    let currentDate = new Date(weekStart);
    for (let w = 0; w < totalWeeks; w++) {
      const week: { date: Date; count: number }[] = [];
      for (let d = 0; d < 7; d++) {
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        const count = activityMap.get(dateStr) || 0;
        week.push({ date: new Date(currentDate), count });
        currentDate = new Date(currentDate.getTime() + 86400000);
      }
      result.push(week);
    }
    return result;
  }, [weekStart, totalWeeks, activityMap]);

  const monthLabels = useMemo(() => {
    const labels: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, weekIndex) => {
      const firstDay = week[0];
      const month = firstDay.date.getMonth();
      if (month !== lastMonth) {
        labels.push({ label: format(firstDay.date, 'MMM', { locale: ko }), weekIndex });
        lastMonth = month;
      }
    });
    return labels;
  }, [weeks]);

  const dayLabels = ['', '월', '', '수', '', '금', ''];
  const totalCount = activities.reduce((sum, a) => sum + a.count, 0);

  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e6edf3' }}>
          독서 활동
        </h3>
        <span style={{ fontSize: '0.8rem', color: '#8b949e' }}>
          올해 총 <strong style={{ color: '#e6edf3' }}>{totalCount}</strong>권
        </span>
      </div>

      <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
        {/* Month labels */}
        <div style={{ display: 'flex', marginLeft: 30, marginBottom: 6, gap: 0 }}>
          {monthLabels.map((m, i) => (
            <div
              key={i}
              style={{
                fontSize: '0.7rem',
                color: '#8b949e',
                position: 'relative',
                left: m.weekIndex * 14,
                width: 0,
                whiteSpace: 'nowrap',
              }}
            >
              {m.label}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 0 }}>
          {/* Day labels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginRight: 4 }}>
            {dayLabels.map((label, i) => (
              <div
                key={i}
                style={{
                  width: 24,
                  height: 12,
                  fontSize: '0.6rem',
                  color: '#8b949e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: 4,
                }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div style={{ display: 'flex', gap: 2 }}>
            {weeks.map((week, wi) => (
              <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {week.map((day, di) => {
                  const isAfterToday = day.date > today;
                  return (
                    <div
                      key={di}
                      title={
                        isAfterToday
                          ? ''
                          : `${format(day.date, 'yyyy년 M월 d일', { locale: ko })}: ${day.count}권`
                      }
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 2,
                        backgroundColor: isAfterToday ? 'transparent' : getColor(day.count),
                        outline: day.count === 0 && !isAfterToday ? '1px solid rgba(27, 31, 35, 0.06)' : 'none',
                        cursor: isAfterToday ? 'default' : 'pointer',
                        opacity: isAfterToday ? 0 : 1,
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 4,
          marginTop: 10,
          fontSize: '0.7rem',
          color: '#8b949e',
        }}
      >
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            style={{
              width: 12,
              height: 12,
              borderRadius: 2,
              backgroundColor: getColor(level),
            }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

export default ReadingGrass;
