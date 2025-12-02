import React, { useState, useEffect, useRef } from 'react';
import './ExportPage.css';
import axiosInstance from '../../../utils/axiosConfig';
import Swal from 'sweetalert2';
import ChevronDownIcon from '@mui/icons-material/ExpandMore';

const ExportPage = (props) => {
// Support both direct categories or nested shape
const categories = props?.categories || {};
const categoryList = categories?.categories?.category_list || categories?.category_list || [];

// Only render after categories are fully loaded
const isReady = !!categoryList.length;

const [clearBtn, setShowclearBtn] = useState(false);
const [selectedCategoryId, setSelectedCategoryId] = useState('');
const [selectedLevel2Id, setselectedLevel2Id] = useState('');
const [selectedLevel3Id, setSelectedLevel3Id] = useState('');
const [selectedlevel4, setSelectedlevel4] = useState('');
const [selectedlevel5, setSelectedlevel5] = useState('');
const [selectedlevel6, setSelectedlevel6] = useState('');
const [isExportAllVisible, setIsExportAllVisible] = useState(true);

const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
const [isLevel2DropdownOpen, setIsLevel2DropdownOpen] = useState(false);
const [isLevel3DropdownOpen, setIsLevel3DropdownOpen] = useState(false);
const [islevel4DropdownOpen, setIslevel4DropdownOpen] = useState(false);
const [islevel5DropdownOpen, setIslevel5DropdownOpen] = useState(false);
const [islevel6DropdownOpen, setIslevel6DropdownOpen] = useState(false);

const [searchQueries, setSearchQueries] = useState({
level1: '',
level2: '',
level3: '',
level4: '',
level5: '',
level6: '',
});

const [selectedCategoryForVariant, setSelectedCategoryForVariant] = useState('');

const categoryDropdownRef = useRef(null);
const categoryDropdown2Ref = useRef(null);
const categoryDropdown3Ref = useRef(null);
const categoryDropdown4Ref = useRef(null);
const categoryDropdown5Ref = useRef(null);
const categoryDropdown6Ref = useRef(null);

const handleClickOutside = (event) => {
if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
setIsCategoryDropdownOpen(false);
}
if (categoryDropdown2Ref.current && !categoryDropdown2Ref.current.contains(event.target)) {
setIsLevel2DropdownOpen(false);
}
if (categoryDropdown3Ref.current && !categoryDropdown3Ref.current.contains(event.target)) {
setIsLevel3DropdownOpen(false);
}
if (categoryDropdown4Ref.current && !categoryDropdown4Ref.current.contains(event.target)) {
setIslevel4DropdownOpen(false);
}
if (categoryDropdown5Ref.current && !categoryDropdown5Ref.current.contains(event.target)) {
setIslevel5DropdownOpen(false);
}
if (categoryDropdown6Ref.current && !categoryDropdown6Ref.current.contains(event.target)) {
setIslevel6DropdownOpen(false);
}
};

useEffect(() => {
document.addEventListener('mousedown', handleClickOutside);
return () => {
document.removeEventListener('mousedown', handleClickOutside);
};
}, []);

// Guard everything with isReady so the component won't render until categories exist
const filteredCategories = isReady
? categoryList.filter(category => category.name.toLowerCase().includes(searchQueries.level1.toLowerCase()))
: [];

const levelOneCategory = isReady
? categoryList.find(level1 => level1._id === selectedCategoryId)
: null;

// For safety, avoid crashes if undefined
const safeSearchQuery = typeof searchQueries === 'string' ? searchQueries.toLowerCase() : '';

const flatLevel2 = isReady
? categoryList.flatMap(level1 => level1.level_one_category_list || [])
: [];

const filteredCategoriesLevel2 = levelOneCategory
? (levelOneCategory.level_one_category_list || []).filter(level2 =>
level2.name.toLowerCase().includes(safeSearchQuery)
)
: flatLevel2.filter(level2 => level2.name.toLowerCase().includes(safeSearchQuery));

const levelTwoCategory = levelOneCategory
? (levelOneCategory.level_one_category_list || []).find(level2 => level2._id === selectedLevel2Id)
: null;

const flatLevel3 = isReady
? categoryList.flatMap(level1 => (level1.level_one_category_list || []))
.flatMap(level2 => (level2.level_two_category_list || []))
: [];

