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
        result.data.forEach((personnel) => {
          $("#personnelTableBody").append(`
            <tr>
              <td class="align-middle text-nowrap">
                <a href="#" class="view-personnel-name" data-id=${personnel.id}>${personnel.lastName}, ${personnel.firstName}
                </a>
              </td>
              <td class="align-middle text-nowrap d-none d-md-table-cell">${personnel.departmentName}</td>
              <td class="align-middle text-nowrap d-none d-md-table-cell">${personnel.location}</td>
              <td class="align-middle text-nowrap d-none d-md-table-cell">${personnel.email}</td>
              <td class="text-end text-nowrap">
                  <button type="button" class="btn btn-primary btn-sm edit-personnel-btn" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id=${personnel.id}>
                    <i class="fa-solid fa-pencil fa-fw"></i>
                  </button>
                  <button type="button" class="btn btn-primary btn-sm delete-personnel-btn" data-id=${personnel.id}>
                    <i class="fa-solid fa-trash fa-fw"></i>
                  </button>
                </td>
            </tr>
          `);
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      showErrorToast("Error fetching personnel data", 4000, false);
    }
  });

  /*GET ALL DEPARTMENTS DYNAMICALLY */
  $.ajax({
    url: "libs/php/getAll.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      result.data.forEach((department) => {
        $("#departmentTableBody").append(`
          <tr>
                <td class="align-middle text-nowrap">
                  ${department.departmentName}
                </td>
                <td class="align-middle text-nowrap d-none d-md-table-cell">
                  ${department.location}
                </td>
                <td class="align-middle text-end text-nowrap">
                  <button type="button" class="btn btn-primary btn-sm edit-department-btn" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id=${department.departmentId}>
                    <i class="fa-solid fa-pencil fa-fw"></i>
                  </button>
                  <button type="button" class="btn btn-primary btn-sm delete-department-btn" data-id=${department.departmentId}>
                    <i class="fa-solid fa-trash fa-fw"></i>
                  </button>
                </td>
              </tr>     
          `)
      })
    }
  })

  /*GET ALL LOCATIONS DYNAMICALLY*/
  $.ajax({
    url: "libs/php/getAll.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      result.data.forEach((location) => {
        $("#locationTableBody").append(`
          <tr>
            <td class="align-middle text-nowrap">
              ${location.location}
            </td>
            <td class="align-middle text-end text-nowrap">
              <button type="button" class="btn btn-primary btn-sm edit-location-btn" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id=${location.id}>
                <i class="fa-solid fa-pencil fa-fw"></i>
              </button>
              <button type="button" class="btn btn-primary btn-sm delete-location-btn" data-id=${location.id}>
                <i class="fa-solid fa-trash fa-fw"></i>
              </button>
            </td>
          </tr>
        `)
      })
    }
  })

  $("#searchInp").on("keyup", function () {
    let searchTerm = $(this).val().trim();  // Get the search input value

    $.ajax({
        url: "libs/php/searchAll.php",
        type: "POST",
        data: {
            txt: searchTerm  // Pass the current search input
        },
        dataType: "json",
        success: function (result) {

            if (result.status.name == "ok") {
                // Clear all tables first
                $("#personnelTableBody").empty();
                $("#departmentTableBody").empty();
                $("#locationTableBody").empty();

                // Personnel Data Append
                if (result.data.personnel && result.data.personnel.length > 0) {
                    result.data.personnel.forEach((item) => {
                        $("#personnelTableBody").append(`
                            <tr>
                                <td class="align-middle text-nowrap">
                                    <a href="#" class="view-personnel-name" data-id=${item.id}>${item.lastName}, ${item.firstName}</a>
                                </td>
                                <td class="align-middle text-nowrap d-none d-md-table-cell">${item.departmentName}</td>
                                <td class="align-middle text-nowrap d-none d-md-table-cell">${item.locationName}</td>
                                <td class="align-middle text-nowrap d-none d-md-table-cell">${item.email}</td>
                                <td class="text-end text-nowrap">
                                    <button type="button" class="btn btn-primary btn-sm edit-personnel-btn" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id=${item.personnelID}>
                                        <i class="fa-solid fa-pencil fa-fw"></i>
                                    </button>
                                    <button type="button" class="btn btn-primary btn-sm delete-personnel-btn" data-id=${item.id}>
                                        <i class="fa-solid fa-trash fa-fw"></i>
                                    </button>
                                </td>
                            </tr>
                        `);
                    });
                } else {
                    $("#personnelTableBody").append(`
                        <tr>
                            <td colspan="5" class="text-center">No personnel found</td>
                        </tr>
                    `);
                }


                // Location Data Append
                if (result.data.locations && result.data.locations.length > 0) {
                    result.data.locations.forEach((item) => {
                        $("#locationTableBody").append(`
                            <tr>
                                <td class="align-middle text-nowrap">${item.locationName}</td>
                                <td class="align-middle text-end text-nowrap">
                                    <button type="button" class="btn btn-primary btn-sm edit-location-btn" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id=${item.id}>
                                        <i class="fa-solid fa-pencil fa-fw"></i>
                                    </button>
                                    <button type="button" class="btn btn-primary btn-sm delete-location-btn" data-id=${item.id}>
                                        <i class="fa-solid fa-trash fa-fw"></i>
                                    </button>
                                </td>
                            </tr>
                        `);
                    });
                } else {
                    $("#locationTableBody").append(`
                        <tr>
                            <td colspan="2" class="text-center">No locations found</td>
                        </tr>
                    `);
                }
                // Department Data Append
                if (result.data.departments && result.data.departments.length > 0) {
                    result.data.departments.forEach((item) => {
                        $("#departmentTableBody").append(`
                            <tr>
                                <td class="align-middle text-nowrap">${item.departmentName}</td>
                                <td class="align-middle text-nowrap d-none d-md-table-cell">${item.locationName}</td>
                                <td class="align-middle text-end text-nowrap">
                                    <button type="button" class="btn btn-primary btn-sm edit-department-btn" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id=${item.id}>
                                        <i class="fa-solid fa-pencil fa-fw"></i>
                                    </button>
                                    <button type="button" class="btn btn-primary btn-sm delete-department-btn" data-id=${item.id}>
                                        <i class="fa-solid fa-trash fa-fw"></i>
                                    </button>
                                </td>
                            </tr>
                        `);
                    });
                } else {
                    $("#departmentTableBody").append(`
                        <tr>
                            <td colspan="3" class="text-center">No departments found</td>
                        </tr>
                    `);
                }
            } else {
                showErrorToast("API Response Error.", 4000, false);
            }
        },
        error: function (xhr, status, error) {
            showErrorToast("AJAX Error.", 4000, false);
        }
    });
});

  /*REFRESH PERSONNEL, DEPARTMENT AND LOCATION TABLES*/
  $("#refreshBtn").on("click", function () {
    
    if ($("#personnelBtn").hasClass("active")) {      
      // Refresh personnel table
      refreshPersonnelTable();
      
    } else if ($("#departmentsBtn").hasClass("active")) {
      // Refresh department table
      refreshDepartmentTable();

    } else if ($("#locationsBtn").hasClass("active")) {
      // Refresh location table
      refreshLocationTable();
    }
  });

  /*REFRESH PERSONNEL TABLE*/
  
  $("#personnelBtn").on("click", function () {

    // Call function to refresh personnel table
    refreshPersonnelTable();

  });

  /*REFRESH DEPARTMENT TABLE*/

  $("#departmentsBtn").on("click", function () {
    
    // Call function to refresh department table
    refreshDepartmentTable();
  });
  
  /*REFRESH LOCATION TABLE*/
  $("#locationsBtn").on("click", function () {
    
    // Call function to refresh location table
    refreshLocationTable();
  });
  
 // Check if the Personnel tab is active
