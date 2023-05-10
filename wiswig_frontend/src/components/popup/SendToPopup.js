import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

export default function SendToPopup({ onClose, newsletter }) {
  const [companies, setCompanies] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('http://localhost:4000/company/companies');
        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.log('Error fetching companies:', error);
      }
    };
    fetchCompanies();
  }, []);

  const handleRowSelection = (event, id) => {
    const selectedIndex = selectedRows.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selectedRows.slice(0, selectedIndex), selectedRows.slice(selectedIndex + 1));
    }

    setSelectedRows(newSelected);
  };

  const handleSendTo = async () => {
    console.log('Sending newsletter to companies:', selectedRows);
    // Api goes here
  };

  return (
    <Dialog open >
      <DialogTitle>Send newsletter</DialogTitle>
      <DialogContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedRows.length > 0 && selectedRows.length < companies.length}
                    checked={selectedRows.length === companies.length}
                    onChange={(event) => {
                      if (event.target.checked) {
                        setSelectedRows(companies.map((company) => company._id));
                      } else {
                        setSelectedRows([]);
                      }
                    }}
                  />
                </TableCell>
                <TableCell>Company</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companies.map((company) => {
                const isRowSelected = selectedRows.indexOf(company._id) !== -1;

                return (
                  <TableRow
                    key={company._id}
                    onClick={(event) => handleRowSelection(event, company._id)}
                    selected={isRowSelected}
                    hover
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isRowSelected} />
                    </TableCell>
                    <TableCell>{company.name}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSendTo} disabled={selectedRows.length === 0}>
          Send
        </Button>
              <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
