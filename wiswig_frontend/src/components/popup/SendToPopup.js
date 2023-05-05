import { useState, useEffect } from 'react';

import useSWR from 'swr';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

export default function SendToPopup({ setShowSendToPopup }) {
    const [companies, setCompanies] = useState([]);
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
    
    const [selectedRows, setSelectedRows] = useState([]);



    const handleRowSelection = (selection) => {
        setSelectedRows(selection.selectionModel);
        console.log(selectedRows);
        console.log(selection)
    };

    const handleSendTo = async () => {
       // setShowSendToPopup(false);
        console.log(selectedRows);

        console.log('Sending newsletter to companies:', selectedRows);
        // Api goes here
    };
    const getRowId = (row) => row._id;

    return (
        <Dialog open onClose={() => setShowSendToPopup(false)}>
            <DialogTitle>Send newsletter to companies</DialogTitle>
            <DialogContent>
                <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={companies || []}
                        columns={[
                            
                            { field: 'name', headerName: 'Name', width: '100%' },
                        ]}
                        checkboxSelection
                        disableSelectionOnClick
                        onSelectionModelChange={handleRowSelection}
                        getRowId={getRowId}

                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSendTo} disabled={selectedRows.length === 0}>Send</Button>
                <Button onClick={() => setShowSendToPopup(false)}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}