$("#filterBtn").on("click", function () {
  if ($("#personnelBtn").hasClass("active")) {
    // Show the filter personnel modal
    $("#filterPersonnelModal").modal("show");

    // Fetch departments for radio buttons
    $.ajax({
      url: 'libs/php/getAllDepartments.php',
      type: 'GET',
      success: function (result) {
        if (result.status.name === "ok") {
          const departmentFilter = $('#departmentFilter');
          departmentFilter.empty();
          result.data.forEach(department => {
            departmentFilter.append(`
              <div class="form-check">
                <input class="form-check-input" type="radio" name="department" value="${department.departmentName}" id="dept_${department.departmentID}">
                <label class="form-check-label" for="dept_${department.departmentID}">
                  ${department.departmentName}
                </label>
              </div>
            `);
          });
        } else {
          showErrorToast("Get all departments API response error.", 4000, false);
        }
      },
      error: function () {
        console.error('Failed to fetch departments.');
      }
    });

    // Fetch locations for radio buttons
    $.ajax({
      url: 'libs/php/getAllLocations.php',
      type: 'GET',
      success: function (result) {
        if (result.status.name === "ok") {
          const locationFilter = $('#locationFilter');
          locationFilter.empty();
          result.data.forEach(location => {
            locationFilter.append(`
              <div class="form-check">
                <input class="form-check-input" type="radio" name="location" value="${location.locationName}" id="loc_${location.locationID}">
                <label class="form-check-label" for="loc_${location.locationID}">
                  ${location.locationName}
                </label>
              </div>
            `);
          });
        } else {
          showErrorToast("Get all locations API response error.", 4000, false);
        }
      },
      error: function () {
        console.error('Failed to fetch locations.');
      }
    });

  } else {
    // Show a modal that explains filtering is only for personnel
    $("#filterErrorModal .modal-body").text("Filtering is only available for personnel.");
    $("#filterErrorModal").modal("show");
  }
});

    /*FILTER PERSONNEL APPLY BUTTON */
    $("#applyFilters").on("click", function () {
      // Get the selected department and location
      var selectedDepartment = $("#departmentFilter input:radio:checked").val() || "";
      var selectedLocation = $("#locationFilter input:radio:checked").val() || "";
    
      // Make an AJAX request to fetch personnel based on the selected filters
      $.ajax({
        url: "libs/php/filterPersonnel.php",
        type: "POST",
        data: { department: selectedDepartment, location: selectedLocation },
        dataType: "json",
        success: function (result) {
          console.log("filterPersonnel.php", result.data);
          if (result.status.name == "ok") {
            // Clear the existing table rows
            $("#personnelTableBody").empty();
            if (result.data.personnel.length > 0) {
            // Loop through the filtered personnel data and append rows to the table
            result.data.personnel.forEach(personnel => {
              $("#personnelTableBody").append(`
                <tr>
                  <td class="align-middle text-nowrap">
                    <a href="#" class="view-personnel-name" data-id=${personnel.id}>${personnel.lastName}, ${personnel.firstName}</a>
                  </td>
                  <td class="align-middle text-nowrap d-none d-md-table-cell">${personnel.departmentName}</td>
                  <td class="align-middle text-nowrap d-none d-md-table-cell">${personnel.location}</td>
                  <td class="align-middle text-nowrap d-none d-md-table-cell">${personnel.email}</td>
                  <td class="text-end text-nowrap">
                      <button type="button" class="btn btn-primary btn-sm edit-personnel-btn" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id=${personnel.id}>
                        <i class="fa-solid fa-pencil fa-fw"></i>
                      </button>
                      <button type="button" class="btn btn-primary btn-sm delete-personnel-btn" data-id=${personnel.id}>
                        <i class="fa-solid fa-trash fa-fw"></i>
                      </button>
                    </td>
                </tr>
              `);
            });
            } else {
              // If no personnel found, display a message
              $("#filterPersonnelModal").modal("hide");
              $("#personnelTableBody").append(`
              <tr>
                <td colspan="5" class="text-center">No personnel found.</td>
              </tr>              
            `);
            }
          } else {
            showErrorToast("Error fetching personnel.", 4000, false);
          }
        },
        error: function () {
          console.error('Failed to fetch filtered personnel.');
        }
      });
    });
    
    /*FILTER PERSONNEL CLEAR FILTERS BUTTON */
