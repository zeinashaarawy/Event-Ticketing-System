import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tab,
  Tabs,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Edit, Delete, Add, Download } from '@mui/icons-material';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const MyEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState(1);
  const [analyticsData, setAnalyticsData] = useState({
    ticketsSold: [],
    revenue: [],
    labels: [],
    upcomingEvents: [],
    summary: {
      totalEvents: 0,
      totalTicketsSold: 0,
      totalRevenue: 0
    }
  });
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [comparisonEvents, setComparisonEvents] = useState([]);
  const [filteredAnalytics, setFilteredAnalytics] = useState(null);

  useEffect(() => {
    fetchEvents();
    fetchAnalytics();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/v1/events/my-events');
      setEvents(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching events');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('/api/v1/users/events/analytics');
      const data = response.data;
      
      setAnalyticsData({
        ticketsSold: data.ticketsSold || [],
        revenue: data.revenue || [],
        labels: data.labels || [],
        upcomingEvents: data.upcomingEvents || [],
        summary: {
          totalEvents: data.totalEvents || 0,
          totalTicketsSold: data.totalTicketsSold || 0,
          totalRevenue: data.totalRevenue || 0
        }
      });
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/v1/events/${selectedEvent._id}`);
      setEvents(events.filter(event => event._id !== selectedEvent._id));
      setDeleteDialogOpen(false);
      setSelectedEvent(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting event');
    }
  };

  const handleEdit = (event) => {
    navigate(`/my-events/${event._id}/edit`);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Filter data based on date range
  const getFilteredData = () => {
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);

    const filteredData = {
      labels: [],
      ticketsSold: [],
      revenue: [],
      summary: { ...analyticsData.summary }
    };

    analyticsData.labels.forEach((label, index) => {
      const date = new Date(label);
      if (date >= startDate && date <= endDate) {
        filteredData.labels.push(label);
        filteredData.ticketsSold.push(analyticsData.ticketsSold[index]);
        filteredData.revenue.push(analyticsData.revenue[index]);
      }
    });

    return filteredData;
  };

  // Generate CSV report
  const generateReport = () => {
    const data = getFilteredData();
    let csv = 'Date,Revenue,Tickets Sold\n';
    
    data.labels.forEach((label, index) => {
      csv += `${label},${data.revenue[index]},${data.ticketsSold[index]}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `event-analytics-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Calculate performance metrics
  const calculateMetrics = (data) => {
    if (!data || !data.revenue || data.revenue.length === 0) return null;

    const totalRevenue = data.revenue.reduce((sum, val) => sum + val, 0);
    const totalTickets = data.ticketsSold.reduce((sum, val) => sum + val, 0);
    const avgRevenuePerDay = totalRevenue / data.labels.length;
    const avgTicketsPerDay = totalTickets / data.labels.length;

    return {
      totalRevenue,
      totalTickets,
      avgRevenuePerDay,
      avgTicketsPerDay,
      peakRevenue: Math.max(...data.revenue),
      peakTickets: Math.max(...data.ticketsSold),
    };
  };

  // Enhanced chart data with comparison
  const getComparisonChartData = () => {
    const data = filteredAnalytics || analyticsData;
    return {
      labels: data.labels,
      datasets: [
        {
          label: selectedMetric === 'revenue' ? 'Revenue ($)' : 'Tickets Sold',
          data: selectedMetric === 'revenue' ? data.revenue : data.ticketsSold,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
        ...comparisonEvents.map((eventId, index) => {
          const event = events.find(e => e._id === eventId);
          return {
            label: event ? event.title : `Event ${index + 1}`,
            data: selectedMetric === 'revenue' 
              ? event?.analytics?.revenue || []
              : event?.analytics?.ticketsSold || [],
            borderColor: `hsl(${index * 60}, 70%, 50%)`,
            backgroundColor: `hsla(${index * 60}, 70%, 50%, 0.5)`,
          };
        }),
      ],
    };
  };

  const revenueChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Revenue Overview',
      },
    },
  };

  const ticketsChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Tickets Overview',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Tickets'
        }
      }
    }
  };

  // Add new chart options
  const bookingDistributionOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Ticket Booking Distribution',
      }
    }
  };

  const revenueChartData = {
    labels: analyticsData.labels,
    datasets: [
      {
        label: 'Revenue ($)',
        data: analyticsData.revenue,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const ticketsChartData = {
    labels: analyticsData.labels,
    datasets: [
      {
        label: 'Tickets Sold',
        data: analyticsData.ticketsSold,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading Analytics...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ width: '100%', mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Events List" />
            <Tab label="Analytics Dashboard" />
          </Tabs>
        </Box>

        {activeTab === 0 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h4">
                My Events
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/create-event')}
              >
                Create Event
              </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Venue</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Available Tickets</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event._id}>
                      <TableCell>{event.title}</TableCell>
                      <TableCell>
                        {new Date(event.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{event.venue}</TableCell>
                      <TableCell>${event.ticketPrice}</TableCell>
                      <TableCell>{event.totalTickets}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(event)}>
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            setSelectedEvent(event);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {activeTab === 1 && (
          <Grid container spacing={4}>
            {/* Date Range Filters */}
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                  <TextField
                    type="date"
                    label="Start Date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange(prev => ({
                      ...prev,
                      startDate: e.target.value
                    }))}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    type="date"
                    label="End Date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange(prev => ({
                      ...prev,
                      endDate: e.target.value
                    }))}
                    InputLabelProps={{ shrink: true }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<Download />}
                    onClick={generateReport}
                  >
                    Download Report
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {/* Summary Cards */}
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Summary & Trends
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" color="primary">
                        {analyticsData.summary?.totalEvents || 0}
                      </Typography>
                      <Typography variant="subtitle1">Total Events</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" color="primary">
                        {analyticsData.summary?.totalTicketsSold || 0}
                      </Typography>
                      <Typography variant="subtitle1">Tickets Sold</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" color="primary">
                        ${(analyticsData.summary?.totalRevenue || 0).toFixed(2)}
                      </Typography>
                      <Typography variant="subtitle1">Total Revenue</Typography>
                    </Box>
                  </Grid>
                  {/* Additional Metrics */}
                  {calculateMetrics(filteredAnalytics || analyticsData) && (
                    <>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <Typography variant="h4" color="primary">
                            ${calculateMetrics(filteredAnalytics || analyticsData).avgRevenuePerDay.toFixed(2)}
                          </Typography>
                          <Typography variant="subtitle1">Avg. Daily Revenue</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <Typography variant="h4" color="primary">
                            {calculateMetrics(filteredAnalytics || analyticsData).avgTicketsPerDay.toFixed(1)}
                          </Typography>
                          <Typography variant="subtitle1">Avg. Daily Tickets</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <Typography variant="h4" color="primary">
                            ${calculateMetrics(filteredAnalytics || analyticsData).peakRevenue.toFixed(2)}
                          </Typography>
                          <Typography variant="subtitle1">Peak Daily Revenue</Typography>
                        </Box>
                      </Grid>
                    </>
                  )}

                  {/* Trends Section */}
                  {analyticsData.trends && (
                    <>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <Typography variant="h4" color={analyticsData.trends.revenueGrowth >= 0 ? 'success.main' : 'error.main'}>
                            {analyticsData.trends.revenueGrowth.toFixed(1)}%
                          </Typography>
                          <Typography variant="subtitle1">Revenue Growth</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <Typography variant="h4" color={analyticsData.trends.ticketsGrowth >= 0 ? 'success.main' : 'error.main'}>
                            {analyticsData.trends.ticketsGrowth.toFixed(1)}%
                          </Typography>
                          <Typography variant="subtitle1">Ticket Sales Growth</Typography>
                        </Box>
                      </Grid>
                    </>
                  )}

                  {/* Projections Section */}
                  {analyticsData.projections && (
                    <>
                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                          Projections
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <Typography variant="h4" color="info.main">
                            ${analyticsData.projections.nextMonthRevenue.toFixed(2)}
                          </Typography>
                          <Typography variant="subtitle1">Projected Next Month Revenue</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <Typography variant="h4" color="info.main">
                            {Math.round(analyticsData.projections.nextMonthTickets)}
                          </Typography>
                          <Typography variant="subtitle1">Projected Next Month Tickets</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <Typography variant="h4" color="info.main">
                            {analyticsData.projections.confidence.toFixed(0)}%
                          </Typography>
                          <Typography variant="subtitle1">Projection Confidence</Typography>
                        </Box>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Paper>
            </Grid>

            {/* Event Comparison */}
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Performance Comparison</Typography>
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Metric</InputLabel>
                    <Select
                      value={selectedMetric}
                      onChange={(e) => setSelectedMetric(e.target.value)}
                      label="Metric"
                    >
                      <MenuItem value="revenue">Revenue</MenuItem>
                      <MenuItem value="tickets">Tickets Sold</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Compare Events</InputLabel>
                    <Select
                      multiple
                      value={comparisonEvents}
                      onChange={(e) => setComparisonEvents(e.target.value)}
                      label="Compare Events"
                    >
                      {events.map((event) => (
                        <MenuItem key={event._id} value={event._id}>
                          {event.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Line 
                  options={{
                    responsive: true,
                    plugins: {
                      title: {
                        display: true,
                        text: 'Event Performance Comparison'
                      }
                    }
                  }} 
                  data={getComparisonChartData()} 
                />
              </Paper>
            </Grid>

            {/* Daily Stats Table */}
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Daily Performance
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Revenue</TableCell>
                        <TableCell align="right">Tickets Sold</TableCell>
                        <TableCell align="right">Avg. Ticket Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(filteredAnalytics || analyticsData).dailyStats?.map((day, index) => (
                        <TableRow key={index}>
                          <TableCell>{new Date(day.date).toLocaleDateString()}</TableCell>
                          <TableCell align="right">${day.revenue.toFixed(2)}</TableCell>
                          <TableCell align="right">{day.ticketsSold}</TableCell>
                          <TableCell align="right">
                            ${day.ticketsSold > 0 ? (day.revenue / day.ticketsSold).toFixed(2) : '0.00'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            {/* Revenue Overview */}
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Revenue Overview
                </Typography>
                <Line options={revenueChartOptions} data={revenueChartData} />
              </Paper>
            </Grid>

            {/* Tickets Overview */}
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Tickets Overview
                </Typography>
                <Bar options={ticketsChartOptions} data={ticketsChartData} />
              </Paper>
            </Grid>

            {/* After the Tickets Overview section */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Booking Rate
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Line
                    options={{
                      responsive: true,
                      plugins: {
                        title: {
                          display: true,
                          text: 'Booking Rate Over Time'
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Tickets Booked per Day'
                          }
                        }
                      }
                    }}
                    data={{
                      labels: analyticsData.labels,
                      datasets: [{
                        label: 'Daily Bookings',
                        data: analyticsData.ticketsSold,
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        tension: 0.4
                      }]
                    }}
                  />
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Ticket Status Distribution
                </Typography>
                <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                  <Doughnut
                    options={bookingDistributionOptions}
                    data={{
                      labels: ['Sold', 'Available', 'Reserved'],
                      datasets: [{
                        data: [
                          analyticsData.summary.totalTicketsSold || 0,
                          (analyticsData.upcomingEvents || []).reduce((sum, event) => sum + (event.ticketsAvailable || 0), 0),
                          0 // Reserved tickets if you implement this feature
                        ],
                        backgroundColor: [
                          'rgba(75, 192, 192, 0.8)',
                          'rgba(255, 99, 132, 0.8)',
                          'rgba(255, 206, 86, 0.8)'
                        ]
                      }]
                    }}
                  />
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Booking Patterns
                </Typography>
                <Box sx={{ height: 400 }}>
                  <Bar
                    options={{
                      responsive: true,
                      plugins: {
                        title: {
                          display: true,
                          text: 'Ticket Sales Distribution'
                        },
                        legend: {
                          display: false
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Number of Tickets'
                          }
                        }
                      }
                    }}
                    data={{
                      labels: analyticsData.labels,
                      datasets: [{
                        label: 'Tickets Sold',
                        data: analyticsData.ticketsSold,
                        backgroundColor: analyticsData.ticketsSold.map(value => 
                          value > (Math.max(...analyticsData.ticketsSold) * 0.7) ? 'rgba(75, 192, 192, 0.8)' :
                          value > (Math.max(...analyticsData.ticketsSold) * 0.3) ? 'rgba(255, 206, 86, 0.8)' :
                          'rgba(255, 99, 132, 0.8)'
                        )
                      }]
                    }}
                  />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Color indicates booking performance:
                    <span style={{ color: 'rgb(75, 192, 192)', marginLeft: '8px' }}>High</span>
                    <span style={{ color: 'rgb(255, 206, 86)', marginLeft: '8px' }}>Medium</span>
                    <span style={{ color: 'rgb(255, 99, 132)', marginLeft: '8px' }}>Low</span>
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Upcoming Events */}
            {analyticsData.upcomingEvents && analyticsData.upcomingEvents.length > 0 && (
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Upcoming Events
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Event Title</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Available Tickets</TableCell>
                          <TableCell>Projected Revenue</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {analyticsData.upcomingEvents.map((event, index) => (
                          <TableRow key={index}>
                            <TableCell>{event.title}</TableCell>
                            <TableCell>
                              {new Date(event.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{event.ticketsAvailable}</TableCell>
                            <TableCell>
                              ${(event.ticketPrice * event.ticketsAvailable).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            )}
          </Grid>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedEvent?.title}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyEvents; 