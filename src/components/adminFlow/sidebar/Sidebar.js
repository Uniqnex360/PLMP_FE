  import React, { useState, useRef, useEffect } from 'react';
  import './Sidebar.css';
  import ApiResponseModal from '../../../ApiResponseModal';
  import Swal from 'sweetalert2';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faBox, faTags, faUser, faFileImport, faFileExport, faCog, faHistory, faStore, faColumns,faCreditCard   } from '@fortawesome/free-solid-svg-icons';
  import { Modal, Box, TextField, Button } from '@mui/material';
  import { useNavigate,useLocation } from 'react-router-dom';
  import axiosInstance from '../../../../src/utils/axiosConfig';
  import CircularProgress from '@mui/material/CircularProgress';
  import { LinearProgress } from '@mui/material';

  const Sidebar = ({  onCategoriesClick, onAllProductsClick, OnAllVariantsClick, OnAddProductClick, onDashboardClick, onHistoryClick,onBrandClick, OnExportClick, OnImportClick, OnPriceClick, OnHiddenClick,OnUserClick, OnRevokePriceClick }) => {
    const [showProductsSubmenu, setShowProductsSubmenu] = useState(false);
    const [showSettingsSubmenu, setShowSettingsSubmenu] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showResponseModal, setShowResponseModal] = useState(false);
    const [apiResponse, setApiResponse] = useState(null);
    const [selectedFilepath, setSelectedFilepath] = useState(null);
    const [selectedVendorId, setSelectedVendorId] = useState(null);
    const [activeSection, setActiveSection] = useState('dashboard');
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname;
    useEffect(() => {
      if (path === '/Admin/allproducts') {
        setActiveSection('products');
      }
    }, [path])
    const getQueryParams = () => {
        const params = new URLSearchParams(location.search);
        const categoryId = params.get('isFalse');
        return { categoryId };
    };
    useEffect(() => {
      const params = getQueryParams();
      if (params.categoryId === 'true') {
        setShowImportModal(true);
      }
    }, [path]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const UserRole = localStorage.getItem('user_role');
    const [vendors, setVendors] = useState([]);
  const [showAddVendorForm, setShowAddVendorForm] = useState(false);

  // Vendor form state
  const [vendorForm, setVendorForm] = useState({
    name: '',
    email: '',
    address: '',
    website: '',
    mobile_number: '',
    city: '',
    state: '',
    zip_code: '',
    logo: null,
  });
  const modalStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  }
    const showUploadErrorSwal = (message) => {
      Swal.fire({title: 'Upload Failed',text: message,icon: 'error',confirmButtonText: 'OK',customClass: { container: 'swal-custom-container', popup: 'swal-custom-popup', title: 'swal-custom-title', confirmButton: 'swal-custom-confirm', cancelButton: 'swal-custom-cancel'
        }
      });
    };
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        setSelectedFile(file);
      }
    };
    const handleImportClick = () => {
      setShowImportModal(true);
    };

    const closeImportModal = () => {
      setShowImportModal(false);
      setSelectedFile(null);
      setUploadProgress(0);
      navigate('/Admin'); 
      // window.location.reload();
    };
    const closeImportModal2 = () => {
      setShowAddVendorForm(false);
    };

    const handleUpload = async () => {
      if (!selectedFile) {
        Swal.fire({
          text: 'Please select a file to upload.',
          confirmButtonText: 'OK', customClass: { container: 'swal-custom-container', popup: 'swal-custom-popup', title: 'swal-custom-title', confirmButton: 'swal-custom-confirm-side', cancelButton: 'swal-custom-cancel',
          },
        });
        return;
      }
      if (!selectedVendorId) {
        Swal.fire({
          text: 'Please select a vendor.',
          confirmButtonText: 'OK', customClass: { container: 'swal-custom-container', popup: 'swal-custom-popup', title: 'swal-custom-title', confirmButton: 'swal-custom-confirm-side', cancelButton: 'swal-custom-cancel',
          },
        });
        return;
      }
      setLoading(true);
      setUploadProgress(0);
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('vendor_id', selectedVendorId);
      try {  
        const response = await axiosInstance.post(`${process.env.REACT_APP_IP}/upload_file/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          },
        });
        setSelectedFilepath(response.data.data.file_path);
        if (response.data && response.data.data.status === true) {
          setApiResponse(response.data.data);
          setShowResponseModal(true);
          setShowImportModal(false);
        } else {
          Swal.fire({ title: 'Success!', text: 'File uploaded successfully!', icon: 'success', confirmButtonText: 'OK', customClass: { container: 'swal-custom-container', popup: 'swal-custom-popup', title: 'swal-custom-title', confirmButton: 'swal-custom-confirm', cancelButton: 'swal-custom-cancel'
            }
          });
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        showUploadErrorSwal('An error occurred while uploading the file.');
      } finally {
        setLoading(false);
        setUploadProgress(0);
      }
    };
    const toggleProductsSubmenu = () => {
      setShowProductsSubmenu(!showProductsSubmenu);
    };
    const toggleSettingsSubmenu = () => {
      setShowSettingsSubmenu(!showSettingsSubmenu);
    };
    const handleSectionClick = (section) => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (section === 'dashboard' || section === 'all-products' || section === 'add-product') {
        navigate('/Admin');
      }
      if (section !== 'products' && section !== 'setting') {
        setShowProductsSubmenu(false);  // Close the product submenu
        localStorage.removeItem("categoryId");
        localStorage.removeItem("levelCategory");
      }
      if (section !== 'setting') {
        setShowSettingsSubmenu(false);  // Close the admin control submenu
      }
      if (section !== 'products') {
        setShowProductsSubmenu(false);  // Close the admin control submenu
      }
        if (section === 'all-products' || section === 'add-product') {  setActiveSection('products')  }
        if (section === 'all-products') { navigate('/Admin/allproducts'); }
        if (section === 'add-product') { navigate('/Admin/addproduct'); }
        if (section === 'hidden') {  navigate('/Admin/inactiveproducts');  }
        if (section === 'settings' || section === 'users') {  setActiveSection('setting')  }
        if (section === 'variants') {  navigate('/Admin/variantlist'); }
        if (section === 'categories') {  navigate('/Admin/categorylist'); }
        if (section === 'history') {  navigate('/Admin/history'); }
        setActiveSection(section);
      if (section === 'brand' && ((location.pathname.includes("product/")) || (location.pathname.includes("/Admin")) ) ) {
        navigate('/Admin/vendor'); 
      }
      else if (section === 'export' && ((location.pathname.includes("product/")) || (location.pathname.includes("/Admin")) ) ) {
        navigate('/Admin/export'); 
      }
      else if (section === 'import' && ((location.pathname.includes("product/")) || (location.pathname.includes("/Admin")) ) ) {
        navigate('/Admin/import'); 
      }
      else if (section === 'price' && ((location.pathname.includes("product/")) || (location.pathname.includes("/Admin")) ) ) {
        navigate('/Admin/price'); 
      }
      else if (section === 'users' && ((location.pathname.includes("product/")) || (location.pathname.includes("/Admin")) ) ) {
        navigate('/Admin/createuser'); 
      }
      else if (section === 'restore' && ((location.pathname.includes("product/")) || (location.pathname.includes("/Admin")) ) ) {
        navigate('/Admin/restoreprice'); 
      }
    };
    const fetchVendors = async () => {
    try {
      const res = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainBrand/`);
      setVendors(res.data?.data.brand_list || []);
    } catch (err) {
      console.error("Error fetching vendors", err);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

      const handleVendorSubmit = async () => {
    if (!vendorForm.name) {
      alert("Vendor name is required.");
      return;
    }

    const formData = new FormData();
    formData.append('name', vendorForm.name);
    formData.append('email', vendorForm.email);
    formData.append('address', vendorForm.address);
    formData.append('website', vendorForm.website);
    formData.append('mobile_number', vendorForm.mobile_number);
    formData.append('city', vendorForm.city);
    formData.append('state', vendorForm.state);
    formData.append('zip_code', vendorForm.zip_code);
    if (vendorForm.logo) formData.append('logo', vendorForm.logo);

    try {
      const response = await axiosInstance.post(`${process.env.REACT_APP_IP}/createBrand/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  if (response.data.data.is_created === true) {
            Swal.fire({  title: 'Success!',  text: 'Vendor added successfully!',  icon: 'success',  confirmButtonText: 'OK',
              customClass: {  container: 'swal-custom-container',  popup: 'swal-custom-popup',  title: 'swal-custom-title',  confirmButton: 'swal-custom-confirm',  cancelButton: 'swal-custom-cancel',
              },
            });
                  setShowAddVendorForm(false);
                  await fetchVendors(); // refresh vendor list
          } else if (response.data.data.is_created === false) {
            Swal.fire({  title: 'Error!',  text: response.data.data.error,  icon: 'error',  confirmButtonText: 'OK',  customClass: {  container: 'swal-custom-container',  popup: 'swal-custom-popup',  title: 'swal-custom-title',  confirmButton: 'swal-custom-confirm',  cancelButton: 'swal-custom-cancel',
              },
            });
          }
    } catch (error) {
      console.error('Error adding Vendor:', error);
      alert("Error occurred while adding vendor.");
    }
  };

    return (
      <div className="sidebar">
        <ul className="topMenu">
          <li onClick={() => { onDashboardClick(); handleSectionClick('dashboard'); }}
            className={activeSection === 'dashboard' ? 'active' : ''}><FontAwesomeIcon icon={faColumns} className="icon" /> Dashboard</li>
          <li onClick={() => { onBrandClick(); handleSectionClick('brand'); }}
            className={activeSection === 'brand' ? 'active' : ''}>
            <FontAwesomeIcon icon={faStore} className="icon" />
            Vendors
          </li>
          <li onClick={() => { onCategoriesClick(); handleSectionClick('categories'); }}
            className={activeSection === 'categories' ? 'active' : ''}>
            <FontAwesomeIcon icon={faTags} className="icon" />
            Categories
          </li>
          <li  onClick={() => { OnAllVariantsClick(); handleSectionClick('variants'); }}
            className={activeSection === 'variants' ? 'active' : ''}>
            <FontAwesomeIcon icon={faUser} className="icon" />
            Variants
          </li>
          <li onClick={() => {toggleProductsSubmenu(); handleSectionClick('products');}} className={`productsMenu ${activeSection === 'products' ? 'active' : ''}`}>
            <FontAwesomeIcon icon={faBox} className="icon" />
            Products
            {showProductsSubmenu && (
              <ul className="subMenu">
                <li onClick={() => { onAllProductsClick(); handleSectionClick('all-products'); }}
                  className={activeSection === 'all-products' ? 'active' : ''} >All Products</li>
                <li onClick={() => { OnAddProductClick(); handleSectionClick('add-product'); }}
                  className={activeSection === 'add-product' ? 'active' : ''}>Add New Product</li>
              </ul>
            )}
          </li>
          <li  onClick={() => { OnPriceClick(); handleSectionClick('price'); }}
            className={activeSection === 'price' ? 'active' : ''}>
            <FontAwesomeIcon icon={faCreditCard} className="icon" />
            Pricing
          </li>
          <li onClick={() => { OnImportClick();handleImportClick(); handleSectionClick('import'); }}
            className={activeSection === 'import' ? 'active' : ''}>
            <FontAwesomeIcon icon={faFileImport} className="icon" /> Import
          </li>
          {loading ? (
          <Modal open={showImportModal} onClose={closeImportModal}>
          <div className="import-modal">
                    <div style={{ marginTop: '10px' }}>
                        <LinearProgress variant="determinate" value={uploadProgress} />
                        <p style={{ textAlign: 'center', marginTop: '5px' }}>{uploadProgress}%</p>
                      </div>
                      </div>
                      </Modal>
        ) : (
          showResponseModal && (
            <ApiResponseModal
              showResponseModal={showResponseModal}
              setShowResponseModal={setShowResponseModal}
              apiResponse={apiResponse}
              selectedVendorId={selectedVendorId}
              selectedFilepath={selectedFilepath ? selectedFilepath : ""}
            />
          )
        )}
          <li onClick={() => { OnExportClick(); handleSectionClick('export'); }}
            className={activeSection === 'export' ? 'active' : ''}>
            <FontAwesomeIcon icon={faFileExport} className="icon" />
            Export
          </li>
          <li onClick={() => { onHistoryClick(); handleSectionClick('history'); }}
            className={activeSection === 'history' ? 'active' : ''}>  
            <FontAwesomeIcon icon={faHistory} className="icon" />
            Logs
          </li>
          <li onClick={() => {toggleSettingsSubmenu(); handleSectionClick('setting');}} className={`productsMenu ${activeSection === 'setting' ? 'active' : ''}`}>
          <FontAwesomeIcon icon={faCog} className="icon" />
          {UserRole === 'admin' ? 'Admin control' : 'User control'}
          {UserRole === 'admin' && showSettingsSubmenu && (
          <ul className="subMenu">
            <li onClick={() => { handleSectionClick('settings'); }}
                className={activeSection === 'settings' ? 'active' : ''}>
              Settings
            </li>
            <li onClick={() => { OnHiddenClick(); handleSectionClick('hidden'); }}
                className={activeSection === 'hidden' ? 'active' : ''}>
              Inactive Products
            </li>
            <li onClick={() => { OnRevokePriceClick(); handleSectionClick('restore'); }}
                className={activeSection === 'restore' ? 'active' : ''}>
              Restore Price
            </li>
            <li onClick={() => { OnUserClick(); handleSectionClick('users'); }}
                className={activeSection === 'users' ? 'active' : ''}>
              Users
            </li>
          </ul>
        )}
        {UserRole !== 'admin' && showSettingsSubmenu && (
          <ul className="subMenu">
            <li onClick={() => { handleSectionClick('settings'); }}
                className={activeSection === 'settings' ? 'active' : ''}>
              Settings
            </li>
          </ul>
        )}
          </li>
        </ul>
        <Modal open={showImportModal} onClose={closeImportModal}>
          <div className="import-modal">
            <h2>Import File</h2>
            <p>Upload a file to import data into the system.</p>
            <a href="/import_Sample.csv" download className="download-sample">
              Download Sample File
            </a>
            <input
              type="file"
              id="file-input"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <div className="file-upload-section">
              <Button
                variant="contained"
                color="primary"
                className='selectFile_btn'
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                Select File
              </Button>
              {selectedFile && <span className="file-name">{selectedFile.name}</span>}
            </div>
          {/* Vendor Section */}
      <div className="vendor-section" style={{ margin: '20px 0', width: '100%' }}>
          <>
            <h3 style={{ fontWeight: 600, marginBottom: '10px' }}>Select a Vendor <span className="required">*</span></h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <select
                className="vendor-select"
                value={selectedVendorId}
                onChange={(e) => setSelectedVendorId(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px',
                  fontSize: '16px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              >
                <option value="">Select Vendor</option>
                {vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </option>
                ))}
              </select>

              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setShowAddVendorForm(true)}
                style={{ whiteSpace: 'nowrap', color: '#fff', backgroundColor: '#007bff' }}
              >
                + Add Vendor
              </Button>
            </div>
          </>
      </div>
            <div className="actions">
            <Button
                variant="contained"
                color="success"
                onClick={handleUpload}
                startIcon={loading && <CircularProgress size={20} color="inherit" />}
              >
                {loading ? 'Uploading...' : 'Upload'}
              </Button>
              <Button variant="outlined" color="error" onClick={closeImportModal}>
                Cancel
              </Button>
            </div>
            {loading && (
              <div style={{ marginTop: '10px' }}>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <p style={{ textAlign: 'center', marginTop: '5px' }}>{uploadProgress}%</p>
              </div>
            )}
          </div>
        </Modal>
        <Modal open={showAddVendorForm} onClose={closeImportModal2} style={{margin:'0px 0px 10px 0px'}}>
        <Box sx={modalStyle}>
          <h3 style={{ fontWeight: 600, marginBottom: '10px' }}>Add New Vendor</h3>

          <TextField
            label="Vendor Name *"
            fullWidth
            value={vendorForm.name}
            onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })}
            style={{ margin: '0px 10px 5px 0px', fontSize: '15px' }}
          />

          <TextField
            label="Email"
            type="email"
            fullWidth
            value={vendorForm.email}
            onChange={(e) => setVendorForm({ ...vendorForm, email: e.target.value })}
            style={{ margin: '5px 0px 10px 0px', fontSize: '15px' }}
          />

        
    <textarea id="import_address" class="swal2-input vendor_input_import" autocomplete="off" placeholder="Vendor Address" onChange={(e) => setVendorForm({ ...vendorForm, address: e.target.value })}
  ></textarea>
  <Box display="flex" gap={2}>
      <TextField
        label="City"
        fullWidth
        value={vendorForm.city}
        onChange={(e) => setVendorForm({ ...vendorForm, city: e.target.value })}
        style={{ fontSize: '15px' }}
      />
      <TextField
        label="State"
        fullWidth
        value={vendorForm.state}
        onChange={(e) => setVendorForm({ ...vendorForm, state: e.target.value })}
        style={{ fontSize: '15px' }}
      />
    </Box>
  <Box display="flex" gap={2}>
    {/* ZIP Code below */}
    <TextField
            style={{ margin: '10px 0px 10px 0px', fontSize: '15px' }}
            label="Phone Number"
            fullWidth
            value={vendorForm.mobile_number}
            onChange={(e) => setVendorForm({ ...vendorForm, mobile_number: e.target.value })}
          />
    <TextField
      label="ZIP Code"
      fullWidth
      value={vendorForm.zip_code}
      onChange={(e) => setVendorForm({ ...vendorForm, zip_code: e.target.value })}
      style={{ marginTop: '10px', fontSize: '15px' }}
    />
  </Box>
          <TextField
            label="Website"
            type="url"
            fullWidth
            value={vendorForm.website}
            onChange={(e) => setVendorForm({ ...vendorForm, website: e.target.value })}   style={{ margin: '0px', fontSize: '15px' }}
          />
          <div className="logo-upload-section">
          <label htmlFor="logo-upload" className='logo-upload-label'>
            Vendor Logo :
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setVendorForm({ ...vendorForm, logo: e.target.files[0] })}
            style={{ marginTop: '15px', fontSize: '15px' }}
          />
  </div>
          <Box mt={0.5} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="contained" color="primary" style={{width:'50%'}} onClick={handleVendorSubmit}>
              Add Vendor
            </Button>
            <Button variant="outlined" color="secondary" onClick={closeImportModal2}>
              Back
            </Button>
          </Box>
        </Box>
      </Modal>
      </div>
    );
  };

  export default Sidebar;