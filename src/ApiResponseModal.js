import React, { useState, useEffect } from "react";
import axiosInstance from "./utils/axiosConfig";
import "./ModalStyles.css";
import CircularProgress from '@mui/material/CircularProgress';
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

const ApiResponseModal = ({
  showResponseModal,
  setShowResponseModal,
  apiResponse,
  selectedFilepath,
  selectedVendorId,
}) => {
  const [mapping, setMapping] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [draggedSource, setDraggedSource] = useState(null);
  const [allMapped, setAllMapped] = useState(false); // Track if all values are mapped
  const navigate = useNavigate();

  const databaseOptions = apiResponse?.Database_options || [];
  const databaseList = apiResponse?.Database_list || [];

  if (selectedFilepath) {
    localStorage.setItem("selectedFile", selectedFilepath);
  }
  let selectedFiles = localStorage.getItem("selectedFile");
console.log(selectedVendorId,'selectedVendorId');

  useEffect(() => {
    if (apiResponse?.extract_list) {
      const initialMapping = apiResponse.extract_list.map((item) => {
        let resultKey = null;
        // Find the key corresponding to the value in item
        console.log(item,'Items');
        
        for (const [key, value] of Object.entries(databaseList)) {
          if (value === item) {
            resultKey = key;
            console.log(key,'key');
            console.log(value,'value');
            break; // Exit loop once the key is found
          }
        }
        return {
          columnHeader: item,
          databaseOption: resultKey, // Use the found resultKey
        };
      });
      setMapping(initialMapping); // Update mapping state
    }
    setLoading(false); // Stop loading after setting mapping
  }, [apiResponse, databaseList]); // Add dict as a dependency if needed
  

  useEffect(() => {
    // Check if all unmatched values are mapped
    const allMappedValues = mapping.every(row => row.databaseOption !== "");
    setAllMapped(allMappedValues);
  }, [mapping]);
const downloadErrorList = (errorList) => {
    if (!errorList || errorList.length === 0) {
        Swal.fire({ title: 'Error!', text: 'No errors to export.', icon: 'error' });
        return;
    }
    // Create an array to hold the formatted error data
    const formattedErrors = [];
    errorList.forEach(errorObject => {
        // Create a new object for each row
        const rowData = {
            Row: errorObject["error-row"]
        };
        // Add each error as a separate "Errors" column
        errorObject.error_list.forEach((error, index) => {
            rowData[`Errors ${index + 1}`] = error;  // Errors 1, Errors 2, Errors 3, etc.
        });
        formattedErrors.push(rowData);
    });
    // Generate the worksheet from the formatted data
    const ws = XLSX.utils.json_to_sheet(formattedErrors);
    // Set the alignment for both columns
    ws['A1'].s = { alignment: { horizontal: 'left' } }; // Row column (A)
    ws['B1'].s = { alignment: { horizontal: 'left' } }; // Errors column (B)

    // Set alignment for every row in the worksheet
    for (let row = 2; row <= ws['!ref'].split(':')[1].slice(1); row++) {
        ws[`A${row}`].s = { alignment: { horizontal: 'left' } }; // Row column (A)
        ws[`B${row}`].s = { alignment: { horizontal: 'left' } }; // Errors column (B)
    }

    // Create a new workbook and append the sheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Error List");

    // Generate and trigger the download link for the Excel file
    XLSX.writeFile(wb, "error_list.xlsx");
    Swal.fire({
      title: 'Success!',
      text: 'The error list has been successfully downloaded.',
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
};
  if (loading) {
    return (
      <div> </div>
      // <div className="loading-spinner-container">
      //   <CircularProgress size={50} />
      //   <span>Processing...</span>
      // </div>
    );
  }
  const handleDragStart = (item, index, source) => {
    setDraggedItem(item);
    setDraggedIndex(index);
    setDraggedSource(source);
  };

  const handleDropDatabaseOption = () => {
    if (draggedSource === "mapToWhere") {
      const updatedMapping = mapping.map((row, index) => {
        if (index === draggedIndex) {
          return { ...row, databaseOption: "" };
        }
        return row;
      });
      setMapping(updatedMapping);
    }
    setDraggedItem(null);
    setDraggedSource(null);
  };

  const handleDropMapToWhere = (targetIndex) => {
    const updatedMapping = [...mapping];

    if (draggedSource === "databaseOptions") {
      updatedMapping[targetIndex].databaseOption = draggedItem;
    } else if (draggedSource === "mapToWhere") {
      const temp = updatedMapping[targetIndex].databaseOption;
      updatedMapping[targetIndex].databaseOption = draggedItem;
      updatedMapping[draggedIndex].databaseOption = temp;
    }

    setMapping(updatedMapping);
    setDraggedItem(null);
    setDraggedSource(null);
  };
const handleDashboard = async () =>{
    navigate('/Admin'); 
    window.location.reload();
}
  const handleSubmit = async () => {
    setLoading(true);
    const fieldData = {};
    mapping.forEach((row) => {
      if (row.databaseOption) {
        // fieldData[row.columnHeader] = row.databaseOption;
        fieldData[row.databaseOption] = row.columnHeader;

      }
    });

    const formData = new FormData();
    formData.append("file_path", selectedFiles);
    formData.append("field_data", JSON.stringify(fieldData));
    formData.append("vendor_id", selectedVendorId);

    try {
       Swal.fire({
              title: 'Processing Request',
              text: 'Your file is being processed and will be imported shortly...',
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
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_IP}/saveXlData/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );      
      if (response.data.data.status === true && response.data.data.is_error === true) {
        const flattenedErrorList = response.data.data.error_list.reduce((acc, errorObject) => {
          // Add each error message from errorObject.error_list to the accumulator
          return [...acc, ...errorObject.error_list.map(errorMessage => ({
              row: errorObject["error-row"],
              error: errorMessage
          }))];
      }, []);
      //Swal.close();
      // Limit to first 10 errors
      const errorListTable = flattenedErrorList.slice(0, 15);
      // Create the table rows for the first 10 errors
      const errorRows = errorListTable.map(error => {
          return `<tr><td style="padding: 5px;text-align: center;">${error.row}</td><td style="font-size: 15px;padding: 5px;">${error.error}</td></tr>`;
      }).join(''); 
        const processedRecords = response.data.data.total_products; // Update this value if needed
        const validRecords = response.data.data.added_count;
        const errorRecords = response.data.data.error_count;
        const errorList = response.data.data.error_list || []; // Array of errors
        // Separate the correct and error data from the response
        // Create a table for error data
        const tableStyle = errorList.length > 3 ? 
        `max-height: 200px; overflow-y: auto;` : '';
        const tableHTML = `
          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <div>
              <p style="margin: 0px; text-align: left;"><strong>Validated records:</strong> ${processedRecords}</p>
              <p style="margin: 0px; text-align: left;"><strong>Valid Records:</strong> ${validRecords}</p>
              <p style="margin: 0px; text-align: left;"><strong>Invalid Records:</strong> ${errorRecords}</p>
            </div>
            <!-- Download Icon and Hover Effect -->
             <div class="download-icon-container" style="cursor: pointer;width: 0%;" id="downloadErrorList">
            <i class="fas fa-download" style="font-size: 24px; color: #923be3;float:right;" ></i>
            <span class="download-text" >Download Error List</span>
          </div>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; ${tableStyle}">
            <thead>
              <tr>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: center;width: 14%;font-size: 16px;">Row</th>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: center;font-size: 16px;">Error</th>
              </tr>
            </thead>
            <tbody>
              ${errorRows}
            </tbody>
          </table>
          
          <br>
          <p style="font-weight: bold;margin: 0px;">Showing the first 15 errors. Download error list for more details and retry after fixing issues.</p>
          <!-- Add the Font Awesome link in the head of your HTML (if not already added) -->
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
          <style>
            .download-icon-container:hover .download-text {
              visibility: visible;
              opacity: 1;
            }
              /* Custom styles for the info icon and text in one row */
        .swal-title-custom {
          display: flex;
          align-items: center;
          font-size: 18px;
           font-size: 27px;
          flex-direction: row;
    justify-content: center;
        }

        .swal-title-custom i {
          font-size: 40px;
          margin-right: 10px; /* Space between icon and text */
          color: skyblue;
        }

        .swal-title-custom span {
          font-weight: bold;
        }
          </style>
        `;
        // Displaying results using Swal with HTML table format for both success and errors
        Swal.fire({
          title: '<div class="swal-title-custom"><i class="fas fa-info-circle"></i><span>Import Results</span></div>', // Info icon and text in the same row
          html: tableHTML,
          // icon: 'info',
          showCancelButton: false,
          showCloseButton: true, // Show the close button in the top-right corner
          allowOutsideClick: false, // Disable closing by clicking outside
          confirmButtonText: 'OK',
          customClass: {
            popup: 'swal-popup-custom',
            title: 'swal-title-custom',
            container: 'swal-custom-container',
            confirmButton: 'swal-custom-confirm',
            cancelButton: 'swal-custom-cancel',
          },
          width: '550px', // Reduce width of the popup
          didOpen: () => {
            document.getElementById('downloadErrorList')?.addEventListener('click', () => downloadErrorList(errorList));
          },
        }).then(() => {  navigate('/Admin?isFalse=true');});

        // Clear file and reload data
      } else if (response.data.data.status === true && response.data.data.is_error === false) {
        const processedRecords = response.data.data.total_products; // Update this value if needed
        const validRecords = response.data.data.added_count;
        const errorRecords = response.data.data.error_count;
        //Swal.close();
        // Creating the content for the Swal message
        const additionalInfo = `
          <div>
            <p style="margin: 0px; text-align: left;"><strong>Validated records:</strong> ${processedRecords}</p>
            <p style="margin: 0px; text-align: left;"><strong>Valid Records:</strong> ${validRecords}</p>
            <p style="margin: 0px; text-align: left;"><strong>Invalid Records:</strong> ${errorRecords}</p>
          </div>
        `;
        // Display the success message with the additional information
        Swal.fire({
          title: 'File imported successfully!',
          // text: 'File imported successfully.',
          icon: 'success',
          html: additionalInfo, // Insert the additional info in the modal
          showCloseButton: true, // Show the close button in the top-right corner
          allowOutsideClick: false, // Disable closing by clicking outside
          showConfirmButton: true, // Optionally hide the confirm button
          customClass: {
            icon: 'custom-icon-margin', // Custom class for icon styling
            container: 'swal-custom-container',
            popup: 'swal-custom-popup',
            title: 'swal-custom-title',
            confirmButton: 'swal-custom-confirm',
            cancelButton: 'swal-custom-cancel',
          },
        }).then(() => {  navigate('/Admin/allproducts');});
      } else if (response.data.data.status === false) {
        const flattenedErrorList = response.data.data.error_list.reduce((acc, errorObject) => {
          // Add each error message from errorObject.error_list to the accumulator
          return [...acc, ...errorObject.error_list.map(errorMessage => ({
              row: errorObject["error-row"],
              error: errorMessage
          }))];
      }, []);
      //Swal.close();
      // Limit to first 10 errors
      const errorListTable = flattenedErrorList.slice(0, 15);
      // Create the table rows for the first 10 errors
      const errorRows = errorListTable.map(error => {
          return `<tr><td style="padding: 5px;text-align: center;">${error.row}</td><td style="font-size: 15px;padding: 5px;">${error.error}</td></tr>`;
      }).join('');  
        const processedRecords = response.data.data.total_products; // Update this value if needed
        const validRecords = response.data.data.added_count;
        const errorRecords = response.data.data.error_count;
        const errorList = response.data.data.error_list || []; // Array of errors
        const tableStyle = errorList.length > 3 ? 
          `max-height: 200px; overflow-y: auto;` : '';
        const tableHTML = `
          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <div>
              <p style="margin: 0px; text-align: left;"><strong>Validated records:</strong> ${processedRecords}</p>
              <p style="margin: 0px; text-align: left;"><strong>Valid Records:</strong> ${validRecords}</p>
              <p style="margin: 0px; text-align: left;"><strong>Invalid Records:</strong> ${errorRecords}</p>
            </div>
            <!-- Download Icon and Hover Effect -->
             <div class="download-icon-container" style="cursor: pointer;width: 0%;" id="downloadErrorList">
            <i class="fas fa-download" style="font-size: 24px; color: #923be3;float:right;" ></i>
            <span class="download-text" >Download Error List</span>
          </div>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; ${tableStyle}">
            <thead>
              <tr>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: center;width: 14%;font-size: 16px;">Row</th>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: center;font-size: 16px;">Error</th>
              </tr>
            </thead>
            <tbody>
              ${errorRows}
            </tbody>
          </table>
          
          <br>
          <p style="font-weight: bold;margin: 0px;">Showing the first 15 errors. Download error list for more details and retry after fixing issues.</p>
          <!-- Add the Font Awesome link in the head of your HTML (if not already added) -->
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
          <style>
            .download-icon-container:hover .download-text {
              visibility: visible;
              opacity: 1;
            }
            /* Custom styles for the warning icon and text in one row */
        .swal-title-custom-import {
          display: flex;
          align-items: center;
          font-size: 27px;
          flex-direction: row;
    justify-content: center;
        }

        .swal-title-custom-import i {
          font-size: 40px;
          margin-right: 10px; /* Space between icon and text */
          color: orange;
        }

        .swal-title-custom-import span {
          font-weight: bold;
        }
          </style>
        `;
      
        Swal.fire({
          title: '<div class="swal-title-custom-import"><i class="fas fa-exclamation-circle"></i><span>Warning</span></div>', // Icon and text in the same row
          html: tableHTML,
          // icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'OK',
          showCloseButton: true, // Show the close button in the top-right corner
          allowOutsideClick: false, // Disable closing by clicking outside
          customClass: {
            popup: 'swal-popup-custom',
            title: 'swal-title-custom-import', // Apply the custom class for title
            container: 'swal-custom-container',
            popup: 'swal-custom-popup',
            title: 'swal-custom-title',
            confirmButton: 'swal-custom-confirm',
            cancelButton: 'swal-custom-cancel',
          },
        }).then(() => {  navigate('/Admin?isFalse=true');});

      }
       else {
        //Swal.close();
        Swal.fire({ title: 'Error!', text: 'Failed to import file.', icon: 'error' });
      }
      // if (response.data && response.data.data.status === true) {
      //   Swal.fire({ title: 'Success!', text: 'File uploaded successfully!', icon: 'success', confirmButtonText: 'OK', customClass: { container: 'swal-custom-container', popup: 'swal-custom-popup', title: 'swal-custom-title', confirmButton: 'swal-custom-confirm', cancelButton: 'swal-custom-cancel'
      //     }
      //   }).then(() => {  navigate('/Admin'); window.location.reload();});
      // }

      // else{
      //   Swal.fire({ title: 'Error!', text: 'File uploaded Error!', icon: 'Error', confirmButtonText: 'OK', customClass: { container: 'swal-custom-container', popup: 'swal-custom-popup', title: 'swal-custom-title', confirmButton: 'swal-custom-confirm', cancelButton: 'swal-custom-cancel'
      //   }
      // }).then(() => {  navigate('/Admin'); window.location.reload();});
      // }
      setShowResponseModal(false);
    } catch (err) {
      //Swal.close();
      console.error("API Error:", err);
    } finally {
      //Swal.close();
      setLoading(false);
    }
  };

  const isMatched = (value) => draggedItem && value && draggedItem === value;
  const isUnmatched = (value) => draggedItem && value && draggedItem !== value && value !== "";

  return (
    <>
      {showResponseModal && (
        <div className="modal-overlay">
          <div className="modal-content-import">
            <div className="modal-header">
              <h2>Field Mapping</h2>
              <button onClick={() => {setShowResponseModal(false);handleDashboard(true);}} className="btn-close">
                X
              </button>
            </div>
            <div className="modal-body">
              {loading ? (
                <div className="loading-spinner-container">
                  <CircularProgress size={50} />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="modal-content-box">
                  <div className="table-container">
                    <table className="styled-table">
                      <thead>
                        <tr>
                          <th>Your Column Header</th>
                          <th>Map to Where</th>
                          <th>Unmatched values</th>
                        </tr>
                      </thead>
                      <tbody>
  {mapping.map((row, index) => (
    <tr key={index}>
      <td>{row.columnHeader}</td>
      <td
        onDrop={() => handleDropMapToWhere(index)}
        onDragOver={(e) => e.preventDefault()}
        className={`map-to-where-cell ${allMapped || isMatched(row.databaseOption) ? "" : "highlight"} ${isMatched(row.databaseOption) ? "matched" : ""} ${isUnmatched(row.databaseOption) ? "unmatched" : ""}`}
      >
        <div
          className={`draggable-item ${isMatched(row.databaseOption) ? "matched" : ""} ${isUnmatched(row.databaseOption) ? "unmatched" : ""}`}
          draggable={!!row.databaseOption}
          onDragStart={() =>
            row.databaseOption &&
            handleDragStart(row.databaseOption, index, "mapToWhere")
          }
        >
          {row.databaseOption || "Drop here"}
        </div>
      </td>
      {/* Display unmatched values only in the first row */}
      {index === 0 ? (
        <td rowSpan={mapping.length}>
          <div
            className="options-list"
            onDrop={handleDropDatabaseOption}
            onDragOver={(e) => e.preventDefault()}
          >
            {databaseOptions
              .filter((option) => !mapping.some((row) => row.databaseOption === option))
              .map((option, i) => (
                <div
                  key={i}
                  className={`draggable-item ${isMatched(option) ? "matched" : ""} ${isUnmatched(option) ? "unmatched" : ""}`}
                  draggable
                  onDragStart={() => handleDragStart(option, null, "databaseOptions")}
                >
                  {option}
                </div>
              ))}
          </div>
        </td>
      ) : null}
    </tr>
  ))}
</tbody>

                    </table>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving..." : "Save Mapping"}
              </button>
              <button className="btn-close-down" onClick={() => {setShowResponseModal(false);handleDashboard(true);}}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApiResponseModal;
