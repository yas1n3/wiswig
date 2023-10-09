import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { filter, isNull } from 'lodash';
import { useSnackbar } from 'notistack';
import { sentenceCase } from 'change-case';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
// components
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'client_Mail', label: 'Email', alignRight: false },
  { id: 'clientGroup', label: 'Company', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_client) => _client.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ClientPage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [CLIENTLIST, setCLIENTLIST] = useState([]);

  const [currentClient, setCurrentClient] = useState(null);

  const [companyName, setCompanyName] = useState('');

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:4000/client/clients');
        setCLIENTLIST(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchClients();
  }, []);

  const handleClickMenuItem = (event, clientId) => {
    setOpen(event.currentTarget);
    const clientIndex = filteredClients.findIndex((client) => client._id === clientId);
    const client = filteredClients[clientIndex];
    setCurrentClient(client);
    console.log(client);
  };

  const handleCloseMenu = () => {
    setOpen(null);
    setCurrentClient(isNull);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = CLIENTLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleEdit = () => {
    if (currentClient) {
      navigate(`/dashboard/client/edit/${currentClient._id}`, {
        state: {
          isEdit: true,
          currentClient,
        },
      });
      handleCloseMenu();
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:4000/client/delete/${currentClient._id}`);
      const updatedList = CLIENTLIST.filter((client) => client._id !== currentClient._id);
      setCLIENTLIST(updatedList);
      enqueueSnackbar('Client deleted!', { variant: 'success', autoHideDuration: 3000 });

    } catch (error) {
      enqueueSnackbar('Failed to delete selected client. Please try again later.', { variant: 'error', autoHideDuration: 3000 });
      console.error(error);
    }
  };
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - CLIENTLIST.length) : 0;

  const filteredClients = applySortFilter(CLIENTLIST, getComparator(order, orderBy), filterName);
  const isNotFound = !filteredClients.length && !!filterName;
  const navigate = useNavigate();

  const [openPopup, setOpenPopup] = useState(false);

  const handleClosePopup = async () => {
    if (companyName.trim() === '') {
      setOpenPopup(false);
      // setCompanyName('');
      return;
    }

    try {
      await axios.post('http://localhost:4000/company/add', { name: companyName });
      enqueueSnackbar('Company added successfully!', { variant: 'success', autoHideDuration: 3000 });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Company not added!', { variant: 'error', autoHideDuration: 3000 });
    }

    setOpenPopup(false);
    setCompanyName('');
  };


  const handleCompany = () => {
    setOpenPopup(true);
  };
  const handleCompanyNameChange = (event) => {
    setCompanyName(event.target.value);
  };

  const handleButtonClick = () => {
    navigate('/dashboard/client/add');
  };
  return (
    <>
      <Helmet>
        <title> Clients | Wiswig </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Clients
          </Typography>
          <Stack alignItems="center" justifyContent="space-between" mb={5} spacing={2}>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleCompany}
              style={{ width: '160px' }}
            >
              New Company
            </Button>
            {openPopup && (
              <Dialog open={openPopup} onClose={handleClosePopup}>
                <DialogTitle>Add Company</DialogTitle>
                <DialogContent sx={{ width: 400, height: 100 }}>
                  <TextField
                    label="Company Name"
                    fullWidth
                    autoFocus
                    margin="dense"
                    value={companyName}
                    onChange={handleCompanyNameChange}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClosePopup}>Cancel</Button>
                  <Button variant="contained" onClick={handleClosePopup}>
                    Add
                  </Button>
                </DialogActions>
              </Dialog>
            )}
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleButtonClick}
              style={{ width: '160px' }}
            >
              New Client
            </Button>
          </Stack>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={CLIENTLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredClients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { _id, name, client_Mail, clientGroup } = row;
                    const selectedClient = selected.indexOf(name) !== -1;

                    return (
                      <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedClient}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedClient} onChange={(event) => handleClick(event, name)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={name} />
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{client_Mail}</TableCell>

                        <TableCell align="left">{clientGroup.name}</TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(e) => handleClickMenuItem(e, _id)}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for something else.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={CLIENTLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleEdit();
          }}
        >
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem
          sx={{ color: 'error.main' }}
          onClick={() => {
            handleDelete();
            handleCloseMenu();
          }}
        >
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
