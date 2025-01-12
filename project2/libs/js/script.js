/*PRELOADER HANDLING */
$(window).on("load", function () {
  if ($("#preloader").length) {
    $("#preloader")
      .delay(1500)
      .fadeOut("slow", function () {
        $(this).remove();
      });
  }
  /*GET ALL PERSONNEL DYNAMICALLY */
  $.ajax({
  url: "libs/php/getAll.php",
  type: "GET",
  dataType: "json",
  success: function (result) {
    if (result.status.name == "ok") {
      const frag = document.createDocumentFragment();

      result.data.forEach((personnel) => {
        const row = document.createElement("tr");
        
        const nameCell = document.createElement("td");
        nameCell.className = "align-middle text-nowrap";
        nameCell.textContent = `${personnel.lastName}, ${personnel.firstName}`;
        row.appendChild(nameCell);

        const deptCell = document.createElement("td");
        deptCell.className = "align-middle text-nowrap d-none d-md-table-cell";
        deptCell.textContent = personnel.departmentName;
        row.appendChild(deptCell);

        const locCell = document.createElement("td");
        locCell.className = "align-middle text-nowrap d-none d-md-table-cell";
        locCell.textContent = personnel.location;
        row.appendChild(locCell);

        const emailCell = document.createElement("td");
        emailCell.className = "align-middle text-nowrap d-none d-md-table-cell";
        emailCell.textContent = personnel.email;
        row.appendChild(emailCell);

        const actionCell = document.createElement("td");
        actionCell.className = "text-end text-nowrap";
        actionCell.innerHTML = `
          <button type="button" class="btn btn-primary btn-sm edit-personnel-btn" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id=${personnel.id}>
            <i class="fa-solid fa-pencil fa-fw"></i>
          </button>
          <button type="button" class="btn btn-primary btn-sm delete-personnel-btn" data-id=${personnel.id}>
            <i class="fa-solid fa-trash fa-fw"></i>
          </button>
        `;
        row.appendChild(actionCell);

        frag.appendChild(row);
      });

      $("#personnelTableBody").append(frag);
    }
  },
  error: function (jqXHR, textStatus, errorThrown) {
    $("#popupErrorModal .modal-body").text("Error fetching all personnel data.");
    $("#popupErrorModal").modal("show");
  }
});

  /*GET ALL DEPARTMENTS DYNAMICALLY */
  $.ajax({
    url: "libs/php/getAll.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      if (result.status.name == "ok") {
        const frag = document.createDocumentFragment();

        result.data.forEach((department) => {
          const row = document.createElement("tr");

          const deptCell = document.createElement("td");
          deptCell.classList = "align-middle-text-nowrap";
          deptCell.textContent = department.departmentName;
          row.append(deptCell);

          const locCell = document.createElement("td");
          locCell.classList = "align-middle-text-nowrap d-none d-md-table-cell";
          locCell.textContent = department.location;
          row.append(locCell);

          const actionCell = document.createElement("td");
          actionCell.classList = "align-middle text-end text-nowrap";
          actionCell.innerHTML = `
            <button type="button" class="btn btn-primary btn-sm edit-department-btn" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id=${department.departmentId}>
              <i class="fa-solid fa-pencil fa-fw"></i>
            </button>
            <button type="button" class="btn btn-primary btn-sm delete-department-btn" data-id=${department.departmentId}>
              <i class="fa-solid fa-trash fa-fw"></i>
            </button> 
          `;
          row.append(actionCell);

          frag.appendChild(row);
        });
        $("#departmentTableBody").append(frag);
      }
    }, error: function () {
      $("#popupErrorModal .modal-body").text("Error fetching all departments.");
      $("#popupErrorModal").modal("show");
    }
  });

  /*GET ALL LOCATIONS DYNAMICALLY*/
  $.ajax({
    url: "libs/php/getAll.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      if (result.status.name == "ok") {
        const frag = document.createDocumentFragment();
        result.data.forEach((location) => {
          const row = document.createElement("tr");

          const locCell = document.createElement("td");
          locCell.classList = "align-middle-text-nowrap";
          locCell.textContent = location.location;
          row.append(locCell);

          const actionCell = document.createElement("td");
          actionCell.classList = "align-middle text-end text-nowrap";
          actionCell.innerHTML = `
            <button type="button" class="btn btn-primary btn-sm edit-location-btn" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id=${location.id}>
              <i class="fa-solid fa-pencil fa-fw"></i>
            </button>
            <button type="button" class="btn btn-primary btn-sm delete-location-btn" data-id=${location.id}>
              <i class="fa-solid fa-trash fa-fw"></i>
            </button>
          `;
          row.append(actionCell);

          frag.appendChild(row);
        });
        $("#locationTableBody").append(frag);
      }
    }, error: function () {
      $("#popupErrorModal .modal-body").text("Error fetching all locations.");
      $("#popupErrorModal").modal("show");
    }
  });

  $(document).on("ready", function () {
    $("#searchInp").val(""); // Clear the search input field
});

  $("#searchInp").on("keyup", function () {
    let searchTerm = $(this).val().trim();

    $.ajax({
        url: "libs/php/searchAll.php",
        type: "POST",
        data: {
            txt: searchTerm
        },
        dataType: "json",
        success: function (result) {
            if (result.status.name == "ok") {
              const personnelFrag = document.createDocumentFragment();
                $("#personnelTableBody").empty();
                $("#departmentTableBody").empty();
                $("#locationTableBody").empty();

                if (result.data.personnel && result.data.personnel.length > 0) {
                    result.data.personnel.forEach((item) => {
                      const row = document.createElement("tr");
        
                      const nameCell = document.createElement("td");
                      nameCell.className = "align-middle text-nowrap";
                      nameCell.textContent = `${item.lastName}, ${item.firstName}`;
                      row.appendChild(nameCell);
              
                      const deptCell = document.createElement("td");
                      deptCell.className = "align-middle text-nowrap d-none d-md-table-cell";
                      deptCell.textContent = item.departmentName;
                      row.appendChild(deptCell);
              
                      const locCell = document.createElement("td");
                      locCell.className = "align-middle text-nowrap d-none d-md-table-cell";
                      locCell.textContent = item.location;
                      row.appendChild(locCell);
              
                      const emailCell = document.createElement("td");
                      emailCell.className = "align-middle text-nowrap d-none d-md-table-cell";
                      emailCell.textContent = item.email;
                      row.appendChild(emailCell);
              
                      const actionCell = document.createElement("td");
                      actionCell.className = "text-end text-nowrap";
                      actionCell.innerHTML = `
                        <button type="button" class="btn btn-primary btn-sm edit-personnel-btn" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id=${item.id}>
                          <i class="fa-solid fa-pencil fa-fw"></i>
                        </button>
                        <button type="button" class="btn btn-primary btn-sm delete-personnel-btn" data-id=${item.id}>
                          <i class="fa-solid fa-trash fa-fw"></i>
                        </button>
                      `;
                      row.appendChild(actionCell);
              
                      personnelFrag.appendChild(row);
                    });
              
                    $("#personnelTableBody").append(personnelFrag);
                } else {
                    const row = document.createElement("tr");
                    const noPersonnelCell = document.createElement("td");
                    noPersonnelCell.colSpan = 5;
                    noPersonnelCell.textContent = "No personnel found";
                    noPersonnelCell.classList.add("text-center");
                    row.appendChild(noPersonnelCell);
                    $("#personnelTableBody").append(row);
                }

                const departmentFrag = document.createDocumentFragment();
                if (result.data.departments && result.data.departments.length > 0) {
                  result.data.departments.forEach((item) => {
                    const row = document.createElement("tr");

                    const deptCell = document.createElement("td");
                    deptCell.classList = "align-middle-text-nowrap";
                    deptCell.textContent = item.departmentName;
                    row.append(deptCell);
          
                    const locCell = document.createElement("td");
                    locCell.classList = "align-middle-text-nowrap d-none d-md-table-cell";
                    locCell.textContent = item.location;
                    row.append(locCell);
          
                    const actionCell = document.createElement("td");
                    actionCell.classList = "align-middle text-end text-nowrap";
                    actionCell.innerHTML = `
                      <button type="button" class="btn btn-primary btn-sm edit-department-btn" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id=${item.id}>
                        <i class="fa-solid fa-pencil fa-fw"></i>
                      </button>
                      <button type="button" class="btn btn-primary btn-sm delete-department-btn" data-id=${item.id}>
                        <i class="fa-solid fa-trash fa-fw"></i>
                      </button> 
                    `;
                    row.append(actionCell);
          
                    departmentFrag.appendChild(row);
                  });
                  $("#departmentTableBody").append(departmentFrag);
              } else {
                  const row = document.createElement("tr");
                  const noDepartmentCell = document.createElement("td");
                  noDepartmentCell.colSpan = 5;
                  noDepartmentCell.textContent = "No departments found";
                  noDepartmentCell.classList.add("text-center");
                  row.appendChild(noDepartmentCell);
                  $("#departmentTableBody").append(row);
              }
                const locationFrag = document.createDocumentFragment();
                if (result.data.locations && result.data.locations.length > 0) {
                    result.data.locations.forEach((item) => {
                      const row = document.createElement("tr");

                      const locCell = document.createElement("td");
                      locCell.classList = "align-middle-text-nowrap";
                      locCell.textContent = item.locationName;
                      row.append(locCell);

                      const actionCell = document.createElement("td");
                      actionCell.classList = "align-middle text-end text-nowrap";
                      actionCell.innerHTML = `
                        <button type="button" class="btn btn-primary btn-sm edit-location-btn" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id=${item.id}>
                          <i class="fa-solid fa-pencil fa-fw"></i>
                        </button>
                        <button type="button" class="btn btn-primary btn-sm delete-location-btn" data-id=${item.id}>
                          <i class="fa-solid fa-trash fa-fw"></i>
                        </button>
                      `;
                      row.append(actionCell);
                      locationFrag.appendChild(row);
                    });
                    $("#locationTableBody").append(locationFrag);
                } else {
                    const row = document.createElement("tr");
                    const noLocationCell = document.createElement("td");
                    noLocationCell.colSpan = 5;
                    noLocationCell.textContent = "No locations found";
                    noLocationCell.classList.add("text-center");
                    row.appendChild(noLocationCell);
                    $("#locationTableBody").append(row);
                }
                
            } else {
              $("#popupErrorModal .modal-body").text("SearchAll API Response Error.");
              $("#popupErrorModal").modal("show");
            }
        },
        error: function (xhr, status, error) {
          $("#popupErrorModal .modal-body").text("SearchAll AJAX Error.");
          $("#popupErrorModal").modal("show");
        }
    });
});

  /*REFRESH PERSONNEL, DEPARTMENT AND LOCATION TABLES*/
  $("#refreshBtn").on("click", function () {
    
    if ($("#personnelBtn").hasClass("active")) {      
      refreshPersonnelTable();

    } else if ($("#departmentsBtn").hasClass("active")) {
      refreshDepartmentTable();

    } else if ($("#locationsBtn").hasClass("active")) {
      refreshLocationTable();
    }
  });

  /*REFRESH PERSONNEL TABLE*/
  
  $("#personnelBtn").on("click", function () {
    $("#filterBtn").attr("disabled", false);
    refreshPersonnelTable();
  });

  /*REFRESH DEPARTMENT TABLE*/

  $("#departmentsBtn").on("click", function () {
    $("#filterBtn").attr("disabled", true);
    refreshDepartmentTable();
  });
  
  /*REFRESH LOCATION TABLE*/
  $("#locationsBtn").on("click", function () {
    $("#filterBtn").attr("disabled", true);
    refreshLocationTable();
  });
  
  $("#filterBtn").on("click", function () {
    if ($("#personnelBtn").hasClass("active")) {
      $("#filterPersonnelModal").modal("show");
      $.ajax({
        url: "libs/php/getAllDepartments.php",
        type: "GET",
        success: function (response) {
          const result = typeof response === "string" ? JSON.parse(response) : response;
          if (result.status.name == "ok") {
            const departmentFilter = $("#filterPersonnelByDepartment");
            departmentFilter.empty();
            departmentFilter.append(`<option value="0">All</option>`)
            result.data.forEach(department => {
              departmentFilter.append(`
                  <option value="${department.departmentID}">${department.departmentName}</option>
              `);
            });
          } else {
            $("#popupErrorModal .modal-body").text("Get all departments API response error.");
            $("#popupErrorModal").modal("show");
          }
        },
        error: function () {
          $("#popupErrorModal .modal-body").text("Failed to fetch departments.");
          $("#popupErrorModal").modal("show");
        }
  });

  $.ajax({
    url: "libs/php/getAllLocations.php",
    type: "GET",
    success: function (response) {
      const result = typeof response === "string" ? JSON.parse(response) : response;
      if (result.status.name == "ok") {
        const locationFilter = $("#filterPersonnelByLocation");
        locationFilter.empty();
        locationFilter.append(`<option value="0">All</option>`)
        result.data.forEach(location => {
          locationFilter.append(`
            <option value="${location.locationID}">${location.locationName}</option>
          `);
        });
      } else {
        $("#popupErrorModal .modal-body").text("Get all locations API response error.");
        $("#popupErrorModal").modal("show");
      }
    },
    error: function () {
      $("#popupErrorModal .modal-body").text("Failed to fetch locations.");
      $("#popupErrorModal").modal("show");
    }
  });

  } else {
    $("#filterErrorModal .modal-body").text("Filtering is only available for personnel.");
    $("#filterErrorModal").modal("show");
  }
});

  /*FILTER PERSONNEL BY DEPARTMENT */
  $("#filterPersonnelByDepartment").on("change", function () {
    if (this.value > 0) {
        $("#filterPersonnelByLocation").val(0);
    }
    var selectedDepartment = $("#filterPersonnelByDepartment option:selected").val() || "";
    $.ajax({
      url: "libs/php/filterPersonnel.php",
      type: "POST",
      data: { department: selectedDepartment},
      dataType: "json",
      success: function (result) {
        if (result.status.name == "ok") {
          const frag = document.createDocumentFragment();
          $("#personnelTableBody").empty();
          if (result.data.personnel.length > 0) {
          result.data.personnel.forEach(personnel => {
            const row = document.createElement("tr");

            const nameCell = document.createElement("td");
            nameCell.className = "align-middle text-nowrap";
            nameCell.textContent = `${personnel.lastName}, ${personnel.firstName}`;
            row.appendChild(nameCell);

            const deptCell = document.createElement("td");
            deptCell.className = "align-middle text-nowrap d-none d-md-table-cell";
            deptCell.textContent = personnel.departmentName;
            row.appendChild(deptCell);

            const locCell = document.createElement("td");
            locCell.className = "align-middle text-nowrap d-none d-md-table-cell";
            locCell.textContent = personnel.location;
            row.appendChild(locCell);

            const emailCell = document.createElement("td");
            emailCell.className = "align-middle text-nowrap d-none d-md-table-cell";
            emailCell.textContent = personnel.email;
            row.appendChild(emailCell);

            const actionCell = document.createElement("td");
            actionCell.className = "text-end text-nowrap";
            actionCell.innerHTML = `
              <button type="button" class="btn btn-primary btn-sm edit-personnel-btn" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id=${personnel.id}>
                <i class="fa-solid fa-pencil fa-fw"></i>
              </button>
              <button type="button" class="btn btn-primary btn-sm delete-personnel-btn" data-id=${personnel.id}>
                <i class="fa-solid fa-trash fa-fw"></i>
              </button>
            `;
            row.appendChild(actionCell);

            frag.appendChild(row);
          });
          $("#personnelTableBody").append(frag);
          } else {
            $("#popupErrorModal .modal-body").text("No personnel found for that particular department.");
            $("#popupErrorModal").modal("show");
          }
        } else {
          $("#popupErrorModal .modal-body").text("Error fetching personnel filtered by department.");
          $("#popupErrorModal").modal("show");
        }
      },
      error: function () {
        $("#popupErrorModal .modal-body").text("Failed to fetch personnel filtered by department.");
        $("#popupErrorModal").modal("show");
      }
    });
  });

  /* FILTER PERSONNEL BY LOCATION */
  $("#filterPersonnelByLocation").on("change", function () {
    if (this.value > 0) {
        $("#filterPersonnelByDepartment").val(0);
    }
    var selectedLocation = $("#filterPersonnelByLocation option:selected").val() || "";
    $.ajax({
      url: "libs/php/filterPersonnel.php",
      type: "POST",
      data: { location: selectedLocation },
      dataType: "json",
      success: function (result) {
        if (result.status.name == "ok") {
          const frag = document.createDocumentFragment();
          $("#personnelTableBody").empty();
          if (result.data.personnel.length > 0) {
          result.data.personnel.forEach(personnel => {
            const row = document.createElement("tr");

            const nameCell = document.createElement("td");
            nameCell.className = "align-middle text-nowrap";
            nameCell.textContent = `${personnel.lastName}, ${personnel.firstName}`;
            row.appendChild(nameCell);

            const deptCell = document.createElement("td");
            deptCell.className = "align-middle text-nowrap d-none d-md-table-cell";
            deptCell.textContent = personnel.departmentName;
            row.appendChild(deptCell);

            const locCell = document.createElement("td");
            locCell.className = "align-middle text-nowrap d-none d-md-table-cell";
            locCell.textContent = personnel.location;
            row.appendChild(locCell);

            const emailCell = document.createElement("td");
            emailCell.className = "align-middle text-nowrap d-none d-md-table-cell";
            emailCell.textContent = personnel.email;
            row.appendChild(emailCell);

            const actionCell = document.createElement("td");
            actionCell.className = "text-end text-nowrap";
            actionCell.innerHTML = `
              <button type="button" class="btn btn-primary btn-sm edit-personnel-btn" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id=${personnel.id}>
                <i class="fa-solid fa-pencil fa-fw"></i>
              </button>
              <button type="button" class="btn btn-primary btn-sm delete-personnel-btn" data-id=${personnel.id}>
                <i class="fa-solid fa-trash fa-fw"></i>
              </button>
            `;
            row.appendChild(actionCell);

            frag.appendChild(row);
          });
          $("#personnelTableBody").append(frag);
          } else {
          $("#popupErrorModal .modal-body").text("No personnel found for that particular location.");
          $("#popupErrorModal").modal("show");
          }
        } else {
          $("#popupErrorModal .modal-body").text("Error fetching personnel filtered by location.");
          $("#popupErrorModal").modal("show");
        }
      },
      error: function () {
        $("#popupErrorModal .modal-body").text("Failed to fetch personnel filtered by location.");
        $("#popupErrorModal").modal("show");
      }
    });
  });
  
  /* ADD PERSONNEL, LOCATIONS AND DEPARTMENTS USING #ADDBTN */
  $("#addBtn").on("click", function () {

    /* 1ST CONDITION: ADD PERSONNEL */
    if ($("#personnelBtn").hasClass("active")) {
      $("#addPersonnelModal").modal("show");
      
      /* 2ND CONDITION: ADD DEPARTMENT */
    } else if ($("#departmentsBtn").hasClass("active")) {
      $("#addDepartmentModal").modal("show");
    
    /*3RD CONDITION: ADD LOCATION */
    } else {
      $("#addLocationModal").modal("show");
    }
  });
   
  /* ADD PERSONNEL MODAL */
  $("#addPersonnelModal").on("show.bs.modal", function () {
    $.ajax({
      url: "libs/php/getAllDepartments.php",
      type: "GET",
      dataType: "json",
      success: function (result) {
          if (result.status.name == "ok") {
            const addPersonnelDepartment = document.getElementById("addPersonnelDepartment");
            addPersonnelDepartment.innerHTML = "";

              result.data.forEach((department) => {
                const option = document.createElement("option");
                option.value = department.departmentID;
                option.textContent = department.departmentName;
                addPersonnelDepartment.appendChild(option);
              });
              
          } else {
            $("#popupErrorModal .modal-body").text("Failed to fetch departments.");
            $("#popupErrorModal").modal("show");
              
          }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#popupErrorModal .modal-body").text("Failed to fetch departments for Add Personnel modal.");
        $("#popupErrorModal").modal("show");
      },
  });

    $.ajax({
        url: "libs/php/getAllLocations.php",
        type: "GET",
        dataType: "json",
        success: function (result) {
            if (result.status.name == "ok") {
              const addPersonnelLocation = document.getElementById("addPersonnelLocation");
              addPersonnelLocation.innerHTML = "";
                result.data.forEach((location) => {
                  const option = document.createElement("option");
                  option.value = location.locationID;
                  option.textContent = location.locationName;
                  addPersonnelLocation.appendChild(option);
                });

            } else {
                $("#popupErrorModal .modal-body").text("Failed to fetch locations for Add Personnel modal.");
                $("#popupErrorModal").modal("show");
            }
        }
    });
  });

  /*ADD PERSONNEL SUBMIT */
  $("#addPersonnelModal").on("submit", "#addPersonnelForm", function (e) {
    e.preventDefault();

    // Get form values
    let firstName = $("#addPersonnelFirstName").val();
    let lastName = $("#addPersonnelLastName").val();
    let email = $("#addPersonnelEmailAddress").val();
    let jobTitle = $("#addPersonnelJobTitle").val();
    let location = $("#addPersonnelLocation").val();
    let departmentID = $("#addPersonnelDepartment").val();

    // Check for duplicate personnel
    $.ajax({
        url: "libs/php/checkForDuplicatePersonnel.php",
        type: "POST",
        dataType: "json",
        data: {
            firstName: firstName,
            lastName: lastName,
            email: email
        },
        success: function (result) {
            if (result.status.name == "ok") {
                // Add personnel
                $.ajax({
                    url: "libs/php/addPersonnel.php",
                    type: "POST",
                    dataType: "json",
                    data: {
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        jobTitle: jobTitle,
                        departmentID: departmentID,
                        location: location
                    },
                    success: function (result) {
                        if (result.status.name == "ok") {
                            $("#addPersonnelModal").modal("hide");
                            refreshPersonnelTable();
                        }
                    },
                    error: function () {
                        $("#popupErrorModal .modal-body").text("Failed to add personnel.");
                        $("#popupErrorModal").modal("show");
                    }
                });
            } else {
                // Duplicate personnel found
                $("#addPersonnelModal").modal("hide");
                $("#addPersonnelErrorModal .modal-body").html(
                    `The entry for <b>${firstName}</b> <b>${lastName}</b> already exists.`
                );
                $("#addPersonnelErrorModal").modal("show");
            }
        },
        error: function () {
            $("#popupErrorModal .modal-body").text("Failed to check for duplicate employees.");
            $("#popupErrorModal").modal("show");
        }
    });
  });

  /*RESET ADD PERSONNEL FORM */
  $("#addPersonnelModal").on("hidden.bs.modal", function () {
    $("#addPersonnelForm")[0].reset();
  });
  
  /*EDIT PERSONNEL MODAL */
  $("#editPersonnelModal").on("show.bs.modal", function (e) {
    $("#editPersonnelFirstName").val("");
    $("#editPersonnelLastName").val("");
    $("#editPersonnelEmailAddress").val("");
    $("#editPersonnelJobTitle").val("");
    $("#editPersonnelDepartment").html("");

    const editPersonnelId = $(e.relatedTarget).attr("data-id");

    $(this).data("editPersonnelId", editPersonnelId);
    
    $.ajax({
      url: "libs/php/getPersonnelByID.php",
      type: "GET",
      dataType: "json",
      data: {
        id: editPersonnelId,
      },
      success: function (result) {
        if (result.status.name == "ok" && result.data.personnel.length > 0) {

          let personnel = result.data.personnel[0];
          let department = result.data.department;
          $("#editPersonnelEmployeeID").val(personnel.id);
          $("#editPersonnelFirstName").val(personnel.firstName);
          $("#editPersonnelLastName").val(personnel.lastName);
          $("#editPersonnelJobTitle").val(personnel.jobTitle);
          $("#editPersonnelEmailAddress").val(personnel.email);

          const editPersonnelDepartment = document.getElementById("editPersonnelDepartment");
          editPersonnelDepartment.innerHTML = "";

          department.forEach((item) => {
            const option = document.createElement("option"); // Create a new option element
            option.value = item.id; // Set the value attribute
            option.textContent = item.name; // Set the display text
            editPersonnelDepartment.appendChild(option); // Append the option to the select element
          });

          $("#editPersonnelDepartment").val(personnel.departmentID);
        } else {
          $("#popupErrorModal .modal-body").text("No personnel data found.");
          $("#popupErrorModal").modal("show");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#popupErrorModal .modal-body").text("Error retrieving data.");
        $("#popupErrorModal").modal("show");
      },
    });
  });

  /*EDIT PERSONNEL FORM SUBMIT */
  $("#editPersonnelForm").on("submit", function (e) {
    e.preventDefault();

    const editPersonnelId = $("#editPersonnelModal").data("editPersonnelId");

    $.ajax({
      url: "libs/php/updatePersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: editPersonnelId,
        firstName: $("#editPersonnelFirstName").val(),
        lastName: $("#editPersonnelLastName").val(),
        jobTitle: $("#editPersonnelJobTitle").val(),
        email: $("#editPersonnelEmailAddress").val(),
        departmentID: $("#editPersonnelDepartment").val(),
      },
      success: function (result) {
        if (result.status.name == "ok") {
          $("#editPersonnelModal").modal("hide");

          refreshPersonnelTable();
        } else {
          $("#popupErrorModal .modal-body").text("Error updating personnel.");
          $("#popupErrorModal").modal("show");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#popupErrorModal .modal-body").text("An error occurred in the edit personnel form.");
        $("#popupErrorModal").modal("show");
      },
    });
  });

  /* DELETE PERSONNEL MODAL */
  $(document).on("click", ".delete-personnel-btn", function () {
    const deletePersonnelId = $(this).data("id");

    if (!deletePersonnelId) {
      $("#popupErrorModal .modal-body").text("Invalid personnel ID.");
      $("#popupErrorModal").modal("show");
      return;
    }

    $("#deletePersonnelConfirmationModal").data("id", deletePersonnelId);

    $.ajax({
      url: "libs/php/getPersonnelDetails.php",
      type: "GET",
      data: 
      { 
        id: deletePersonnelId,
      },
      success: function (response) {
        const result = typeof response === "string" ? JSON.parse(response) : response;
        if (result.status.name == "ok") {
          let firstName = result.data.firstName;
          let lastName = result.data.lastName;

          if (firstName && lastName) {
            $("#deletePersonnelConfirmationMessage").html(
              `Are you sure that you want to remove the entry for <b>${firstName} ${lastName}</b>?`
            );
            $("#deletePersonnelId").val(deletePersonnelId);
            $("#deletePersonnelConfirmationModal").modal("show");
          } else {
            $("#popupErrorModal .modal-body").text("Incomplete personnel data.");
            $("#popupErrorModal").modal("show");
          }
        } else {
          $("#popupErrorModal .modal-body").text("Personnel not found.");
          $("#popupErrorModal").modal("show");
        }
  },
      error: function (xhr, status, error) {
        $("#popupErrorModal .modal-body").text("Error retrieving personnel details.");
        $("#popupErrorModal").modal("show");
      },
    });
  });

  /* DELETE PERSONNEL CONFIRMATION MODAL*/
  $("#deletePersonnelForm").on("submit", function(e) {
    e.preventDefault();
    const deletePersonnelId = $("#deletePersonnelId").val();
    $.ajax({
      url: "libs/php/deletePersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: deletePersonnelId,
      },
      success: function(result) {
        let firstName = result.data.deletedPersonnel.firstName;
        let lastName = result.data.deletedPersonnel.lastName;
        if (result.status.name == "ok") {
          $("#deletePersonnelConfirmationModal").modal("hide");
          refreshPersonnelTable();
        } else {
        $("#popupErrorModal .modal-body").text("Error deleting personnel.");
        $("#popupErrorModal").modal("show");
        }
  },
      error: function(jqXHR, textStatus, errorThrown) {
        $("#popupErrorModal .modal-body").text("Error deleting personnel.");
        $("#popupErrorModal").modal("show");
      }
    });
  });

  /* ADD DEPARTMENT MODAL */
  $("#addDepartmentModal").on("show.bs.modal", function (){
    $.ajax({
      url: "libs/php/getAllLocations.php",
      type: "GET",
      dataType: "json",
      success: function (result) {
        if (result.status.name == "ok") {
          const addDepartmentLocation = document.getElementById("addDepartmentLocation");
          addDepartmentLocation.innerHTML = "";

          result.data.forEach(function(location) {
            const option = document.createElement("option");
            option.value = location.locationID;
            option.textContent = location.locationName;
            addDepartmentLocation.appendChild(option);
          });
        } else {
          $("#popupErrorModal .modal-body").text("Failed to fetch locations for Add Department modal.");
          $("#popupErrorModal").modal("show");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#popupErrorModal .modal-body").text("Failed to load locations.");
        $("#popupErrorModal").modal("show");
      }
    });
  });


  /*ADD DEPARTMENT FORM SUBMIT */
  $("#addDepartmentModal").on("submit", "#addDepartmentForm", function (e) {
    e.preventDefault(); 
    
    $.ajax({
      url: "libs/php/checkForDuplicateDepartments.php",
      type: "POST",
      dataType: "json",
      data: {
        departmentName: $("#addDepartmentName").val(),
        locationID: $("#addDepartmentLocation option:selected").val()
      },
      success: function (result) {
        if (result.status.name == "ok") {
            $.ajax({
                url: "libs/php/addDepartment.php",
                type: "POST",
                dataType: "json",
                data: {
                  departmentName: $("#addDepartmentName").val(),
                  locationID: $("#addDepartmentLocation option:selected").val()
                },
                success: function (result) {
                  if (result.status.name == "ok") {              
                    $("#addDepartmentModal").modal("hide");
                    refreshDepartmentTable();
                  }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                  $("#popupErrorModal .modal-body").text("Failed to add department.");
                  $("#popupErrorModal").modal("show");
                }
            });
        } else {
            let departmentName = result.data.duplicates[0].departmentName;
            $("#addDepartmentModal").modal("hide");
            $("#addDepartmentErrorModal .modal-body").html(`The entry for <b>${departmentName}</b> cannot be added as it already exists in the directory.`);
            $("#addDepartmentErrorModal").modal("show");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#popupErrorModal .modal-body").text("Failed to check for duplicate departments.");
        $("#popupErrorModal").modal("show");
      }
    });
  });

  /* RESET ADD DEPARTMENT MODAL */
  $("#addDepartmentModal").on("hidden.bs.modal", function () {
    $("#addDepartmentForm")[0].reset();

  });

  /*EDIT DEPARTMENT MODAL */
  $("#editDepartmentModal").on("show.bs.modal", function (e) {

    document.getElementById("editDepartmentName").value = "";

    const editDepartmentId = e.relatedTarget.getAttribute("data-id");
    this.dataset.editDepartmentId = editDepartmentId;

    $.ajax({
      url: "libs/php/getDepartmentByID.php",
      type: "POST",
      dataType: "json",
      data: {
        departmentID: editDepartmentId,
      },
      success: function (result) {
        if (result.status.name == "ok" && result.data.department.length > 0) {
          let department = result.data.department[0];
          let locations = result.data.locations;
          document.getElementById("editDepartmentName").value = department.departmentName;

          const editDepartmentLocation = document.getElementById("editDepartmentLocation");
          editDepartmentLocation.innerHTML = ""; // Clear existing options
  
          locations.forEach(function (location) {
            const option = document.createElement("option");
            option.value = location.locationID;
            option.textContent = location.locationName;
            editDepartmentLocation.appendChild(option);
          });

          $("#editDepartmentLocation").val(department.locationID);
        } else {
          $("#popupErrorModal .modal-body").text("No department data found.");
          $("#popupErrorModal").modal("show");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#popupErrorModal .modal-body").text("Error retrieving data.");
        $("#popupErrorModal").modal("show");
      },
    });
  });

/* EDIT DEPARTMENT FORM SUBMIT*/
$("#editDepartmentForm").on("submit", function (e) {

  e.preventDefault();

  const editDepartmentId = $("#editDepartmentModal").data("editDepartmentId");

  $.ajax({
    url: "libs/php/updateDepartmentByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: editDepartmentId,
      departmentName: $("#editDepartmentName").val(),
      locationID: $("#editDepartmentLocation option:selected").val(),
    },
    success: function (result) {
      if (result.status.name == "ok") {
        $("#editDepartmentModal").modal("hide");
        refreshDepartmentTable();
      } else {
        $("#popupErrorModal .modal-body").text("Error updating the department.");
        $("#popupErrorModal").modal("show");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#popupErrorModal .modal-body").text("An error occurred in the edit department submit form.");
      $("#popupErrorModal").modal("show");
    },
  });
});

/*DELETE DEPARTMENT MODAL */
$(document).on("click", ".delete-department-btn", function () {
  const deleteDepartmentId = $(this).data("id");

  if (!deleteDepartmentId) {
    $("#popupErrorModal .modal-body").text("Invalid department ID.");
    $("#popupErrorModal").modal("show");
    return;
  }

  $("#deleteDepartmentConfirmationModal").data("id", deleteDepartmentId);

  $.ajax({
    url: "libs/php/getDepartmentDetails.php",
    type: "GET",
    dataType: "json",
    data: {
      id: deleteDepartmentId,
    },
    success: function (result) {
      if (result.status.name == "ok" && result.data) {
        const personnelCount = result.data.personnelCount;
        const departmentName = result.data.departmentName;

        if (personnelCount > 0) {
          const errorMessage = `You cannot remove the entry for <b>${departmentName}</b> because it has <b>${personnelCount}</b> employee${personnelCount === 1 ? "" : "s"} assigned to it.`;
          $("#deleteDepartmentErrorModal .modal-body").html(errorMessage);
          $("#deleteDepartmentErrorModal").modal("show");
          return;
        } else {
          // Update the modal with the confirmation message
          $("#deleteDepartmentConfirmationMessage").html(
            `Are you sure that you want to remove the entry for <b>${departmentName.trim()}</b>?`
          );
          $("#deleteDepartmentId").val(deleteDepartmentId);
          $("#deleteDepartmentConfirmationModal").modal("show");
        }
      } else {
        $("#popupErrorModal .modal-body").text("Error retrieving department details.");
        $("#popupErrorModal").modal("show");
      }
    },
    error: function () {
      $("#popupErrorModal .modal-body").text("Error retrieving department details.");
      $("#popupErrorModal").modal("show");
    },
  });
});

/* DELETE DEPARTMENT FORM SUBMIT */
$("#deleteDepartmentForm").on("submit", function (e) {
  e.preventDefault();
  const deleteDepartmentId = $("#deleteDepartmentId").val();
  $.ajax({
    url: "libs/php/deleteDepartmentByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: deleteDepartmentId,
    },
    success: function (result) {
      if (result.status.name == "ok") {
        const departmentName = result.data.departmentName;

        $("#deleteDepartmentConfirmationModal").modal("hide");
        refreshDepartmentTable();
      } else {
        $("#deleteDepartmentConfirmationModal").modal("hide");
        $("#popupErrorModal .modal-body").text("Error deleting department.");
        $("#popupErrorModal").modal("show");
      }
    },
    error: function () {
      $("#popupErrorModal .modal-body").text("Error deleting department.");
      $("#popupErrorModal").modal("show");
    },
  });
});

  /* DELETE DEPARTMENT MODAL */
  $("#deleteDepartmentConfirmationModal").on("hidden.bs.modal", function () {

    $("#deleteDepartmentConfirmationMessage").html("");
    $("#deleteDepartmentId").val("");
  });

  /*ADD LOCATION FORM SUBMIT */
  $("#addLocationModal").on("submit", function (e) {
    e.preventDefault();
      
    $.ajax({
      url: "libs/php/checkForDuplicateLocations.php",
      type: "POST",
      dataType: "json",
      data: {
        locationName: $("#addLocationName").val(),
      },
      success: function (result) {
        if (result.status.name == "ok") {
            $.ajax({
                url: "libs/php/addLocation.php",
                type: "POST",
                dataType: "json",
                data: {
                  locationName: $("#addLocationName").val(),
                  locationID: $("#addLocation option:selected").val()
                },
                success: function (result) {
                  if (result.status.name == "ok") {
                    $("#addLocationModal").modal("hide");
                    refreshLocationTable();
                  }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                  $("#popupErrorModal .modal-body").text("Failed to add location.");
                  $("#popupErrorModal").modal("show");
                }
              });
        } else {
            let locationName = result.data.duplicates[0].locationName;
            $("#addLocationModal").modal("hide");
            $("#addLocationErrorModal .modal-body").html(`The entry for <b>${locationName}</b> cannot be added as it already exists in the directory.`);;
            $("#addLocationErrorModal").modal("show");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#popupErrorModal .modal-body").text("Failed to check for duplicate locations.");
        $("#popupErrorModal").modal("show");
      }
    });
  });

  /* RESET ADD LOCATION FORM */
  $("#addLocationModal").on("hidden.bs.modal", function () {
    $("#addLocationForm")[0].reset();
  });

  /*EDIT LOCATION MODAL*/
  $("#editLocationModal").on("show.bs.modal", function (e) {

    $("#editLocationName").val("");

    const editLocationId = $(e.relatedTarget).attr("data-id");
    
    $("#editLocationModal").data("editLocationId", editLocationId);

    $.ajax({
      url: "libs/php/getLocationByID.php",
      type: "POST",
      dataType: "json",
      data: {
        locationId: editLocationId,
      },
      success: function (result) {
        if (result.status.name == "ok" && result.data.length > 0) {
          let locationName = result.data[0].locationName;
          $("#editLocationName").val(locationName);
        } else {
          $("#popupErrorModal .modal-body").text("Error retrieving location details.");
          $("#popupErrorModal").modal("show");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#popupErrorModal .modal-body").text("Error retrieving location details.");
        $("#popupErrorModal").modal("show");
      }
    });
  });

  /*EDIT LOCATION FORM SUBMIT*/
  $("#editLocationForm").on("submit", function (e) {
    e.preventDefault();

    const editLocationId = $("#editLocationModal").data("editLocationId");

    $.ajax({
      url: "libs/php/updateLocationByID.php",
      type: "POST",
      dataType: "json",
      data: {
        locationId: editLocationId,
        locationName: $("#editLocationName").val(),
      },
      success: function(result) {
        if (result.status.name == "ok") {
          $("#editLocationModal").modal("hide");
          refreshLocationTable();
        } else {
          $("#popupErrorModal .modal-body").text("Error updating the location.");
          $("#popupErrorModal").modal("show");
        }
      }, 
      error: function(jqXHR, textStatus, errorThrown) {
        $("#popupErrorModal .modal-body").text("An error occurred in the edit location submit form.");
        $("#popupErrorModal").modal("show");
      }
    })
})

  /*DELETE LOCATION MODAL */
  $(document).on("click", ".delete-location-btn", function () {
    const deleteLocationId = $(this).data("id");

    if (!deleteLocationId) {
      $("#popupErrorModal .modal-body").text("Invalid location ID.");
      $("#popupErrorModal").modal("show");
      return;
    }

    $("#deleteLocationConfirmationModal").data("id", deleteLocationId);

    $.ajax({
      url: "libs/php/getLocationDetails.php",
      type: "GET",
      dataType: "json",
      data: {
        id: deleteLocationId,
      },
      success: function (result) {
        if (result.status.name == "ok" && result.data) {
          const departmentCount = result.data.departmentCount;
          const locationName = result.data.locationName;

          if (departmentCount > 0) {
            const errorMessage = `You cannot remove the entry for <b>${locationName}</b> because it has <b>${departmentCount}</b> department${departmentCount === 1 ? "" : "s"} assigned to it.`;

            $("#deleteLocationConfirmationModal").modal("hide");
            $("#deleteLocationErrorModal").modal("hide");
            
            $("#deleteLocationErrorModal .modal-body").html(errorMessage);
            $("#deleteLocationErrorModal").modal("show");
            
            return;
          } else {
            $("#deleteLocationConfirmationModal .modal-body").html(
              `Are you sure that you want to remove the entry for <b>${locationName}</b>?`
            );
            $("#deleteLocationConfirmationModal").modal("show");
          }
        } else {
          $("#popupErrorModal .modal-body").text("Error retrieving location details.");
          $("#popupErrorModal").modal("show");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#popupErrorModal .modal-body").text("Failed to retrieve location details.");
        $("#popupErrorModal").modal("show");
      },
    });
  });  

  /* DELETE LOCATION CONFIRMATION MODAL*/
  $("#deleteLocationConfirmationModal .btn-delete-location-confirmation").on("click", function() {
  const deleteLocationId = $("#deleteLocationConfirmationModal").data("id");
    $.ajax({
      url: "libs/php/deleteLocationByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: deleteLocationId,
      },
      success: function(result) {
        if (result.status.name == "ok") {
          let locationName = result.data.locationName;
          $("#deleteLocationConfirmationModal").modal("hide");
          
          refreshLocationTable();
          $("#deleteLocationSuccessModal .modal-body").text(`The location ${locationName} was successfully deleted.`);
          $("#deleteLocationSuccessModal").modal("show");

        } else {
          $("#popupErrorModal .modal-body").text("Error deleting location.");
          $("#popupErrorModal").modal("show");
        }
    },
      error: function(jqXHR, textStatus, errorThrown) {
        $("#popupErrorModal .modal-body").text("Failed to delete location.");
        $("#popupErrorModal").modal("show");
      }
    });
  });


  /*REFRESH PERSONNEL TABLE FUNCTION*/
  function refreshPersonnelTable() {
    $("#searchInp").val("");
    $("#personnelTableBody").empty();

    $.ajax({
      url: "libs/php/updateAllPersonnel.php",
      type: "GET",
      dataType: "json",
      success: function (result) {
        if (result.status.name == "ok") {
          const frag = document.createDocumentFragment();

          result.data.forEach((personnel) => {
            const row = document.createElement("tr");
            
            const nameCell = document.createElement("td");
            nameCell.className = "align-middle text-nowrap";
            nameCell.textContent = `${personnel.lastName}, ${personnel.firstName}`;
            row.appendChild(nameCell);
    
            const deptCell = document.createElement("td");
            deptCell.className = "align-middle text-nowrap d-none d-md-table-cell";
            deptCell.textContent = personnel.departmentName;
            row.appendChild(deptCell);
    
            const locCell = document.createElement("td");
            locCell.className = "align-middle text-nowrap d-none d-md-table-cell";
            locCell.textContent = personnel.location;
            row.appendChild(locCell);
    
            const emailCell = document.createElement("td");
            emailCell.className = "align-middle text-nowrap d-none d-md-table-cell";
            emailCell.textContent = personnel.email;
            row.appendChild(emailCell);
    
            const actionCell = document.createElement("td");
            actionCell.className = "text-end text-nowrap";
            actionCell.innerHTML = `
              <button type="button" class="btn btn-primary btn-sm edit-personnel-btn" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id=${personnel.id}>
                <i class="fa-solid fa-pencil fa-fw"></i>
              </button>
              <button type="button" class="btn btn-primary btn-sm delete-personnel-btn" data-id=${personnel.id}>
                <i class="fa-solid fa-trash fa-fw"></i>
              </button>
            `;
            row.appendChild(actionCell);
    
            frag.appendChild(row);
          });
    
          $("#personnelTableBody").append(frag);
        } else {
          $("#popupErrorModal .modal-body").text("No personnel data available.");
          $("#popupErrorModal").modal("show");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#popupErrorModal .modal-body").text("Error refreshing all personnel.");
        $("#popupErrorModal").modal("show");
      }
    });
  }

  /*REFRESH DEPARTMENT TABLE FUNCTION*/
  function refreshDepartmentTable() {
    $("#searchInp").val("");
    $("#departmentTableBody").empty();

    $.ajax({
      url: "libs/php/updateAllDepartments.php",
      type: "GET",
      dataType: "json",
      success: function (result) {
        if (result.status.name == "ok") {
          const frag = document.createDocumentFragment();

          result.data.forEach((department) => {
            const row = document.createElement("tr");

            const deptCell = document.createElement("td");
            deptCell.classList = "align-middle-text-nowrap";
            deptCell.textContent = department.name;
            row.append(deptCell);

            const locCell = document.createElement("td");
            locCell.classList = "align-middle-text-nowrap d-none d-md-table-cell";
            locCell.textContent = department.location;
            row.append(locCell);

            const actionCell = document.createElement("td");
            actionCell.classList = "align-middle text-end text-nowrap";
            actionCell.innerHTML = `
              <button type="button" class="btn btn-primary btn-sm edit-department-btn" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id=${department.id}>
                <i class="fa-solid fa-pencil fa-fw"></i>
              </button>
              <button type="button" class="btn btn-primary btn-sm delete-department-btn" data-id=${department.id}>
                <i class="fa-solid fa-trash fa-fw"></i>
              </button> 
            `;
            row.append(actionCell);

            frag.appendChild(row);
          });
          $("#departmentTableBody").append(frag);
        } else {
          $("#popupErrorModal .modal-body").text("No department data available.");
          $("#popupErrorModal").modal("show");
        }
      }, 
      error: function () {
        $("#popupErrorModal .modal-body").text("Error refreshing all departments.");
        $("#popupErrorModal").modal("show");
      }
    })
  }

  /*REFRESH LOCATION TABLE FUNCTION*/
  function refreshLocationTable() {
    $("#searchInp").val("");
    $("#locationTableBody").empty();

    $.ajax({
      url: "libs/php/updateAllLocations.php",
      type: "GET",
      dataType: "json",
      success: function (result) {
        if (result.status.name == "ok") {
          const frag = document.createDocumentFragment(); // Create a DocumentFragment
          result.data.forEach((location) => {
            const row = document.createElement("tr");
      
            const locCell = document.createElement("td");
            locCell.classList = "align-middle text-nowrap";
            locCell.textContent = location.name; // Ensure you're using the correct key ('name' instead of 'location')
            row.append(locCell);
      
            const actionCell = document.createElement("td");
            actionCell.classList = "align-middle text-end text-nowrap";
            actionCell.innerHTML = `
              <button type="button" class="btn btn-primary btn-sm edit-location-btn" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id=${location.id}>
                <i class="fa-solid fa-pencil fa-fw"></i>
              </button>
              <button type="button" class="btn btn-primary btn-sm delete-location-btn" data-id=${location.id}>
                <i class="fa-solid fa-trash fa-fw"></i>
              </button>
            `;
            row.append(actionCell);
      
            frag.appendChild(row);
          });
          $("#locationTableBody").empty().append(frag);
        } else {
          $("#popupErrorModal .modal-body").text("No location data available.");
          $("#popupErrorModal").modal("show");
        }
      },
      error: function () {
        $("#popupErrorModal .modal-body").text("Error refreshing all locations.");
        $("#popupErrorModal").modal("show");
      }
      
    });
  }
});