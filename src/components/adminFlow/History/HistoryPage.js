import React, { useState } from 'react';
import axiosInstance from '../../../utils/axiosConfig';
import Swal from 'sweetalert2';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './HistoryPages.css';

const HistoryPage = () => {
  const [apiResponse, setApiResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeButton, setActiveButton] = useState('');

  const handleApiCall = async (apiUrl, buttonKey) => {
    setLoading(true);
    setActiveButton(buttonKey);
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/${apiUrl}`);
      setApiResponse(response.data.data.result);
    } catch (error) {
      console.error(`Error fetching data from ${apiUrl}:`, error);
      Swal.fire({
        title: 'Error',
        text: 'An error occurred while fetching data.',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          container: 'swal-custom-container',
          popup: 'swal-custom-popup',
          title: 'swal-custom-title',
          confirmButton: 'swal-custom-confirm',
          cancelButton: 'swal-custom-cancel',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const renderHeaders = () => {
    if (activeButton === 'priceLog') {
      return (
        <>
          <TableCell style={{padding:'8px'}}><strong>SKU Number</strong></TableCell>
          <TableCell style={{padding:'8px'}}><strong>User Name</strong></TableCell>
          <TableCell style={{padding:'8px'}}><strong>New Retail Price</strong></TableCell>
          <TableCell style={{padding:'8px'}}><strong>Old Retail Price</strong></TableCell>
          <TableCell style={{padding:'8px'}}><strong>Log Date</strong></TableCell>
        </>
      );
    }
    if (activeButton === 'productLog') {
      return (
        <>
          <TableCell className='productth1' style={{padding:'8px'}}><strong>User Name</strong></TableCell>
          <TableCell className='productth2' style={{padding:'8px'}}><strong>Product Name</strong></TableCell>
          <TableCell className='productth3' style={{padding:'8px'}}><strong>Action</strong></TableCell>
          <TableCell className='productth4' style={{padding:'8px'}}><strong>Updated Action</strong></TableCell>
          <TableCell className='productth5' style={{padding:'8px'}}><strong>Log Date</strong></TableCell>
        </>
      );
    }
    if (activeButton === 'productVariantLog') {
      return (
        <>
          <TableCell style={{padding:'8px', width:'10%'}}><strong>User Name</strong></TableCell>
          <TableCell style={{padding:'8px', width:'15%'}}><strong>SKU Number</strong></TableCell>
          <TableCell className='productth3' style={{padding:'8px', width:'20%'}}><strong>Product Name</strong></TableCell>
          <TableCell style={{padding:'8px', width:'10%'}}><strong>Action</strong></TableCell>
          <TableCell className='productth4' style={{padding:'8px', width:'20%'}}><strong>Updated Action</strong></TableCell>
          <TableCell style={{padding:'8px',width:'15%'}}><strong>Log Date</strong></TableCell>
        </>
      );
    }
    if (activeButton === 'categoryVariantLog') {
      return (
        <>
          <TableCell style={{padding:'8px'}}><strong>User Name</strong></TableCell>
          <TableCell style={{padding:'8px'}}><strong>Variant option name</strong></TableCell>
          <TableCell style={{padding:'8px'}}><strong>Action</strong></TableCell>
          <TableCell style={{padding:'8px'}}><strong>Level</strong></TableCell>
          <TableCell style={{padding:'8px'}}><strong>Category Name</strong></TableCell>
          <TableCell style={{padding:'8px'}}><strong>Category Level</strong></TableCell>
          <TableCell style={{padding:'8px'}}><strong>Log Date</strong></TableCell>
        </>
      );
    }
    if (activeButton === 'categoryLog') {
      return (
        <>
          <TableCell style={{padding:'8px'}}><strong>User Name</strong></TableCell>
          <TableCell style={{padding:'8px'}}><strong>Category Name</strong></TableCell>
          <TableCell style={{padding:'8px'}}><strong>Action</strong></TableCell>
          <TableCell style={{padding:'8px'}}><strong>Level</strong></TableCell>
          <TableCell style={{padding:'8px'}}><strong>Category Level</strong></TableCell>
          <TableCell style={{padding:'8px'}}><strong>Log Date</strong></TableCell>
        </>
      );
    }
    return (
      <>
        <TableCell style={{padding:'8px'}}><strong>User Name</strong></TableCell>
        <TableCell style={{padding:'8px'}}><strong>Category ID</strong></TableCell>
        <TableCell style={{padding:'8px'}}><strong>Action</strong></TableCell>
        <TableCell style={{padding:'8px'}}><strong>Level</strong></TableCell>
        <TableCell style={{padding:'8px'}}><strong>Category Name</strong></TableCell>
        <TableCell style={{padding:'8px'}}><strong>Log Date</strong></TableCell>
      </>
    );
  };

  const renderRows = () => {
    return apiResponse.map((log, index) => (
      <TableRow key={index}>
        {activeButton === 'priceLog' ? (
          <>
            <TableCell style={{padding:'8px'}}>{log.sku_number}</TableCell>
            <TableCell style={{padding:'8px'}}>{log.user_id}</TableCell>
            <TableCell style={{padding:'8px'}}>{log.new_retail_price}</TableCell>
            <TableCell style={{padding:'8px'}}>{log.old_retail_price}</TableCell>
            <TableCell style={{padding:'8px'}}>{log.log_date}</TableCell>
          </>
        ) : activeButton === 'productLog' ? (
          <>
            <TableCell style={{padding:'8px'}}>{log.user_name}</TableCell>
            <TableCell style={{padding:'8px'}}>{log.product_name}</TableCell>
            <TableCell style={{padding:'8px'}}>{log.action}</TableCell>
       <TableCell style={{padding:'8px', width:'20%'}}>
  {log.data && typeof log.data === 'object' ? (
    Object.entries(log.data).map(([key, value]) => {
      const [oldVal, newVal] = value.split('->').map(v => v.trim());
      return (
        <div key={key}>
          <strong>{key}:</strong>{' '}
          <span>
            {oldVal} <strong style={{ verticalAlign: 'top' }}>→</strong> {newVal}
          </span>
        </div>
      );
    })
  ) : (
    <span></span>
  )}
</TableCell>
            <TableCell style={{padding:'8px'}}>{log.log_date}</TableCell>
          </>
        ) : activeButton === 'productVariantLog' ? (
          <>
            <TableCell style={{padding:'8px'}}>{log.user_name}</TableCell>
            <TableCell style={{padding:'8px'}}>{log.sku_number}</TableCell>
            <TableCell style={{padding:'8px'}}>{log.product_name}</TableCell>
            <TableCell style={{padding:'8px'}}>{log.action}</TableCell>
            <TableCell style={{padding:'8px', width:'20%'}}>
  {log.data && typeof log.data === 'object' ? (
    Object.entries(log.data).map(([key, value]) => {
      const [oldVal, newVal] = value.split('->').map(v => v.trim());
      return (
        <div key={key}>
          <strong>{key}:</strong>{' '}
          <span>
            {oldVal} <strong style={{ verticalAlign: 'top' }}>→</strong> {newVal}
          </span>
        </div>
      );
    })
  ) : (
    <span></span>
  )}
</TableCell>
            <TableCell style={{padding:'8px',width:'20%'}}>{log.log_date}</TableCell>
          </>
        ) : activeButton === 'categoryLog' ? (
          <>
            <TableCell>{log.user_name}</TableCell>
            <TableCell>{log.category_last_name}</TableCell>
            <TableCell>{log.action}</TableCell>
            <TableCell>{log.level}</TableCell>
            <TableCell>{log.category_name}</TableCell>
            <TableCell>{log.log_date}</TableCell>
          </>
         ) : activeButton === 'categoryVariantLog' ? (
          <>
            <TableCell>{log.user_name}</TableCell>
            <TableCell>{log.varient_option_name}</TableCell>
            <TableCell>{log.action}</TableCell>
            <TableCell>{log.level}</TableCell>
            <TableCell>{log.category_last_name}</TableCell>
            <TableCell>{log.category_name}</TableCell>
            <TableCell>{log.log_date}</TableCell>
          </>
        ) : (
          <>
            <TableCell>{log.user_name}</TableCell>
            <TableCell>{log.varient_option_name}</TableCell>
            <TableCell>{log.action}</TableCell>
            <TableCell>{log.level}</TableCell>
            <TableCell>{log.category_name}</TableCell>
            <TableCell>{log.log_date}</TableCell>
          </>
        )}
      </TableRow>
    ));
  };

  return (
    <div className="history-page" style={{ paddingTop: '90px', minWidth: '1200px', margin: 'auto' }}>
      <h2 className='responsive-header'
        style={{
          textAlign: 'center',
          marginBottom: '20px',
          position: 'fixed',
          top: '33px',
          background: '#fff',
          zIndex: 10,
          padding: '10px 0',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        History
      </h2>

      <div
        className="buttons-container responsive-buttons"
        style={{
          display: 'flex',
          gap: '31px',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          position: 'fixed',
          top: '100px',
          background: '#fff',
          zIndex: 10,
          padding: '10px 0',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Button
          variant="contained"
          style={{ width: '14%' }}
          color={activeButton === 'categoryLog' ? 'secondary' : 'primary'}
          onClick={() => handleApiCall('obtainCategoryLog/', 'categoryLog')}
          disabled={loading}
        >
          Category Log
        </Button>
        <Button
          variant="contained"
          style={{ width: '22%' }}
          color={activeButton === 'categoryVariantLog' ? 'secondary' : 'primary'}
          onClick={() => handleApiCall('obtainCategoryVarientLog/', 'categoryVariantLog')}
          disabled={loading}
        >
          Category Variant Log
        </Button>
        <Button
          variant="contained"
          style={{ width: '16%' }}
          color={activeButton === 'productLog' ? 'secondary' : 'primary'}
          onClick={() => handleApiCall('obtainProductLog/', 'productLog')}
          disabled={loading}
        >
          Product Log
        </Button>
        <Button
          variant="contained"
          style={{ width: '21%' }}
          color={activeButton === 'productVariantLog' ? 'secondary' : 'primary'}
          onClick={() => handleApiCall('obtainProductVarientLog/', 'productVariantLog')}
          disabled={loading}
        >
          Product Variant Log
        </Button>
        <Button
          variant="contained"
          style={{ width: '13%' }}
          color={activeButton === 'priceLog' ? 'secondary' : 'primary'}
          onClick={() => handleApiCall('obtainPriceLog/', 'priceLog')}
          disabled={loading}
        >
          Retail Log
        </Button>
      </div>

      {loading && <p style={{ textAlign: 'center',margin:'10px 0px 0px 0px' }}>Loading...</p>}
      {apiResponse.length > 0 && (
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>{renderHeaders()}</TableRow>
            </TableHead>
            <TableBody>{renderRows()}</TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default HistoryPage;