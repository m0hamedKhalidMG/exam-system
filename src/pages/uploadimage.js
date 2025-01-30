import React, { useState } from 'react';
import { Button, Typography, TextField, MenuItem, Card, CardContent } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [type, setType] = useState('adminBg');
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);

    try {
      const response = await axios.post('http://localhost:5000/api/user/dashboard/images', formData, {
        headers: {  Authorization: `Bearer ${token}`,'Content-Type': 'multipart/form-data' },
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <Card style={{ maxWidth: 400, margin: '20px auto', padding: 20, textAlign: 'center' }}>
      <CardContent>
        <Typography variant="h5">Upload Background Image</Typography>
        <TextField
          select
          label="Select Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="adminBg">Admin Background</MenuItem>
          <MenuItem value="userBg">User Background</MenuItem>
        </TextField>
        <input
          accept="image/*"
          type="file"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="upload-file"
        />
        <label htmlFor="upload-file">
          <Button variant="contained" component="span" startIcon={<CloudUploadIcon />} fullWidth>
            Choose File
          </Button>
        </label>
        {file && <Typography variant="body2" style={{ marginTop: 10 }}>{file.name}</Typography>}
        <Button variant="contained" color="primary" onClick={handleUpload} fullWidth style={{ marginTop: 15 }}>
          Upload
        </Button>
        {message && <Typography color="error" style={{ marginTop: 10 }}>{message}</Typography>}
      </CardContent>
    </Card>
  );
};
export default ImageUpload;
