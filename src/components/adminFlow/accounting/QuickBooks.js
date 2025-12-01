import React, { useEffect, useState } from "react";
const styles = {
  container: {
    backgroundColor: "white",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    borderRadius: "12px",
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
  },
  title: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "24px",
    color: "#1a1a2e",
  },
  tabContainer: {
    display: "flex",
    gap: "8px",
    marginBottom: "24px",
    borderBottom: "2px solid #e5e7eb",
    paddingBottom: "0",
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
  },
  activeTab: {
    color: "#2d8a4e",
    borderBottomColor: "#2d8a4e",
    fontWeight: "600",
  },
  searchContainer: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  searchInput: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    width: "280px",
    fontSize: "14px",
    outline: "none",
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
  },
  refreshBtn: {
    padding: "10px 20px",
    backgroundColor: "#2d8a4e",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "8px",
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
  pendingStatus: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
  },
  overdueStatus: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
  openStatus: {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
  },
  closedStatus: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },
  partialStatus: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
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
  actionBtn: {
    padding: "6px 10px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: "#6b7280",
    borderRadius: "4px",
    transition: "background 0.2s",
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
  },
};
const QuickBooks = () => {
  const [activeTab, setActiveTab] = useState("invoices");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };
  const fetchData = () => {
    try {
      setInvoices([]);
      setPurchaseOrders([]);
      setVendors([]);
      setCustomers([]);
      setStatusFilter([]);
      setSearchQuery([]);
      setLoading([]);
setActiveTab("invoices");
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleRefresh = () => {
    setSearchQuery("");
    setStatusFilter("all");
    fetchData();
  };
  const getFilteredInvoices = () => {
    return invoices.filter((inv) => {
      const matchSearches =
        inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "all" || inv.status === statusFilter;
      return matchSearches && matchStatus;
    });
  };
  const getFilteredCustomers = () => {
    return customers.filter((cust) => {
      const matchSearches =
        cust.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cust.emailName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && cust.active) ||
        (statusFilter === "inactive" && !cust.active);
      return matchSearches && matchStatus;
    });
  };
  const getFilteredVendors = () => {
    return vendors.filter((v) => {
      const matchSearches =
        v.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.companyName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && v.active) ||
        (statusFilter === "inactive" && !v.active);
      return matchSearches && matchStatus;
    });
  };
  const getFilteredPurchaseOrders = () => {
    return purchaseOrders.filter((p) => {
      const matchSearches =
        p.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      return matchSearches && matchStatus;
    });
  };
  const getFilteredInventory = () => {
    return inventory.filter((item) => {
      const matchSearches =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "low" && item.quantityOnHand <= item.reorderPoint) ||
        (statusFilter === "instock" && item.quantityOnHand > item.reorderPoint);
      return matchSearches && matchStatus;
    });
  };
  const getStatusBadgeStyle = (status, type) => {
    const baseStyle = styles.statuBadge;
    if (type === "invoice") {
      if (status === "paid") return { ...baseStyle, ...styles.paidStatus };
      if (status === "pending")
        return { ...baseStyle, ...styles.pendingStatus };
      if (status === "overdue")
        return { ...baseStyle, ...styles.overdueStatus };
    }
    if (type === "po") {
      if (status === "closed") return { ...baseStyle, ...styles.closedStatus };
      if (status === "open") return { ...baseStyle, ...styles.openStatus };
      if (status === "partial")
        return { ...baseStyle, ...styles.partialStatus };
    }
    if (type === "active") {
      return status === "true"
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
  const getFilterOptions=()=>{
    switch(activeTab)
    {
        case 'invoices':
            return [
                {value:'all',label:'All Status'},
                {value:'paid',label:"Paid"},
                {value:'overdue',label:'Overdue'},
                {value:'pending',label:'Pending'}

            ]   
        case 'customers':
        case 'vendors':
            return [
                {value:'all',label:"All Status"},
                {value:'active',label:"Active"},
                {value:'inactive',label:"Inactive"}
            ]
        case 'purchase-orders':
            return [
                {value:'all',label:"All Status"},
                {value:'open',label:"Open"},
                {value:'partial',label:"Partial"},
                {value:'partial',label:"Closed"}
            ]
        case 'inventory':
            return [
                {value:'all',label:"All Items"},
                {value:'low',label:"Low Stock"},
                {value:'instock',label:"In Stock"}
            ]
        default:
            return []
    }
  }
  const renderStats=()=>{
    switch(activeTab){
        case 'invoices':{
            const filtered=getFilteredInvoices()
            const total=filtered.reduce((sum,inv)=>sum+inv.amount,0)
            const balance=filtered.reduce((sum,inv)=>sum+inv.balance,0)
            return (
                <div style={styles.statsContainer}>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>Total Invoices</div>
                        <div style={styles.statValue}>{filtered.length}</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>Total Amount</div>
                        <div style={{...styles.statValue,color:"#166534"}}>{formatCurrency(total)}</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>OutStanding Balance</div>
                        <div style={{...styles.statValue,color:"#92400e"}}>{formatCurrency(balance)}</div>
                    </div>
                </div>
            )
        }
        case 'customers':{
            const filtered=getFilteredCustomers()
            const totalBalance = filtered.reduce((sum, c) => sum + c.balance, 0);
            const activeCount = filtered.filter(c => c.active).length;
            return (
                <div style={styles.statsContainer}>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>Total Customers</div>
                        <div style={styles.statValue}>{filtered.length}</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>Active Customers</div>
                        <div style={{...styles.statValue,color:"#166534"}}>{activeCount}</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>OutStanding Balance</div>
                        <div style={{...styles.statValue,color:"#1e40af"}}>{formatCurrency(totalBalance)}</div>
                    </div>
                </div>
            )
        }
        case 'vendors':{
            const filtered=getFilteredVendors()
            const totalBalance = filtered.reduce((sum, c) => sum + c.balance, 0);
            const activeCount = filtered.filter(c => c.active).length;
            return (
                <div style={styles.statsContainer}>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>Total Vendors</div>
                        <div style={styles.statValue}>{filtered.length}</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>Active Vendors</div>
                        <div style={{...styles.statValue,color:"#166534"}}>{activeCount}</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>Total Payable</div>
                        <div style={{...styles.statValue,color:"#92400e"}}>{formatCurrency(totalBalance)}</div>
                    </div>
                </div>
            )
        }
        case 'purchase-orders':{
            const filtered=getFilteredPurchaseOrders()
            const totalBalance = filtered.reduce((sum, c) => sum + c.balance, 0);
            const activeCount = filtered.filter(c => c.status==='open').length;
            return (
                <div style={styles.statsContainer}>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>Total POs</div>
                        <div style={styles.statValue}>{filtered.length}</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>Open Orders</div>
                        <div style={{...styles.statValue,color:"#1e40af"}}>{activeCount}</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>Total Value</div>
                        <div style={{...styles.statValue,color:"#92400e"}}>{formatCurrency(totalBalance)}</div>
                    </div>
                </div>
            )
        }
        case 'inventory':{
            const filtered=getFilteredInventory()
            const lowStock=filtered.filter(i=>i.quantityOnHand<=i.reorderPoint).length
            const totalValue = filtered.reduce((sum, i) => sum + (i.quantityOnHand * i.costPrice), 0);
            return (
                <div style={styles.statsContainer}>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>Total Items</div>
                        <div style={styles.statValue}>{filtered.length}</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>Low Stock Items</div>
                        <div style={{...styles.statValue,color:"#1e40af"}}>{lowStock}</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>Inventory Value</div>
                        <div style={{...styles.statValue,color:"#92400e"}}>{formatCurrency(totalValue)}</div>
                    </div>
                </div>
            )
        }
        default:
            return null
    }
  }
   const renderTable = () => {
    if (loading) {
      return <div style={styles.loadingOverlay}>Loading data...</div>;
    }

    switch (activeTab) {
      case 'invoices': {
        const data = getFilteredInvoices();
        if (data.length === 0) return <div style={styles.noData}>No invoices found.</div>;
        return (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Invoice #</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Due Date</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Balance</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map(inv => (
                <tr key={inv.id}>
                  <td style={{ ...styles.td, fontWeight: '600', color: '#2d8a4e' }}>{inv.invoiceNumber}</td>
                  <td style={styles.td}>{inv.customerName}</td>
                  <td style={styles.td}>{inv.date}</td>
                  <td style={styles.td}>{inv.dueDate}</td>
                  <td style={{ ...styles.td, fontWeight: '500' }}>{formatCurrency(inv.amount)}</td>
                  <td style={{ ...styles.td, fontWeight: '500' }}>{formatCurrency(inv.balance)}</td>
                  <td style={styles.td}>
                    <span style={getStatusBadgeStyle(inv.status, 'invoice')}>
                      {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      }
      case 'customers': {
        const data = getFilteredCustomers();
        if (data.length === 0) return <div style={styles.noData}>No customers found.</div>;
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
              {data.map(cust => (
                <tr key={cust.id}>
                  <td style={{ ...styles.td, fontWeight: '600' }}>{cust.displayName}</td>
                  <td style={styles.td}>{cust.companyName}</td>
                  <td style={styles.td}>{cust.email}</td>
                  <td style={styles.td}>{cust.phone}</td>
                  <td style={{ ...styles.td, fontWeight: '500' }}>{formatCurrency(cust.balance)}</td>
                  <td style={styles.td}>
                    <span style={getStatusBadgeStyle(cust.active.toString(), 'active')}>
                      {cust.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      }
      case 'vendors': {
        const data = getFilteredVendors();
        if (data.length === 0) return <div style={styles.noData}>No vendors found.</div>;
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
              {data.map(v => (
                <tr key={v.id}>
                  <td style={{ ...styles.td, fontWeight: '600' }}>{v.displayName}</td>
                  <td style={styles.td}>{v.companyName}</td>
                  <td style={styles.td}>{v.email}</td>
                  <td style={styles.td}>{v.phone}</td>
                  <td style={{ ...styles.td, fontWeight: '500' }}>{formatCurrency(v.balance)}</td>
                  <td style={styles.td}>
                    <span style={getStatusBadgeStyle(v.active.toString(), 'active')}>
                      {v.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      }
      case 'purchase-orders': {
        const data = getFilteredPurchaseOrders();
        if (data.length === 0) return <div style={styles.noData}>No purchase orders found.</div>;
        return (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>PO #</th>
                <th style={styles.th}>Vendor</th>
                <th style={styles.th}>Order Date</th>
                <th style={styles.th}>Expected Date</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map(po => (
                <tr key={po.id}>
                  <td style={{ ...styles.td, fontWeight: '600', color: '#2d8a4e' }}>{po.poNumber}</td>
                  <td style={styles.td}>{po.vendorName}</td>
                  <td style={styles.td}>{po.date}</td>
                  <td style={styles.td}>{po.expectedDate}</td>
                  <td style={{ ...styles.td, fontWeight: '500' }}>{formatCurrency(po.amount)}</td>
                  <td style={styles.td}>
                    <span style={getStatusBadgeStyle(po.status, 'po')}>
                      {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      }
      case 'inventory': {
        const data = getFilteredInventory();
        if (data.length === 0) return <div style={styles.noData}>No inventory items found.</div>;
        return (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Item Name</th>
                <th style={styles.th}>SKU</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Qty On Hand</th>
                <th style={styles.th}>Reorder Point</th>
                <th style={styles.th}>Unit Price</th>
                <th style={styles.th}>Cost</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => {
                const isLowStock = item.quantityOnHand <= item.reorderPoint;
                return (
                  <tr key={item.id} style={isLowStock ? { backgroundColor: '#fef2f2' } : {}}>
                    <td style={{ ...styles.td, fontWeight: '600' }}>{item.name}</td>
                    <td style={{ ...styles.td, fontFamily: 'monospace', color: '#6b7280' }}>{item.sku}</td>
                    <td style={styles.td}>
                      <span style={{ padding: '2px 8px', backgroundColor: '#f3f4f6', borderRadius: '4px', fontSize: '12px' }}>
                        {item.category}
                      </span>
                    </td>
                    <td style={{ ...styles.td, fontWeight: '500', color: isLowStock ? '#991b1b' : 'inherit' }}>
                      {item.quantityOnHand}
                    </td>
                    <td style={styles.td}>{item.reorderPoint}</td>
                    <td style={{ ...styles.td, fontWeight: '500' }}>{formatCurrency(item.unitPrice)}</td>
                    <td style={styles.td}>{formatCurrency(item.costPrice)}</td>
                    <td style={styles.td}>
                      <span style={getStatusBadgeStyle(isLowStock ? 'low' : 'instock', 'stock')}>
                        {isLowStock ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        );
      }
      default:
        return null;
    }
  };

  const tabs = [
  { id: 'invoices', label: 'Invoices' },
  { id: 'customers', label: 'Customers' },
  { id: 'vendors', label: 'Vendors' },
  { id: 'purchase-orders', label: 'Purchase Orders' },
  { id: 'inventory', label: 'Inventory' },
];


  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Accounts</h2>

      {/* Tabs */}
      <div style={styles.tabContainer}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            style={{
              ...styles.tab,
              ...(activeTab === tab.id ? styles.activeTab : {}),
            }}
            onClick={() => {
              setActiveTab(tab.id);
              setSearchQuery('');
              setStatusFilter('all');
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      {renderStats()}

      {/* Search & Filters */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder={`Search ${activeTab.replace('-', ' ')}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.filterSelect}
        >
          {getFilterOptions().map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button style={styles.refreshBtn} onClick={handleRefresh}>
          ↻ Refresh
        </button>
        {/* <button style={styles.exportBtn}>
          ⬇ Export
        </button> */}
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: '10px' }}>
        {renderTable()}
      </div>
    </div>
  );
};

export default QuickBooks;

  


