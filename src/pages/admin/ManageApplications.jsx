import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllApplications, updateApplicationStatus } from '../../redux/slices/applicationSlice';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Button, 
    Chip,
    Box,
    CircularProgress,
    Typography,
    Pagination
} from '@mui/material';
import { toast } from 'react-toastify';

const ManageApplications = () => {
  const dispatch = useDispatch();
  const { applications = [], isLoading, error, pagination = {} } = useSelector((state) => state.applications || {});
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getAllApplications({ page, limit: 10 }));
  }, [dispatch, page]);

  const handleStatusUpdate = async (id, status) => {
      try {
          await dispatch(updateApplicationStatus({ id, status })).unwrap();
          toast.success(`Application ${status} successfully`);
      } catch (err) {
          toast.error(err || 'Failed to update status');
      }
  };

  if (isLoading) return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
            <Table sx={{ minWidth: 650 }} aria-label="admin applications table">
                <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Applicant</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Pet</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Message</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {applications.map((app) => (
                    <TableRow key={app._id}>
                    <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                            {app.user ? app.user.name : 'Unknown'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {app.user ? app.user.email : ''}
                        </Typography>
                    </TableCell>
                    <TableCell>{app.pet ? app.pet.name : 'Unknown Pet'}</TableCell>
                    <TableCell 
                        sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} 
                        title={app.message}
                    >
                        {app.message}
                    </TableCell>
                    <TableCell>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                        <Chip 
                            label={app.status} 
                            color={app.status === 'Approved' ? 'success' : app.status === 'Rejected' ? 'error' : 'warning'} 
                            size="small"
                        />
                    </TableCell>
                    <TableCell>
                        {app.status === 'Pending' && (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button 
                                    variant="contained" 
                                    color="success" 
                                    size="small"
                                    onClick={() => handleStatusUpdate(app._id, 'Approved')}
                                >
                                    Approve
                                </Button>
                                <Button 
                                    variant="contained" 
                                    color="error" 
                                    size="small"
                                    onClick={() => handleStatusUpdate(app._id, 'Rejected')}
                                >
                                    Reject
                                </Button>
                            </Box>
                        )}
                        {app.status === 'Approved' && (
                            <Button 
                                variant="outlined" 
                                color="error" 
                                size="small"
                                onClick={() => handleStatusUpdate(app._id, 'Rejected')}
                            >
                                Revoke Approval
                            </Button>
                        )}
                    </TableCell>
                    </TableRow>
                ))}
                {applications.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={6} align="center">No applications found.</TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
        </TableContainer>
        {/* Pagination */ }
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
                count={pagination?.pages || 1}
                page={page}
                onChange={(e, v) => setPage(v)}
                color="primary"
            />
        </Box>
    </Box>
  );
};

export default ManageApplications;