const filteredCategoriesLevel3 = levelTwoCategory
? (levelTwoCategory.level_two_category_list || []).filter(level3 =>
level3.name.toLowerCase().includes(safeSearchQuery)
)
: flatLevel3.filter(level3 => level3.name.toLowerCase().includes(safeSearchQuery));

const levelThreeCategory = levelTwoCategory
? (levelTwoCategory.level_two_category_list || []).find(level3 => level3._id === selectedLevel3Id)
: null;

const flatLevel4 = isReady
? categoryList.flatMap(level1 => (level1.level_one_category_list || []))
.flatMap(level2 => (level2.level_two_category_list || []))
.flatMap(level3 => (level3.level_three_category_list || []))
: [];

const filteredCategoriesLevel4 = levelThreeCategory
? (levelThreeCategory.level_three_category_list || []).filter(level4 =>
level4.name.toLowerCase().includes(safeSearchQuery)
)
: flatLevel4.filter(level4 => level4.name.toLowerCase().includes(safeSearchQuery));

const levelFourCategory = levelThreeCategory
? (levelThreeCategory.level_three_category_list || []).find(level4 => level4._id === selectedlevel4)
: null;

const flatLevel5 = isReady
? categoryList.flatMap(level1 => (level1.level_one_category_list || []))
.flatMap(level2 => (level2.level_two_category_list || []))
.flatMap(level3 => (level3.level_three_category_list || []))
.flatMap(level4 => (level4.level_four_category_list || []))
: [];

const filteredCategoriesLevel5 = levelFourCategory
? (levelFourCategory.level_four_category_list || []).filter(level5 =>
level5.name.toLowerCase().includes(safeSearchQuery)
)
: flatLevel5.filter(level5 => level5.name.toLowerCase().includes(safeSearchQuery));

const levelFiveCategory = levelFourCategory
? (levelFourCategory.level_four_category_list || []).find(level5 => level5._id === selectedlevel5)
: null;

const flatLevel6 = isReady
? categoryList.flatMap(level1 => (level1.level_one_category_list || []))
.flatMap(level2 => (level2.level_two_category_list || []))
.flatMap(level3 => (level3.level_three_category_list || []))
.flatMap(level4 => (level4.level_four_category_list || []))
.flatMap(level5 => (level5.level_five_category_list || []))
: [];

const filteredCategoriesLevel6 = levelFiveCategory
? (levelFiveCategory.level_five_category_list || []).filter(level6 =>
level6.name.toLowerCase().includes(safeSearchQuery)
)
: flatLevel6.filter(level6 => level6.name.toLowerCase().includes(safeSearchQuery));

const handleSearchChange = (level, value) => {
setSearchQueries(prev => ({ ...prev, [level]: value }));
};

const handleLevelClear = (e) => {
setSelectedCategoryId(e);
setselectedLevel2Id(e);
setSelectedLevel3Id(e);
setSelectedlevel4(e);
setSelectedlevel5(e);
setSelectedlevel6(e);
setShowclearBtn(false);
setIsExportAllVisible(true);
setIsCategoryDropdownOpen(false);
setIsLevel2DropdownOpen(false);
setIsLevel3DropdownOpen(false);
setIslevel4DropdownOpen(false);
setIslevel5DropdownOpen(false);
setIslevel6DropdownOpen(false);
};

const handleCategorySelect = async (id) => {
setSelectedCategoryId(id);
try {
const res = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainVarientForCategory/?id=${id}`);
console.log('API Response: here', res.data.data);
} catch (err) {
console.log('ERROR', err);
}
setselectedLevel2Id('');
setSelectedLevel3Id('');
setSelectedlevel4('');
setSelectedlevel5('');
setSelectedlevel6('');
setIsCategoryDropdownOpen(false);
};

const handleCategorySelectForVariants = async (id, category_level) => {
console.log(id, 'ID');
if (id && category_level) {
setShowclearBtn(true);
setIsExportAllVisible(false);
setSelectedCategoryForVariant(id);
}
try {
const res = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainVarientForCategory/?id=${id}`);
// Optionally use res.data
} catch (err) {
console.log('ERROR', err);
}
};

useEffect(() => {
// Only run once categories are ready
if (isReady) {
handleCategorySelectForVariants();
}
}, [isReady]);

