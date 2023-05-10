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
  const [newsletterTitle, setNewsletterTitle] = useState('');
  const location = useLocation();

  useEffect(() => {
    fetch(`http://localhost:4000/newsletter/newsletter/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setTemplateJson(data.newsletter.JSONcontent);
        setNewsletterTitle(data.newsletter.title);
      })
      .catch((error) => console.error(error));
  }, [id]);

  const save = () => {
    emailEditorRef.current?.saveDesign((design) => {
      emailEditorRef.current?.exportHtml((data) => {
        const { html } = data;

        const newsletter = {
          HTMLcontent: html,
          JSONcontent: JSON.stringify(design),
        };

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

  const onLoad = () => {
    if (templateJson) {
      emailEditorRef.current?.loadDesign(templateJson);
    }
  };
/*   const onReady = () => {}; */


  return (
    <>
      <Helmet>
        <title>Newsletter builder | Wiswig</title>
      </Helmet>
      <Container>
        <style>{`.blockbuilder-branding, .brand { display: none !important; }`}</style>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Newsletter builder
          </Typography>
          <Button onClick={save} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Save Design
          </Button>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h6" gutterBottom>
          {newsletterTitle}
        </Typography>
      </Stack>

        <Container style={{ transform: 'scale(0.925)', margin: '-5% 0 0 -10%' }}>
          <EmailEditor ref={emailEditorRef} onReady={onLoad}  />
        </Container>
      </Container>
    </>
  );
}
