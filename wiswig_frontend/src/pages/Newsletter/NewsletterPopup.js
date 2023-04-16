import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

export default function NewsletterPopup(props) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const handleTitleChange = (event) => {
        setTitle(event.target.value);
        if (event.key === 'Enter') {
            document.getElementById('description').focus();
        }
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleSave = () => {
        if (!title || !description) {
            alert('Please enter a title and description for the newsletter.');
            return;
        }

        if (props.onSave) {
            props.onSave(title, description);
        }
        setTitle('');
        setDescription('');
    };

    useEffect(() => {
        if (props.newsletter) {
            setTitle(props.newsletter.title);
            setDescription(props.newsletter.description);
        }
    }, [props.newsletter]);

    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>Add Newsletter Information</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="title"
                    label="Title"
                    type="text"
                    fullWidth
                    value={title}
                    onChange={handleTitleChange}
                    onKeyPress={handleTitleChange}
                />
                <TextField
                    multiline
                    rows={4}
                    margin="dense"
                    id="description"
                    label="Description"
                    type="text"
                    fullWidth
                    value={description}
                    onChange={handleDescriptionChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}