$("#clearFilters").on("click", function () {
  // Reset radio buttons
  $("#filterForm input:radio").prop("checked", false);
  $("#personnelTableBody").empty();
  $.ajax({
    url: "libs/php/updateAllPersonnel.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      if (result.status.name == "ok" && Array.isArray(result.data)) {
        if (result.data.length === 0) {
          // Display message for no personnel data
          $("#personnelTableBody").append(`
            <tr><td colspan="6">No personnel data available</td></tr>
            `);
        } else {
          // Append rows for each personnel
          result.data.forEach(function (personnel) {
            $("#personnelTableBody").append(`
            <tr>
              <td class="align-middle text-nowrap">${personnel.lastName}, ${personnel.firstName}</td>
              <td class="align-middle text-nowrap d-none d-md-table-cell">${personnel.departmentName}</td>
              <td class="align-middle text-nowrap d-none d-md-table-cell">${personnel.location}</td>
              <td class="align-middle text-nowrap d-none d-md-table-cell">${personnel.email}</td>
              <td class="text-end text-nowrap">
                  <button type="button" class="btn btn-primary btn-sm edit-personnel-btn" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id=${personnel.id}>
                    <i class="fa-solid fa-pencil fa-fw"></i>
                  </button>
                  <button type="button" class="btn btn-primary btn-sm delete-personnel-btn" data-id=${personnel.id}>
                    <i class="fa-solid fa-trash fa-fw"></i>
                  </button>
                </td>
            </tr>
            `);
          });
        }
      } else {
        showErrorToast("No personnel data available", 4000, false);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      showErrorToast("Error refreshing personnel table", 4000, false);
    }
  });
});
  
/* ADD PERSONNEL, LOCATIONS AND DEPARTMENTS USING #ADDBTN */
$("#addBtn").on("click", function () {
  //clear personnel, departments and location forms
  $("#addPersonnelForm")[0].reset();
  $("#addDepartmentForm")[0].reset();
  $("#addLocationForm")[0].reset();
  // Check if personnel button is active

  /* 1ST CONDITION: ADD PERSONNEL */
  if ($("#personnelBtn").hasClass("active")) {
      // Trigger the modal to show
      $("#addPersonnelModal").modal('show');

      // Populate the department dropdown
      $.ajax({
          url: "libs/php/getAllDepartments.php",
          type: "GET",
          dataType: "json",
          success: function (result) {
              if (result.status.name == "ok") {
                  // Clear existing options
                  $("#addPersonnelDepartment").html("");

                  // Populate the dropdown with fetched data
                  result.data.forEach((department) => {
                      $("#addPersonnelDepartment").append(
                          $("<option>", {
                              value: department.departmentID,
                              text: department.departmentName,
                          })
                      );
                  });
              } else {
                  showErrorToast("Failed to fetch departments.", 4000, false);
              }
          },
          error: function (jqXHR, textStatus, errorThrown) {
              showErrorToast("Failed to fetch departments for Add Personnel modal.", 4000, false);
          },
      });

      // Populate the location dropdown
      $.ajax({
          url: "libs/php/getAllLocations.php",
          type: "GET",
          dataType: "json",
          success: function (result) {
              if (result.status.name == "ok") {
                  // Clear existing options
                  $("#addPersonnelLocation").html("");

                  // Populate the dropdown with fetched data
                  result.data.forEach((location) => {
                      $("#addPersonnelLocation").append(
                          $("<option>", {
                              value: location.locationID,
                              text: location.locationName
                          })
                      );
                  });
              } else {
                  showErrorToast("Failed to fetch locations for Add Personnel modal.", 4000, false);
              }
          }
      });

/* 2ND CONDITION: ADD DEPARTMENT */
} else if ($("#departmentsBtn").hasClass("active")) {
  // Trigger the modal to show
  $("#addDepartmentModal").modal('show');

  // Populate the location dropdown
  $.ajax({
    url: "libs/php/getAllLocations.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      if (result.status.name == "ok") {
        // Clear existing options
        $("#addDepartmentLocation").empty();

        // Populate the dropdown with fetched data
        result.data.forEach(function(location) {
          $("#addDepartmentLocation").append(
            $("<option>", {
              value: location.locationID,
              text: location.locationName
            })
          );
        });
      } else {
        showErrorToast("Failed to fetch locations for Add Department modal.", 4000, false);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      showErrorToast("Failed to load locations.", 4000, false);
    }
  });
/*3RD CONDITION: ADD LOCATION */
} else {
  // Trigger the location modal to show
    $("#addLocationModal").modal('show');
}
});
   
