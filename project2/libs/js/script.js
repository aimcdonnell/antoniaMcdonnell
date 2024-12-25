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
                  <button type="button" class="btn btn-primary btn-sm delete-personnel-btn" data-bs-toggle="modal" data-bs-target="#deletePersonnelConfirmationModal" data-id=${personnel.id}>
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



  //get a particular personnel by ID for editing
  /*$(document).on("click", ".edit-btn", function () {
    //continue here
    //how to get the id of the personnel that was clicked

  })*/

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
                  <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id=${department.id}>
                    <i class="fa-solid fa-pencil fa-fw"></i>
                  </button>
                  <button type="button" class="btn btn-primary btn-sm deleteDepartmentBtn" data-id=${department.id}>
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
              <button type="button" class="btn btn-primary btn-sm">
                <i class="fa-solid fa-pencil fa-fw"></i>
              </button>
              <button type="button" class="btn btn-primary btn-sm">
                <i class="fa-solid fa-trash fa-fw"></i>
              </button>
            </td>
          </tr>
          `)
      })
    }
  })


$("#searchInp").on("keyup", function () {
  
    // your code
    
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
  
      
    }
    //CONTINUE WORKING ON THIS
    $(this).removeClass("active");
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
    
  });
  
  /*FILTER PERSONNEL BY DEPARTMENT OR LOCATION*/
  $("#filterBtn").on("click", function () {
    
    // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location
    
  });
  
/* ADD PERSONNEL, LOCATIONS AND DEPARTMENTS USING #ADDBTN */
$("#addBtn").on("click", function () {
  //clear personnel, departments and location forms
  $("#addPersonnelForm")[0].reset();
  $("#addDepartmentForm")[0].reset();
  // Check if personnel button is active
  /*ADD PERSONNEL */
  if ($("#personnelBtn").hasClass("active")) {
      // Trigger the modal to show
      $("#addPersonnelModal").modal('show');

      // Populate the department dropdown
      $.ajax({
          url: "libs/php/getAllDepartments.php", // Adjust endpoint as needed
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
    /*ADD DEPARTMENT */
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
  } else {
    // Trigger the location modal to show
      //$("#addLocationModal").modal('show');
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
              $("#addPersonnelModal").modal("hide");
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
                          // Optionally close the modal or refresh the table
                          $("#addPersonnelModal").modal('hide');
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
          showErrorToast("Failed to check for duplicates.", 4000, false);
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
        $("#addDepartmentModal").modal("hide");
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
              //const newDepartmentId = result.data.departmentID;
              //console.log("New Department ID:", newDepartmentId);
              // Optionally close the modal or refresh the table
              $("#addDepartmentModal").modal('hide');
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
      showErrorToast("Failed to check for duplicates.", 4000, false);
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
        // Close the modal
        $("#editPersonnelModal").modal("hide");

        // Show a confirmation modal message
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

/*EDIT DEPARTMENT MODAL */
  $("#editDepartmentModal").on("show.bs.modal", function (e) {
  /// Clear any previous data from the modal
  $("#editDepartmentName").val("");

  // Use `e.relatedTarget` to access the button that triggered the modal
  // Retrieve the `data-id` of the clicked edit button
  const editDepartmentId = $(e.relatedTarget).attr("data-id");

  // Store the ID in the modal's data attribute to retain it when modal is reopened
  $(this).data('editDepartmentId', editDepartmentId);

  // Perform the AJAX request using the retrieved personnel ID
  $.ajax({
    url: "libs/php/getDepartmentByID.php",
    type: "POST",
    dataType: "json",
    data: {
      departmentID: editDepartmentId, // Pass the correct ID to the server
    },
    success: function (result) {
      console.log("edit department data", result);
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
        showErrorToast("No personnel data found", 4000, false);
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

  // Retrieve the personnel ID from the modal's data attribute
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
      if (result.status.name == "ok") {
        // Close the modal
        $("#editDepartmentModal").modal("hide");

        // Show a confirmation modal message
        $("#editDepartmentSuccessModal").modal("show");
        refreshDepartmentTable();
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

/*DELETE PERSONNEL MODAL */
  // Perform the AJAX request using the retrieved personnel ID
  /* DELETE PERSONNEL BUTTON CLICK */
$(document).on("click", ".delete-personnel-btn", function() {
  // Get the personnel ID from the button's data-id attribute
  const deletePersonnelId = $(this).data("id");

  if (!deletePersonnelId) {
    showErrorToast("Invalid personnel ID", 4000, false);
    return;
}

  // Set the personnel ID in the confirmation modal (store it as data-id on the modal)
  $("#deletePersonnelConfirmationModal").data("id", deletePersonnelId);

  // Show the confirmation modal
  $("#deletePersonnelConfirmationModal").modal("show");
});

/* DELETE PERSONNEL CONFIRMATION MODAL*/
$("#deletePersonnelConfirmationModal .btn-delete-confirmation").on("click", function() {
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
      if (result.status.name == "ok") {
        // Close the confirmation modal
        $("#deletePersonnelConfirmationModal").modal("hide");
        refreshPersonnelTable();

        // Show a toast message
        $("#deletePersonnelSuccessModal").modal("show");
        // Refresh the personnel table

      } else {
        showErrorToast("Error deleting employee", 4000, false);
      }
},
    error: function(jqXHR, textStatus, errorThrown) {
      showErrorToast("Error deleting employee", 4000, false);
    }
  });
});


/* FUNCTION TO REFRESH PERSONNEL TABLE */
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
                  <button type="button" class="btn btn-primary btn-sm delete-personnel-btn" data-bs-toggle="modal" data-bs-target="#deletePersonnelConfirmationModal" data-id=${personnel.id}>
                    <i class="fa-solid fa-trash fa-fw"></i>
                  </button>
                </td>
            </tr>
            `);
          });
        }
        showSuccessToast("Personnel table refreshed!", 3000);
      } else {
        showErrorToast("No personnel data available", 4000, false);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      showErrorToast("Error refreshing personnel table", 4000, false);
    }
  });
}

// Bind the function to the button click
/*$(document).on("ready", function () {
  $("#refreshBtn").on("click", refreshPersonnelTable);
});*/

//function to refresh department table

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
            <t><td colspan="6">No department data available</td></tr>
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
                  <button type="button" class="btn btn-primary btn-sm deleteDepartmentBtn" data-id=${department.id}>
                    <i class="fa-solid fa-trash fa-fw"></i>
                  </button>
                </td>
              </tr>     
              `);
            });
          }
          showSuccessToast("Department table refreshed!", 3000);
      } else {
        showErrorToast("No department data available", 4000, false);
      }
    }, 
    error: function (jqXHR, textStatus, errorThrown) {
      showErrorToast("Error refreshing department table", 4000, false);
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