const handleLevel2Select = (id) => {
const selectedValue = id || '';
if (selectedValue !== '') {
let level1Category;
categoryList.some(level1 => {
const foundLevel2 = (level1.level_one_category_list || []).some(level2 => level2._id === selectedValue);


    if (foundLevel2) {
      level1Category = level1;
      return true;
    }
    return false;
  });

  if (!level1Category) {
    console.error('Level 1 category not found for Level 2 category with ID:', selectedValue);
    return;
  }

  setSelectedCategoryId(level1Category._id);
  setselectedLevel2Id(selectedValue);
  setSelectedLevel3Id('');
  setSelectedlevel4('');
  setSelectedlevel5('');
  setSelectedlevel6('');
  setIsLevel2DropdownOpen(false);
} else {
  setselectedLevel2Id('');
}
};

const handleLevel3Select = (id) => {
const selectedValue = id || '';
if (selectedValue !== '') {
let level1Category, level2Category;
categoryList.some(level1 => {
const foundLevel2 = (level1.level_one_category_list || []).find(level2 =>
(level2.level_two_category_list || []).some(level3 => level3._id === selectedValue)
);
if (foundLevel2) {
level1Category = level1;
level2Category = foundLevel2;
return true;
}
return false;
});
if (!level2Category || !level1Category) {
console.error('Parent categories not found for selected Level 3 category with ID:', selectedValue);
return;
}
setSelectedCategoryId(level1Category._id);
setselectedLevel2Id(level2Category._id);
setSelectedLevel3Id(selectedValue);
setSelectedlevel4('');
setSelectedlevel5('');
setSelectedlevel6('');
setIsLevel3DropdownOpen(false);
} else {
setSelectedLevel3Id('');
}
};

const handleLevelSelect = (level, id) => {
const selectedValue = id || '';
if (selectedValue !== '') {
switch (level) {
case 4: {
let level1Category, level2Category, level3Category;
categoryList.some(level1 => {
const foundLevel2 = (level1.level_one_category_list || []).find(level2 =>
(level2.level_two_category_list || []).some(level3 =>
(level3.level_three_category_list || []).some(level4 => level4._id === selectedValue)
)
);
if (foundLevel2) {
const foundLevel3 = (foundLevel2.level_two_category_list || []).find(level3 =>
(level3.level_three_category_list || []).some(level4 => level4._id === selectedValue)
);


          if (foundLevel3) {
            level1Category = level1;
            level2Category = foundLevel2;
            level3Category = foundLevel3;
            return true;
          }
        }
        return false;
      });

      if (!level1Category || !level2Category || !level3Category) {
        console.error('Parent categories not found for selected Level 4 category with ID:', selectedValue);
        return;
      }
      setSelectedCategoryId(level1Category._id);
      setselectedLevel2Id(level2Category._id);
      setSelectedLevel3Id(level3Category._id);
      setSelectedlevel4(selectedValue);
      setSelectedlevel5('');
      setSelectedlevel6('');
      break;
    }
    case 5: {
      let level4Category, level3CategoryForLevel5, level2CategoryForLevel5, level1CategoryForLevel5;
      categoryList.some(level1 => {
        return (level1.level_one_category_list || []).some(level2 => {
          return (level2.level_two_category_list || []).some(level3 => {
            return (level3.level_three_category_list || []).some(level4 => {
              if ((level4.level_four_category_list || []).some(level5 => level5._id === selectedValue)) {
                level1CategoryForLevel5 = level1;
                level2CategoryForLevel5 = level2;
                level3CategoryForLevel5 = level3;
                level4Category = level4;
                return true;
              }
              return false;
            });
          });
        });
      });
      if (!level1CategoryForLevel5 || !level2CategoryForLevel5 || !level3CategoryForLevel5 || !level4Category) {
        console.error('Parent categories not found for Level 5 category with ID:', selectedValue);
        return;
      }
      setSelectedCategoryId(level1CategoryForLevel5._id);
      setselectedLevel2Id(level2CategoryForLevel5._id);
      setSelectedLevel3Id(level3CategoryForLevel5._id);
      setSelectedlevel4(level4Category._id);
      setSelectedlevel5(selectedValue);
      break;
    }
    case 6: {
      let level5Category, level4CategoryForLevel6, level3CategoryForLevel6, level2CategoryForLevel6, level1CategoryForLevel6;
      categoryList.some(level1 => {
        return (level1.level_one_category_list || []).some(level2 => {
          return (level2.level_two_category_list || []).some(level3 => {
            return (level3.level_three_category_list || []).some(level4 => {
              return (level4.level_four_category_list || []).some(level5 => {
                if ((level5.level_five_category_list || []).some(level6 => level6._id === selectedValue)) {
                  level1CategoryForLevel6 = level1;
                  level2CategoryForLevel6 = level2;
                  level3CategoryForLevel6 = level3;
                  level4CategoryForLevel6 = level4;
                  level5Category = level5;
                  return true;
                }
                return false;
              });
            });
          });
        });
      });
      if (!level1CategoryForLevel6 || !level2CategoryForLevel6 || !level3CategoryForLevel6 || !level4CategoryForLevel6 || !level5Category) {
        console.error('Parent categories not found for Level 6 category with ID:', selectedValue);
        return;
      }
      setSelectedCategoryId(level1CategoryForLevel6._id);
      setselectedLevel2Id(level2CategoryForLevel6._id);
      setSelectedLevel3Id(level3CategoryForLevel6._id);
      setSelectedlevel4(level4CategoryForLevel6._id);
      setSelectedlevel5(level5Category._id);
      setSelectedlevel6(selectedValue);
      break;
    }
    default:
      break;
  }
} else {
  switch (level) {
    case 4:
      setSelectedlevel4('');
      break;
    case 5:
      setSelectedlevel5('');
      break;
    case 6:
      setSelectedlevel6('');
      break;
    default:
      break;
  }
}
};