/* ADD PERSONNEL FORM SUBMIT */
$("#addPersonnelModal").on("submit", "#addPersonnelForm", function (e) {
  e.preventDefault(); // Prevent the default form submission

  // Check if personnel already exists (duplicate check)
  var firstName = $("#addPersonnelFirstName").val();
  var lastName = $("#addPersonnelLastName").val();
  var email = $("#addPersonnelEmailAddress").val();

  // AJAX call to check for duplicate personnel
  $.ajax({
      url: "libs/php/checkForDuplicatePersonnel.php", // Backend endpoint to check for duplicates
      type: "POST",
      dataType: "json",
      data: {
          firstName: firstName,
          lastName: lastName,
          email: email
      },
      success: function (result) {
          if (result.status.name == "ok" && result.data.exists) {
              // Show an error message if duplicate found
              firstName = result.data.firstName;
              lastName = result.data.lastName;
              $("#addPersonnelModal").modal("hide");
              $("#addPersonnelErrorModal .modal-body").text(`${firstName} ${lastName} cannot be added as it already exists in the directory.`);
              $("#addPersonnelErrorModal").modal("show");
          } else {
              // No duplicate found, proceed with adding personnel
              $.ajax({
                  url: "libs/php/addPersonnel.php",
                  type: "POST",
                  dataType: "json",
                  data: {
                      firstName: firstName,
                      lastName: lastName,
                      email: email,
                      jobTitle: $("#addPersonnelJobTitle").val(),
                      departmentName: $("#addPersonnelDepartment").val(),
                      departmentID: $("#addPersonnelDepartment").val(),
                  },
                  success: function (result) {
                      if (result.status.name == "ok") {
                        firstName = result.data.firstName;
                        lastName = result.data.lastName;
                          // Optionally close the modal or refresh the table
                          $("#addPersonnelModal").modal('hide');
                          $("#addPersonnelSuccessModal .modal-body").text(`${firstName} ${lastName} was added successfully.`);
                          $("#addPersonnelSuccessModal").modal('show');
                          refreshPersonnelTable();
                      }
                  },
                  error: function (jqXHR, textStatus, errorThrown) {
                      showErrorToast("Failed to add personnel.", 4000, false);
                  }
              });
          }
      },
      error: function (jqXHR, textStatus, errorThrown) {
          showErrorToast("Failed to check for duplicate employees.", 4000, false);
      }
  });
});

/*VIEW PERSONNEL MODAL */
$("#personnelTableBody").on("click", ".view-personnel-name", function(e) {
  //prevent default link behavior
  e.preventDefault();

  // Retrieve the data-id attribute from the clicked link
  const personnelId = $(this).data("id");

  //Fetch the personnel details using the personnel ID
  $.ajax({
    url: "libs/php/getPersonnelById.php",
    type: "GET",
    dataType: "json",
    data: {
      id: personnelId
    },
    success: function (result) {
      if (result.status.name == "ok") {
        // Populate the modal with the retrieved data
        const personnel = result.data.personnel[0];
        $("#viewPersonnelFirstName").val(personnel.firstName);
        $("#viewPersonnelLastName").val(personnel.lastName);
        $("#viewPersonnelJobTitle").val(personnel.jobTitle || "Not specified");
        $("#viewPersonnelEmailAddress").val(personnel.email);
        $("#viewPersonnelLocation").val(personnel.location);
        $("#viewPersonnelDepartment").val(personnel.departmentName);

        // Show the modal
        $("#viewPersonnelModal").modal("show");
      }
    }, 
    error: function (jqXHR, textStatus, errorThrown) {
      showErrorToast("Failed to fetch view personnel details.", 4000, false);
    }
  })
})
  
/*EDIT PERSONNEL MODAL */
$("#editPersonnelModal").on("show.bs.modal", function (e) {
  /// Clear any previous data from the modal
  $("#editPersonnelFirstName").val("");
  $("#editPersonnelLastName").val("");
  $("#editPersonnelEmailAddress").val("");
  $("#editPersonnelJobTitle").val("");
  $("#editPersonnelDepartment").html("");

  // Use `e.relatedTarget` to access the button that triggered the modal
  // Retrieve the `data-id` of the clicked edit button
  const editPersonnelId = $(e.relatedTarget).attr("data-id");

  // Store the ID in the modal's data attribute to retain it when modal is reopened
  $(this).data('editPersonnelId', editPersonnelId);
  
  // Perform the AJAX request using the retrieved personnel ID
  $.ajax({
    url: "libs/php/getPersonnelByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: editPersonnelId, // Pass the correct ID to the server
    },
    success: function (result) {
      if (result.status.name == "ok" && result.data.personnel.length > 0) {
        // Update the modal fields with the employee's data
        let personnel = result.data.personnel[0];
        let department = result.data.department;
        $("#editPersonnelEmployeeID").val(personnel.id);
        $("#editPersonnelFirstName").val(personnel.firstName);
        $("#editPersonnelLastName").val(personnel.lastName);
        $("#editPersonnelJobTitle").val(personnel.jobTitle);
        $("#editPersonnelEmailAddress").val(personnel.email);

        // Populate the department dropdown
        $("#editPersonnelDepartment").html(""); // Clear existing options
        $.each(department, function () {
          $("#editPersonnelDepartment").append(
            $("<option>", {
              value: this.id,
              text: this.name,
            })
          );
        });

        // Set the department value to match the employee's department
        $("#editPersonnelDepartment").val(personnel.departmentID);
      } else {
        showErrorToast("No personnel data found", 4000, false);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      showErrorToast("Error retrieving data", 4000, false);
    },
  });
});

