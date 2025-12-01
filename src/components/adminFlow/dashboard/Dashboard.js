import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./Dashboard.css";
import axiosInstance from "../../../../src/utils/axiosConfig";
import Unauthorized from "../../Unauthorized";
import Modal from "@mui/material/Modal";
import { SyncLoader } from "react-spinners";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);
function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenvendor, setIsModalOpenVendor] = useState(false);
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    animation: {
      duration: 1500,
      easing: "easeInOutQuad",
    },
  };
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get(
          `${process.env.REACT_APP_IP}/obtainDashboardCount/`
        );
        console.log("RESPONSE", response);
        if (response.status === 401) {
          setUnauthorized(true);
        } else if (response.data) {
          const categories =
            response.data.data.parent_level_category_list || [];
          setParentCategories(categories);
          setDashboardData(response.data.data);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setUnauthorized(true);
        } else console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);
  const fetchVendors = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_IP}/obtainBrand/`
      );
      if (response.data) {
        setVendors(response.data.data.brand_list);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const handleVendorClick = () => {
    setIsModalOpenVendor(true);
    fetchVendors();
  };
  const closeVendorModal = () => {
    setIsModalOpenVendor(false);
  };
  if (unauthorized) {
    return <Unauthorized />;
  }
  if (loading) {
    return (
      <div className="loading-spinner-container">
        <div>
          <SyncLoader color="#3498db" loading={loading} size={15} />
        </div>
      </div>
    );
  }

  const categoryData = {
    labels: Object.keys(dashboardData.category_project_dict),
    datasets: [
      {
        label: "Products Count",
        data: Object.values(dashboardData.category_project_dict),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4caf50",
          "#F7A35C",
          "#90ED7D",
        ],
        borderColor: "#ffffff",
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard Overview</h2>
      <div className="stats-cards">
        <div className="card card-blue">
          <h3>Total Products</h3>
          <p>{dashboardData.total_product}</p>
        </div>
        <div className="card card-green" onClick={handleVendorClick}>
          <h3>Total Vendors</h3>
          <p>{dashboardData.total_brand}</p>
        </div>
        <div className="card card-yellow">
          <h3>Total End Level Categories</h3>
          <p>{dashboardData.total_last_level_category}</p>
        </div>
        <div className="card card-orange" onClick={openModal}>
          <h3>Total Parent Level Categories</h3>
          <p>{dashboardData.total_parent_level_category}</p>
        </div>
      </div>
      <div className="charts-section">
        <div className="chart-card">
          <h3>Category wise count</h3>
          <div className="doughnut-container">
            {/* Left side: Doughnut chart */}
            <div className="chart-side">
              <Doughnut
                data={categoryData}
                options={{
                  ...options,
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
            {/* Right side: Legends with colors */}
            <div className="values-side">
              {categoryData.labels.map((label, index) => {
                const colorIndex =
                  index % categoryData.datasets[0].backgroundColor.length;
                return (
                  <div key={index} className="value-item">
                    <div
                      className="color-box"
                      style={{
                        backgroundColor:
                          categoryData.datasets[0].backgroundColor[colorIndex],
                      }}
                    ></div>
                    <span>{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={isModalOpen}
        className="modal-content-dashboard"
        onClose={closeModal}
      >
        <div className="modal-container">
          <h2>Parent Level Categories</h2>
          <ul className="ulliclass">
            {parentCategories.length > 0 ? (
              parentCategories.map((category) => (
                <li key={category.id} className="ulliclass">
                  {category.name} ({category.product_count}{" "}
                  {category.product_count === 1 ? "product" : "products"})
                </li>
              ))
            ) : (
              <p>No categories found.</p>
            )}
          </ul>
          <button onClick={closeModal} className="btn_dash">
            Close
          </button>
        </div>
      </Modal>
      <Modal
        open={isModalOpenvendor}
        className="modal-content-dashboard"
        onClose={closeVendorModal}
      >
        <div className="modal-container">
          <h2>Total Vendors</h2>
          <ul className="ulliclass">
            {vendors.length > 0 ? (
              vendors.map((vendor) => (
                <li key={vendor.id} className="ulliclass">
                  <div className="vendor-name">
                    <span>{vendor.name}</span>
                    <span className="product-count">
                      {" "}
                      ({vendor.product_count} products)
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <p>No vendors found.</p>
            )}
          </ul>
          <button onClick={closeVendorModal} className="btn_dash">
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}
export default Dashboard;
