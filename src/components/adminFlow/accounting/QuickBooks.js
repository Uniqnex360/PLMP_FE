import React, { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import axiosInstance from "../../../utils/axiosConfig.js";
const styles = {
  container: {
    backgroundColor: "white",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    borderRadius: "12px",
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
  },
  checkingStatus: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1a1a2e",
    margin: 0,
  },
  connectionStatus: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
  },
  connected: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },
  disconnected: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
  connectBtn: {
    padding: "10px 20px",
    backgroundColor: "#2d8a4e",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  },
  disconnectBtn: {
    padding: "8px 16px",
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    marginLeft: "8px",
  },
  tabContainer: {
    display: "flex",
    gap: "8px",
    marginBottom: "24px",
    borderBottom: "2px solid #e5e7eb",
    paddingBottom: "0",
    overflowX: "auto",
  },
  tab: {
    padding: "12px 20px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    color: "#6b7280",
    borderBottom: "2px solid transparent",
    marginBottom: "-2px",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  },
  activeTab: {
    color: "#2d8a4e",
    borderBottomColor: "#2d8a4e",
    fontWeight: "600",
  },
  searchContainer: {
    display: "flex",
    gap: "12px",
    marginBottom: "16px",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
  },
  refreshContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  searchInput: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    width: "280px",
    marginTop: "11px",
    fontSize: "14px",
    outline: "none",
    height: "40px",
    boxSizing: "border-box",
  },
  filterSelect: {
    padding: "10px 32px 10px 12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    cursor: "pointer",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: "right 8px center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "16px",
    backgroundColor: "white",
    height: "40px",
    boxSizing: "border-box",
  },
  refreshBtn: {
    padding: "10px 12px",
    backgroundColor: "#2d8a4e",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    minWidth: "100px",
    justifyContent: "center",
    height: "38px",
  },
  syncBtn: {
    padding: "10px 20px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    height: "38px",
    boxSizing: "border-box",
    whiteSpace: "nowrap",
    minWidth: "140px",
  },
  exportBtn: {
    padding: "10px 20px",
    backgroundColor: "#f3f4f6",
    color: "#374151",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  },
  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  statCard: {
    padding: "16px 20px",
    backgroundColor: "#f9fafb",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
  },
  statLabel: {
    fontSize: "13px",
    color: "#6b7280",
    marginBottom: "4px",
  },
  statValue: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1a1a2e",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },
  th: {
    textAlign: "left",
    padding: "12px 16px",
    backgroundColor: "#f9fafb",
    color: "#6b7280",
    fontWeight: "600",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom: "1px solid #e5e7eb",
  },
  td: {
    padding: "14px 16px",
    borderBottom: "1px solid #f3f4f6",
    color: "#374151",
  },
  statusBadge: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "500",
  },
  paidStatus: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },
  unpaidStatus: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
  partialStatus: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
  },
  openStatus: {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
  },
  closedStatus: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },
  activeStatus: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },
  inactiveStatus: {
    backgroundColor: "#f3f4f6",
    color: "#6b7280",
  },
  lowStockStatus: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
  inStockStatus: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },
  clickableRow: {
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  noData: {
    textAlign: "center",
    padding: "40px",
    color: "#9ca3af",
    fontSize: "15px",
  },
  loadingOverlay: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px",
    color: "#6b7280",
    flexDirection: "column",
    gap: "12px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid #e5e7eb",
    borderTop: "3px solid #2d8a4e",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  errorContainer: {
    textAlign: "center",
    padding: "40px",
    color: "#991b1b",
    backgroundColor: "#fee2e2",
    borderRadius: "8px",
    margin: "20px 0",
  },
  retryBtn: {
    marginTop: "12px",
    padding: "8px 16px",
    backgroundColor: "#991b1b",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  detailModal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px",
    maxWidth: "800px",
    width: "90%",
    maxHeight: "80vh",
    overflow: "auto",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    gap: "20px",
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "32px",
    cursor: "pointer",
    color: "#6b7280",
    padding: "0",
    width: "32px",
    height: "32px",
    flexShrink: 0,
  },
  detailSection: {
    marginBottom: "20px",
  },
  detailTitle: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "12px",
    color: "#1a1a2e",
  },
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
  },
  detailItem: {
    padding: "8px 0",
  },
  detailLabel: {
    fontSize: "12px",
    color: "#6b7280",
    marginBottom: "2px",
  },
  detailValue: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#1a1a2e",
  },
};
const spinnerStyle = document.createElement("style");
spinnerStyle.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(spinnerStyle);
const swalButtonStyle = document.createElement("style");
swalButtonStyle.textContent = `
  .swal2-confirm, .swal2-cancel {
    min-width: 140px !important;
    padding: 10px 24px !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    border-radius: 6px !important;
    border: none !important;
    cursor: pointer !important;
    box-sizing: border-box !important;
    text-overflow: clip !important;
    overflow: visible !important;
    white-space: nowrap !important;
    word-wrap: normal !important;
    flex: 0 0 auto !important;
  }
  .swal2-confirm {
    background-color: #991b1b !important;
    color: white !important;
  }
  .swal2-cancel {
    background-color: #6b7280 !important;
    color: white !important;
  }
  .swal2-actions {
    gap: 10px !important;
    justify-content: center !important;
  }
`;
document.head.appendChild(swalButtonStyle);
const QuickBooks = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [billMode, setBillMode] = useState("vendors");
  const [purchaseOrderMode, setPurchaseOrderMode] = useState("vendors");
  const [realmId, setRealmId] = useState(null);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("invoices");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [bills, setBills] = useState([]);
  const [payments, setPayments] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [checkingConnection, setCheckingConnection] = useState(true);
  const [connectionError, setConnectionError] = useState(null);
  const [invoiceSummary, setInvoiceSummary] = useState({});
  const [inventorySummary, setInventorySummary] = useState({});
  const [accountsSummary, setAccountsSummary] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setInvoiceModalOpen(false);
        setDetailModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  });
  const formatAddress = (address) => {
    if (!address) return "-";
    const parts = [
      address.line1,
      address.line2,
      address.city,
      address.state,
      address.postal_code,
    ].filter(Boolean);
    return parts.join(", ") || "-";
  };
  const checkConnectionStatus = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_IP}/quickbooks/status/`
      );
      if (response.data.estatus && response.data.data.is_connected) {
        const connection = response.data.data.connections[0];
        setIsConnected(true);
        setRealmId(connection.realm_id);
        setCompanyInfo(connection.company);
      } else {
        setIsConnected(false);
        setRealmId(null);
        setCompanyInfo(null);
      }
    } catch (err) {
      console.error("Error checking connection status:", err);
      setIsConnected(false);
      setConnectionError(err.message || "Failed to check connection status");
      Swal.fire({
        title: "Connection Error",
        text: "Unable to check QuickBooks connection status",
        icon: "error",
      });
    } finally {
      setCheckingConnection(false);
    }
  }, []);
  const handleConnect = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_IP}/quickbooks/connect/`
      );
      if (response.data.estatus && response.data.data.auth_url) {
        window.location.href = response.data.data.auth_url;
      } else {
        Swal.fire({
          title: "Error",
          text: response.data.emessage || "Failed to initiate connection",
          icon: "error",
        });
      }
    } catch (err) {
      console.error("Error connecting:", err);
      Swal.fire({
        title: "Error",
        text: "Failed to connect to QuickBooks",
        icon: "error",
      });
    }
  };
  const handleDisconnect = async () => {
    const result = await Swal.fire({
      title: "Disconnect QuickBooks?",
      text: "Are you sure you want to disconnect this QuickBooks company?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#991b1b",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, disconnect",
      customClass: {
        confirmButton: "swal2-confirm-custom",
        cancelButton: "swal2-cancel-custom",
      },
      buttonsStyling: true,
    });
    if (result.isConfirmed) {
      try {
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_IP}/quickbooks/disconnect/`,
          { realm_id: realmId }
        );
        if (response.data.estatus) {
          setIsConnected(false);
          setRealmId(null);
          setCompanyInfo(null);
          clearAllData();
          Swal.fire(
            "Disconnected",
            "QuickBooks has been disconnected.",
            "success"
          );
        }
      } catch (err) {
        console.error("Error disconnecting:", err);
        Swal.fire("Error", "Failed to disconnect", "error");
      }
    }
  };
  const clearAllData = () => {
    setInvoices([]);
    setCustomers([]);
    setVendors([]);
    setPurchaseOrders([]);
    setBills([]);
    setPayments([]);
    setInventory([]);
    setAccounts([]);
  };
  const fetchInvoices = async () => {
    if (!realmId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_IP}/quickbooks/invoices/`,
        { params: { realm_id: realmId } }
      );
      if (response.data.estatus && response.data.data.success) {
        setInvoices(response.data.data.invoices || []);
        setInvoiceSummary(response.data.data.summary || {});
      } else {
        throw new Error(
          response.data.data?.error || "Failed to fetch invoices"
        );
      }
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setError(err.message || "Failed to fetch invoices");
    } finally {
      setLoading(false);
    }
  };
  const fetchCustomers = async () => {
    if (!realmId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_IP}/quickbooks/customers/`,
        { params: { realm_id: realmId } }
      );
      if (response.data.estatus && response.data.data.success) {
        setCustomers(response.data.data.customers || []);
      } else {
        throw new Error(
          response.data.data?.error || "Failed to fetch customers"
        );
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError(err.message || "Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };
  const fetchVendors = async () => {
    if (!realmId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_IP}/quickbooks/vendors/`,
        { params: { realm_id: realmId } }
      );
      if (response.data.estatus && response.data.data.success) {
        setVendors(response.data.data.vendors || []);
      } else {
        throw new Error(response.data.data?.error || "Failed to fetch vendors");
      }
    } catch (err) {
      console.error("Error fetching vendors:", err);
      setError(err.message || "Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };
  const fetchPurchaseOrders = async (mode = purchaseOrderMode) => {
    if (!realmId) return;
    setLoading(true);
    setError(null);
    try {
      const params = {
        realm_id: realmId,
        mode: mode,
      };
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_IP}/quickbooks/purchase-orders/`,
        { params }
      );
      if (response.data.estatus && response.data.data.success) {
        const poData =
          mode === "customers"
            ? response.data.data.customer_purchase_orders || []
            : response.data.data.vendor_purchase_orders || [];
        setPurchaseOrders(poData);
      } else {
        throw new Error(
          response.data.data?.error || "Failed to fetch purchase orders"
        );
      }
    } catch (err) {
      console.error("Error fetching purchase orders:", err);
      setError(err.message || "Failed to fetch purchase orders");
    } finally {
      setLoading(false);
    }
  };
  const fetchBills = async (mode = billMode) => {
    if (!realmId) return;
    setLoading(true);
    setError(null);
    try {
      const params = {
        realm_id: realmId,
        mode: mode,
      };
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_IP}/quickbooks/bills/`,
        { params }
      );
      if (response.data.estatus && response.data.data.success) {
        const billsData =
          mode === "customers"
            ? response.data.data.customer_bills || []
            : response.data.data.vendor_bills || [];
        setBills(billsData);
      } else {
        throw new Error(response.data.data?.error || "Failed to fetch bills");
      }
    } catch (err) {
      console.error("Error fetching bills:", err);
      setError(err.message || "Failed to fetch bills");
    } finally {
      setLoading(false);
    }
  };
  const fetchPayments = async () => {
    if (!realmId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_IP}/quickbooks/payments/`,
        { params: { realm_id: realmId } }
      );
      if (response.data.estatus && response.data.data.success) {
        setPayments(response.data.data.payments || []);
      } else {
        throw new Error(
          response.data.data?.error || "Failed to fetch payments"
        );
      }
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError(err.message || "Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };
  const fetchInventory = async () => {
    if (!realmId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_IP}/quickbooks/items/`,
        { params: { realm_id: realmId } }
      );
      if (response.data.estatus && response.data.data.success) {
        setInventory(response.data.data.inventory_items || []);
        setInventorySummary(response.data.data.summary || {});
      } else {
        throw new Error(
          response.data.data?.error || "Failed to fetch inventory"
        );
      }
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setError(err.message || "Failed to fetch inventory");
    } finally {
      setLoading(false);
    }
  };
  const fetchAccounts = async () => {
    if (!realmId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_IP}/quickbooks/chart-of-accounts/`,
        { params: { realm_id: realmId } }
      );
      if (response.data.estatus && response.data.data.success) {
        setAccounts(response.data.data.accounts || []);
        setAccountsSummary(response.data.data.summary || {});
      } else {
        throw new Error(
          response.data.data?.error || "Failed to fetch accounts"
        );
      }
    } catch (err) {
      console.error("Error fetching accounts:", err);
      setError(err.message || "Failed to fetch accounts");
    } finally {
      setLoading(false);
    }
  };
  const fetchCustomerDetails = async (customerId) => {
    if (!realmId || !customerId) return;
    setLoading(true);
    setDetailLoading(true);
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_IP}/quickbooks/customers/details/`,
        { params: { realm_id: realmId, customer_id: customerId } }
      );
      if (response.data.estatus && response.data.data.success) {
        setDetailData(response.data.data);
        setDetailModalOpen(true);
        setLoading(false);
      } else {
        setLoading(false);

        throw new Error(
          response.data.data?.error || "Failed to fetch customer details"
        );
      }
    } catch (err) {
      console.error("Error fetching customer details:", err);
      Swal.fire("Error", err.message || "Failed to fetch details", "error");
    } finally {
      setLoading(false);

      setDetailLoading(false);
    }
  };
  const fetchVendorDetails = async (vendorId) => {
    if (!realmId || !vendorId) return;
    setDetailLoading(true);
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_IP}/quickbooks/vendors/details/`,
        { params: { realm_id: realmId, vendor_id: vendorId } }
      );
      if (response.data.estatus && response.data.data.success) {
        setDetailData(response.data.data);
        setDetailModalOpen(true);
      } else {
        throw new Error(
          response.data.data?.error || "Failed to fetch vendor details"
        );
      }
    } catch (err) {
      console.error("Error fetching vendor details:", err);
      Swal.fire("Error", err.message || "Failed to fetch details", "error");
    } finally {
      setDetailLoading(false);
    }
  };
  const handleSyncProducts = async () => {
    if (!realmId) return;
    const result = await Swal.fire({
      title: "Sync Products to QuickBooks?",
      text: "This will sync all active products from your catalog to QuickBooks.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2d8a4e",
      confirmButtonText: "Yes, sync",
    });
    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: "Syncing Products...",
          text: "Please wait while products are being synced.",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_IP}/quickbooks/sync-products/`,
          { realm_id: realmId }
        );
        Swal.close();
        if (response.data.estatus && response.data.data.success) {
          const { synced, failed } = response.data.data;
          Swal.fire({
            title: "Sync Complete",
            html: `<p><strong>Synced:</strong> ${synced} products</p>
                   <p><strong>Failed:</strong> ${failed} products</p>`,
            icon: failed > 0 ? "warning" : "success",
          });
          fetchInventory();
        } else {
          throw new Error(response.data.data?.error || "Sync failed");
        }
      } catch (err) {
        Swal.close();
        Swal.fire("Error", err.message || "Failed to sync products", "error");
      }
    }
  };
  const fetchDataForTab = useCallback(
    (tab) => {
      switch (tab) {
        case "invoices":
          fetchInvoices();
          break;
        case "customers":
          fetchCustomers();
          break;
        case "vendors":
          fetchVendors();
          break;
        case "purchase-orders":
          fetchPurchaseOrders(purchaseOrderMode);
          break;
        case "bills":
          fetchBills(billMode);
          break;
        case "payments":
          fetchPayments();
          break;
        case "inventory":
          fetchInventory();
          break;
        case "accounts":
          fetchAccounts();
          break;
        default:
          break;
      }
    },
    [realmId, billMode, purchaseOrderMode]
  );
  useEffect(() => {
    checkConnectionStatus();
  }, [checkConnectionStatus]);
  useEffect(() => {
    if (isConnected && realmId) {
      fetchDataForTab(activeTab);
    }
  }, [isConnected, realmId, activeTab, fetchDataForTab]);
  const getFilteredData = () => {
    let data = [];
    let searchFields = [];
    switch (activeTab) {
      case "invoices":
        data = invoices;
        searchFields = ["doc_number", "customer_name"];
        break;
      case "customers":
        data = customers;
        searchFields = ["display_name", "company_name", "email"];
        break;
      case "vendors":
        data = vendors;
        searchFields = ["display_name", "company_name", "email"];
        break;
      case "purchase-orders":
        data = purchaseOrders;
        searchFields =
          purchaseOrderMode === "customers"
            ? ["doc_number", "customer_name"]
            : ["doc_number", "vendor_name"];
        break;
      case "bills":
        data = bills;
        searchFields = ["doc_number", "vendor_name"];
        break;
      case "payments":
        data = payments;
        searchFields =
          billMode === "customers"
            ? ["doc_number", "customer_name"]
            : ["doc_number", "vendor_name"];
        break;
      case "inventory":
        data = inventory;
        searchFields = ["name", "sku", "description"];
        break;
      case "accounts":
        data = accounts;
        searchFields = ["name", "account_type"];
        break;
      default:
        return [];
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter((item) =>
        searchFields.some((field) =>
          (item[field] || "").toString().toLowerCase().includes(query)
        )
      );
    }
    if (statusFilter !== "all") {
      switch (activeTab) {
        case "invoices":
        case "bills":
          data = data.filter(
            (item) => item.payment_status?.toLowerCase() === statusFilter
          );
          break;
        case "customers":
        case "vendors":
          data = data.filter((item) =>
            statusFilter === "active" ? item.is_active : !item.is_active
          );
          break;
        case "purchase-orders":
          data = data.filter(
            (item) => item.status?.toLowerCase() === statusFilter
          );
          break;
        case "inventory":
          if (statusFilter === "low") {
            data = data.filter(
              (item) => (item.qty_on_hand || 0) <= (item.reorder_point || 0)
            );
          } else if (statusFilter === "instock") {
            data = data.filter(
              (item) => (item.qty_on_hand || 0) > (item.reorder_point || 0)
            );
          }
          break;
        default:
          break;
      }
    }
    return data;
  };
  const getFilterOptions = () => {
    switch (activeTab) {
      case "invoices":
      case "bills":
        return [
          { value: "all", label: "All Status" },
          { value: "paid", label: "Paid" },
          { value: "unpaid", label: "Unpaid" },
          { value: "partial", label: "Partial" },
        ];
      case "customers":
      case "vendors":
        return [
          { value: "all", label: "All Status" },
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ];
      case "purchase-orders":
        return [
          { value: "all", label: "All Status" },
          { value: "open", label: "Open" },
          { value: "closed", label: "Closed" },
        ];
      case "inventory":
        return [
          { value: "all", label: "All Items" },
          { value: "low", label: "Low Stock" },
          { value: "instock", label: "In Stock" },
        ];
      default:
        return [{ value: "all", label: "All" }];
    }
  };
  const handleBillModeToggle = (mode) => {
    setBillMode(mode);
    fetchBills(mode);
  };
  const getStatusBadgeStyle = (status, type) => {
    const baseStyle = styles.statusBadge;
    if (type === "payment") {
      const statusLower = (status || "").toLowerCase();
      if (statusLower === "paid") return { ...baseStyle, ...styles.paidStatus };
      if (statusLower === "unpaid")
        return { ...baseStyle, ...styles.unpaidStatus };
      if (statusLower === "partial")
        return { ...baseStyle, ...styles.partialStatus };
    }
    if (type === "po") {
      const statusLower = (status || "").toLowerCase();
      if (statusLower === "closed")
        return { ...baseStyle, ...styles.closedStatus };
      if (statusLower === "open") return { ...baseStyle, ...styles.openStatus };
    }
    if (type === "active") {
      const isActive =
        typeof status === "boolean"
          ? status
          : status === "true" || status === true;
      return isActive
        ? { ...baseStyle, ...styles.activeStatus }
        : { ...baseStyle, ...styles.inactiveStatus };
    }
    if (type === "stock") {
      return status === "low"
        ? { ...baseStyle, ...styles.lowStockStatus }
        : { ...baseStyle, ...styles.inStockStatus };
    }
    return baseStyle;
  };
  const renderStats = () => {
    const data = getFilteredData();
    switch (activeTab) {
      case "invoices": {
        const total = data.reduce(
          (sum, inv) => sum + (inv.total_amount || 0),
          0
        );
        const balance = data.reduce(
          (sum, inv) => sum + (inv.balance_due || 0),
          0
        );
        const paidCount = data.filter(
          (inv) => inv.payment_status === "Paid"
        ).length;
        return (
          <div style={styles.statsContainer}>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Total Invoices</div>
              <div style={styles.statValue}>{data.length}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Total Amount</div>
              <div style={{ ...styles.statValue, color: "#166534" }}>
                {formatCurrency(total)}
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Outstanding Balance</div>
              <div style={{ ...styles.statValue, color: "#92400e" }}>
                {formatCurrency(balance)}
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Paid Invoices</div>
              <div style={{ ...styles.statValue, color: "#166534" }}>
                {paidCount}
              </div>
            </div>
          </div>
        );
      }
      case "customers": {
        const totalBalance = data.reduce((sum, c) => sum + (c.balance || 0), 0);
        const activeCount = data.filter((c) => c.is_active).length;
        return (
          <div style={styles.statsContainer}>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Total Customers</div>
              <div style={styles.statValue}>{data.length}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Active Customers</div>
              <div style={{ ...styles.statValue, color: "#166534" }}>
                {activeCount}
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Total Receivable</div>
              <div style={{ ...styles.statValue, color: "#1e40af" }}>
                {formatCurrency(totalBalance)}
              </div>
            </div>
          </div>
        );
      }
      case "vendors": {
        const totalBalance = data.reduce((sum, v) => sum + (v.balance || 0), 0);
        const activeCount = data.filter((v) => v.is_active).length;
        return (
          <div style={styles.statsContainer}>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Total Vendors</div>
              <div style={styles.statValue}>{data.length}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Active Vendors</div>
              <div style={{ ...styles.statValue, color: "#166534" }}>
                {activeCount}
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Total Payable</div>
              <div style={{ ...styles.statValue, color: "#92400e" }}>
                {formatCurrency(totalBalance)}
              </div>
            </div>
          </div>
        );
      }
      case "inventory": {
        const lowStock = data.filter(
          (i) => (i.qty_on_hand || 0) <= (i.reorder_point || 0)
        ).length;
        const totalValue = data.reduce(
          (sum, i) => sum + (i.qty_on_hand || 0) * (i.purchase_cost || 0),
          0
        );
        const totalQty = data.reduce((sum, i) => sum + (i.qty_on_hand || 0), 0);
        return (
          <div style={styles.statsContainer}>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Total Items</div>
              <div style={styles.statValue}>{data.length}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Total Quantity</div>
              <div style={styles.statValue}>{totalQty}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Low Stock Items</div>
              <div style={{ ...styles.statValue, color: "#991b1b" }}>
                {lowStock}
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Inventory Value</div>
              <div style={{ ...styles.statValue, color: "#1e40af" }}>
                {formatCurrency(totalValue)}
              </div>
            </div>
          </div>
        );
      }
      case "accounts": {
        return (
          <div style={styles.statsContainer}>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Total Accounts</div>
              <div style={styles.statValue}>{data.length}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Total Assets</div>
              <div style={{ ...styles.statValue, color: "#166534" }}>
                {formatCurrency(accountsSummary.total_assets || 0)}
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Total Liabilities</div>
              <div style={{ ...styles.statValue, color: "#92400e" }}>
                {formatCurrency(accountsSummary.total_liabilities || 0)}
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Net Income</div>
              <div style={{ ...styles.statValue, color: "#1e40af" }}>
                {formatCurrency(accountsSummary.net_income || 0)}
              </div>
            </div>
          </div>
        );
      }
      default:
        return null;
    }
  };
  const handlePurchaseOrderModeToggle = (mode) => {
    setPurchaseOrderMode(mode);
    fetchPurchaseOrders(mode);
  };
  const renderTable = () => {
    if (loading) {
      return (
        <div style={styles.loadingOverlay}>
          <div style={styles.spinner}></div>
          <div>Loading...</div>
        </div>
      );
    }
    if (error) {
      return (
        <div style={styles.errorContainer}>
          <div>Error: {error}</div>
          <button
            style={styles.retryBtn}
            onClick={() => fetchDataForTab(activeTab)}
          >
            Retry
          </button>
        </div>
      );
    }

    const data = getFilteredData();
    // if (data.length === 0) {
    //   return (
    //     <div style={styles.noData}>No {activeTab.replace("-", " ")} found.</div>
    //   );
    // }
    switch (activeTab) {
      case "invoices":
  if (data.length === 0) {
    return <div style={styles.noData}>No invoices found</div>;
  }
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Invoice #</th>
          <th style={styles.th}>Customer</th>
          <th style={styles.th}>Date</th>
          <th style={styles.th}>Due Date</th>
          <th style={styles.th}>Subtotal</th>
          <th style={styles.th}>Discount</th>
          <th style={styles.th}>Total Amount</th>
          <th style={styles.th}>Balance</th>
          <th style={styles.th}>Status</th>
          <th style={styles.th}>Billing Address</th> {/* Add back */}
          <th style={styles.th}>Shipping Address</th> {/* Add back */}
        </tr>
      </thead>
      <tbody>
        {data.map((inv) => (
          <tr
            key={inv.id}
            style={styles.clickableRow}
            onClick={() => fetchInvoiceDetails(inv.id)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#f9fafb")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "")
            }
          >
            <td style={{ ...styles.td, fontWeight: "600", color: "#2d8a4e" }}>
              {inv.doc_number || inv.id}
            </td>
            <td style={styles.td}>{inv.customer_name || "-"}</td>
            <td style={styles.td}>{formatDate(inv.issue_date)}</td>
            <td style={styles.td}>{formatDate(inv.due_date)}</td>
            <td style={{ ...styles.td, fontWeight: "500" }}>
              {formatCurrency(inv.subtotal)}
            </td>
            <td style={{ 
              ...styles.td, 
              fontWeight: "500",
              color: inv.discount > 0 ? "#991b1b" : "#6b7280"
            }}>
              {formatCurrency(inv.discount)}
            </td>
            <td style={{ 
              ...styles.td, 
              fontWeight: "600",
              color: "#166534"
            }}>
              {formatCurrency(inv.total_amount)}
            </td>
            <td style={{ ...styles.td, fontWeight: "500" }}>
              {formatCurrency(inv.balance_due)}
            </td>
            <td style={styles.td}>
              <span style={getStatusBadgeStyle(inv.payment_status, "payment")}>
                {inv.payment_status || "Unknown"}
              </span>
            </td>
            <td style={styles.td}>
              {formatAddress(inv.billing_address)}
            </td>
            <td style={styles.td}>
              {formatAddress(inv.shipping_address)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
      case "customers":
        if (data.length === 0) {
          return <div style={styles.noData}>No customers found</div>;
        }
        return (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Company</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Balance</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((cust) => (
                <tr
                  key={cust.id}
                  style={styles.clickableRow}
                  onClick={() => fetchCustomerDetails(cust.id)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f9fafb")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "")
                  }
                >
                  <td style={{ ...styles.td, fontWeight: "600" }}>
                    {cust.display_name || "-"}
                  </td>
                  <td style={styles.td}>{cust.company_name || "-"}</td>
                  <td style={styles.td}>{cust.email || "-"}</td>
                  <td style={styles.td}>{cust.phone || "-"}</td>
                  <td style={{ ...styles.td, fontWeight: "500" }}>
                    {formatCurrency(cust.balance)}
                  </td>
                  <td style={styles.td}>
                    <span style={getStatusBadgeStyle(cust.is_active, "active")}>
                      {cust.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "vendors":
        if (data.length === 0) {
          return <div style={styles.noData}>No vendors found</div>;
        }
        return (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Vendor ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Company</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Balance</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((v) => (
                <tr
                  key={v.id}
                  style={styles.clickableRow}
                  onClick={() => fetchVendorDetails(v.id)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f9fafb")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "")
                  }
                >
                  <td
                    style={{
                      ...styles.td,
                      fontFamily: "monospace",
                      fontSize: "12px",
                      color: "#6b7280",
                    }}
                  >
                    {v.id}
                  </td>
                  <td style={{ ...styles.td, fontWeight: "600" }}>
                    {v.display_name || "-"}
                  </td>
                  <td style={styles.td}>{v.company_name || "-"}</td>
                  <td style={styles.td}>{v.email || "-"}</td>
                  <td style={styles.td}>{v.phone || "-"}</td>
                  <td style={{ ...styles.td, fontWeight: "500" }}>
                    {formatCurrency(v.balance)}
                  </td>
                  <td style={styles.td}>
                    <span style={getStatusBadgeStyle(v.is_active, "active")}>
                      {v.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "purchase-orders":
        return (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "20px",
                backgroundColor: "#f9fafb",
                padding: "12px",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  backgroundColor: "#e5e7eb",
                  padding: "4px",
                  borderRadius: "6px",
                }}
              >
                <button
                  style={{
                    padding: "8px 16px",
                    backgroundColor:
                      purchaseOrderMode === "vendors"
                        ? "#2d8a4e"
                        : "transparent",
                    color:
                      purchaseOrderMode === "vendors" ? "white" : "#374151",
                    border: "none",
                    whiteSpace: "nowrap",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    minWidth: "140px",
                    fontWeight: "500",
                    transition: "all 0.2s",
                  }}
                  onClick={() => handlePurchaseOrderModeToggle("vendors")}
                >
                  Vendor POs
                </button>
                <button
                  style={{
                    padding: "10px 20px",
                    backgroundColor:
                      purchaseOrderMode === "customers"
                        ? "#3b82f6"
                        : "transparent",
                    color:
                      purchaseOrderMode === "customers" ? "white" : "#374151",
                    border: "none",
                    whiteSpace: "nowrap",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    minWidth: "140px",
                    fontWeight: "500",
                    transition: "all 0.2s",
                  }}
                  onClick={() => handlePurchaseOrderModeToggle("customers")}
                >
                  Customer POs
                </button>
              </div>
            </div>

            {data.length === 0 ? (
              <div style={styles.noData}>
                No {purchaseOrderMode === "vendors" ? "vendor" : "customer"}{" "}
                purchase orders found
              </div>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>PO #</th>
                    <th style={styles.th}>
                      {purchaseOrderMode === "vendors" ? "Vendor" : "Customer"}
                    </th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>
                      {purchaseOrderMode === "vendors"
                        ? "Expected Date"
                        : "Delivery Date"}
                    </th>
                    <th style={styles.th}>Amount</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((po) => (
                    <tr key={po.id}>
                      <td
                        style={{
                          ...styles.td,
                          fontWeight: "600",
                          color: "#2d8a4e",
                        }}
                      >
                        {po.doc_number || po.id}
                      </td>
                      <td style={styles.td}>
                        {purchaseOrderMode === "vendors"
                          ? po.vendor_name
                          : po.customer_name || "-"}
                      </td>
                      <td style={styles.td}>{formatDate(po.issue_date)}</td>
                      <td style={styles.td}>{formatDate(po.expected_date)}</td>
                      <td style={{ ...styles.td, fontWeight: "500" }}>
                        {formatCurrency(po.total_amount)}
                      </td>
                      <td style={styles.td}>
                        <span style={getStatusBadgeStyle(po.status, "po")}>
                          {po.status || "Open"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        );

      case "bills":
        return (
          <>
            {data.length === 0 ? (
              <div style={styles.noData}>
                No {billMode === "vendors" ? "vendor" : "customer"} bills found
              </div>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Bill #</th>
                    <th style={styles.th}>
                      {billMode === "vendors" ? "Vendor" : "Customer"}
                    </th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Due Date</th>
                    <th style={styles.th}>Amount</th>
                    <th style={styles.th}>Balance</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((bill) => (
                    <tr key={bill.id}>
                      <td style={{ ...styles.td, fontWeight: "600" }}>
                        {bill.doc_number || bill.id}
                      </td>
                      <td style={styles.td}>
                        {billMode === "vendors"
                          ? bill.vendor_name
                          : bill.customer_name || "-"}
                      </td>
                      <td style={styles.td}>{formatDate(bill.issue_date)}</td>
                      <td style={styles.td}>{formatDate(bill.due_date)}</td>
                      <td style={{ ...styles.td, fontWeight: "500" }}>
                        {formatCurrency(bill.total_amount)}
                      </td>
                      <td style={{ ...styles.td, fontWeight: "500" }}>
                        {formatCurrency(bill.balance_due)}
                      </td>
                      <td style={styles.td}>
                        <span
                          style={getStatusBadgeStyle(
                            bill.payment_status,
                            "payment"
                          )}
                        >
                          {bill.payment_status || "Unknown"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        );
      case "payments":
        if (data.length === 0) {
          return <div style={styles.noData}>No payments found</div>;
        }
        return (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Payment ID</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Method</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Deposit Account</th>
              </tr>
            </thead>
            <tbody>
              {data.map((payment) => (
                <tr key={payment.id}>
                  <td style={{ ...styles.td, fontWeight: "600" }}>
                    {payment.id}
                  </td>
                  <td style={styles.td}>{payment.customer_name || "-"}</td>
                  <td style={styles.td}>{formatDate(payment.payment_date)}</td>
                  <td style={styles.td}>{payment.payment_method || "-"}</td>
                  <td
                    style={{
                      ...styles.td,
                      fontWeight: "500",
                      color: "#166534",
                    }}
                  >
                    {formatCurrency(payment.amount)}
                  </td>
                  <td style={styles.td}>{payment.deposit_account || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "inventory":
        if (data.length === 0) {
          return <div style={styles.noData}>No inventory found</div>;
        }
        return (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Item Name</th>
                <th style={styles.th}>SKU</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Qty On Hand</th>
                <th style={styles.th}>Reorder Point</th>
                <th style={styles.th}>Unit Price</th>
                <th style={styles.th}>Cost</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => {
                const isLowStock =
                  (item.qty_on_hand || 0) <= (item.reorder_point || 0);
                return (
                  <tr
                    key={item.id}
                    style={isLowStock ? { backgroundColor: "#fef2f2" } : {}}
                  >
                    <td style={{ ...styles.td, fontWeight: "600" }}>
                      {item.name}
                    </td>
                    <td
                      style={{
                        ...styles.td,
                        fontFamily: "monospace",
                        color: "#6b7280",
                      }}
                    >
                      {item.sku || "-"}
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          padding: "2px 8px",
                          backgroundColor: "#f3f4f6",
                          borderRadius: "4px",
                          fontSize: "12px",
                        }}
                      >
                        {item.type || "-"}
                      </span>
                    </td>
                    <td
                      style={{
                        ...styles.td,
                        fontWeight: "500",
                        color: isLowStock ? "#991b1b" : "inherit",
                      }}
                    >
                      {item.qty_on_hand || 0}
                    </td>
                    <td style={styles.td}>{item.reorder_point || 0}</td>
                    <td style={{ ...styles.td, fontWeight: "500" }}>
                      {formatCurrency(item.unit_price)}
                    </td>
                    <td style={styles.td}>
                      {formatCurrency(item.purchase_cost)}
                    </td>
                    <td style={styles.td}>
                      <span
                        style={getStatusBadgeStyle(
                          isLowStock ? "low" : "instock",
                          "stock"
                        )}
                      >
                        {isLowStock ? "Low Stock" : "In Stock"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        );
      case "accounts":
        if (data.length === 0) {
          return <div style={styles.noData}>No accounts found</div>;
        }
        return (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Account Name</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Sub Type</th>
                <th style={styles.th}>Current Balance</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((account) => (
                <tr key={account.id}>
                  <td style={{ ...styles.td, fontWeight: "600" }}>
                    {account.name}
                  </td>
                  <td style={styles.td}>{account.account_type || "-"}</td>
                  <td style={styles.td}>{account.account_subtype || "-"}</td>
                  <td style={{ ...styles.td, fontWeight: "500" }}>
                    {formatCurrency(account.current_balance)}
                  </td>
                  <td style={styles.td}>
                    <span
                      style={getStatusBadgeStyle(account.is_active, "active")}
                    >
                      {account.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      default:
        return null;
    }
  };
  const fetchInvoiceDetails = async (invoiceId) => {
    if (!invoiceId || !realmId) return;
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_IP}/quickbooks/invoice/details/`,
        { params: { realm_id: realmId, invoice_id: invoiceId } }
      );
      if (response.data.status && response.data.data.success) {
        const invoiceDetails = response.data.data.invoice;
        setSelectedInvoice(invoiceDetails);
        setInvoiceModalOpen(true);
        setLoading(false);
      } else {
        throw new Error(
          response.data.data?.error || "Failed to fetch invoice details"
        );
      }
    } catch (error) {
      setLoading(false);

      console.error("Error fetching invoice details", error);
      Swal.fire(
        "Error",
        error.message || "Failed to fetch invoice details",
        "error"
      );
    }
  };
  const renderInvoiceModal = () => {
    if (!selectedInvoice || !invoiceModalOpen) return null;

    return (
      <div
        style={styles.detailModal}
        onClick={() => setInvoiceModalOpen(false)}
      >
        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div style={styles.modalHeader}>
            <h3 style={{ margin: 0, flex: 1, minWidth: 0 }}>
              Invoice Details - {selectedInvoice.doc_number}
            </h3>
            <button
              style={styles.closeBtn}
              onClick={() => setInvoiceModalOpen(false)}
            >
              ×
            </button>
          </div>

          <div style={styles.detailSection}>
            <div style={styles.detailTitle}>Customer Information</div>
            <div style={styles.detailGrid}>
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Customer</div>
                <div style={styles.detailValue}>
                  {selectedInvoice.customer_name}
                </div>
              </div>
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Email</div>
                <div style={styles.detailValue}>
                  {selectedInvoice.customer_email || "-"}
                </div>
              </div>
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Invoice Date</div>
                <div style={styles.detailValue}>
                  {formatDate(selectedInvoice.issue_date)}
                </div>
              </div>
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Due Date</div>
                <div style={styles.detailValue}>
                  {formatDate(selectedInvoice.due_date)}
                </div>
              </div>
            </div>
          </div>

          <div style={styles.detailSection}>
            <div style={styles.detailTitle}>Financial Summary</div>
            <div style={styles.detailGrid}>
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Subtotal</div>
                <div style={styles.detailValue}>
                  {formatCurrency(selectedInvoice.subtotal)}
                </div>
              </div>
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Tax</div>
                <div style={styles.detailValue}>
                  {formatCurrency(selectedInvoice.tax_amount)}
                </div>
              </div>
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Shipping</div>
                <div style={styles.detailValue}>
                  {formatCurrency(selectedInvoice.shipping)}
                </div>
              </div>
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Total Amount</div>
                <div
                  style={{
                    ...styles.detailValue,
                    fontWeight: "600",
                    color: "#166534",
                  }}
                >
                  {formatCurrency(selectedInvoice.total_amount)}
                </div>
              </div>
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Balance Due</div>
                <div
                  style={{
                    ...styles.detailValue,
                    fontWeight: "600",
                    color:
                      selectedInvoice.balance_due > 0 ? "#92400e" : "#166534",
                  }}
                >
                  {formatCurrency(selectedInvoice.balance_due)}
                </div>
              </div>
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Status</div>
                <div style={styles.detailValue}>
                  <span
                    style={getStatusBadgeStyle(
                      selectedInvoice.payment_status,
                      "payment"
                    )}
                  >
                    {selectedInvoice.payment_status}
                    {selectedInvoice.is_overdue ? " (Overdue)" : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.detailSection}>
            <div style={styles.detailTitle}>
              Line Items ({selectedInvoice.line_items_count})
            </div>
            <table style={{ ...styles.table, fontSize: "13px" }}>
              <thead>
                <tr>
                  <th style={styles.th}>Item</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Quantity</th>
                  <th style={styles.th}>Unit Price</th>
                  <th style={styles.th}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.line_items.map((item, index) => (
                  <tr key={index}>
                    <td style={styles.td}>{item.item_name || "-"}</td>
                    <td style={styles.td}>{item.description || "-"}</td>
                    <td style={styles.td}>{item.quantity}</td>
                    <td style={styles.td}>{formatCurrency(item.unit_price)}</td>
                    <td style={styles.td}>{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedInvoice.linked_payments &&
            selectedInvoice.linked_payments.length > 0 && (
              <div style={styles.detailSection}>
                <div style={styles.detailTitle}>
                  Payments ({selectedInvoice.payment_count})
                </div>
                <table style={{ ...styles.table, fontSize: "13px" }}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Payment Date</th>
                      <th style={styles.th}>Method</th>
                      <th style={styles.th}>Reference</th>
                      <th style={styles.th}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.linked_payments.map((payment) => (
                      <tr key={payment.id}>
                        <td style={styles.td}>
                          {formatDate(payment.payment_date)}
                        </td>
                        <td style={styles.td}>
                          {payment.payment_method || "-"}
                        </td>
                        <td style={styles.td}>
                          {payment.payment_ref_number || "-"}
                        </td>
                        <td style={{ ...styles.td, color: "#166534" }}>
                          {formatCurrency(payment.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>
      </div>
    );
  };
  const renderDetailModal = () => {
    if (!detailModalOpen || !detailData) return null;
    const isCustomer = activeTab === "customers";
    const entity = isCustomer ? detailData.customer : detailData.vendor;
    const transactions = isCustomer ? detailData.invoices : detailData.bills;
    const secondaryData = isCustomer
      ? detailData.payments
      : detailData.purchase_orders;
    return (
      <div style={styles.detailModal} onClick={() => setDetailModalOpen(false)}>
        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div style={styles.modalHeader}>
            <h3 style={{ margin: 0, flex: 1, minWidth: 0 }}>
              {isCustomer ? "Customer" : "Vendor"} Details
            </h3>
            <button
              style={styles.closeBtn}
              onClick={() => setDetailModalOpen(false)}
            >
              ×
            </button>
          </div>
          <div style={styles.detailSection}>
            <div style={styles.detailTitle}>Basic Information</div>
            <div style={styles.detailGrid}>
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Display Name</div>
                <div style={styles.detailValue}>
                  {entity?.display_name || "-"}
                </div>
              </div>
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Company</div>
                <div style={styles.detailValue}>
                  {entity?.company_name || "-"}
                </div>
              </div>
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Email</div>
                <div style={styles.detailValue}>{entity?.email || "-"}</div>
              </div>
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Phone</div>
                <div style={styles.detailValue}>{entity?.phone || "-"}</div>
              </div>
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Balance</div>
                <div style={styles.detailValue}>
                  {formatCurrency(entity?.balance)}
                </div>
              </div>
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Status</div>
                <div style={styles.detailValue}>
                  <span
                    style={getStatusBadgeStyle(entity?.is_active, "active")}
                  >
                    {entity?.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div style={styles.detailSection}>
            <div style={styles.detailTitle}>Address</div>
            <div style={styles.detailGrid}>
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Billing Address</div>
                <div style={styles.detailValue}>
                  {formatAddress(entity?.billing_address)}
                </div>
              </div>
              {isCustomer && (
                <div style={styles.detailItem}>
                  <div style={styles.detailLabel}>Shipping Address</div>
                  <div style={styles.detailValue}>
                    {formatAddress(entity?.shipping_address)}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div style={styles.detailSection}>
            <div style={styles.detailTitle}>
              {isCustomer ? "Invoices" : "Bills"} ({transactions?.length || 0})
            </div>
            {transactions && transactions.length > 0 ? (
              <table style={{ ...styles.table, fontSize: "13px" }}>
                <thead>
                  <tr>
                    <th style={styles.th}>#</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Amount</th>
                    <th style={styles.th}>Balance</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 5).map((txn) => (
                    <tr key={txn.id}>
                      <td style={styles.td}>{txn.doc_number || txn.id}</td>
                      <td style={styles.td}>{formatDate(txn.issue_date)}</td>
                      <td style={styles.td}>
                        {formatCurrency(txn.total_amount)}
                      </td>
                      <td style={styles.td}>
                        {formatCurrency(txn.balance_due)}
                      </td>
                      <td style={styles.td}>
                        <span
                          style={getStatusBadgeStyle(
                            txn.payment_status,
                            "payment"
                          )}
                        >
                          {txn.payment_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ color: "#9ca3af", fontSize: "14px" }}>
                No {isCustomer ? "invoices" : "bills"} found.
              </div>
            )}
          </div>
          <div style={styles.detailSection}>
            <div style={styles.detailTitle}>
              {isCustomer ? "Payments" : "Purchase Orders"} (
              {secondaryData?.length || 0})
            </div>
            {secondaryData && secondaryData.length > 0 ? (
              <table style={{ ...styles.table, fontSize: "13px" }}>
                <thead>
                  <tr>
                    <th style={styles.th}>#</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Amount</th>
                    {!isCustomer && <th style={styles.th}>Status</th>}
                  </tr>
                </thead>
                <tbody>
                  {secondaryData.slice(0, 5).map((item) => (
                    <tr key={item.id}>
                      <td style={styles.td}>{item.doc_number || item.id}</td>
                      <td style={styles.td}>
                        {formatDate(item.payment_date || item.issue_date)}
                      </td>
                      <td style={styles.td}>
                        {formatCurrency(item.amount || item.total_amount)}
                      </td>
                      {!isCustomer && (
                        <td style={styles.td}>
                          <span style={getStatusBadgeStyle(item.status, "po")}>
                            {item.status || "Open"}
                          </span>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ color: "#9ca3af", fontSize: "14px" }}>
                No {isCustomer ? "payments" : "purchase orders"} found.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  const tabs = [
    { id: "invoices", label: "Invoices" },
    { id: "customers", label: "Customers" },
    { id: "vendors", label: "Vendors" },
    { id: "bills", label: "Bills" },
    { id: "payments", label: "Payments" },
    { id: "purchase-orders", label: "Purchase Orders" },
    { id: "inventory", label: "Inventory" },
    { id: "accounts", label: "Chart of Accounts" },
  ];
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>QuickBooks Integration</h2>
        {checkingConnection ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={styles.connectionStatus}>
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  backgroundColor: "#f59e0b",
                  borderRadius: "50%",
                }}
              ></span>
              Checking connection...
            </div>
          </div>
        ) : isConnected ? (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ ...styles.connectionStatus, ...styles.connected }}>
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  backgroundColor: "#166534",
                  borderRadius: "50%",
                }}
              ></span>
              Connected: {companyInfo?.name || realmId}
            </div>
            <button style={styles.disconnectBtn} onClick={handleDisconnect}>
              Disconnect
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ ...styles.connectionStatus, ...styles.disconnected }}>
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  backgroundColor: "#991b1b",
                  borderRadius: "50%",
                }}
              ></span>
              Not Connected
            </div>
            <button style={styles.connectBtn} onClick={handleConnect}>
              Connect to QuickBooks
            </button>
          </div>
        )}
      </div>
      {isConnected ? (
        <>
          <div style={styles.tabContainer}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                style={{
                  ...styles.tab,
                  ...(activeTab === tab.id ? styles.activeTab : {}),
                }}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchQuery("");
                  setStatusFilter("all");
                  setError(null);
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {renderStats()}
          <div style={styles.searchContainer}>
            {activeTab === "purchase-orders" && (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  backgroundColor: "#e5e7eb",
                  padding: "4px",
                  borderRadius: "6px",
                }}
              >
                <button
                  style={{
                    padding: "8px 16px",
                    backgroundColor:
                      purchaseOrderMode === "vendors"
                        ? "#2d8a4e"
                        : "transparent",
                    color:
                      purchaseOrderMode === "vendors" ? "white" : "#374151",
                    border: "none",
                    whiteSpace: "nowrap",
                    minWidth: "140px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                  onClick={() => handlePurchaseOrderModeToggle("vendors")}
                >
                  Vendor POs
                </button>
                <button
                  style={{
                    padding: "8px 16px",
                    backgroundColor:
                      purchaseOrderMode === "customers"
                        ? "#3b82f6"
                        : "transparent",
                    color:
                      purchaseOrderMode === "customers" ? "white" : "#374151",
                    border: "none",
                    whiteSpace: "nowrap",
                    minWidth: "140px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                  onClick={() => handlePurchaseOrderModeToggle("customers")}
                >
                  Customer POs
                </button>
              </div>
            )}

            {activeTab === "bills" && (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  backgroundColor: "#e5e7eb",
                  padding: "4px",
                  minWidth: "140px",

                  borderRadius: "6px",
                }}
              >
                <button
                  style={{
                    padding: "8px 16px",
                    backgroundColor:
                      billMode === "vendors" ? "#2d8a4e" : "transparent",
                    color: billMode === "vendors" ? "white" : "#374151",
                    border: "none",
                    whiteSpace: "nowrap",
                    minWidth: "140px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                  onClick={() => handleBillModeToggle("vendors")}
                >
                  Vendor Bills
                </button>
                <button
                  style={{
                    padding: "8px 16px",
                    backgroundColor:
                      billMode === "customers" ? "#3b82f6" : "transparent",
                    color: billMode === "customers" ? "white" : "#374151",
                    border: "none",
                    whiteSpace: "nowrap",
                    minWidth: "140px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                  onClick={() => handleBillModeToggle("customers")}
                >
                  Customer Bills
                </button>
              </div>
            )}
            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                marginLeft: "auto",
              }}
            >
              <input
                type="text"
                placeholder={`Search ${activeTab.replace("-", " ")}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={styles.filterSelect}
              >
                {getFilterOptions().map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <div style={styles.refreshContainer}>
                {activeTab === "inventory" && (
                  <button style={styles.syncBtn} onClick={handleSyncProducts}>
                    Sync Products
                  </button>
                )}
                <button
                  style={styles.refreshBtn}
                  onClick={() => fetchDataForTab(activeTab)}
                  disabled={loading}
                >
                  ↻ Refresh
                </button>
              </div>
            </div>
          </div>
          <div
            style={{
              overflowX: "auto",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
            }}
          >
            {renderTable()}
          </div>
        </>
      ) : (
        <div style={styles.noData}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔗</div>
          <div
            style={{ fontSize: "18px", fontWeight: "500", marginBottom: "8px" }}
          >
            Connect to QuickBooks
          </div>
          <div style={{ color: "#9ca3af" }}>
            Click the "Connect to QuickBooks" button above to get started.
          </div>
        </div>
      )}
      {renderDetailModal()}
      {renderInvoiceModal()}
    </div>
  );
};
export default QuickBooks;