/*EDIT PERSONNEL FORM SUBMIT */
$("#editPersonnelForm").on("submit", function (e) {
  // Executes when the form button with type="submit" is clicked
  // stop the default browser behaviour
  e.preventDefault();

  // Retrieve the personnel ID from the modal's data attribute
  const editPersonnelId = $("#editPersonnelModal").data('editPersonnelId');

  // AJAX call to save form data
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
        let firstName = result.data[0].firstName;
        let lastName = result.data[0].lastName;
        // Close the modal
        $("#editPersonnelModal").modal("hide");

        // Show a confirmation modal message
        $("#editPersonnelSuccessModal .modal-body").text(`${firstName} ${lastName} was successfully updated.`);
        $("#editPersonnelSuccessModal").modal("show");
        refreshPersonnelTable();
      } else {
        // Show a toast message
        showErrorToast("Error updating personnel", 4000, false);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // Show a toast message
      showErrorToast("An error occurred in the edit personnel form", 4000, false);
    },
  });
});

/* DELETE PERSONNEL MODAL */
// Perform the AJAX request using the retrieved personnel ID
$(document).on("click", ".delete-personnel-btn", function() {
  // Get the personnel ID from the button's data-id attribute
  const deletePersonnelId = $(this).data("id");

  if (!deletePersonnelId) {
    showErrorToast("Invalid personnel ID", 4000, false);
    return;
  }

  // Set the personnel ID in the confirmation modal (store it as data-id on the modal)
  $("#deletePersonnelConfirmationModal").data("id", deletePersonnelId);

  // Fetch the personnel details (firstName, lastName) using the personnel ID
  $.ajax({
    url: 'libs/php/getPersonnelDetails.php', // You will need a script to return the first and last name based on ID
    type: 'GET',
    data: { 
      id: deletePersonnelId 
    },
    success: function(response) {
      if (response.status.name === "ok") {
        // Populate the modal with the personnel's first and last name
        const firstName = response.data.firstName;
        const lastName = response.data.lastName;

        // Set the personnel name in the confirmation modal
        $("#deletePersonnelConfirmationModal .modal-body").text(`Are you sure you want to delete ${firstName} ${lastName}?`);
        
        // Show the confirmation modal
        $("#deletePersonnelConfirmationModal").modal("show");
      } else {
        // Handle error if no personnel found
        showErrorToast("Personnel not found", 4000, false);
      }
    },
    error: function() {
      // Handle AJAX error
      showErrorToast("Error retrieving personnel details", 4000, false);
    }
  });
});

/* DELETE PERSONNEL CONFIRMATION MODAL*/
$("#deletePersonnelConfirmationModal .btn-delete-personnel-confirmation").on("click", function() {
  // Retrieve the personnel ID from the confirmation modal's data-id attribute
  const deletePersonnelId = $("#deletePersonnelConfirmationModal").data("id");
  // Perform the AJAX request to delete the personnel
  $.ajax({
    url: "libs/php/deletePersonnelByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: deletePersonnelId, // Pass the correct ID to the server
    },
    success: function(result) {
      let firstName = result.data.deletedPersonnel.firstName;
      let lastName = result.data.deletedPersonnel.lastName;
      if (result.status.name == "ok") {
        // Close the confirmation modal
        $("#deletePersonnelConfirmationModal").modal("hide");
        refreshPersonnelTable();

        // Show a success modal
        $("#deletePersonnelSuccessModal .modal-body").text(`${firstName} ${lastName} was successfully deleted.`);
        $("#deletePersonnelSuccessModal").modal("show");
        // Refresh the personnel table

      } else {
      showErrorToast("Error deleting personnel", 4000, false);
      }
},
    error: function(jqXHR, textStatus, errorThrown) {
      showErrorToast("Error deleting personnel", 4000, false);
    }
  });
});


  /*ADD DEPARTMENT FORM SUBMIT */
$("#addDepartmentModal").on("submit", "#addDepartmentForm", function (e) {
  e.preventDefault(); // Prevent the default form submission

  // Check if department already exists (duplicate check)

  // AJAX call to check for duplicate department including location
  $.ajax({
    url: "libs/php/checkForDuplicateDepartments.php",
    type: "POST",
    dataType: "json",
    data: {
      departmentName: $("#addDepartmentName").val(),
      locationID: $("#addDepartmentLocation option:selected").val()
    },
    success: function (result) {
      if (result.status.name == "ok" && result.data.exists) {
        let departmentName = result.data.duplicates[0].departmentName;
        let departmentLocation = result.data.duplicates[0].locationName;
        $("#addDepartmentModal").modal("hide");

        $("#addDepartmentErrorModal .modal-body").text(`The ${departmentName} department in ${departmentLocation} cannot be added as it already exists in the directory.`);;
        $("#addDepartmentErrorModal").modal("show");
      } else {
        // No duplicate found, proceed with adding department
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
              let departmentName = result.data.department.departmentName;
              let locationName = result.data.department.locationName;
          
              // Show success modal and refresh the table
              $("#addDepartmentModal").modal('hide');
              $("#addDepartmentSuccessModal .modal-body").text(`The ${departmentName} department in ${locationName} was successfully added.`);
              $("#addDepartmentSuccessModal").modal('show');
              refreshDepartmentTable();
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            showErrorToast("Failed to add department.", 4000, false);
          }
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      showErrorToast("Failed to check for duplicate departments.", 4000, false);
    }
  });
});