// Visibility helpers
const level2Categories = levelOneCategory ? (levelOneCategory.level_one_category_list || []) : [];
const levelTwoCategoryForVisible = level2Categories.find(level2 => level2._id === selectedLevel2Id);
const level3Categories = levelTwoCategoryForVisible ? (levelTwoCategoryForVisible.level_two_category_list || []) : [];
const levelThreeCategoryForVisible = level3Categories.find(level3 => level3._id === selectedLevel3Id);
const level4Categories = levelThreeCategoryForVisible ? (levelThreeCategoryForVisible.level_three_category_list || []) : [];
const levelFourCategoryForVisible = level4Categories.find(level4 => level4._id === selectedlevel4);
const level5Categories = levelFourCategoryForVisible ? (levelFourCategoryForVisible.level_four_category_list || []) : [];
const levelFiveCategoryForVisible = level5Categories.find(level5 => level5._id === selectedlevel5);
const level6Categories = levelFiveCategoryForVisible ? (levelFiveCategoryForVisible.level_five_category_list || []) : [];

const [loading, setLoading] = useState(false);

const handleExport = async () => {
  setLoading(true);
  const { value: formValues } = await Swal.fire({
    title: 'Export Options',
    html: `<div style="font-size: 16px; padding-bottom: 10px;">
      <label for="includeInactiveProducts" style="display: block;">
        <input type="checkbox" id="includeInactiveProducts" /> 
        Include Inactive Products
      </label>
      <label for="includeInactiveVariants" style="display: block; margin: 8px 0;">
        <input type="checkbox" id="includeInactiveVariants" />
        Include Inactive Variants
      </label>
    </div>`,
    showCancelButton: true,
    confirmButtonText: 'Export',
    cancelButtonText: 'Cancel',
    focusCancel: true,
    customClass: {
      container: 'swal-custom-container ',
      popup: 'swal-custom-popup',
      title: 'swal-custom-title',
      confirmButton: 'swal-custom-confirm export-custom',
      cancelButton: 'swal-custom-cancel',
    },
    preConfirm: () => {
      // Return the values as an object that SweetAlert2 can handle properly
      return {
        includeInactiveProducts: !document.getElementById('includeInactiveProducts').checked,
        includeInactiveVariants: !document.getElementById('includeInactiveVariants').checked
      };
    },
    // Add this to prevent the [object Object] issue
    willOpen: () => {
      // Reset checkboxes to default unchecked state
      const includeInactiveProducts = document.getElementById('includeInactiveProducts');
      const includeInactiveVariants = document.getElementById('includeInactiveVariants');
      if (includeInactiveProducts) includeInactiveProducts.checked = false;
      if (includeInactiveVariants) includeInactiveVariants.checked = false;
    }
  });

  if (formValues) {
    try {
      Swal.fire({
        title: 'Processing Request',
        text: 'Your file is being processed and will download shortly...',
        icon: 'info',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
        customClass: {
          container: 'swal-custom-container',
          popup: 'swal-custom-popup',
          title: 'swal-custom-title',
        },
      });

      const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/exportAll/`, {
        responseType: 'blob',
        params: {
          category_id: selectedCategoryForVariant,
          is_active_product: formValues.includeInactiveProducts,
          is_active_variant: formValues.includeInactiveVariants,
        },
      });

      Swal.close();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'products.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      Swal.fire({
        title: 'Success!',
        text: 'File exported successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          container: 'swal-custom-container',
          popup: 'swal-custom-popup',
          title: 'swal-custom-title',
          confirmButton: 'swal-custom-confirm',
          cancelButton: 'swal-custom-cancel',
        },
      });
    } catch (error) {
      Swal.close();
      console.error('Error exporting data:', error);
      Swal.fire({
        title: 'Export Failed',
        text: 'An error occurred while exporting the data.',
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
  } else {
    setLoading(false); // Cancel clicked
  }
};

// If not ready (categories not loaded), render nothing or a loader
if (!isReady) {
return (
<div className="export-page" style={{ padding: '7px' }}>
<div className="CategoryTable-header">
<h2 className="header_cls_prod">Export Schema</h2>
</div>
<div style={{ padding: '1rem' }}>Loading categories...</div>
</div>
);
}

return (
<div className="export-page" style={{ padding: '7px' }}>
<div className="CategoryTable-header">
<h2 className="header_cls_prod">Export Schema</h2>
</div>
<div className="CategoryContainer">
{clearBtn && (
<button className="clear_cat_btn" onClick={() => handleLevelClear('')}>
Clear all
</button>
)}


    <div className="DropdownsContainer">
      {/* Level 1 Dropdown */}
      <div className="DropdownColumn" ref={categoryDropdownRef}>
        <label htmlFor="categorySelect">Level 1:</label>
        <div className="custom-dropdown" onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}>
          <div className="selected-category">
            {selectedCategoryId
              ? categoryList.find(level1 => level1._id === selectedCategoryId)?.name
              : 'Select Category'}
            <span className="dropdown-icons">
              <ChevronDownIcon style={{ fontSize: 25, float: 'right' }} />
            </span>
          </div>
          {isCategoryDropdownOpen && (
            <div className="dropdown-options">
              <input
                type="text"
                placeholder="Search category..."
                value={searchQueries.level1}
                onChange={e => handleSearchChange('level1', e.target.value)}
                className="dropdown-search-input"
                onClick={e => e.stopPropagation()}
              />
              <div className="dropdown-option" onClick={() => handleCategorySelect('')}>
                <span>Select Category</span>
              </div>
              {filteredCategories.map(level1 => (
                <div
                  className="dropdown-option"
                  onClick={() => {
                    handleCategorySelect(level1._id);
                    handleCategorySelectForVariants(level1._id, 'level-1');
                  }}
                >
                  <span>{level1.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Level 2 Dropdown */}
      <div className="DropdownColumn" ref={categoryDropdown2Ref}>
        <label htmlFor="sectionSelect">Level 2:</label>
        <div className="custom-dropdown" onClick={() => setIsLevel2DropdownOpen(!isLevel2DropdownOpen)}>
          <div className="selected-category">
            {selectedLevel2Id
              ? (levelOneCategory?.level_one_category_list || []).find(level2 => level2._id === selectedLevel2Id)?.name
              : 'Select category'}
            <span className="dropdown-icons">
              <ChevronDownIcon style={{ fontSize: 25, float: 'right' }} />
            </span>
          </div>
          {isLevel2DropdownOpen && (
            <div className="dropdown-options">
              <input
                type="text"
                placeholder="Search category..."
                value={searchQueries.level2}
                onChange={e => handleSearchChange('level2', e.target.value)}
                className="dropdown-search-input"
                onClick={e => e.stopPropagation()}
              />
              <div className="dropdown-option" onClick={() => handleLevel2Select('')}>
                <span>Select category</span>
              </div>
              {selectedCategoryId
  ? filteredCategoriesLevel2?.map(level2 => (
      <div
        key={level2._id}
        className="dropdown-option"
        onClick={() => {
          handleLevel2Select(level2._id);
          handleCategorySelectForVariants(level2._id, 'level-2');
        }}
      >
        <span>{level2.name}</span>
      </div>
    ))
  : (() => {
      const level2List = [];
      categoryList.forEach(level1 => {
        (level1.level_one_category_list || [])
          .filter(level2 =>
            level2.name.toLowerCase().includes(searchQueries.level2.toLowerCase())
          )
          .forEach(level2 => {
            level2List.push({
              level2,
              level1,
              path: level1.name,
            });
          });
      });

      return level2List.map(item => (
        <div
          key={`${item.level1._id}-${item.level2._id}`}
          className="dropdown-option"
          onClick={() => {
            setSelectedCategoryId(item.level1._id);
            handleLevel2Select(item.level2._id);
            handleCategorySelectForVariants(item.level2._id, 'level-2');
          }}
        >
          <span>
            {item.level2.name}
            <small style={{ color: '#999', marginLeft: '8px' }}>
              ({item.path})
            </small>
          </span>
        </div>
      ));
    })()}
            </div>
          )}
        </div>
      </div>

      {/* Level 3 Dropdown */}
      <div className="DropdownColumn" ref={categoryDropdown3Ref}>
        <label htmlFor="productTypeSelect">Level 3:</label>
        <div className="custom-dropdown" onClick={() => setIsLevel3DropdownOpen(!isLevel3DropdownOpen)}>
          <div className="selected-category">
            {selectedLevel3Id
              ? (levelTwoCategory?.level_two_category_list || []).find(level3 => level3._id === selectedLevel3Id)?.name
              : 'Select category'}
            <span className="dropdown-icons">
              <ChevronDownIcon style={{ fontSize: 25, float: 'right' }} />
            </span>
          </div>
          {isLevel3DropdownOpen && (
            <div className="dropdown-options">
              <input
                type="text"
                placeholder="Search category..."
                value={searchQueries.level3}
                onChange={e => handleSearchChange('level3', e.target.value)}
                className="dropdown-search-input"
                onClick={e => e.stopPropagation()}
              />
              <div className="dropdown-option" onClick={() => handleLevel3Select('')}>
                <span>Select category</span>
              </div>
              {selectedLevel2Id
  ? filteredCategoriesLevel3?.map(level3 => (
      <div
        key={level3._id}
        className="dropdown-option"
        onClick={() => {
          handleLevel3Select(level3._id);
          handleCategorySelectForVariants(level3._id, 'level-3');
        }}
      >
        <span>{level3.name}</span>
      </div>
    ))
  : (() => {
      const level3List = [];
      categoryList.forEach(level1 => {
        (level1.level_one_category_list || []).forEach(level2 => {
          (level2.level_two_category_list || [])
            .filter(level3 =>
              level3.name.toLowerCase().includes(searchQueries.level3.toLowerCase())
            )
            .forEach(level3 => {
              level3List.push({
                level3,
                level1,
                level2,
                path: `${level1.name} → ${level2.name}`,
              });
            });
        });
      });

      return level3List.map(item => (
        <div
          key={`${item.level1._id}-${item.level2._id}-${item.level3._id}`}
          className="dropdown-option"
          onClick={() => {
            setSelectedCategoryId(item.level1._id);
            setselectedLevel2Id(item.level2._id);
            handleLevel3Select(item.level3._id);
            handleCategorySelectForVariants(item.level3._id, 'level-3');
          }}
        >
          <span>
            {item.level3.name}
            <small style={{ color: '#999', marginLeft: '8px' }}>
              ({item.path})
            </small>
          </span>
        </div>
      ));
    })()}
            </div>
          )}
        </div>
      </div>

      {/* Level 4 Dropdown */}
      <div className="DropdownColumn" ref={categoryDropdown4Ref}>
        <label htmlFor="level4Select">Level 4:</label>
        <div className="custom-dropdown" onClick={() => setIslevel4DropdownOpen(!islevel4DropdownOpen)}>
          <div className="selected-category">
            {selectedlevel4
              ? (levelThreeCategory?.level_three_category_list || []).find(level4 => level4._id === selectedlevel4)?.name
              : 'Select category'}
            <span className="dropdown-icons">
              <ChevronDownIcon style={{ fontSize: 25, float: 'right' }} />
            </span>
          </div>
          {islevel4DropdownOpen && (
            <div className="dropdown-options">
              <input
                type="text"
                placeholder="Search category..."
                value={searchQueries.level4}
                onChange={e => handleSearchChange('level4', e.target.value)}
                className="dropdown-search-input"
                onClick={e => e.stopPropagation()}
              />
              <div className="dropdown-option" onClick={() => handleLevelSelect(4, '')}>
                <span>Select category</span>
              </div>
             {selectedLevel3Id
  ? filteredCategoriesLevel4?.map(level4 => (
      <div
        key={level4._id}
        className="dropdown-option"
        onClick={() => {
          handleLevelSelect(4, level4._id);
          handleCategorySelectForVariants(level4._id, 'level-4');
        }}
      >
        <span>{level4.name}</span>
      </div>
    ))
  : (() => {
      const level4List = [];
      categoryList.forEach(level1 => {
        (level1.level_one_category_list || []).forEach(level2 => {
          (level2.level_two_category_list || []).forEach(level3 => {
            (level3.level_three_category_list || [])
              .filter(level4 =>
                level4.name.toLowerCase().includes(searchQueries.level4.toLowerCase())
              )
              .forEach(level4 => {
                level4List.push({
                  level4,
                  level1,
                  level2,
                  level3,
                  path: `${level1.name} → ${level2.name} → ${level3.name}`,
                });
              });
          });
        });
      });

      return level4List.map(item => (
        <div
          key={`${item.level1._id}-${item.level2._id}-${item.level3._id}-${item.level4._id}`}
          className="dropdown-option"
          onClick={() => {
            setSelectedCategoryId(item.level1._id);
            setselectedLevel2Id(item.level2._id);
            setSelectedLevel3Id(item.level3._id);
            handleLevelSelect(4, item.level4._id);
            handleCategorySelectForVariants(item.level4._id, 'level-4');
          }}
        >
          <span>
            {item.level4.name}
            <small style={{ color: '#999', marginLeft: '8px' }}>
              ({item.path})
            </small>
          </span>
        </div>
      ));
    })()}
            </div>
          )}
        </div>
      </div>

      {/* Level 5 Dropdown */}
      <div className="DropdownColumn" ref={categoryDropdown5Ref}>
        <label htmlFor="level5Select">Level 5:</label>
        <div className="custom-dropdown" onClick={() => setIslevel5DropdownOpen(!islevel5DropdownOpen)}>
          <div className="selected-category">
            {selectedlevel5
              ? (levelFourCategory?.level_four_category_list || []).find(level5 => level5._id === selectedlevel5)?.name
              : 'Select category'}
            <span className="dropdown-icons">
              <ChevronDownIcon style={{ fontSize: 25, float: 'right' }} />
            </span>
          </div>
          {islevel5DropdownOpen && (
            <div className="dropdown-options">
              <input
                type="text"
                placeholder="Search category..."
                value={searchQueries.level5}
                onChange={e => handleSearchChange('level5', e.target.value)}
                className="dropdown-search-input"
                onClick={e => e.stopPropagation()}
              />
              <div className="dropdown-option" onClick={() => handleLevelSelect(5, '')}>
                <span>Select category</span>
              </div>
              {selectedlevel4
  ? filteredCategoriesLevel5?.map(level5 => (
      <div
        key={level5._id}
        className="dropdown-option"
        onClick={() => {
          handleLevelSelect(5, level5._id);
          handleCategorySelectForVariants(level5._id, 'level-5');
        }}
      >
        <span>{level5.name}</span>
      </div>
    ))
  : (() => {
      const level5List = [];
      categoryList.forEach(level1 => {
        (level1.level_one_category_list || []).forEach(level2 => {
          (level2.level_two_category_list || []).forEach(level3 => {
            (level3.level_three_category_list || []).forEach(level4 => {
              (level4.level_four_category_list || [])
                .filter(level5 =>
                  level5.name.toLowerCase().includes(searchQueries.level5.toLowerCase())
                )
                .forEach(level5 => {
                  level5List.push({
                    level5,
                    level1,
                    level2,
                    level3,
                    level4,
                    path: `${level1.name} → ${level2.name} → ${level3.name} → ${level4.name}`,
                  });
                });
            });
          });
        });
      });

      return level5List.map(item => (
        <div
          key={`${item.level1._id}-${item.level2._id}-${item.level3._id}-${item.level4._id}-${item.level5._id}`}
          className="dropdown-option"
          onClick={() => {
            setSelectedCategoryId(item.level1._id);
            setselectedLevel2Id(item.level2._id);
            setSelectedLevel3Id(item.level3._id);
            setSelectedlevel4(item.level4._id);
            handleLevelSelect(5, item.level5._id);
            handleCategorySelectForVariants(item.level5._id, 'level-5');
          }}
        >
          <span>
            {item.level5.name}
            <small style={{ color: '#999', marginLeft: '8px' }}>
              ({item.path})
            </small>
          </span>
        </div>
      ));
    })()}
            </div>
          )}
        </div>
      </div>

      {/* Level 6 Dropdown */}
      <div className="DropdownColumn" ref={categoryDropdown6Ref}>
        <label htmlFor="level6Select">Level 6:</label>
        <div className="custom-dropdown" onClick={() => setIslevel6DropdownOpen(!islevel6DropdownOpen)}>
          <div className="selected-category">
            {selectedlevel6
              ? (levelFiveCategory?.level_five_category_list || []).find(level6 => level6._id === selectedlevel6)?.name
              : 'Select category'}
            <span className="dropdown-icons">
              <ChevronDownIcon style={{ fontSize: 25, float: 'right' }} />
            </span>
          </div>
          {islevel6DropdownOpen && (
            <div className="dropdown-options">
              <input
                type="text"
                placeholder="Search category..."
                value={searchQueries.level6}
                onChange={e => handleSearchChange('level6', e.target.value)}
                className="dropdown-search-input"
                onClick={e => e.stopPropagation()}
              />
              <div className="dropdown-option" onClick={() => handleLevelSelect(6, '')}>
                <span>Select category</span>
              </div>
              {selectedlevel5
  ? filteredCategoriesLevel6?.map(level6 => (
      <div
        key={level6._id}
        className="dropdown-option"
        onClick={() => {
          handleLevelSelect(6, level6._id);
          handleCategorySelectForVariants(level6._id, 'level-6');
        }}
      >
        <span>{level6.name}</span>
      </div>
    ))
  : (() => {
      const level6List = [];
      categoryList.forEach(level1 => {
        (level1.level_one_category_list || []).forEach(level2 => {
          (level2.level_two_category_list || []).forEach(level3 => {
            (level3.level_three_category_list || []).forEach(level4 => {
              (level4.level_four_category_list || []).forEach(level5 => {
                (level5.level_five_category_list || [])
                  .filter(level6 =>
                    level6.name.toLowerCase().includes(searchQueries.level6.toLowerCase())
                  )
                  .forEach(level6 => {
                    level6List.push({
                      level6,
                      level1,
                      level2,
                      level3,
                      level4,
                      level5,
                      path: `${level1.name} → ${level2.name} → ${level3.name} → ${level4.name} → ${level5.name}`,
                    });
                  });
              });
            });
          });
        });
      });

      return level6List.map(item => (
        <div
          key={`${item.level1._id}-${item.level2._id}-${item.level3._id}-${item.level4._id}-${item.level5._id}-${item.level6._id}`}
          className="dropdown-option"
          onClick={() => {
            setSelectedCategoryId(item.level1._id);
            setselectedLevel2Id(item.level2._id);
            setSelectedLevel3Id(item.level3._id);
            setSelectedlevel4(item.level4._id);
            setSelectedlevel5(item.level5._id);
            handleLevelSelect(6, item.level6._id);
            handleCategorySelectForVariants(item.level6._id, 'level-6');
          }}
        >
          <span>
            {item.level6.name}
            <small style={{ color: '#999', marginLeft: '8px' }}>
              ({item.path})
            </small>
          </span>
        </div>
      ));
    })()}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>

  {isExportAllVisible && <button onClick={() => handleExport()} className="Export-button">Export All</button>}
  {!isExportAllVisible && <button onClick={() => handleExport()} className="Export-button">Export</button>}
</div>
);
};

export default ExportPage;