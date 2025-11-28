import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ProductList.css";
import axiosInstance from "../../../../src/utils/axiosConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faFilter,
  faSlidersH,
  faSort,
  faClone,
  faEye,
  faEyeSlash,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import Soon from "../../../assets/image_2025_01_02T08_51_07_818Z.png";
import Swal from "sweetalert2";

const ProductList = () => {
  const [responseData, setResponseData] = useState([]);
  const [responseDataForProductsIds, setResponseDataForProductsIds] = useState(
    []
  );
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortOption, setSortOption] = useState(""); // default value to 'newest'
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(""); // The selected variant type
  const [selectedCategoryId, setSelectedCategoryId] = useState(""); // The selected category ID
  const [selectedOptionValue, setSelectedOptionValue] = useState("");
  const [variants, setVariants] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [searchVisible, setSearchVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  const [sortVisiblebyVariant, setsortVisiblebyVariant] = useState(false);
  const [showText, setShowText] = useState(false);
  const [hoveredProductId, setHoveredProductId] = useState(null); // Track hovered product ID
  const [hoveredVisibilityId, setHoveredVisibilityId] = useState(null); // Track hovered visibility icon
  const [showTextCategories, setShowTextCategories] = useState(false);
  const [showTextForVariant, setshowTextForVariant] = useState(false);
  const [productCount, setProductCounts] = useState(0);
  const BrandId = queryParams.get("brandID");
  const [filteredCategoriesdropdown, setFilteredCategories] = useState([]);
  const UserRole = localStorage.getItem("user_role");
  let pageFromUrl = parseInt(queryParams.get("page")) || 1; // Default to 1 if not present or invalid
  // useEffect(() => {
  // pageFromUrl = parseInt(queryParams.get('page')) || 1; // Ensuring it's treated as an integer, default to 1 if invalid
  // }, [queryParams]);
  const itemsPerPage = 25; // Number of items per page

  const controllerRef = useRef(null);
  const isInitialMount=useRef(true)

  const handleVisibilityToggle = async (e, product) => {
    e.stopPropagation(); // Prevent click propagation if necessary
    // Toggle the visibility based on the current state of `is_active`
    const updatedVisibility = !product.is_active;
    // Update local state immediately
    setResponseData((prevData) =>
      prevData.map((item) =>
        item.product_id === product.product_id
          ? { ...item, is_active: updatedVisibility }
          : item
      )
    ); // Show confirmation dialog with SweetAlert
    Swal.fire({
      title: `Are you sure you want to ${
        updatedVisibility ? "enable" : "disable"
      } the selected product?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: `Yes, ${updatedVisibility ? "enable" : "disable"} it`,
      cancelButtonText: "No, stay",
      customClass: {
        container: "swal-custom-container",
        popup: "swal-custom-popup",
        title: "swal-custom-title",
        confirmButton: "swal-custom-confirm",
        cancelButton: "swal-custom-cancel",
      },
    }).then((result) => {
      // If the user clicks "Yes", then call the API to update the product status
      if (result.isConfirmed) {
        const payload = {
          id: product.product_id,
          is_active: updatedVisibility,
        };
        // Call the API to update product visibility in the backend
        axiosInstance
          .post(
            `${process.env.REACT_APP_IP}/UpdateProductActiveInActive/`,
            payload
          )
          .then((response) => {
            if (
              response.data &&
              response.data.data &&
              response.data.data.is_update
            ) {
              // After successful update, optionally refetch data or update UI
              const filter = true;
              fetchData({ filter });
              Swal.fire({
                title: "Success!",
                text: `The product has been ${
                  updatedVisibility ? "enabled" : "disabled"
                }.`,
                icon: "success",
                customClass: {
                  container: "swal-custom-container",
                  popup: "swal-custom-popup",
                  title: "swal-custom-title",
                  confirmButton: "swal-custom-confirm",
                  cancelButton: "swal-custom-cancel",
                },
              });
            } else {
              alert("Unexpected response structure");
            }
          })
          .catch((err) => {
            setError(err.message);
            Swal.fire({
              title: "Error",
              text: "There was an issue updating the product status.",
              icon: "error",
              customClass: {
                container: "swal-custom-container",
                popup: "swal-custom-popup",
                title: "swal-custom-title",
                confirmButton: "swal-custom-confirm",
                cancelButton: "swal-custom-cancel",
              },
            });
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        // If the user clicks "No, stay", revert the local state change
        setResponseData((prevData) =>
          prevData.map((item) =>
            item.product_id === product.product_id
              ? { ...item, is_active: !updatedVisibility }
              : item
          )
        );
        Swal.fire({
          title: "Cancelled",
          text: "No changes were made.",
          icon: "info",
          customClass: {
            container: "swal-custom-container",
            popup: "swal-custom-popup",
            title: "swal-custom-title",
            confirmButton: "swal-custom-confirm",
            cancelButton: "swal-custom-cancel",
          },
        });
      }
    });
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };
  const handleSortChange = async (event) => {
    const selectedOption = event.target.value;
    if (selectedOption) {
      setSortOption(selectedOption);
      const filter = selectedOption === "newest" ? true : false;
      fetchData({ filter, search: searchQuery, pg: pageFromUrl });
    } else {
      setSortOption("");
    }
  };
  const fetchData = async (params = {}) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_IP}/obtainAllProductList/`,
        { params }
      );
      console.log("obtainAllProductList", response);
      if (
        response.data &&
        response.data.data &&
        response.data.data.product_list
      ) {
        setProductCounts(response.data.data.product_count);
        // if (response.data.data.product_count <= 25 && location.pathname==='/Admin/allproducts' ) {
        //     navigate(`/Admin/allproducts?page=1`);
        // }
        setResponseData(response.data.data.product_list);
        setResponseDataForProductsIds(response.data.data.product_id_list || []);
      } else {
        alert("Unexpected response structure");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_IP}/obtainAllLastLevelIds/`
      );
      setCategories(response.data.data.last_level_category || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_IP}/obtainBrand/`
      );
      setBrands(response.data.data.brand_list || []);
    } catch (err) {
      console.error("Error fetching brands:", err);
    }
  };
  const fetchVariants = async (selectedCategoryId) => {
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_IP}/obtainVarientOptions/`,
        {
          params: selectedCategoryId ? { id: selectedCategoryId } : {},
        }
      );
      setVariants(response.data.data.varient_list || []);
    } catch (err) {
      console.error("Error fetching brands:", err);
    }
  };

  const handleCategoryChange = async (event) => {
    const selectedCategoryId = event.target.value;
    setSelectedCategory(selectedCategoryId);
    if (selectedCategoryId !== "") {
      fetchVariants(selectedCategoryId); // Fetch variants based on selected category
      fetchData({
        category_id: selectedCategoryId,
        search: searchQuery,
        pg: 1,
      });
      const params = {
        ...(selectedCategoryId && { category_id: selectedCategoryId }),
        ...(selectedBrand && { brand_id: selectedBrand }),
        ...(selectedVariant && { variant_option_name_id: selectedVariant }),
        ...(searchQuery && { search: searchQuery }),
        pg: 1,
      };
      fetchData(params);
    } else {
      fetchData({ search: searchQuery, pg: pageFromUrl });
    }
  };

  const handleBrandChange = async (event) => {
    const selectedBrandId = event.target.value;
    setSelectedBrand(selectedBrandId);
    if (selectedBrandId !== "") {
      const params = {
        ...(selectedCategory && { category_id: selectedCategory }),
        ...(selectedBrandId && { brand_id: selectedBrandId }),
        ...(selectedVariant && { variant_option_name_id: selectedVariant }),
        ...(searchQuery && { search: searchQuery }),
        pg: 1,
      };
      fetchData(params);
    } else {
      fetchData({ search: searchQuery, pg: pageFromUrl });
    }
  };
  const handleVariantChange = async (event) => {
    const selectedVariantId = event.target.value;
    const selectedCategoryId =
      event.target.selectedOptions[0].dataset.categoryId;
    setSelectedCategoryId(selectedCategoryId);
    setSelectedVariant(selectedVariantId);
    if (selectedVariantId !== "") {
      const params = {
        ...(selectedCategory ||
          (selectedCategoryId && {
            category_id: selectedCategory || selectedCategoryId,
          })),
        ...(selectedBrand && { brand_id: selectedBrand }),
        ...(selectedVariantId && { variant_option_name_id: selectedVariantId }),
        ...(searchQuery && { search: searchQuery }),
        pg: 1,
      };

      fetchData(params);
    } else {
      fetchData({ search: searchQuery, pg: pageFromUrl });
    }
  };
  const handleOptionValueChange = (e) => {
    setSelectedOptionValue(e.target.value);
    if (e.target.value !== "") {
      const params = {
        ...(selectedCategory ||
          (selectedCategoryId && {
            category_id: selectedCategory || selectedCategoryId,
          })),
        ...(selectedBrand && { brand_id: selectedBrand }),
        ...(selectedVariant && { variant_option_name_id: selectedVariant }),
        variant_option_value_id: e.target.value,
        ...(searchQuery && { search: searchQuery }),
        pg: 1,
      };
      fetchData(params);
    }
  };
  const handleProductSelect = (productId) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/Admin/product/${productId}`);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allProductIds = responseData.map((item) => item.product_id);
      setSelectedProducts(allProductIds);
      handleCombinationSelectCategory();
    } else {
      setSelectedProducts([]);
    }
  };
  const handleCombinationSelectCategory = async () => {
    const payload = {};
    try {
      const res = await axiosInstance.get(
        `${process.env.REACT_APP_IP}/obtainListofCategoryCombinations/`,
        { payload }
      );
      console.log(res, "response here ");
      setFilteredCategories(res.data.data.last_all_ids || []);
    } catch (err) {
      console.log("ERROR", err);
    }
  };
  const handleClearSelected = () => {
    setSelectedProducts([]);
  };
  const handleTaxonomySelect = async (e) => {
    const selectedValue = JSON.parse(e.target.value);

    const { value: productChoice } = await Swal.fire({
      title: `Change taxonomy for products`,
      html: `
      <p>Are you sure you want to change the taxonomy for:</p>
      <div style="text-align: center; margin: 15px 0px 0px 0px;">
        <input type="radio" name="productChoice" class='includeInactiveProducts' id="selected" value="selected">
        <label for="selected">${selectedProducts.length} selected products</label><br>
        <input type="radio" name="productChoice" class='includeInactiveProducts' id="all" value="all">
        <label for="all" style="margin:0px 69px 0px 0px">All products</label>
      </div>
    `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const choice = document.querySelector(
          'input[name="productChoice"]:checked'
        );
        if (!choice) {
          Swal.showValidationMessage("Please select an option");
          return false;
        }
        return choice.value;
      },
      customClass: {
        container: "swal-custom-container",
        popup: "swal-custom-popup",
        title: "swal-custom-title",
        confirmButton: "swal-custom-confirm-variant",
        cancelButton: "swal-custom-cancel",
      },
    });

    if (!productChoice) return;

    try {
      const payload = {
        product_ids:
          productChoice === "selected"
            ? selectedProducts
            : responseDataForProductsIds,
        category_id: selectedValue.id,
        category_level: selectedValue.category_level_str,
      };

      const res = await axiosInstance.post(
        `${process.env.REACT_APP_IP}/updateCategoryToProducts/`,
        payload
      );

      console.log("Taxonomy updated:", res.data);

      await Swal.fire({
        title: "Success!",
        text: "Taxonomy updated successfully!",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          container: "swal-custom-container",
          popup: "swal-custom-popup",
          title: "swal-custom-title",
          confirmButton: "swal-custom-confirm",
          cancelButton: "swal-custom-cancel",
        },
      });

      fetchData({ filter: true, search: searchQuery, pg: pageFromUrl });
      setSelectedProducts([]); // Clear selected products after update
    } catch (error) {
      console.error("Failed to update taxonomy", error);
      Swal.fire({
        title: "Error!",
        text: "There was an error updating the taxonomy.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
    handleCombinationSelectCategory();
  };
  const handleCategorySortClick = () => {
    setSortVisible(!sortVisible);
    if (searchVisible) {
      setSearchVisible(!searchVisible);
    }
    if (sortVisiblebyVariant) {
      setsortVisiblebyVariant(!sortVisiblebyVariant);
    }
  };
  const handleBrandSortClick = () => {
    setSearchVisible(!searchVisible);
    if (sortVisible) {
      setSortVisible(!sortVisible);
    }
    if (sortVisiblebyVariant) {
      setsortVisiblebyVariant(!sortVisiblebyVariant);
    }
  };
  const handleVariantSortClick = () => {
    setsortVisiblebyVariant(!sortVisiblebyVariant);
    if (sortVisible) {
      setSortVisible(!sortVisible);
    }
    if (searchVisible) {
      setSearchVisible(!searchVisible);
    }
  };
  useEffect(() => {
    if (loading) {
      setProductCounts(0);
    }
  }, [productCount, loading]);

  useEffect(() => {
    if(isInitialMount.current)
    {
      return
    }
    const delayDebounce = setTimeout(() => {
      if (searchQuery !== "") {
        fetchSearchResults(searchQuery);
      } else {
        const params = {
          filter: true,
          pg: 1,
          ...(selectedBrand ||
            (BrandId && { brand_id: selectedBrand || BrandId })),
          ...(selectedCategory && { category_id: selectedCategory }),
          ...(selectedVariant && { variant_option_name_id: selectedVariant }),
        };

        fetchData(params);
      }
    }, 400); // Debounce delay

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const fetchSearchResults = async (query) => {
    // Abort previous request if exists
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    // Create new controller
    controllerRef.current = new AbortController();
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_IP}/obtainAllProductList/`,
        {
          params: {
            search: query,
            ...(selectedCategory ? { id: selectedCategory } : {}),
            ...(selectedBrand ? { brand_id: selectedBrand } : {}),
            ...(selectedVariant
              ? { variant_option_name_id: selectedVariant }
              : {}),
          },
          signal: controllerRef.current.signal,
        }
      );
      setResponseData(response.data.data.product_list);
      setResponseDataForProductsIds(response.data.data.product_id_list || []);
      setProductCounts(response.data.data.product_count);
    } catch (error) {
      if (axiosInstance.isCancel?.(error) || error.name === "CanceledError") {
        console.log("Previous request aborted.");
      } else {
        console.error("Error fetching product list:", error);
      }
    } finally {
      setLoading(false);
    }
  };
  // const handleSearchChange = async(event) => {
  //    setSearchQuery(event.target.value);
  //    const query = event.target.value;
  //    if (query !== '') {
  //      setLoading(true);
  //      setResponseData([]);
  //    }
  //    try {
  //      const response = await axiosInstance.get(
  //        `${process.env.REACT_APP_IP}/obtainAllProductList/`,
  //        {
  //          params: {
  //            search:query
  //          }
  //        }
  //      );
  //      setResponseData(response.data.data.product_list);
  //      setProductCounts(response.data.data.product_count);
  //      setLoading(false);
  //      console.log('Response', responseData);
  //    } catch (error) {
  //      console.error('Error fetching product list:', error);
  //    }
  //   };
  // const filteredProducts = responseData.filter((product) => {
  //   const productName = product.product_name?.toLowerCase() || '';
  //   const model = product.model?.toLowerCase() || '';
  //   const brand = product.brand?.toLowerCase() || '';
  //   const tags = product.category_name?.toLowerCase() || '';
  //   const mpn = product.mpn?.toLowerCase() || '';
  //   const query = searchQuery.toLowerCase();
  //   return (
  //     productName.includes(query) ||
  //     model.includes(query) ||
  //     brand.includes(query) ||
  //     tags.includes(query) ||
  //     mpn.includes(query)
  //   );
  // });

  // let sortedProducts = [...filteredProducts].sort((a, b) => {
  //   if (!sortColumn) return 0;
  //   const aValue = a[sortColumn] ? a[sortColumn].toString().toLowerCase() : '';
  //   const bValue = b[sortColumn] ? b[sortColumn].toString().toLowerCase() : '';
  //       if (aValue === bValue) return 0;
  //       return (aValue > bValue ? 1 : -1) * (sortOrder === "asc" ? 1 : -1);
  // });
  const handlePageChange = (page) => {
    navigate(`/Admin/allproducts?page=${page}`);
    console.log(selectedCategory, "selectedCategory");
    console.log(selectedCategoryId, "selectedCategory 2");

    const params = {
      ...(selectedCategoryId && { category_id: selectedCategoryId }),
      ...(selectedBrand && { brand_id: selectedBrand }),
      ...(selectedVariant && { variant_option_name_id: selectedVariant }),
      ...(searchQuery && { search: searchQuery }),
      filter: true,
      pg: page,
    };
    fetchData(params);
  };
  let sortedProducts = responseData;
  const handleCloneClick = async (e, productId) => {
    e.stopPropagation(); // Prevent row click event from triggering
    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_IP}/cloneProduct/`,
        {
          id: productId,
        }
      );
      if (response.data.data.is_created === true) {
        Swal.fire({
          title: "Success",
          text: "Product Cloned successfully!",
          icon: "success",
          customClass: {
            container: "swal-custom-container",
            popup: "swal-custom-popup",
            title: "swal-custom-title",
            confirmButton: "swal-custom-confirm",
            cancelButton: "swal-custom-cancel",
          },
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to Clone product!",
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            container: "swal-custom-container",
            popup: "swal-custom-popup",
            title: "swal-custom-title",
            confirmButton: "swal-custom-confirm",
            cancelButton: "swal-custom-cancel",
          },
        });
      }
    } catch (err) {
      console.log(err);
    }
    const filter = true;
    fetchData({ filter });
  };
  const clearSearchInput = () => {
    setSearchQuery("");
    const filter = true;
    fetchData({ filter, search: searchQuery, pg: pageFromUrl });
  };
  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchVariants();
    console.log(selectedProducts, "Selected Products");
  }, []);
  useEffect(() => {
  if (BrandId !== "" && BrandId !== null) {
    setSelectedBrand(BrandId);
    fetchData({ brand_id: BrandId, filter: true, pg: pageFromUrl });  // ✅ Added filter and pg
  } else {
    fetchData({ filter: true, pg: pageFromUrl });  // ✅ Added pg
  }
  setTimeout(() => {
    isInitialMount.current = false;
  }, 500);
}, []);
  const selectedVariantData = variants.find(
    (variant) => variant.varient_option_id === selectedVariant
  );
  const optionValues = selectedVariantData
    ? selectedVariantData.option_value_list
    : [];
  const handleFiltersClear = async () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setSelectedOptionValue("");
    setSelectedVariant("");
    const filter = true;
    fetchData({ filter, search: searchQuery, pg: pageFromUrl });
  };
  let totalPages = Math.ceil(productCount / itemsPerPage); // Calculate total pages based on brand count
  let currentProducts = responseData.slice(0, itemsPerPage);
  totalPages = Math.ceil(productCount / itemsPerPage); // Calculate total pages based on brand coun
  return (
    <div className="product-list">
      <div className="search-container" style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
          style={{ paddingRight: "30px" }}
        />
        {searchQuery && (
          <button
            onClick={clearSearchInput}
            style={{
              position: "absolute",
              right: "266px",
              background: "transparent",
              border: "none",
              fontSize: "16px",
              color: "#aaa",
              cursor: "pointer",
              width: "15%",
              top: "-3px",
            }}
          >
            {" "}
            ✕{" "}
          </button>
        )}
        <div
          className="count-vendor"
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "flex-end",
            width: "32%",
          }}
        >
          <span className="total-brands-text" style={{ marginRight: "5px" }}>
            Total Products:
          </span>
          <span className="brand-count">{productCount}</span>
        </div>
      </div>

      <div className="sort-container">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="filter-dropdown "
          style={{ margin: "8px 0px 7px 0px" }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option value={cat.id}>{cat.name}</option>
          ))}{" "}
        </select>
        <select
          value={selectedBrand}
          onChange={handleBrandChange}
          className="filter-dropdown variant_dropdown"
        >
          <option value="">All Vendors</option>
          {brands.map((brand) => (
            <option value={brand.id}>{brand.name}</option>
          ))}
        </select>
        <select
          value={selectedVariant}
          onChange={handleVariantChange}
          className="filter-dropdown variant_dropdown half-width truncate-option"
        >
          <option value="">All Variants</option>
          {variants.map((variant) => (
            <option
              value={variant.varient_option_id}
              data-category-id={variant.category_id}
            >
              {variant.type_name}
            </option>
          ))}
        </select>
        {selectedVariant && (
          <select
            value={selectedOptionValue}
            onChange={handleOptionValueChange}
            className="filter-dropdown variant_dropdown"
          >
            <option value="">Select Option</option>
            {optionValues.map((option) => (
              <option value={option.type_value_id}>
                {option.type_value_name}
              </option>
            ))}
          </select>
        )}

        {/* {sortVisiblebyVariant && (
        <>          
          <select value={selectedVariant} onChange={handleVariantChange} className="filter-dropdown ">
            <option value="">All Variants</option>
            {variants.map((variant) => (
              <option key={variant.type_id} value={variant.type_id}>
                {variant.type_name}
              </option>
            ))}
          </select>
          {selectedVariant && (
            <select value={selectedOptionValue} onChange={handleOptionValueChange} className="filter-dropdown variant_dropdown">
              <option value="">Select Option</option>
              {optionValues.map((option) => (
                <option key={option.type_value_id} value={option.type_value_id}>
                  {option.type_value_name}
                </option>
              ))}
            </select>
          )}
        </>
      )} */}
        {/* {searchVisible && (
                   <select value={selectedBrand} onChange={handleBrandChange} className="filter-dropdown" >
                   <option value="">All Vendors</option>
                   {brands.map((brand) => (
                     <option  value={brand.id}>{brand.name}</option>
                   ))}
                 </select>    )} */}
        {/* {sortVisible && (
                  <select  value={selectedCategory}  onChange={handleCategoryChange}  className="filter-dropdown"  >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option value={cat.id}>{cat.name}</option>   ))} </select> )} */}
        <div style={{ position: "relative", display: "none" }}>
          <FontAwesomeIcon
            icon={faSlidersH}
            onClick={handleVariantSortClick}
            style={{
              cursor: "pointer",
              fontSize: "18px",
              marginRight: "10px",
              padding: "15px 5px",
            }}
            onMouseEnter={() => setshowTextForVariant(true)}
            onMouseLeave={() => setshowTextForVariant(false)}
          />
          {showTextForVariant && (
            <span
              style={{
                position: "absolute",
                top: "-25px",
                left: "0",
                backgroundColor: "black",
                color: "white",
                padding: "5px 10px",
                borderRadius: "5px",
                fontSize: "12px",
                whiteSpace: "nowrap",
                zIndex: "1000",
              }}
            >
              {" "}
              Filter by Variants
            </span>
          )}
          <FontAwesomeIcon
            icon={faFilter}
            onClick={handleBrandSortClick}
            style={{
              cursor: "pointer",
              fontSize: "18px",
              marginRight: "10px",
              padding: "15px 5px",
            }}
            onMouseEnter={() => setShowText(true)}
            onMouseLeave={() => setShowText(false)}
          />
          {showText && (
            <span
              style={{
                position: "absolute",
                top: "-25px",
                left: "0",
                backgroundColor: "black",
                color: "white",
                padding: "5px 10px",
                borderRadius: "5px",
                fontSize: "12px",
                whiteSpace: "nowrap",
                zIndex: "1000",
              }}
            >
              {" "}
              Filter by Vendors{" "}
            </span>
          )}
        </div>
        <div style={{ position: "relative", display: "none" }}>
          <FontAwesomeIcon
            icon={faSort}
            onClick={handleCategorySortClick}
            style={{
              cursor: "pointer",
              fontSize: "18px",
              marginRight: "10px",
              padding: "15px 5px",
            }}
            onMouseEnter={() => setShowTextCategories(true)}
            onMouseLeave={() => setShowTextCategories(false)}
          />
          {showTextCategories && (
            <span
              style={{
                position: "absolute",
                top: "-25px",
                left: "0",
                backgroundColor: "black",
                color: "white",
                padding: "5px 10px",
                borderRadius: "5px",
                fontSize: "12px",
                whiteSpace: "nowrap",
                zIndex: "1000",
              }}
            >
              {" "}
              Filter by Categories{" "}
            </span>
          )}
        </div>
        {(selectedCategory.length > 0 ||
          selectedVariant.length > 0 ||
          selectedBrand.length > 0) && (
          <button onClick={handleFiltersClear} className="filters-clear-btn">
            <FontAwesomeIcon icon={faRotateLeft} />
          </button>
        )}

        <select
          onChange={handleSortChange}
          value={sortOption}
          className="sort-dropdown variant_dropdown"
          style={{ cursor: "pointer" }}
        >
          <option value="">Sort by Products</option>
          <option value="newest">Newest Products</option>
          <option value="oldest">Oldest Products</option>
        </select>
      </div>
      {loading ? (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Loading products...
        </p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : currentProducts.length > 0 ? (
        <>
          <table className="product-table">
            <thead>
              <tr>
                <th className="checkbox-column" style={{ width: "3%" }}>
                  <input
                    type="checkbox"
                    style={{ cursor: "pointer" }}
                    onChange={handleSelectAll}
                    checked={selectedProducts.length === sortedProducts.length}
                  />
                </th>
                <th
                  className="checkbox-column"
                  style={{ width: "3%" }}
                  onClick={() => handleSort("product_image")}
                >
                  Image
                  {sortColumn === "product_image"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </th>
                <th
                  className="product-column"
                  style={{ width: "35%" }}
                  onClick={() => handleSort("product_name")}
                >
                  Product Name{" "}
                  {sortColumn === "product_name"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </th>
                <th
                  className="brand-column"
                  style={{ width: "10%" }}
                  onClick={() => handleSort("brand")}
                >
                  Vendor{" "}
                  {sortColumn === "brand"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </th>
                <th
                  className="taxonomy-column"
                  style={{ width: "40%" }}
                  onClick={() => handleSort("taxonomy")}
                >
                  Taxonomy{" "}
                  {sortColumn === "taxonomy"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                  {selectedProducts.length > 0 && (
                    <div>
                      <select
                        onChange={handleTaxonomySelect}
                        defaultValue=""
                        className="taxonomy-select"
                        style={{
                          marginTop: "5px",
                          width: "80%",
                          display: "inline-block",
                          fontSize: "12px",
                        }}
                      >
                        <option value="" disabled>
                          Change taxonomy for selected
                        </option>
                        {filteredCategoriesdropdown.map((item) => (
                          <option value={JSON.stringify(item)}>
                            {item.category_name}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleClearSelected}
                        className="products-clear-btn"
                      >
                        <FontAwesomeIcon icon={faRotateLeft} />
                      </button>
                    </div>
                  )}
                </th>
                <th className="others-column" style={{ width: "5%" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.map((item) => (
                <tr
                  key={`product-${item.product_id}`}
                  style={{ cursor: "pointer" }}
                >
                  <td className="checkbox-column">
                    <input
                      type="checkbox"
                      style={{ cursor: "pointer" }}
                      checked={selectedProducts.includes(item.product_id)}
                      onChange={() => handleSelectProduct(item.product_id)}
                    />
                  </td>
                  <td
                    className="checkbox-column"
                    onClick={() => handleProductSelect(item.product_id)}
                  >
                    {Array.isArray(item.image) ? (
                      <img
                        src={item.image[0] || Soon}
                        alt={item.product_name}
                        className="product-image-round"
                      />
                    ) : (
                      <img
                        src={item.image}
                        alt={item.product_name}
                        className="product-image-round"
                      />
                    )}
                  </td>
                  <td
                    className="product-cell"
                    onClick={() => handleProductSelect(item.product_id)}
                  >
                    <span className="product-name">{item.product_name}</span>
                  </td>
                  <td
                    className="mpn-column"
                    onClick={() => handleProductSelect(item.product_id)}
                  >
                    {item.brand}
                  </td>
                  <td
                    className="attributes-column"
                    onClick={() => handleProductSelect(item.product_id)}
                  >
                    {item.category_name}
                  </td>
                  <td className="others-column">
                    <div
                      style={{ position: "relative", display: "inline-block" }}
                    >
                      <FontAwesomeIcon
                        icon={faClone}
                        onClick={(e) => handleCloneClick(e, item.product_id)}
                        style={{
                          cursor: "pointer",
                          fontSize: "18px",
                          color: "#007bff",
                          padding: "0px 7px 0px 4px",
                        }}
                        onMouseEnter={() =>
                          setHoveredProductId(item.product_id)
                        } // Set hovered product ID
                        onMouseLeave={() => setHoveredProductId(null)}
                      />
                      {hoveredProductId === item.product_id && ( // Show tooltip only for the hovered row's clone icon
                        <span
                          style={{
                            position: "absolute",
                            top: "-28px",
                            left: "-19px",
                            backgroundColor: "black",
                            color: "white",
                            padding: "5px 10px",
                            borderRadius: "5px",
                            fontSize: "12px",
                            whiteSpace: "nowrap",
                            zIndex: "1000",
                          }}
                        >
                          {" "}
                          Clone Product
                        </span>
                      )}
                    </div>
                    {UserRole === "admin" && (
                      <div
                        style={{
                          position: "relative",
                          display: "inline-block",
                        }}
                        onMouseEnter={() =>
                          setHoveredVisibilityId(item.product_id)
                        } // Set hovered visibility icon ID
                        onMouseLeave={() => setHoveredVisibilityId(null)} // Reset hovered visibility icon ID
                      >
                        <FontAwesomeIcon
                          icon={item.is_active ? faEye : faEyeSlash}
                          onClick={(e) => handleVisibilityToggle(e, item)}
                          style={{ cursor: "pointer", fontSize: "16px" }}
                        />
                        {hoveredVisibilityId === item.product_id && (
                          <span
                            style={{
                              position: "absolute",
                              top: "-28px",
                              left: "5%",
                              transform: "translateX(-50%)",
                              backgroundColor: "black",
                              color: "white",
                              padding: "5px 10px",
                              borderRadius: "5px",
                              fontSize: "12px",
                              whiteSpace: "nowrap",
                              zIndex: "1000",
                            }}
                          >
                            {item.is_active
                              ? "Active Product"
                              : "Inactive Product"}
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination-container">
            {totalPages > 1 && pageFromUrl > 1 && (
              <button
                className="pagination-button prev-button-plp"
                onClick={() => handlePageChange(pageFromUrl - 1)}
              >
                &laquo; Prev
              </button>
            )}
            {totalPages > 1 &&
              Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(Math.max(0, pageFromUrl - 3), pageFromUrl + 2)
                .map((page) => (
                  <button
                    key={page}
                    className={`pagination-button ${
                      page === pageFromUrl ? "active" : ""
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
            {totalPages > 1 && pageFromUrl < totalPages && (
              <button
                className="pagination-button next-button-plp"
                onClick={() => handlePageChange(pageFromUrl + 1)}
              >
                Next &raquo;
              </button>
            )}
          </div>
        </>
      ) : (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          No products found.
        </p>
      )}
    </div>
  );
};
export default ProductList;