/*EDIT DEPARTMENT MODAL */
  $("#editDepartmentModal").on("show.bs.modal", function (e) {
  /// Clear any previous data from the modal
  $("#editDepartmentName").val("");

  // Use `e.relatedTarget` to access the button that triggered the modal
  // Retrieve the `data-id` of the clicked edit button
  const editDepartmentId = $(e.relatedTarget).attr("data-id");

  // Store the ID in the modal's data attribute to retain it when modal is reopened
  $(this).data('editDepartmentId', editDepartmentId);

  // Perform the AJAX request using the retrieved department ID
  $.ajax({
    url: "libs/php/getDepartmentByID.php",
    type: "POST",
    dataType: "json",
    data: {
      departmentID: editDepartmentId, // Pass the correct ID to the server
    },
    success: function (result) {
      if (result.status.name == "ok" && result.data.department.length > 0) {
        // Update the modal fields with the employee's data
        let department = result.data.department[0];
        let location = result.data.locations;
       $("#editDepartmentName").val(department.departmentName);

        // Populate the location dropdown
        $("#editDepartmentLocation").html(""); // Clear existing options
        $.each(location, function () {
          $("#editDepartmentLocation").append(
            $("<option>", {
              value: this.locationID,
              text: this.locationName,
            })
          );
        });

        // Set the department value to match the employee's department
        $("#editDepartmentLocation").val(department.locationID);
      } else {
        showErrorToast("No department data found", 4000, false);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      showErrorToast("Error retrieving data", 4000, false);
    },
  });
});

/* EDIT DEPARTMENT FORM SUBMIT*/
$("#editDepartmentForm").on("submit", function (e) {
  // Executes when the form button with type="submit" is clicked
  // stop the default browser behaviour
  e.preventDefault();

  // Retrieve the department ID from the modal's data attribute
  const editDepartmentId = $("#editDepartmentModal").data('editDepartmentId');

  // AJAX call to save form data
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
      let departmentName = result.data[0].departmentName;
      let locationName = result.data[0].locationName;
      if (result.status.name == "ok") {
        // Close the modal
        $("#editDepartmentModal").modal("hide");

        // Show a confirmation modal message
        $("#editDepartmentSuccessModal .modal-body").text(`The ${departmentName} department in ${locationName} was successfully updated.`);
        $("#editDepartmentSuccessModal").modal("show");
        refreshDepartmentTable();
      } else {
        // Show a toast message
        showErrorToast("Error updating the department", 4000, false);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // Show a toast message
      showErrorToast("An error occurred in the edit department submit form", 4000, false);
    },
  });
});

/*DELETE DEPARTMENT MODAL */
  // Perform the AJAX request using the retrieved department ID
  // Delete department button click
  $(document).on("click", ".delete-department-btn", function () {
    // Get the department ID
    const deleteDepartmentId = $(this).data("id");
  
    if (!deleteDepartmentId) {
      showErrorToast("Invalid department ID", 4000, false);
      return;
    }
  
    // Set the department ID in the confirmation modal
    $("#deleteDepartmentConfirmationModal").data("id", deleteDepartmentId);
  
    // Send AJAX request to check if the department can be deleted
    $.ajax({
      url: "libs/php/getDepartmentDetails.php",
      type: "GET",
      dataType: "json",
      data: {
        id: deleteDepartmentId,
      },
      success: function (result) {
        if (result.status.name === "ok" && result.data) {
          const personnelCount = result.data.personnelCount;
          const departmentName = result.data.departmentName;
          const locationName = result.data.locationName;
  
          if (personnelCount > 0) {
            // Error: Employees attached to department
            const errorMessage = `Sorry, you cannot delete ${departmentName} in ${locationName} as there ${
              personnelCount === 1 ? "is" : "are"
            } ${personnelCount} employee${personnelCount === 1 ? "" : "s"} assigned to it.`;
            $("#deleteDepartmentErrorModal .modal-body").text(errorMessage);
            $("#deleteDepartmentErrorModal").modal("show");

            //Return to prevent further execution
            return;
          } else {
            // Success: No employees attached, show confirmation modal
            $("#deleteDepartmentConfirmationModal .modal-body").text(
              `Are you sure you want to delete the ${departmentName} department in ${locationName}?`
            );
            $("#deleteDepartmentConfirmationModal").modal("show");
          }
        } else {
          showErrorToast("Error retrieving department details", 4000, false);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        showErrorToast("Error retrieving department details", 4000, false);
      },
    });
  });  

/* DELETE DEPARTMENT CONFIRMATION MODAL*/
$("#deleteDepartmentConfirmationModal .btn-delete-department-confirmation").on("click", function() {
  // Retrieve the department ID from the confirmation modal's data-id attribute
  const deleteDepartmentId = $("#deleteDepartmentConfirmationModal").data("id");
  // Perform the AJAX request to delete the department
  $.ajax({
    url: "libs/php/deleteDepartmentByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: deleteDepartmentId, // Pass the correct ID to the server
    },
    success: function(result) {
      if (result.status.name == "ok") {
        let departmentName = result.data.departmentName;
        let locationName = result.data.departmentLocation;
        // Close the confirmation modal
        $("#deleteDepartmentConfirmationModal").modal("hide");

        // Refresh the department table
        refreshDepartmentTable();
        // Show a success modal
        $("#deleteDepartmentSuccessModal .modal-body").text(`The ${departmentName} department in ${locationName} was successfully deleted.`);
        $("#deleteDepartmentSuccessModal").modal("show");

      } else {
        //Show error modal
        $("#deleteDepartmentConfirmationModal").modal("hide");
        showErrorToast("Error deleting department", 4000, false);
      }
},
    error: function(jqXHR, textStatus, errorThrown) {
      showErrorToast("Error deleting department", 4000, false);
    }
  });
});

 /*ADD LOCATION FORM SUBMIT */
 $("#addLocationModal").on("submit", "#addLocationForm", function (e) {
  e.preventDefault(); // Prevent the default form submission

  // Check if location already exists (duplicate check)

  // AJAX call to check for duplicate location
  $.ajax({
    url: "libs/php/checkForDuplicateLocations.php",
    type: "POST",
    dataType: "json",
    data: {
      locationName: $("#addLocationName").val(),
    },
    success: function (result) {
      if (result.status.name == "ok" && result.data.exists) {
        
        let locationName = result.data.duplicates[0].locationName;
        $("#addLocationModal").modal("hide");

        $("#addLocationErrorModal .modal-body").text(`The location ${locationName} cannot be added as it already exists in the directory.`);;
        $("#addLocationErrorModal").modal("show");
      } else {
        // No duplicate found, proceed with adding location
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
              let locationName = result.data.location.name;
          
              // Show success modal and refresh the table
              $("#addLocationModal").modal('hide');
              $("#addLocationSuccessModal .modal-body").text(`The location ${locationName} was successfully added.`);
              $("#addLocationSuccessModal").modal('show');
              refreshLocationTable();
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            showErrorToast("Failed to add location.", 4000, false);
          }
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      showErrorToast("Failed to check for duplicate locations.", 4000, false);
    }
  });
});

