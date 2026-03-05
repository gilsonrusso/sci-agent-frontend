import { Box, Typography } from '@mui/material';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { subDays } from 'date-fns';

export default function WriterHeatmap() {
    const today = new Date();

    // Generate some mock contribution data for the last 150 days
    const randomValues = Array.from({ length: 150 }).map((_, i) => {
        return {
            date: subDays(today, i).toISOString().split('T')[0],
            count: Math.random() > 0.5 ? Math.floor(Math.random() * 4) : 0
        };
    });

    return (
        <Box sx={{
            backgroundColor: '#161B22',
            border: '1px solid #30363D',
            borderRadius: '6px',
            p: 3,
            mb: 4
        }}>
            <Typography sx={{ color: '#C9D1D9', fontWeight: 600, mb: 2, fontSize: 14 }}>
                341 contributions in the last year
            </Typography>

            <Box sx={{
                // Overriding default styles for dark theme
                '& .react-calendar-heatmap .color-empty': { fill: '#161B22', stroke: '#1C2128', strokeWidth: 1 },
                '& .react-calendar-heatmap .color-scale-1': { fill: '#0E4429' },
                '& .react-calendar-heatmap .color-scale-2': { fill: '#006D32' },
                '& .react-calendar-heatmap .color-scale-3': { fill: '#26A641' },
                '& .react-calendar-heatmap .color-scale-4': { fill: '#39D353' },
                '& .react-calendar-heatmap text': { fill: '#8B949E', fontSize: '10px' }
            }}>
                <CalendarHeatmap
                    startDate={subDays(today, 150)}
                    endDate={today}
                    values={randomValues}
                    classForValue={(value: { count: number } | undefined) => {
                        if (!value || value.count === 0) {
                            return 'color-empty';
                        }
                        return `color-scale-${Math.min(value.count, 4)}`;
                    }}
                    showWeekdayLabels={true}
                    gutterSize={3}
                />
            </Box>
        </Box>
    );
}
