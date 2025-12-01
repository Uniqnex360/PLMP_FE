import React, { useState, useEffect, useCallback, useRef } from "react";
import Swal from "sweetalert2";
import ChevronDownIcon from "@mui/icons-material/ExpandMore";
import "./VariantList.css";
import axiosInstance from "../../../../src/utils/axiosConfig";
import { SyncLoader } from "react-spinners";

const VariantList = ({ categories }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedLevel2Id, setSelectedLevel2Id] = useState("");
  const [selectedLevel3Id, setSelectedLevel3Id] = useState("");
  const [selectedlevel4, setSelectedlevel4] = useState("");
  const [selectedlevel5, setSelectedlevel5] = useState("");
  const [selectedlevel6, setSelectedlevel6] = useState("");
  const [clearBtn, setShowclearBtn] = useState(false);
  const dropdownRef = useRef([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isLevel2DropdownOpen, setIsLevel2DropdownOpen] = useState(false);
  const [isLevel3DropdownOpen, setIsLevel3DropdownOpen] = useState(false);
  const [islevel4DropdownOpen, setIslevel4DropdownOpen] = useState(false);
  const [islevel5DropdownOpen, setIslevel5DropdownOpen] = useState(false);
  const [islevel6DropdownOpen, setIslevel6DropdownOpen] = useState(false);
  const [variantsData, setVariantsData] = useState([]);
  const [searchQueries, setSearchQueries] = useState({
    level1: "",
    level2: "",
    level3: "",
    level4: "",
    level5: "",
    level6: "",
  });
  const [selectedCategoryForVariant, setSelectedCategoryForVariant] =
    useState("");
  const [selectedCategoryLevelForVariant, setSelectedCategoryLevelForVariant] =
    useState("");
  const categoryDropdownRef = useRef(null);
  const categoryDropdown2Ref = useRef(null);
  const categoryDropdown3Ref = useRef(null);
  const categoryDropdown4Ref = useRef(null);
  const categoryDropdown5Ref = useRef(null);
  const categoryDropdown6Ref = useRef(null);
  const [filteredCategoriesdropdown, setFilteredCategories] = useState([]);
  const [filteredCategoriesdropdownSearch, setFilteredCategoriesSearch] =
    useState([]);

  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleClickOutside = (event) => {
    if (
      categoryDropdownRef.current &&
      !categoryDropdownRef.current.contains(event.target)
    ) {
      setIsCategoryDropdownOpen(false);
    }
    if (
      categoryDropdown2Ref.current &&
      !categoryDropdown2Ref.current.contains(event.target)
    ) {
      setIsLevel2DropdownOpen(false);
    }
    if (
      categoryDropdown3Ref.current &&
      !categoryDropdown3Ref.current.contains(event.target)
    ) {
      setIsLevel3DropdownOpen(false);
    }
    if (
      categoryDropdown4Ref.current &&
      !categoryDropdown4Ref.current.contains(event.target)
    ) {
      setIslevel4DropdownOpen(false);
    }
    if (
      categoryDropdown5Ref.current &&
      !categoryDropdown5Ref.current.contains(event.target)
    ) {
      setIslevel5DropdownOpen(false);
    }
    if (
      categoryDropdown6Ref.current &&
      !categoryDropdown6Ref.current.contains(event.target)
    ) {
      setIslevel6DropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredCategories =
    categories?.category_list?.filter((category) =>
      category?.name?.toLowerCase().includes(searchQueries.level1.toLowerCase())
    ) || [];

  const levelOneCategory = (categories?.category_list ?? []).find(
    (level1) => level1._id === selectedCategoryId
  );

  const safeSearchQuery =
    typeof searchQueries === "string" ? searchQueries.toLowerCase() : "";
  //   const filteredCategoriesLevel2 = levelOneCategory
  //     ? levelOneCategory.level_one_category_list.filter((level2) =>
  //         level2.name.toLowerCase().includes(safeSearchQuery)
  //       )
  //     : categories.category_list
  //         .flatMap((level1) => level1.level_one_category_list)
  //         .filter((level2) =>
  //           level2.name.toLowerCase().includes(safeSearchQuery)
  //         );
 const levelTwoCategory = (() => {
  if (!selectedLevel2Id || !selectedCategoryId) return null;
  
  // Find the specific Level 1 category first
  const level1 = categories.category_list?.find(
    (l1) => l1._id === selectedCategoryId
  );
  
  if (!level1) return null;
  
  // Then find the Level 2 under THIS specific Level 1
  return level1.level_one_category_list?.find(
    (l2) => l2._id === selectedLevel2Id
  );
})();
  //   const filteredCategoriesLevel3 = levelTwoCategory
  //     ? levelTwoCategory.level_two_category_list.filter((level3) =>
  //         level3.name.toLowerCase().includes(safeSearchQuery)
  //       )
  //     : categories.category_list
  //         .flatMap((level1) => level1.level_one_category_list)
  //         .flatMap((level2) => level2.level_two_category_list)
  //         .filter((level3) =>
  //           level3.name.toLowerCase().includes(safeSearchQuery)
  //         );

  const levelThreeCategory = (() => {
  if (!selectedLevel3Id || !levelTwoCategory) return null;
  
  return levelTwoCategory.level_two_category_list?.find(
    (l3) => l3._id === selectedLevel3Id
  );
})();
  //   const filteredCategoriesLevel4 = levelThreeCategory
  //     ? levelThreeCategory.level_three_category_list.filter((level4) =>
  //         level4.name.toLowerCase().includes(safeSearchQuery)
  //       )
  //     : categories.category_list
  //         .flatMap((level1) => level1.level_one_category_list)
  //         .flatMap((level2) => level2.level_two_category_list)
  //         .flatMap((level3) => level3.level_three_category_list)
  //         .filter((level4) =>
  //           level4.name.toLowerCase().includes(safeSearchQuery)
  //         );

const levelFourCategory = (() => {
  if (!selectedlevel4 || !levelThreeCategory) return null;
  
  return levelThreeCategory.level_three_category_list?.find(
    (l4) => l4._id === selectedlevel4
  );
})();
  //   const filteredCategoriesLevel5 = levelFourCategory
  //     ? levelFourCategory.level_four_category_list.filter((level5) =>
  //         level5.name.toLowerCase().includes(safeSearchQuery)
  //       )
  //     : categories.category_list
  //         .flatMap((level1) => level1.level_one_category_list)
  //         .flatMap((level2) => level2.level_two_category_list)
  //         .flatMap((level3) => level3.level_three_category_list)
  //         .flatMap((level4) => level4.level_four_category_list)
  //         .filter((level5) =>
  //           level5.name.toLowerCase().includes(safeSearchQuery)
  //         );
const levelFiveCategory = (() => {
  if (!selectedlevel5 || !levelFourCategory) return null;
  
  return levelFourCategory.level_four_category_list?.find(
    (l5) => l5._id === selectedlevel5
  );
})();
  //   const filteredCategoriesLevel6 = levelFiveCategory
  //     ? levelFiveCategory.level_five_category_list.filter((level6) =>
  //         level6.name.toLowerCase().includes(safeSearchQuery)
  //       )
  //     : categories.category_list
  //         .flatMap((level1) => level1.level_one_category_list)
  //         .flatMap((level2) => level2.level_two_category_list)
  //         .flatMap((level3) => level3.level_three_category_list)
  //         .flatMap((level4) => level4.level_four_category_list)
  //         .flatMap((level5) => level5.level_five_category_list)
  //         .filter((level6) =>
  //           level6.name.toLowerCase().includes(safeSearchQuery)
  //         );

  const handleSearchChange = (level, value) => {
    setSearchQueries((prev) => ({ ...prev, [level]: value }));
  };
  const handleCategorySelect = async (id) => {
    setSelectedCategoryId(id);
    setSelectedLevel2Id("");
    setSelectedLevel3Id("");
    setSelectedlevel4("");
    setSelectedlevel5("");
    setSelectedlevel6("");
    setIsCategoryDropdownOpen(false);
    if (id === "") {
      handleLevelClear();
    }
  };
  const [lastLevelCategoryIds, setLastLevelCategoryIds] = useState([]);
  const [isAddProductVisible, setIsAddProductVisible] = useState(false);
  useEffect(() => {
    const fetchCategoryData = async () => {
      const res = await axiosInstance.get(
        `${process.env.REACT_APP_IP}/obtainCategoryAndSections/`
      );
      setLastLevelCategoryIds(res.data.data.last_level_category);
    };

    fetchCategoryData();
  }, []);
  const handleCategorySelectForVariants = async (id, level) => {
    setLoading(true);
    const selectedIdString = String(id);
    const isIdInLastLevel = lastLevelCategoryIds.some(
      (category) => String(category.id) === selectedIdString
    );
    if (id && level) {
      setShowclearBtn(true);
    }
    if (isIdInLastLevel) {
      setIsAddProductVisible(true);
    }
    setSelectedCategoryForVariant(id);
    setSelectedCategoryLevelForVariant(level);
    try {
      const res = await axiosInstance.get(
        `${process.env.REACT_APP_IP}/obtainVarientForCategory/?id=${id}`
      );
      setVariantsData(res.data.data);
    } catch (err) {
      console.log("ERROR", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    handleCategorySelectForVariants();
  }, []);
  const handleMultiSelectCategory = async (id, level) => {
    const payload = {};
    try {
      const res = await axiosInstance.get(
        `${process.env.REACT_APP_IP}/obtainListofCategoryCombinations/`,
        { payload }
      );
      console.log(res, "response here ");
      setFilteredCategories(res.data.data.last_all_ids || []);
      setFilteredCategoriesSearch(res.data.data.last_all_ids || []);
    } catch (err) {
      console.log("ERROR", err);
    }
  };
  useEffect(() => {
    handleMultiSelectCategory();
  }, []);
  const handleLevel2Select = (id, parentId) => {
    const selectedValue = id;
    if (selectedValue !== "") {
      // CRITICAL FIX: Always use the parentId to set the correct Level 1 category
      if (parentId) {
        setSelectedCategoryId(parentId);
      } else {
        // Fallback: search for parent if not provided
        let level1Category;
        categories.category_list.some((level1) => {
          const foundLevel2 = level1.level_one_category_list.find(
            (level2) => level2._id === selectedValue
          );
          if (foundLevel2) {
            level1Category = level1;
            return true;
          }
          return false;
        });

        if (!level1Category) {
          console.error(
            "Level 1 category not found for Level 2 category with ID:",
            selectedValue
          );
          return;
        }
        setSelectedCategoryId(level1Category._id);
      }

      setSelectedLevel2Id(selectedValue);
      setSelectedLevel3Id("");
      setSelectedlevel4("");
      setSelectedlevel5("");
      setSelectedlevel6("");
      setIsLevel2DropdownOpen(false);
    } else {
      setSelectedLevel2Id("");
      handleLevelClear();
    }
  };
  const handleLevel3Select = (id) => {
    const selectedValue = id;
    if (selectedValue !== "") {
      // 1. Check if the item exists in the CURRENT selection chain
      if (selectedCategoryId && selectedLevel2Id) {
        const currentL1 = categories.category_list.find(
          (c) => c._id === selectedCategoryId
        );
        const currentL2 = currentL1?.level_one_category_list.find(
          (c) => c._id === selectedLevel2Id
        );
        const existsInCurrent = currentL2?.level_two_category_list.some(
          (c) => c._id === selectedValue
        );

        if (existsInCurrent) {
          // It belongs to current parents, just set the level 3
          setSelectedLevel3Id(selectedValue);
          setSelectedlevel4("");
          setSelectedlevel5("");
          setSelectedlevel6("");
          setIsLevel3DropdownOpen(false);
          handleCategorySelectForVariants(selectedValue, "level-3");
          return; // Stop here, don't search globally
        }
      }

      // 2. Global Search (Auto-complete parents if nothing selected yet)
      let level1Category, level2Category;
      categories.category_list.some((level1) => {
        const foundLevel2 = level1.level_one_category_list.find((level2) =>
          level2.level_two_category_list.some(
            (level3) => level3._id === selectedValue
          )
        );
        if (foundLevel2) {
          level1Category = level1;
          level2Category = foundLevel2;
          return true;
        }
        return false;
      });

      if (!level2Category || !level1Category) {
        console.error("Parent categories not found");
        return;
      }

      setSelectedCategoryId(level1Category._id);
      setSelectedLevel2Id(level2Category._id);
      setSelectedLevel3Id(selectedValue);
      setSelectedlevel4("");
      setSelectedlevel5("");
      setSelectedlevel6("");
      setIsLevel3DropdownOpen(false);
      handleCategorySelectForVariants(selectedValue, "level-3");
    } else {
      setSelectedLevel3Id("");
      handleLevelClear();
    }
  };
  const handleLevelSelect = (level, id) => {
    const selectedValue = id || "";
    if (selectedValue !== "") {
      switch (level) {
        case 4:
          // 1. Check current selection
          if (selectedCategoryId && selectedLevel2Id && selectedLevel3Id) {
            const l1 = categories.category_list.find(
              (c) => c._id === selectedCategoryId
            );
            const l2 = l1?.level_one_category_list.find(
              (c) => c._id === selectedLevel2Id
            );
            const l3 = l2?.level_two_category_list.find(
              (c) => c._id === selectedLevel3Id
            );
            const exists = l3?.level_three_category_list.some(
              (c) => c._id === selectedValue
            );
            if (exists) {
              setSelectedlevel4(selectedValue);
              setSelectedlevel5("");
              setSelectedlevel6("");
              setIslevel4DropdownOpen(false);
              handleCategorySelectForVariants(selectedValue, "level-4");
              return;
            }
          }

          // 2. Global Search
          let l1_4, l2_4, l3_4;
          categories.category_list.some((level1) => {
            const foundLevel2 = level1.level_one_category_list.find((level2) =>
              level2.level_two_category_list.some((level3) =>
                level3.level_three_category_list.some(
                  (level4) => level4._id === selectedValue
                )
              )
            );
            if (foundLevel2) {
              const foundLevel3 = foundLevel2.level_two_category_list.find(
                (level3) =>
                  level3.level_three_category_list.some(
                    (level4) => level4._id === selectedValue
                  )
              );
              if (foundLevel3) {
                l1_4 = level1;
                l2_4 = foundLevel2;
                l3_4 = foundLevel3;
                return true;
              }
            }
            return false;
          });
          if (l1_4) {
            setSelectedCategoryId(l1_4._id);
            setSelectedLevel2Id(l2_4._id);
            setSelectedLevel3Id(l3_4._id);
            setSelectedlevel4(selectedValue);
            setSelectedlevel5("");
            setSelectedlevel6("");
            setIslevel4DropdownOpen(false);
            handleCategorySelectForVariants(selectedValue, "level-4");
          }
          break;

        case 5:
          // 1. Check current selection
          if (
            selectedCategoryId &&
            selectedLevel2Id &&
            selectedLevel3Id &&
            selectedlevel4
          ) {
            const l1 = categories.category_list.find(
              (c) => c._id === selectedCategoryId
            );
            const l2 = l1?.level_one_category_list.find(
              (c) => c._id === selectedLevel2Id
            );
            const l3 = l2?.level_two_category_list.find(
              (c) => c._id === selectedLevel3Id
            );
            const l4 = l3?.level_three_category_list.find(
              (c) => c._id === selectedlevel4
            );
            const exists = l4?.level_four_category_list.some(
              (c) => c._id === selectedValue
            );
            if (exists) {
              setSelectedlevel5(selectedValue);
              setSelectedlevel6("");
              setIslevel5DropdownOpen(false);
              handleCategorySelectForVariants(selectedValue, "level-5");
              return;
            }
          }

          // 2. Global Search
          let l1_5, l2_5, l3_5, l4_5;
          categories.category_list.some((level1) => {
            return level1.level_one_category_list.some((level2) => {
              return level2.level_two_category_list.some((level3) => {
                return level3.level_three_category_list.some((level4) => {
                  if (
                    level4.level_four_category_list.some(
                      (level5) => level5._id === selectedValue
                    )
                  ) {
                    l1_5 = level1;
                    l2_5 = level2;
                    l3_5 = level3;
                    l4_5 = level4;
                    return true;
                  }
                  return false;
                });
              });
            });
          });
          if (l1_5) {
            setSelectedCategoryId(l1_5._id);
            setSelectedLevel2Id(l2_5._id);
            setSelectedLevel3Id(l3_5._id);
            setSelectedlevel4(l4_5._id);
            setSelectedlevel5(selectedValue);
            setSelectedlevel6("");
            setIslevel5DropdownOpen(false);
            handleCategorySelectForVariants(selectedValue, "level-5");
          }
          break;

        case 6:
          // 1. Check current selection
          if (
            selectedCategoryId &&
            selectedLevel2Id &&
            selectedLevel3Id &&
            selectedlevel4 &&
            selectedlevel5
          ) {
            const l1 = categories.category_list.find(
              (c) => c._id === selectedCategoryId
            );
            const l2 = l1?.level_one_category_list.find(
              (c) => c._id === selectedLevel2Id
            );
            const l3 = l2?.level_two_category_list.find(
              (c) => c._id === selectedLevel3Id
            );
            const l4 = l3?.level_three_category_list.find(
              (c) => c._id === selectedlevel4
            );
            const l5 = l4?.level_four_category_list.find(
              (c) => c._id === selectedlevel5
            );
            const exists = l5?.level_five_category_list.some(
              (c) => c._id === selectedValue
            );
            if (exists) {
              setSelectedlevel6(selectedValue);
              setIslevel6DropdownOpen(false);
              handleCategorySelectForVariants(selectedValue, "level-6");
              return;
            }
          }

          // 2. Global Search
          let l1_6, l2_6, l3_6, l4_6, l5_6;
          categories.category_list.some((level1) => {
            return level1.level_one_category_list.some((level2) => {
              return level2.level_two_category_list.some((level3) => {
                return level3.level_three_category_list.some((level4) => {
                  return level4.level_four_category_list.some((level5) => {
                    if (
                      level5.level_five_category_list.some(
                        (level6) => level6._id === selectedValue
                      )
                    ) {
                      l1_6 = level1;
                      l2_6 = level2;
                      l3_6 = level3;
                      l4_6 = level4;
                      l5_6 = level5;
                      return true;
                    }
                    return false;
                  });
                });
              });
            });
          });
          if (l1_6) {
            setSelectedCategoryId(l1_6._id);
            setSelectedLevel2Id(l2_6._id);
            setSelectedLevel3Id(l3_6._id);
            setSelectedlevel4(l4_6._id);
            setSelectedlevel5(l5_6._id);
            setSelectedlevel6(selectedValue);
            setIslevel6DropdownOpen(false);
            handleCategorySelectForVariants(selectedValue, "level-6");
          }
          break;
        default:
          break;
      }
    } else {
      // Clear logic remains the same
      switch (level) {
        case 4:
          setSelectedlevel4("");
          handleLevelClear();
          break;
        case 5:
          setSelectedlevel5("");
          handleLevelClear();
          break;
        case 6:
          setSelectedlevel6("");
          handleLevelClear();
          break;
        default:
          break;
      }
    }
  };
  const [error, setError] = useState(null);
  //  To make visible the next level categories
  const level2Categories = levelOneCategory
    ? levelOneCategory.level_one_category_list
    : [];
  const levelTwoCategoryForVisible = level2Categories.find(
    (level2) => level2._id === selectedLevel2Id
  );
  const level3Categories = levelTwoCategoryForVisible
    ? levelTwoCategoryForVisible.level_two_category_list
    : [];
  const levelThreeCategoryForVisible = level3Categories.find(
    (level3) => level3._id === selectedLevel3Id
  );
  const level4Categories = levelThreeCategoryForVisible
    ? levelThreeCategoryForVisible.level_three_category_list
    : [];
  const levelFourCategoryForVisible = level4Categories.find(
    (level4) => level4._id === selectedlevel4
  );
  const level5Categories = levelFourCategoryForVisible
    ? levelFourCategoryForVisible.level_four_category_list
    : [];
  const levelFiveCategoryForVisible = level5Categories.find(
    (level5) => level5._id === selectedlevel5
  );
  const level6Categories = levelFiveCategoryForVisible
    ? levelFiveCategoryForVisible.level_five_category_list
    : [];
  if (!level6Categories) {
    console.log(level6Categories);
  }
  const handleLevelClear = (e) => {
    handleCategorySelectForVariants();
    setSelectedCategoryId(e);
    setSelectedLevel2Id(e);
    setSelectedLevel3Id(e);
    setSelectedlevel4(e);
    setSelectedlevel5(e);
    setSelectedlevel6(e);
    setShowclearBtn(false);
    setIsAddProductVisible(false);
    setIsCategoryDropdownOpen(false);
    setIsLevel2DropdownOpen(false);
    setIsLevel3DropdownOpen(false);
    setIslevel4DropdownOpen(false);
    setIslevel5DropdownOpen(false);
    setIslevel6DropdownOpen(false);
    setRowSelectedCategoryIds({});
    setRowSelectedValues({});
  };
  const handleAddVariant = useCallback(
    async (
      category_varient_id,
      selectedCategoryForVariant,
      selectedCategoryLevelForVariant
    ) => {
      setError(null);
      Swal.fire({
        title: "Add New Variant",
        input: "text",
        showCancelButton: true,
        confirmButtonText: "Save",
        cancelButtonText: "Cancel",
        showCloseButton: true,
        customClass: {
          container: "swal-custom-container",
          popup: "swal-custom-popup",
          title: "swal-custom-title",
          confirmButton: "swal-custom-confirm-variant",
          cancelButton: "swal-custom-cancel",
        },
        inputAttributes: { autocomplete: "off" },
        inputValidator: (value) => {
          if (!value) {
            return "You need to write something!";
          }
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await axiosInstance.post(
              `${process.env.REACT_APP_IP}/createVarientOption/`,
              {
                name: result.value,
                category_varient_id: category_varient_id,
                category_id: selectedCategoryForVariant,
                category_name: selectedCategoryLevelForVariant,
              }
            );
            if (response.data.data.is_created === true) {
              Swal.fire({
                title: "Success",
                text: "Variant added successfully!",
                icon: "success",
                customClass: {
                  container: "swal-custom-container",
                  popup: "swal-custom-popup",
                  title: "swal-custom-title",
                  confirmButton: "swal-custom-confirm",
                  cancelButton: "swal-custom-cancel",
                },
              });
              handleCategorySelectForVariants(
                selectedCategoryForVariant,
                selectedCategoryLevelForVariant
              );
            } else if (response.data.data.is_created === false) {
              Swal.fire({
                title: response.data.data.error,
                icon: "warning",
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
            console.error("Error adding variant:", err);
            setError("Failed to add variant. Please try again.");
          }
        }
      });
    },
    []
  ); // Add dependencies if required

  const handleAddVariantValue = async (typeId, varient_option_id) => {
    const { value: typeValueName } = await Swal.fire({
      title: "Add Variant Value",
      input: "text",
      inputPlaceholder: "Enter variant value name",
      showCancelButton: true,
      confirmButtonText: "Save",
      showCloseButton: true,
      inputAttributes: { autocomplete: "off" },
      inputValidator: (value) => {
        if (!value) {
          return "You need to enter a value!";
        }
      },
      customClass: {
        container: "swal-custom-container",
        popup: "swal-custom-popup",
        title: "swal-custom-title",
        confirmButton: "swal-custom-confirm-variant",
        cancelButton: "swal-custom-cancel",
      },
    });
    if (typeValueName) {
      try {
        setError(null);
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_IP}/createValueForVarientName/`,
          {
            name: typeValueName,
            option_id: typeId,
            varient_option_id: varient_option_id,
          }
        );
        if (response.data.data.is_created === true) {
          Swal.fire({
            title: "Success",
            text: "Variant value added successfully!",
            icon: "success",
            customClass: {
              container: "swal-custom-container",
              popup: "swal-custom-popup",
              title: "swal-custom-title",
              confirmButton: "swal-custom-confirm-value",
              cancelButton: "swal-custom-cancel",
            },
          });
          handleCategorySelectForVariants(
            selectedCategoryForVariant,
            selectedCategoryLevelForVariant
          );
        } else if (response.data.data.is_created === false) {
          Swal.fire({
            title: response.data.data.error,
            icon: "warning",
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
        console.error("Error adding variant value:", err);
        setError("Failed to add variant value. Please try again.");
      }
    }
  };
  const variantList =
    variantsData && variantsData.varient_list ? variantsData.varient_list : [];
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [rowSelectedCategoryIds, setRowSelectedCategoryIds] = useState({});
  const handleDropdownClick = (index) => {
    setDropdownOpen((prev) => {
      // Toggle the clicked dropdown's open/close state
      return {
        [index]: !prev[index], // Toggle the clicked dropdown
      };
    });
  };
  const handleClickOutsidedropdown = (event) => {
    if (dropdownRef.current && Array.isArray(dropdownRef.current)) {
      let isClickInsideAnyDropdown = dropdownRef.current.some(
        (ref) => ref && ref.contains(event.target)
      );
      if (!isClickInsideAnyDropdown) {
        setDropdownOpen({});
      }
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsidedropdown);
    return () =>
      document.removeEventListener("mousedown", handleClickOutsidedropdown);
  }, []);
  const handleSearchChangedropdown = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = filteredCategoriesdropdownSearch.filter((category) =>
      category.category_name.toLowerCase().includes(query)
    );
    setFilteredCategories(filtered);
  };
  const handleCategorySelectdropdown = (e, index) => {
    const categoryId = e.target.value;

    setRowSelectedCategoryIds((prevState) => {
      const updatedState = { ...prevState };
      if (!updatedState[index]) {
        updatedState[index] = [];
      }

      if (categoryId === "all") {
        const allCategoryIds = filteredCategoriesdropdownSearch.map(
          (cat) => cat.id
        );
        updatedState[index] = ["all", ...allCategoryIds];
      } else {
        const isSelected = updatedState[index].includes(categoryId);
        if (isSelected) {
          updatedState[index] = updatedState[index].filter(
            (id) => id !== categoryId
          );
        } else {
          updatedState[index] = [...updatedState[index], categoryId];
        }
      }

      return updatedState;
    });
  };
  const handleApplyClick = async (
    varient_option_id,
    type_id,
    category_level,
    option_value_list
  ) => {
    let selectedCategoryIds = Object.values(rowSelectedCategoryIds).flat();
    let rowSelectedValues1 = Object.values(rowSelectedValues).flat();
    let options = "";
    if (rowSelectedValues1.length === 0) {
      options = option_value_list;
    } else {
      options = rowSelectedValues1;
    }
    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_IP}/updatevarientToReleatedCategories/`,
        {
          category_id_list: selectedCategoryIds,
          category_level: category_level,
          varient_option_id: varient_option_id,
          type_id: type_id,
          option_value_list: options,
        }
      );
      if (response.data && response.data.data.is_updated === true) {
        Swal.fire({
          title: "Success!",
          text: "Other categories updated successfully!",
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
        console.log("API call successful:", response);
        setSelectedCategories([]); // Clear selected categories after applying
        setSelectedCategoryIds([]);
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to Update Category.",
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
        console.log("API call failed:", response);
      }
      setRowSelectedCategoryIds({});
      setRowSelectedValues({});
    } catch (error) {
      setRowSelectedCategoryIds({});
      setRowSelectedValues({});
      Swal.fire({
        title: "Error",
        text: "Failed to Update Category.",
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
      console.error("Error during API call:", error);
    }
  };
  const [rowSelectedValues, setRowSelectedValues] = useState({});
  const handleOptionSelect = (typeValueName, typeValueId, index) => {
    console.log(typeValueName, "typeValueName");
    console.log(typeValueId, "typeValueId");
    if (typeValueId !== "") {
      setRowSelectedValues((prevState) => {
        const updatedState = { ...prevState };
        // Ensure the current row (index) has an array of selected values
        if (!updatedState[index]) {
          updatedState[index] = [];
        }
        // Check if the value is already selected for this row
        const isSelected = updatedState[index].some(
          (item) => item.type_value_id === typeValueId
        );
        if (isSelected) {
          // Deselect the value if it was already selected
          updatedState[index] = updatedState[index].filter(
            (item) => item.type_value_id !== typeValueId
          );
        } else {
          // Select the value if it wasn't selected
          updatedState[index] = [
            ...updatedState[index],
            { type_value_name: typeValueName, type_value_id: typeValueId },
          ];
        }
        // Ensure we only store the selected values for the current row
        // We overwrite all previous rows with the current row's values
        return { [index]: updatedState[index] };
      });
    }
  };
  return (
    <div className="variant-schema">
      <div className="CategoryTable-header">
        <h2 className="header_cls">Variants Schema</h2>
      </div>
      <div className="CategoryContainer">
        {clearBtn && (
          <button
            className="clear_cat_btn"
            onClick={() => handleLevelClear("")}
          >
            Clear all
          </button>
        )}
        <div className="DropdownsContainer">
          {/* Level 1 Dropdown */}
          <div className="DropdownColumn" ref={categoryDropdownRef}>
            <label htmlFor="categorySelect">Level 1:</label>
            <div
              className="custom-dropdown"
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            >
              <div className="selected-category">
                {selectedCategoryId
                  ? categories.category_list.find(
                      (level1) => level1._id === selectedCategoryId
                    )?.name
                  : "Select Category"}
                <span className="dropdown-icons">
                  <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                </span>
              </div>
              {isCategoryDropdownOpen && (
                <div className="dropdown-options">
                  <input
                    type="text"
                    placeholder="Search category..."
                    value={searchQueries.level1}
                    onChange={(e) =>
                      handleSearchChange("level1", e.target.value)
                    }
                    className="dropdown-search-input"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div
                    className="dropdown-option"
                    onClick={() => handleCategorySelect("")}
                  >
                    <span>Select Category</span>
                  </div>
                  {filteredCategories.map((level1) => (
                    <div
                      key={level1._id}
                      className="dropdown-option"
                      onClick={() => {
                        handleCategorySelect(level1._id);
                        handleCategorySelectForVariants(level1._id, "level-1");
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
          {/* Level 2 Dropdown */}
          {/* Level 2 Dropdown */}
          {/* Level 2 Dropdown - FIXED with index tracking */}
          <div className="DropdownColumn" ref={categoryDropdown2Ref}>
            <label htmlFor="sectionSelect">Level 2:</label>
            <div
              className="custom-dropdown"
              onClick={() => setIsLevel2DropdownOpen(!isLevel2DropdownOpen)}
            >
              <div className="selected-category">
                {(() => {
                  if (!selectedLevel2Id || !selectedCategoryId)
                    return "Select category";
                  const l1 = categories.category_list?.find(
                    (l) => l._id === selectedCategoryId
                  );
                  const l2 = l1?.level_one_category_list?.find(
                    (l) => l._id === selectedLevel2Id
                  );
                  return l2?.name || "Select category";
                })()}
                <span className="dropdown-icons">
                  <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                </span>
              </div>
              {isLevel2DropdownOpen && (
                <div className="dropdown-options">
                  <input
                    type="text"
                    placeholder="Search category..."
                    value={searchQueries.level2}
                    onChange={(e) =>
                      handleSearchChange("level2", e.target.value)
                    }
                    className="dropdown-search-input"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div
                    className="dropdown-option"
                    onClick={() => {
                      setSelectedCategoryId("");
                      setSelectedLevel2Id("");
                      setSelectedLevel3Id("");
                      setSelectedlevel4("");
                      setSelectedlevel5("");
                      setSelectedlevel6("");
                      setIsLevel2DropdownOpen(false);
                    }}
                  >
                    <span>Select category</span>
                  </div>

                  {(() => {
                    let itemsToShow = [];

                    if (selectedCategoryId) {
                      // Level 1 is selected - show only its children
                      const level1 = categories.category_list?.find(
                        (l1) => l1._id === selectedCategoryId
                      );
                      if (level1) {
                        level1.level_one_category_list?.forEach(
                          (level2, index) => {
                            itemsToShow.push({
                              level2,
                              level1,
                              level2Index: index, // ✅ Track the index
                              path: null,
                              uniqueKey: `${level1._id}___${index}___${level2._id}`,
                            });
                          }
                        );
                      }
                    } else {
                      // Level 1 NOT selected - show all with parent path
                      categories.category_list?.forEach((level1) => {
                        level1.level_one_category_list?.forEach(
                          (level2, index) => {
                            itemsToShow.push({
                              level2,
                              level1,
                              level2Index: index, // ✅ Track the index
                              path: level1.name,
                              uniqueKey: `${level1._id}___${index}___${level2._id}`,
                            });
                          }
                        );
                      });
                    }

                    // Filter by search
                    const filtered = itemsToShow.filter((item) =>
                      item.level2.name
                        .toLowerCase()
                        .includes(searchQueries.level2.toLowerCase())
                    );

                    return filtered.map((item) => (
                      <div
                        key={item.uniqueKey}
                        className="dropdown-option"
                        onClick={() => {
                          console.log("=== Level 2 Selection ===");
                          console.log(
                            "Level 1:",
                            item.level1.name,
                            "ID:",
                            item.level1._id
                          );
                          console.log(
                            "Level 2:",
                            item.level2.name,
                            "ID:",
                            item.level2._id,
                            "Index:",
                            item.level2Index
                          );
                          console.log(
                            "Level 2 children count:",
                            item.level2.level_two_category_list?.length
                          );
                          console.log(
                            "Level 2 children:",
                            item.level2.level_two_category_list?.map(
                              (l3) => l3.name
                            )
                          );

                          setSelectedCategoryId(item.level1._id);
                          setSelectedLevel2Id(item.level2._id);
                          setSelectedLevel3Id("");
                          setSelectedlevel4("");
                          setSelectedlevel5("");
                          setSelectedlevel6("");
                          handleCategorySelectForVariants(
                            item.level2._id,
                            "level-2"
                          );
                          setIsLevel2DropdownOpen(false);
                        }}
                      >
                        <span>
                          {item.level2.name}
                          {item.path && (
                            <small style={{ color: "#999", marginLeft: "8px" }}>
                              ({item.path})
                            </small>
                          )}
                        </span>
                      </div>
                    ));
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* Level 3 Dropdown */}
          {/* Level 3 Dropdown */}
          {/* Level 3 Dropdown */}
          {/* Level 3 Dropdown */}
          {/* Level 3 Dropdown */}
          {/* Level 3 Dropdown */}
          <div className="DropdownColumn" ref={categoryDropdown3Ref}>
            <label htmlFor="productTypeSelect">Level 3:</label>
            <div
              className="custom-dropdown"
              onClick={() => setIsLevel3DropdownOpen(!isLevel3DropdownOpen)}
            >
              <div className="selected-category">
                {selectedLevel3Id
                  ? (levelTwoCategory?.level_two_category_list ?? []).find(
                      (level3) => level3._id === selectedLevel3Id
                    )?.name
                  : "Select category"}
                <span className="dropdown-icons">
                  <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                </span>
              </div>
              {isLevel3DropdownOpen && (
                <div className="dropdown-options">
                  <input
                    type="text"
                    placeholder="Search category..."
                    value={searchQueries.level3}
                    onChange={(e) =>
                      handleSearchChange("level3", e.target.value)
                    }
                    className="dropdown-search-input"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div
                    className="dropdown-option"
                    onClick={() => handleLevel3Select("")}
                  >
                    <span>Select category</span>
                  </div>
                  {selectedLevel2Id
                    ? (levelTwoCategory?.level_two_category_list ?? [])
                        .filter((level3) =>
                          level3.name
                            .toLowerCase()
                            .includes(searchQueries.level3.toLowerCase())
                        )
                        .map((level3) => (
                          <div
                            key={level3._id}
                            className="dropdown-option"
                            onClick={() => {
                              handleLevel3Select(level3._id);
                              handleCategorySelectForVariants(
                                level3._id,
                                "level-3"
                              );
                              setIsLevel3DropdownOpen(false);
                            }}
                          >
                            <span>{level3.name}</span>
                          </div>
                        ))
                    : (() => {
                        // When Level 2 is NOT selected, show all Level 3s with their EXACT parent path
                        const level3List = [];
                        categories.category_list.forEach((level1) => {
                          level1.level_one_category_list.forEach((level2) => {
                            // ✅ KEY FIX: Only show level3s that belong to THIS specific level1 and level2
                            level2.level_two_category_list.forEach((level3) => {
                              level3List.push({
                                level3,
                                level1,
                                level2,
                                path: `${level1.name} → ${level2.name}`,
                              });
                            });
                          });
                        });

                        return level3List
                          .filter((item) =>
                            item.level3.name
                              .toLowerCase()
                              .includes(searchQueries.level3.toLowerCase())
                          )
                          .filter(
                            (item) => item.level3._id !== selectedLevel3Id // ✅ Hide already selected
                          )
                          .map((item) => (
                            <div
                              key={`${item.level3._id}-${item.level1._id}-${item.level2._id}`}
                              className="dropdown-option"
                              onClick={() => {
                                setSelectedCategoryId(item.level1._id);
                                setSelectedLevel2Id(item.level2._id);
                                handleLevel3Select(item.level3._id);
                                handleCategorySelectForVariants(
                                  item.level3._id,
                                  "level-3"
                                );
                                setIsLevel3DropdownOpen(false);
                              }}
                            >
                              <span>
                                {item.level3.name}
                                <small
                                  style={{ color: "#999", marginLeft: "8px" }}
                                >
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
          {/* Level 4 Dropdown */}
          {/* Level 4 Dropdown */}
          {/* Level 4 Dropdown */}
          {/* Level 4 Dropdown */}
          {/* Level 4 Dropdown */}
          <div className="DropdownColumn" ref={categoryDropdown4Ref}>
            <label htmlFor="level4Select">Level 4:</label>
            <div
              className="custom-dropdown"
              onClick={() => setIslevel4DropdownOpen(!islevel4DropdownOpen)}
            >
              <div className="selected-category">
                {selectedlevel4
                  ? (levelThreeCategory?.level_three_category_list ?? []).find(
                      (level4) => level4._id === selectedlevel4
                    )?.name
                  : "Select category"}
                <span className="dropdown-icons">
                  <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                </span>
              </div>
              {islevel4DropdownOpen && (
                <div className="dropdown-options">
                  <input
                    type="text"
                    placeholder="Search category..."
                    value={searchQueries.level4}
                    onChange={(e) =>
                      handleSearchChange("level4", e.target.value)
                    }
                    className="dropdown-search-input"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div
                    className="dropdown-option"
                    onClick={() => handleLevelSelect(4, "")}
                  >
                    <span>Select category</span>
                  </div>
                  {selectedLevel3Id
                    ? (levelThreeCategory?.level_three_category_list ?? [])
                        .filter((level4) =>
                          level4.name
                            .toLowerCase()
                            .includes(searchQueries.level4.toLowerCase())
                        )
                        .map((level4) => (
                          <div
                            key={level4._id}
                            className="dropdown-option"
                            onClick={() => {
                              handleLevelSelect(4, level4._id);
                              handleCategorySelectForVariants(
                                level4._id,
                                "level-4"
                              );
                              setIslevel4DropdownOpen(false);
                            }}
                          >
                            <span>{level4.name}</span>
                          </div>
                        ))
                    : (() => {
                        // When Level 3 is NOT selected, show all Level 4s with their EXACT parent path
                        const level4List = [];
                        categories.category_list.forEach((level1) => {
                          level1.level_one_category_list.forEach((level2) => {
                            level2.level_two_category_list.forEach((level3) => {
                              // ✅ KEY FIX: Only show level4s that belong to THIS specific path
                              level3.level_three_category_list.forEach(
                                (level4) => {
                                  level4List.push({
                                    level4,
                                    level1,
                                    level2,
                                    level3,
                                    path: `${level1.name} → ${level2.name} → ${level3.name}`,
                                  });
                                }
                              );
                            });
                          });
                        });

                        return level4List
                          .filter((item) =>
                            item.level4.name
                              .toLowerCase()
                              .includes(searchQueries.level4.toLowerCase())
                          )
                          .filter(
                            (item) => item.level4._id !== selectedlevel4 // ✅ Hide already selected
                          )
                          .map((item) => (
                            <div
                              key={`${item.level4._id}-${item.level1._id}-${item.level2._id}-${item.level3._id}`}
                              className="dropdown-option"
                              onClick={() => {
                                setSelectedCategoryId(item.level1._id);
                                setSelectedLevel2Id(item.level2._id);
                                setSelectedLevel3Id(item.level3._id);
                                handleLevelSelect(4, item.level4._id);
                                handleCategorySelectForVariants(
                                  item.level4._id,
                                  "level-4"
                                );
                                setIslevel4DropdownOpen(false);
                              }}
                            >
                              <span>
                                {item.level4.name}
                                <small
                                  style={{ color: "#999", marginLeft: "8px" }}
                                >
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
          {/* Level 5 Dropdown */}
          {/* Level 5 Dropdown */}
          {/* Level 5 Dropdown */}
          {/* Level 5 Dropdown */}
          {/* Level 5 Dropdown */}
          <div className="DropdownColumn" ref={categoryDropdown5Ref}>
            <label htmlFor="level5Select">Level 5:</label>
            <div
              className="custom-dropdown"
              onClick={() => setIslevel5DropdownOpen(!islevel5DropdownOpen)}
            >
              <div className="selected-category">
                {selectedlevel5
                  ? (levelFourCategory?.level_four_category_list ?? []).find(
                      (level5) => level5._id === selectedlevel5
                    )?.name
                  : "Select category"}
                <span className="dropdown-icons">
                  <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                </span>
              </div>
              {islevel5DropdownOpen && (
                <div className="dropdown-options">
                  <input
                    type="text"
                    placeholder="Search category..."
                    value={searchQueries.level5}
                    onChange={(e) =>
                      handleSearchChange("level5", e.target.value)
                    }
                    className="dropdown-search-input"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div
                    className="dropdown-option"
                    onClick={() => handleLevelSelect(5, "")}
                  >
                    <span>Select category</span>
                  </div>
                  {selectedlevel4
                    ? (levelFourCategory?.level_four_category_list ?? [])
                        .filter((level5) =>
                          level5.name
                            .toLowerCase()
                            .includes(searchQueries.level5.toLowerCase())
                        )
                        .map((level5) => (
                          <div
                            key={level5._id}
                            className="dropdown-option"
                            onClick={() => {
                              handleLevelSelect(5, level5._id);
                              handleCategorySelectForVariants(
                                level5._id,
                                "level-5"
                              );
                              setIslevel5DropdownOpen(false);
                            }}
                          >
                            <span>{level5.name}</span>
                          </div>
                        ))
                    : (() => {
                        // When Level 4 is NOT selected, show all Level 5s with their EXACT parent path
                        const level5List = [];
                        categories.category_list.forEach((level1) => {
                          level1.level_one_category_list.forEach((level2) => {
                            level2.level_two_category_list.forEach((level3) => {
                              level3.level_three_category_list.forEach(
                                (level4) => {
                                  // ✅ KEY FIX: Only show level5s that belong to THIS specific path
                                  level4.level_four_category_list.forEach(
                                    (level5) => {
                                      level5List.push({
                                        level5,
                                        level1,
                                        level2,
                                        level3,
                                        level4,
                                        path: `${level1.name} → ${level2.name} → ${level3.name} → ${level4.name}`,
                                      });
                                    }
                                  );
                                }
                              );
                            });
                          });
                        });

                        return level5List
                          .filter((item) =>
                            item.level5.name
                              .toLowerCase()
                              .includes(searchQueries.level5.toLowerCase())
                          )
                          .filter(
                            (item) => item.level5._id !== selectedlevel5 // ✅ Hide already selected
                          )
                          .map((item) => (
                            <div
                              key={`${item.level5._id}-${item.level1._id}-${item.level2._id}-${item.level3._id}-${item.level4._id}`}
                              className="dropdown-option"
                              onClick={() => {
                                setSelectedCategoryId(item.level1._id);
                                setSelectedLevel2Id(item.level2._id);
                                setSelectedLevel3Id(item.level3._id);
                                setSelectedlevel4(item.level4._id);
                                handleLevelSelect(5, item.level5._id);
                                handleCategorySelectForVariants(
                                  item.level5._id,
                                  "level-5"
                                );
                                setIslevel5DropdownOpen(false);
                              }}
                            >
                              <span>
                                {item.level5.name}
                                <small
                                  style={{ color: "#999", marginLeft: "8px" }}
                                >
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
          {/* Level 6 Dropdown */}
          {/* Level 6 Dropdown */}
          {/* Level 6 Dropdown */}
          {/* Level 6 Dropdown */}
          {/* Level 6 Dropdown */}
          <div className="DropdownColumn" ref={categoryDropdown6Ref}>
            <label htmlFor="level6Select">Level 6:</label>
            <div
              className="custom-dropdown"
              onClick={() => setIslevel6DropdownOpen(!islevel6DropdownOpen)}
            >
              <div className="selected-category">
                {selectedlevel6
                  ? (levelFiveCategory?.level_five_category_list ?? []).find(
                      (level6) => level6._id === selectedlevel6
                    )?.name
                  : "Select category"}
                <span className="dropdown-icons">
                  <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                </span>
              </div>
              {islevel6DropdownOpen && (
                <div className="dropdown-options">
                  <input
                    type="text"
                    placeholder="Search category..."
                    value={searchQueries.level6}
                    onChange={(e) =>
                      handleSearchChange("level6", e.target.value)
                    }
                    className="dropdown-search-input"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div
                    className="dropdown-option"
                    onClick={() => handleLevelSelect(6, "")}
                  >
                    <span>Select category</span>
                  </div>
                  {selectedlevel5
                    ? (levelFiveCategory?.level_five_category_list ?? [])
                        .filter((level6) =>
                          level6.name
                            .toLowerCase()
                            .includes(searchQueries.level6.toLowerCase())
                        )
                        .map((level6) => (
                          <div
                            key={level6._id}
                            className="dropdown-option"
                            onClick={() => {
                              handleLevelSelect(6, level6._id);
                              handleCategorySelectForVariants(
                                level6._id,
                                "level-6"
                              );
                              setIslevel6DropdownOpen(false);
                            }}
                          >
                            <span>{level6.name}</span>
                          </div>
                        ))
                    : (() => {
                        // When Level 5 is NOT selected, show all Level 6s with their EXACT parent path
                        const level6List = [];
                        categories.category_list.forEach((level1) => {
                          level1.level_one_category_list.forEach((level2) => {
                            level2.level_two_category_list.forEach((level3) => {
                              level3.level_three_category_list.forEach(
                                (level4) => {
                                  level4.level_four_category_list.forEach(
                                    (level5) => {
                                      // ✅ KEY FIX: Only show level6s that belong to THIS specific path
                                      level5.level_five_category_list.forEach(
                                        (level6) => {
                                          level6List.push({
                                            level6,
                                            level1,
                                            level2,
                                            level3,
                                            level4,
                                            level5,
                                            path: `${level1.name} → ${level2.name} → ${level3.name} → ${level4.name} → ${level5.name}`,
                                          });
                                        }
                                      );
                                    }
                                  );
                                }
                              );
                            });
                          });
                        });

                        return level6List
                          .filter((item) =>
                            item.level6.name
                              .toLowerCase()
                              .includes(searchQueries.level6.toLowerCase())
                          )
                          .filter(
                            (item) => item.level6._id !== selectedlevel6 // ✅ Hide already selected
                          )
                          .map((item) => (
                            <div
                              key={`${item.level6._id}-${item.level1._id}-${item.level2._id}-${item.level3._id}-${item.level4._id}-${item.level5._id}`}
                              className="dropdown-option"
                              onClick={() => {
                                setSelectedCategoryId(item.level1._id);
                                setSelectedLevel2Id(item.level2._id);
                                setSelectedLevel3Id(item.level3._id);
                                setSelectedlevel4(item.level4._id);
                                setSelectedlevel5(item.level5._id);
                                handleLevelSelect(6, item.level6._id);
                                handleCategorySelectForVariants(
                                  item.level6._id,
                                  "level-6"
                                );
                                setIslevel6DropdownOpen(false);
                              }}
                            >
                              <span>
                                {item.level6.name}
                                <small
                                  style={{ color: "#999", marginLeft: "8px" }}
                                >
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
      {isAddProductVisible && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAddVariant(
              variantsData.category_varient_id,
              selectedCategoryForVariant,
              selectedCategoryLevelForVariant
            );
          }}
          className="addvariant_btn"
        >
          + Add variant
        </button>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading ? (
        <div className="loading-container">
          <SyncLoader color="#3498db" loading={loading} size={15} />
        </div>
      ) : variantsData.varient_list && variantsData.varient_list.length > 0 ? (
        <div>
          {variantsData.varient_list && (
            <div className="variant-container">
              <div className="variant-header">
                <span>Variants</span>
              </div>
              {variantList.length > 0 ? (
                <div className="variant-container">
                  <div className="variant-option-table">
                    <table>
                      <thead>
                        <tr>
                          <th style={{ width: "12%" }}>Option Type</th>
                          <th style={{ width: "20%" }}>Values</th>
                          <th style={{ width: "27%", display: "none" }}>
                            Applicable Categories
                          </th>
                          <th style={{ width: "13%" }}>
                            Other Available Categories
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {variantList.map((variant, index) => (
                          <tr key={index}>
                            <td>
                              {variant.type_name}{" "}
                              <button
                                onClick={() =>
                                  handleAddVariantValue(
                                    variant.type_id,
                                    variant.varient_option_id
                                  )
                                }
                                className="add-variant-value-button"
                              >
                                +
                              </button>
                            </td>
                            <td>
                              {variant.option_value_list.length > 0 ? (
                                <ul className="option-value-list">
                                  {variant.option_value_list.map((value) => {
                                    const isSelected = rowSelectedValues[
                                      index
                                    ]?.some(
                                      (item) =>
                                        item.type_value_id ===
                                        value.type_value_id
                                    );
                                    return (
                                      <li
                                        key={value.type_value_id}
                                        className={`option-value-item ${
                                          isSelected ? "selected" : ""
                                        }`}
                                        style={{
                                          cursor: "pointer",
                                          padding: "6px",
                                          backgroundColor: isSelected
                                            ? "#d7ffe6"
                                            : "#fff",
                                          border: "1px solid #ccc",
                                          borderRadius: "4px",
                                          marginBottom: "4px",
                                        }}
                                        onClick={() =>
                                          handleOptionSelect(
                                            value.type_value_name,
                                            value.type_value_id,
                                            index
                                          )
                                        }
                                      >
                                        {isSelected && (
                                          <span
                                            style={{
                                              marginRight: "8px",
                                              color: "#18b418",
                                            }}
                                          >
                                            ✔
                                          </span>
                                        )}
                                        {value.type_value_name}
                                      </li>
                                    );
                                  })}
                                </ul>
                              ) : (
                                <span>No values available</span>
                              )}
                            </td>
                            <td style={{ display: "none" }}>
                              <ul className="option-category-list">
                                {variant.tagged_category_list
                                  .filter((item) => item)
                                  .map((item, index) => (
                                    <li key={index}>{item}</li>
                                  ))}
                              </ul>
                            </td>
                            <td>
                              <div style={{ margin: "10px 0" }}>
                                <div
                                  ref={(el) =>
                                    (dropdownRef.current[index] = el)
                                  }
                                  style={{
                                    position: "relative",
                                    display: "inline-block",
                                  }}
                                >
                                  <div
                                    style={{
                                      padding: "10px",
                                      borderRadius: "5px",
                                      border: "1px solid #ccc",
                                      width: "225px",
                                      cursor: "pointer",
                                      background: "#fff",
                                      fontSize: "14px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                    }}
                                    onClick={() => {
                                      handleDropdownClick(index);
                                    }}
                                  >
                                    Select Category
                                    <span
                                      style={{
                                        fontSize: "12px",
                                        color: "#918f8f",
                                      }}
                                    >
                                      ▼
                                    </span>
                                  </div>

                                  {dropdownOpen[index] && (
                                    <div
                                      style={{
                                        width: "228px",
                                        border: "1px solid #ccc",
                                        backgroundColor: "#fff",
                                        zIndex: 1000,
                                        maxHeight: "130px",
                                        overflowY: "auto",
                                        padding: "8px",
                                        position: "absolute",
                                        top: "110%",
                                        left: 0,
                                        boxShadow:
                                          "0 4px 6px rgba(0, 0, 0, 0.1)",
                                        borderRadius: "5px",
                                      }}
                                    >
                                      <input
                                        type="text"
                                        placeholder="Search category..."
                                        value={searchQuery}
                                        onChange={handleSearchChangedropdown}
                                        className="dropdown-search-input"
                                        onClick={(e) => e.stopPropagation()}
                                        style={{
                                          width: "92%",
                                          padding: "6px",
                                          marginBottom: "8px",
                                          fontSize: "14px",
                                          border: "1px solid #ccc",
                                          borderRadius: "4px",
                                        }}
                                      />
                                      <div
                                        style={{
                                          padding: "8px",
                                          cursor: "pointer",
                                          background: "lightgrey",
                                          borderRadius: "4px",
                                          marginBottom: "4px",
                                          fontSize: "14px",
                                        }}
                                        onClick={() =>
                                          handleCategorySelectdropdown(
                                            { target: { value: "all" } },
                                            index
                                          )
                                        }
                                      >
                                        Apply to all categories
                                      </div>
                                      {filteredCategoriesdropdown.length > 0 ? (
                                        filteredCategoriesdropdown.map(
                                          (category) => (
                                            <div
                                              style={{
                                                padding: "6px",
                                                cursor: "pointer",
                                                borderRadius: "4px",
                                                background:
                                                  selectedCategoryIds.includes(
                                                    category.id
                                                  )
                                                    ? "#d7ffe6"
                                                    : "#fff",
                                                fontSize: "14px",
                                                marginBottom: "2px",
                                              }}
                                              onClick={() =>
                                                handleCategorySelectdropdown(
                                                  {
                                                    target: {
                                                      value: category.id,
                                                    },
                                                  },
                                                  index
                                                )
                                              }
                                            >
                                              {rowSelectedCategoryIds[
                                                index
                                              ]?.includes(category.id) && (
                                                <span
                                                  style={{
                                                    marginRight: "8px",
                                                    color: "#18b418",
                                                  }}
                                                >
                                                  ✔
                                                </span>
                                              )}
                                              {category.category_name}
                                            </div>
                                          )
                                        )
                                      ) : (
                                        <div
                                          style={{
                                            padding: "6px",
                                            fontSize: "14px",
                                            color: "#999",
                                          }}
                                        >
                                          No categories found.
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                                {rowSelectedCategoryIds[index]?.length > 0 && (
                                  <button
                                    onClick={() =>
                                      handleApplyClick(
                                        variant.varient_option_id,
                                        variant.type_id,
                                        selectedCategoryLevelForVariant,
                                        variant.option_value_list
                                      )
                                    }
                                    style={{
                                      margin: "0px 0px 0px 10px",
                                      width: "20%",
                                      padding: "11px 2px 10px 2px",
                                    }}
                                  >
                                    Apply
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div>No variants found</div>
              )}
            </div>
          )}
        </div>
      ) : selectedCategoryForVariant && selectedCategoryForVariant !== "" ? (
        <div className="variant-container">
          <div className="no-variants-message">
            No variants found for the selected category
          </div>
        </div>
      ) : null}{" "}
    </div>
  );
};

export default VariantList;