/*EDIT LOCATION MODAL*/

$("#editLocationModal").on("show.bs.modal", function (e) {

  //Clear any previous data from the modal
  $("#editLocationName").val("");

  //Use e.relatedTarget to access the button that triggered the modal
  //Get the data-id attribute of the clicked edit button

  const editLocationId = $(e.relatedTarget).attr("data-id");

  //Store the id in the modal's data attribute to retain it after the modal is closed
  $("#editLocationModal").data('editLocationId', editLocationId);

  //Perform the AJAX request using the retrieved location ID
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
        showErrorToast("Error retrieving location details", 4000, false);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      showErrorToast("Error retrieving location details", 4000, false);
    }
  });
});

/*EDIT LOCATION FORM SUBMIT*/
$("#editLocationForm").on("submit", function (e) {
  //Executes when the form button with type="submit" is clicked
  //Prevent the default form submission behavior
  e.preventDefault();

  //Retrieve the location ID from the modal's data attribute
  const editLocationId = $("#editLocationModal").data("editLocationId");
  //AJAX call to save form data
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
        let locationName = result.data[0].locationName;
        // Close the modal
        $("#editLocationModal").modal("hide");

        // Show a success modal
        $("#editLocationSuccessModal .modal-body").text(`The location name was successfully updated to ${locationName}.`);
        $("#editLocationSuccessModal").modal("show");
        refreshLocationTable();
      } else {
        // Show a toast message
        showErrorToast("Error updating the location", 4000, false);
      }
    }, 
    error: function(jqXHR, textStatus, errorThrown) {
      showErrorToast("An error occurred in the edit location submit form", 4000, false);
    }
  })
})

/*DELETE LOCATION MODAL */
  // Perform the AJAX request using the retrieved location ID
  // Delete location button click
  $(document).on("click", ".delete-location-btn", function () {
    // Get the location ID
    const deleteLocationId = $(this).data("id");

    if (!deleteLocationId) {
      showErrorToast("Invalid location ID", 4000, false);
      return;
    }
  
    // Set the location ID in the confirmation modal
    $("#deleteLocationConfirmationModal").data("id", deleteLocationId);
  
    // Send AJAX request to check if the location can be deleted
    $.ajax({
      url: "libs/php/getLocationDetails.php",
      type: "GET",
      dataType: "json",
      data: {
        id: deleteLocationId,
      },
      success: function (result) {
        if (result.status.name === "ok" && result.data) {
          const departmentCount = result.data.departmentCount;
          const locationName = result.data.locationName;

          if (departmentCount > 0) {
            // Error: Employees attached to department
            const errorMessage = `Sorry, you cannot delete ${locationName} as there ${
              departmentCount === 1 ? "is" : "are"
            } ${departmentCount} department${departmentCount === 1 ? "" : "s"} assigned to it.`;
            
            $("#deleteLocationConfirmationModal").modal("hide");
            $("#deleteLocationErrorModal").modal("hide");
            
            $("#deleteLocationErrorModal .modal-body").text(errorMessage);
            $("#deleteLocationErrorModal").modal("show");

            // Return early to prevent further execution
            return;
          } else {
            // Success: No employees attached, show confirmation modal
            $("#deleteLocationConfirmationModal .modal-body").text(
              `Are you sure you want to delete the location ${locationName}?`
            );
            $("#deleteLocationConfirmationModal").modal("show");
          }
        } else {
          showErrorToast("Error retrieving location details", 4000, false);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        showErrorToast("Error retrieving location details", 4000, false);
      },
    });
  });  

/* DELETE LOCATION CONFIRMATION MODAL*/
$("#deleteLocationConfirmationModal .btn-delete-location-confirmation").on("click", function() {
  // Retrieve the location ID from the confirmation modal's data-id attribute
  const deleteLocationId = $("#deleteLocationConfirmationModal").data("id");
  // Perform the AJAX request to delete the location
  $.ajax({
    url: "libs/php/deleteLocationByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: deleteLocationId, // Pass the correct ID to the server
    },
    success: function(result) {
      if (result.status.name == "ok") {
        let locationName = result.data.locationName;
        // Close the confirmation modal
        $("#deleteLocationConfirmationModal").modal("hide");
        
        // Refresh the location table
        refreshLocationTable();
        // Show a success modal
        $("#deleteLocationSuccessModal .modal-body").text(`The location ${locationName} was successfully deleted.`);
        $("#deleteLocationSuccessModal").modal("show");

      } else {
        // Hide confirmation modal and show error modal
        $("#deleteLocationConfirmationModal").modal("hide");
        showErrorToast("Error deleting location", 4000, false);
      }
},
    error: function(jqXHR, textStatus, errorThrown) {
      showErrorToast("Error deleting location", 4000, false);
    }
  });
});


