import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import EmailEditor from 'react-email-editor';
import { Helmet } from 'react-helmet-async';
import { Container, Stack, Typography, Button } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Iconify from '../components/iconify';

export default function DashboardAppPage() {
  const emailEditorRef = useRef(null);

  const { id } = useParams();
  const [templateJson, setTemplateJson] = useState(null);
  const [newsletterTitle, setNewsletterTitle] = useState("");
  const location = useLocation();



  useEffect(() => {
    if (location.state && location.state.newsletter) {
      setTemplateJson(location.state.newsletter.JSONcontent);
      setNewsletterTitle(location.state.newsletter.title);
    }
  }, [location.state]);

  const save = () => {
    emailEditorRef.current?.saveDesign((design) => {
      emailEditorRef.current?.exportHtml((data) => {
        const { html } = data;

        const newsletter = {
          HTMLcontent: html,
          JSONcontent: JSON.stringify(design),
        };
// add a verification if necessary
/*         if (user) {
          newsletter.creator = user._id;
        } */

        axios
          .put(`http://localhost:4000/newsletter/editnewsletter/${id}`, newsletter)
          .then((response) => {
            console.log('Newsletter saved:', response.data);
            alert('Newsletter saved successfully!');
          })
          .catch((error) => {
            console.error('Failed to save newsletter:', error);
            alert('Failed to save newsletter. Please try again later.', error);
          });
      });
    });
  };

  const onReady = () => {
    if (templateJson) {
      emailEditorRef.current?.loadDesign(templateJson);
    }
  };

  return (
    <>
      <Helmet>
        <title>Newsletter builder | Wiswig</title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Newsletter builder {newsletterTitle}
          </Typography>

          <Button onClick={save} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Save Design
          </Button>
        </Stack>
        <Container style={{ transform: 'scale(0.925)', margin: '-5% 0 0 -10%' }}>
          <EmailEditor ref={emailEditorRef} onReady={onReady} />
        </Container>
      </Container>
    </>
  );
}
