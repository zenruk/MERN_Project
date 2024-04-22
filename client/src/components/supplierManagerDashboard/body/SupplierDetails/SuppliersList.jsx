import React, { useEffect, useState } from "react";
import axios from "axios";
import { PDFViewer } from "@react-pdf/renderer";
import { Button, Modal } from "react-bootstrap";
import Excel from "../../../../assests/img/icons/excel.png";
import Pdf from "../../../../assests/img/icons/pdf.png";
import Refresh from "../../../../assests/img/icons/refresh.png";
import SearchBar from './SearchBar';
import FarmerForm from "./FarmerForm";
import SupplierReport from "./SupplierReport";
import * as XLSX from "xlsx";
import { writeFile } from "xlsx";
import './farmers.css';

axios.defaults.baseURL = "http://localhost:8070/";

function SuppliersList() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [filteredDataList, setFilteredDataList] = useState([]); 

  useEffect(() => {
    getFetchData();
  }, []);

  useEffect(() => {
    setFilteredDataList(dataList); // Initialize filteredDataList with dataList
  }, [dataList]);

  const getFetchData = async () => {
    try {
      const response = await axios.get("/Farmer/");
      setDataList(response.data);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRefreshClick = () => {
    window.location.reload();
  };

  const generateExcelFile = () => {
    // Define the worksheet
    const ws = XLSX.utils.json_to_sheet(dataList);
  
    // Define the workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Suppliers Report");
  
    // Generate the Excel file
    writeFile(wb, "suppliers_report.xlsx");
  };
  
  const handleButtonClick = () => {
    getFetchData(); // Fetch the latest data if needed
    generateExcelFile();
  };
  

  const handleAddModalOpen = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const handleEditModalOpen = (farmer) => {
    setSelectedFarmer(farmer);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this farmer?");
    if (confirmDelete) {
      try {
        await axios.delete(`/Farmer/delete/${id}`);
        alert("Successfully Deleted");
        getFetchData();
        window.location.reload();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleAddSubmit = async (formData) => {
    try {
      await axios.post("/Farmer/add", formData);
      alert("Farmer Added");
      window.location.reload();
      handleAddModalClose();
      getFetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditSubmit = async (formData) => {
    try {
      await axios.put(`/Farmer/update/${formData._id}`, formData);
      alert("Farmer Updated");
      handleEditModalClose();
      getFetchData();
    } catch (err) {
      alert(err.message);
    }
  };



  // Search functionality
  const handleSearch = (query) => {
    const filteredList = dataList.filter((farmer) => {
      // Check the selected search attribute and filter accordingly
      switch (searchAttribute) {
        case 'name':
          const fullName = `${farmer.name} ${farmer.username}`;
          return fullName.toLowerCase().includes(query.toLowerCase());
        case 'email':
          return farmer.email.toLowerCase().includes(query.toLowerCase());
        case 'city':
          return farmer.city.toLowerCase().includes(query.toLowerCase());
        default:
          return false;
      }
    });
    setFilteredDataList(filteredList);
  };

  // State variable for selected search attribute
  const [searchAttribute, setSearchAttribute] = useState('name');

  // Function to handle search attribute change
  const handleSearchAttributeChange = (event) => {
    setSearchAttribute(event.target.value);
  };





  const [showReportModal, setShowReportModal] = useState(false);
  const handleCloseReportModal = () => setShowReportModal(false);
  const handleShowReportModal = () => setShowReportModal(true);

  return (
    <div id="main col-8">
      <div className="card recent-sales overflow-auto">
        <div className="card-body">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="card-title">
                Supplier Details
                <h6>Manage Supplier Details</h6>
              </div>
            </div>
            <ul className="table-top-head" style={{ float: "right" }}>
              <li>
                <div className="button-container" title="Generate Report as PDF">
                  <a onClick={handleShowReportModal}>
                    <img src={Pdf} alt="Pdf Icon" className="icon" />
                  </a>
                </div>
              </li>
              <li>
                <div className="button-container" title="Generate Report as Excel">
                  <a onClick={handleButtonClick}>
                    <img src={Excel} alt="Excel Icon" className="icon" />
                  </a>
                </div>
              </li>
              <li>
                <div className="button-container" title="Refresh">
                  <a onClick={handleRefreshClick}>
                    <img src={Refresh} alt="Refresh Icon" className="icon" />
                  </a>
                </div>
              </li>
              <li>
                <div className="page-btn">
                  <button
                    type="button"
                    className="btn btn-added"
                    onClick={handleAddModalOpen}
                  >
                    <i className="bi bi-plus-circle"></i> Add Farmer
                  </button>
                </div>
              </li>
            </ul>
            <Modal show={showReportModal} onHide={handleCloseReportModal}>
              <Modal.Header closeButton>
                <Modal.Title>Supplier Details Report</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <PDFViewer width="100%" height="500px">
                  <SupplierReport dataList={dataList} />
                </PDFViewer>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseReportModal}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </div>

          <Modal show={addModalOpen} onHide={handleAddModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add Farmer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <FarmerForm handleSubmit={handleAddSubmit} />
            </Modal.Body>
          </Modal>

          <Modal show={editModalOpen} onHide={handleEditModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Farmer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <FarmerForm
                handleSubmit={handleEditSubmit}
                initialData={selectedFarmer}
              />
            </Modal.Body>
          </Modal>

          <div className="table-container">
            <SearchBar onSearch={handleSearch} searchAttribute={searchAttribute} onSearchAttributeChange={handleSearchAttributeChange} />
            <table className="table table-borderless datatable">
              <thead className="table-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">NIC</th>
                  <th scope="col">Username</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Mobile</th>
                  <th scope="col">City</th>
                  <th scope="col">Lane</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDataList.length ? (
                  filteredDataList.map((farmer, index) => (
                    <tr key={farmer._id}>
                      <td>{index + 1}</td>
                      <td>{farmer.NIC}</td>
                      <td>{farmer.username}</td>
                      <td>{farmer.name}</td>
                      <td>{farmer.email}</td>
                      <td>{farmer.mobile}</td>
                      <td>{farmer.city}</td>
                      <td>{farmer.lane}</td>
                      <td className="action">
                        <div className="buttons">
                          <button
                            className="btn btn-edit"
                            title="Edit"
                            onClick={() => handleEditModalOpen(farmer)}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            className="btn btn-delete"
                            title="Delete"
                            onClick={() => handleDelete(farmer._id)}
                          >
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No Data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuppliersList;
