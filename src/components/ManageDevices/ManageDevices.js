import { AuthContext } from '../../contexts/auth';
import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import { useNavigate } from 'react-router-dom';
import Switch from '@mui/material/Switch';
import Loading from '../Loading/Loading';
import './manageDevices.css'
import { toast } from 'react-toastify';
import * as ResponseStatus from '../../entities/responseStatus';
import moment from 'moment';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal'

const modalTitle = 'Do you really want to remove these devices?';
const modalTextContent = 'By clicking confirm, the selected devices will be permanently removed from the system along with their field measured data.';

function createData(name, _id, latitude, longitude, isActive, created_at) {
  return {
    name,
    _id,
    latitude,
    longitude,
    isActive,
    created_at,
  };
}

const rows = [
  createData('Device Lg', '3AS45ESD', 40.877, 67.879, true, '16/05/2022'),
  createData('Device Kc', 'AAS48796', 70.877, -67.879, false, '16/05/2022'),
];

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
  
  // This method is created for cross-browser compatibility, if you don't
  // need to support IE11, you can use Array.prototype.sort() directly
  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }
  
  const headCells = [
    {
      id: 'name',
      numeric: false,
      disablePadding: true,
      label: 'Name',
    },
    {
      id: '_id',
      numeric: false,
      disablePadding: true,
      label: 'Id',
    },
    {
      id: 'latitude',
      numeric: false,
      disablePadding: true,
      label: 'Latitude',
    },
    {
      id: 'longitude',
      numeric: false,
      disablePadding: true,
      label: 'Longitude',
    },
    {
        id: 'isActive',
        numeric: false,
        disablePadding: true,
        label: 'Status',
    },
    {
      id: 'created_at',
      numeric: false,
      disablePadding: true,
      label: 'Registered in',
    }
  ];
  
  function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
      props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };
  
    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all desserts',
              }}
            />
          </TableCell>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              id={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
  
  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
  };
  
  const EnhancedTableToolbar = (props) => {
    const { numSelected, setIsDeleteModalOpen } = props;
    const navigate = useNavigate();

    const onAddDeviceClick = (event) => {
        event.preventDefault();
        navigate('/manage-devices/create-device');
    };
  
    const onDeleteDevicesClick = (event) => {
        event.preventDefault();
        setIsDeleteModalOpen(true);
    };
  
    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            List of devices
          </Typography>
        )}
  
        {numSelected > 0 ? (
          <Tooltip title="Delete selected devices">
            <IconButton onClick={onDeleteDevicesClick}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Add new device">
            <IconButton onClick={onAddDeviceClick}>
              <AddCircleOutlineIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    );
  };
  
  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
    setIsDeleteModalOpen: PropTypes.func.isRequired
  };

function ManageDevices() {

    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [deviceList, setDeviceList] = React.useState(rows);
    const { API, setSelectedPage, user } = React.useContext(AuthContext); 
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('name');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    React.useEffect(() => {
        setSelectedPage('Manage devices');
    }, []);

    const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
      if (event.target.checked) {
        const newSelecteds = deviceList.map((n) => n._id);
        setSelected(newSelecteds);
        return;
      }
      setSelected([]);
    };

    const handleClick = (event, id) => {
      const selectedIndex = selected.indexOf(id);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        );
      }

      setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    const handleOnDeviceStatusChange = (id) => {
        const newDeviceList = deviceList.map(device => {
            if (device._id === id) {
                device.isActive = !device.isActive;
            }
            return device;
        })
        setDeviceList(newDeviceList);
    };

    const handleModalCancelClick = () => {
        setIsDeleteModalOpen(false);
    }

    const handleModalConfirmClick = () => {
        toast.info('Deleting selected devices...');
        setIsDeleteModalOpen(false);
    }

    const isSelected = (id) => selected.indexOf(id) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - deviceList.length) : 0;

    if (loading) {
        return (
            <Loading/>
        );
    }

    return (
        <div className='table-box'>
            <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%', mb: 2 }}>
                  <EnhancedTableToolbar numSelected={selected.length} setIsDeleteModalOpen={setIsDeleteModalOpen} />
                  <TableContainer sx={{ maxHeight: 500, minHeight: 350 }}>
                    <Table
                      sx={{ minWidth: 750 }}
                      aria-labelledby="tableTitle"
                      size={'medium'}
                    >
                      <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={deviceList.length}
                      />
                      <TableBody>
                        {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                           rows.slice().sort(getComparator(order, orderBy)) */}
                        {stableSort(deviceList, getComparator(order, orderBy))
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row, index) => {
                            const isItemSelected = isSelected(row._id);
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                              <TableRow
                                hover
                                role="checkbox"
                                aria-checked={isItemSelected}
                                tabIndex={-1}
                                key={row._id}
                                selected={isItemSelected}
                                sx={{height: 60}}
                              >
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    color="primary"
                                    checked={isItemSelected}
                                    onClick={(event) => handleClick(event, row._id)}
                                    inputProps={{
                                      'aria-labelledby': labelId,
                                    }}
                                  />
                                </TableCell>
                                <TableCell
                                  component="th"
                                  id={labelId}
                                  scope="row"
                                  padding="none"
                                >
                                  {row.name}
                                </TableCell>
                                <TableCell padding="none">{row._id}</TableCell>
                                <TableCell padding="none">{row.latitude}</TableCell>
                                <TableCell padding="none">{row.longitude}</TableCell>
                                <TableCell padding="none">
                                    <Switch checked={row.isActive} onClick={() => handleOnDeviceStatusChange(row._id)} inputProps={{ 'aria-label': 'controlled' }}/>
                                </TableCell>
                                <TableCell padding="none">{row.created_at}</TableCell>
                              </TableRow>
                            );
                          })}
                        {emptyRows > 0 && (
                          <TableRow
                            style={{
                              height: 53 * emptyRows,
                            }}
                          >
                            <TableCell colSpan={7} />
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={deviceList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Paper>
            </Box>
            <ConfirmationModal
                modalTitle={modalTitle}
                modalTextContent={modalTextContent}
                isOpen={isDeleteModalOpen}
                handleConfirmClick={handleModalConfirmClick}
                handleCancelClick={handleModalCancelClick}
            />
        </div>
    );

}

export default ManageDevices;