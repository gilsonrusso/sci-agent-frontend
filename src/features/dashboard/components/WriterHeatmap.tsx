import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { subDays } from 'date-fns';

export default function WriterHeatmap() {
  const today = new Date();
  const theme = useTheme();

  // Generate some mock contribution data for the last 150 days
  const randomValues = Array.from({ length: 150 }).map((_, i) => {
    return {
      date: subDays(today, i).toISOString().split('T')[0],
      count: Math.random() > 0.5 ? Math.floor(Math.random() * 4) : 0,
    };
  });

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '6px',
        p: 3,
        mb: 4,
      }}
    >
      <Typography sx={{ color: 'text.primary', fontWeight: 600, mb: 2, fontSize: 14 }}>
        341 contributions in the last year
      </Typography>

      <Box
        sx={{
          // Overriding default styles for current theme
          '& .react-calendar-heatmap .color-empty': {
            fill: theme.palette.mode === 'dark' ? '#161B22' : '#ebedf0',
            stroke: theme.palette.divider,
            strokeWidth: 1,
          },
          '& .react-calendar-heatmap .color-scale-1': {
            fill: theme.palette.mode === 'dark' ? '#0E4429' : '#9be9a8',
          },
          '& .react-calendar-heatmap .color-scale-2': {
            fill: theme.palette.mode === 'dark' ? '#006D32' : '#40c463',
          },
          '& .react-calendar-heatmap .color-scale-3': {
            fill: theme.palette.mode === 'dark' ? '#26A641' : '#30a14e',
          },
          '& .react-calendar-heatmap .color-scale-4': {
            fill: theme.palette.mode === 'dark' ? '#39D353' : '#216e39',
          },
          '& .react-calendar-heatmap text': {
            fill: theme.palette.text.secondary,
            fontSize: '10px',
          },
        }}
      >
        <CalendarHeatmap
          startDate={subDays(today, 150)}
          endDate={today}
          values={randomValues}
          classForValue={(value: any) => {
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