/*REFRESH PERSONNEL TABLE FUNCTION*/
function refreshPersonnelTable() {
  // Clear the existing table rows
  $("#personnelTableBody").empty();

  $.ajax({
    url: "libs/php/updateAllPersonnel.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      if (result.status.name == "ok" && Array.isArray(result.data)) {
        if (result.data.length === 0) {
          // Display message for no personnel data
          $("#personnelTableBody").append(`
            <tr><td colspan="6">No personnel data available</td></tr>
            `);
        } else {
          // Append rows for each personnel
          result.data.forEach(function (personnel) {
            $("#personnelTableBody").append(`
            <tr>
              <td class="align-middle text-nowrap">${personnel.lastName}, ${personnel.firstName}</td>
              <td class="align-middle text-nowrap d-none d-md-table-cell">${personnel.departmentName}</td>
              <td class="align-middle text-nowrap d-none d-md-table-cell">${personnel.location}</td>
              <td class="align-middle text-nowrap d-none d-md-table-cell">${personnel.email}</td>
              <td class="text-end text-nowrap">
                  <button type="button" class="btn btn-primary btn-sm edit-personnel-btn" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id=${personnel.id}>
                    <i class="fa-solid fa-pencil fa-fw"></i>
                  </button>
                  <button type="button" class="btn btn-primary btn-sm delete-personnel-btn" data-id=${personnel.id}>
                    <i class="fa-solid fa-trash fa-fw"></i>
                  </button>
                </td>
            </tr>
            `);
          });
        }
        showSuccessToast("Personnel table refreshed!", 3000, true);
      } else {
        showErrorToast("No personnel data available", 4000, false);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      showErrorToast("Error refreshing personnel table", 4000, false);
    }
  });
}

/*REFRESH DEPARTMENT TABLE FUNCTION*/
function refreshDepartmentTable() {
  // Clear the existing table rows
  $("#departmentTableBody").empty();

  $.ajax({
    url: "libs/php/updateAllDepartments.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      if (result.status.name == "ok" && Array.isArray(result.data)) {
        if (result.data.length === 0) {
          $("#departmentTableBody").append(`
            <tr><td colspan="6">No department data available</td></tr>
            `);
          } else {
            //Append rows for each department
            result.data.forEach(function (department){
              $("#departmentTableBody").append(`
              <tr>
                <td class="align-middle text-nowrap">
                  ${department.name}
                </td>
                <td class="align-middle text-nowrap d-none d-md-table-cell">
                  ${department.location}
                </td>
                <td class="align-middle text-end text-nowrap">
                  <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id=${department.id}>
                    <i class="fa-solid fa-pencil fa-fw"></i>
                  </button>
                  <button type="button" class="btn btn-primary btn-sm delete-department-btn" data-id=${department.id}>
                    <i class="fa-solid fa-trash fa-fw"></i>
                  </button>
                </td>
              </tr>     
              `);
            });
          }
          showSuccessToast("Department table refreshed!", 3000, true);
      } else {
        showErrorToast("No department data available", 4000, false);
      }
    }, 
    error: function (jqXHR, textStatus, errorThrown) {
      showErrorToast("Error refreshing department table", 4000, false);
    }
  })
}

/*REFRESH LOCATION TABLE FUNCTION*/
function refreshLocationTable() {
  // Clear the existing table rows
  $("#locationTableBody").empty();

  $.ajax({
    url: "libs/php/updateAllLocations.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      if (result.status.name == "ok" && Array.isArray(result.data)) {
        if (result.data.length === 0) {
          $("#locationTableBody").append(`
            <tr><td colspan="6">No location data available</td></tr>
            `);
        } else {
          //Append rows for each location
          result.data.forEach(function (location) {
            $("#locationTableBody").append(`
              <tr>
                <td class="align-middle text-nowrap">
                  ${location.name}
                </td>
                <td class="align-middle text-end text-nowrap">
                  <button type="button" class="btn btn-primary btn-sm edit-location-btn" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id=${location.id}>
                    <i class="fa-solid fa-pencil fa-fw"></i>
                  </button>
                  <button type="button" class="btn btn-primary btn-sm delete-location-btn" data-id=${location.id}>
                    <i class="fa-solid fa-trash fa-fw"></i>
                  </button>
                </td>
              </tr>
            `);
          });
        }
        showSuccessToast("Location table refreshed!", 3000, true);
      } else {
        showErrorToast("No location data available", 4000, false);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      showErrorToast("Error refreshing location table", 4000, false);
    }
  })
}

/*TOAST MESSAGE FUNCTIONS */
function showErrorToast(message, duration, close) {
  
  Toastify({
    text: message,
    duration: duration,
    newWindow: true,
    close: close,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "#ff0000",
      color: "#ffffff"
    },
    className: "toastify-center",
    onClick: function () {} // Callback after click
  }).showToast();
  
}

function showSuccessToast(message, duration, close) {

  Toastify({
    text: message,
    duration: duration,
    newWindow: true,
    close: close,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "#008000",
      color: "#ffffff"
    },
    className: "toastify-center",
    onClick: function () {} // Callback after click
  }).showToast();
}
});