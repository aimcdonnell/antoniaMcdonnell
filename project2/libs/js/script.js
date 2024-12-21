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
        result.data.forEach((personnel, i) => {
          $("#personnelTableBody").append(`
            <tr>
              <td class="align-middle text-nowrap">${personnel.lastName}, ${personnel.firstName}</td>
              <td class="align-middle text-nowrap d-none d-md-table-cell">${personnel.departmentName}</td>
              <td class="align-middle text-nowrap d-none d-md-table-cell">${personnel.location}</td>
              <td class="align-middle text-nowrap d-none d-md-table-cell">${personnel.email}</td>
              <td class="text-end text-nowrap">
                  <button type="button" class="btn btn-primary btn-sm edit-btn" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id=${personnel.personnelId}>
                    <i class="fa-solid fa-pencil fa-fw"></i>
                  </button>
                  <button type="button" class="btn btn-primary btn-sm delete-btn" data-bs-toggle="modal" data-bs-target="#deletePersonnelModal" data-id=${personnel.personnelId}>
                    <i class="fa-solid fa-trash fa-fw"></i>
                  </button>
                </td>
            </tr>
          `);
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      showToast("Error fetching personnel data", 4000, false);
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

      showToast("Personnel refreshed successfully", 4000, true);
      
    } else {
      
      if ($("#departmentsBtn").hasClass("active")) {
        
        // Refresh department table
      } else {
        
        // Refresh location table
        
      }
      
    }
    //CONTINUE WORKING ON THIS
    $(this).removeClass("active");
  });
  
  /*FILTER PERSONNEL BY DEPARTMENT OR LOCATION*/
  $("#filterBtn").on("click", function () {
    
    // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location
    
  });
  
/*ADD PERSONNEL USING #ADDBTN*/
  //add locations and departments buttons
    $("#addBtn").on("click", function () {
      // Check if personnel button is active
      if ($("#personnelBtn").hasClass("active")) {
          // Trigger the modal to show
          $("#addPersonnelModal").modal('show');

          // Populate the department dropdown
          $.ajax({
            url: "libs/php/getAllDepartments.php", // Adjust endpoint as needed
            type: "GET",
            dataType: "json",
            success: function (result) {
                if (result.status.name === "ok") {
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
                    showToast("Failed to fetch departments.", 4000, false);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                showToast("Failed to fetch departments for Add Personnel modal.", 4000, false);
            },
        });

        // Populate the location dropdown
        $.ajax({
          url: "libs/php/getAllLocations.php",
          type: "GET",
          dataType: "json",
          success: function (result) {
            console.log("location dropdown results", result.data);
            if (result.status.name === "ok") {
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
              showToast("Failed to fetch locations for Add Personnel modal.", 4000, false);
            }
          }
        })
      }
  });

  /*ADD PERSONNEL FORM SUBMIT */
  $("#addPersonnelModal").on("submit", "#addPersonnelForm", function (e) {
      e.preventDefault(); // Prevent the default form submission
  
      // Send the form data via AJAX
      $.ajax({
          url: "libs/php/addPersonnel.php",
          type: "POST",
          dataType: "json",
          data: {
              firstName: $("#addPersonnelFirstName").val(),
              lastName: $("#addPersonnelLastName").val(),
              email: $("#addPersonnelEmailAddress").val(),
              jobTitle: $("#addPersonnelJobTitle").val(),
              departmentName: $("#addPersonnelDepartment").val(),
              departmentID: $("#addPersonnelDepartment").val(),
          },
          success: function (result) {
              console.log(result);
              if (result.status.name == "ok") {
                  // Optionally close the modal or refresh the table
                  $("#addPersonnelModal").modal('hide');
                  alert("Personnel added successfully!");
              }
          },
          error: function (jqXHR, textStatus, errorThrown) {
              console.error("Error: " + textStatus + " - " + errorThrown);
          }
      });
  });

  /*REFRESH PERSONNEL TABLE*/
  
  $("#personnelBtn").on("click", function () {

    // Call function to refresh personnel table

  });

  /*REFRESH DEPARTMENT TABLE*/

  $("#departmentsBtn").on("click", function () {
    
    // Call function to refresh department table
    
  });
  
  /*REFRESH LOCATION TABLE*/
  $("#locationsBtn").on("click", function () {
    
    // Call function to refresh location table
    
  });

  
  /*EDIT PERSONNEL MODAL */
  $("#editPersonnelModal").on("show.bs.modal", function (e) {
    // Use `e.relatedTarget` to access the button that triggered the modal
    // Retrieve the `data-id` of the clicked edit button
    const editPersonnelId = $(e.relatedTarget).attr("data-id");
  
  
    // Perform the AJAX request using the retrieved personnel ID
    $.ajax({
      url: "libs/php/getPersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: editPersonnelId, // Pass the correct ID to the server
      },
      success: function (result) {
        console.log(result.data.personnel[0]);
  
        if (result.status.name === "ok") {
          // Update the modal fields with the employee's data
          $("#editPersonnelEmployeeID").val(result.data.personnel[0].id);
          $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
          $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
          $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
          $("#editPersonnelEmailAddress").val(result.data.personnel[0].email);
          // Populate the department dropdown
          $("#editPersonnelDepartment").html("");
          $.each(result.data.department, function () {
            $("#editPersonnelDepartment").append(
              $("<option>", {
                value: this.id,
                text: this.name,
              })
            );
          });
  
          // Set the department value to match the employee's department
          $("#editPersonnelDepartment").val(result.data.personnel[0].departmentID);
        } else {
          showToast("Error retrieving data", 4000, false);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        showToast("Error retrieving data", 4000, false);
      },
    });
  });
  
  
  /*EDIT PERSONNEL FORM SUBMIT */
  $("#editPersonnelForm").on("submit", function (e) {
    
    // Executes when the form button with type="submit" is clicked
    // stop the default browser behaviour
  
    e.preventDefault();
  
    // AJAX call to save form data
    $.ajax({
      url: "libs/php/updatePersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: $("#editPersonnelEmployeeID").val(),
        firstName: $("#editPersonnelFirstName").val(),
        lastName: $("#editPersonnelLastName").val(),
        jobTitle: $("#editPersonnelJobTitle").val(),
        email: $("#editPersonnelEmailAddress").val(),
        departmentName: $("#editPersonnelDepartment").val()
      },
      success: function (result) {

        if (result.status.name == "ok") {
          // Close the modal
          $("#editPersonnelModal").modal("hide");

          // Show a confirmation modal message
          $("#editPersonnelConfirmationModal").modal("show");
          
        } else {
          // Show a toast message
          showToast("Error updating personnel", 4000, false);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Show a toast message
        showToast("An error occurred in the edit personnel form", 4000, false);
      }
    
  });
  
})

/*DELETE PERSONNEL MODAL */
$("#deletePersonnelModal").on("show.bs.modal", function (e) {
  // Use `e.relatedTarget` to access the button that triggered the modal
  // Retrieve the `data-id` of the clicked edit button
  const deletePersonnelId = $(e.relatedTarget).attr("data-id");

  // Perform the AJAX request using the retrieved personnel ID
  $.ajax({
    url: "libs/php/deletePersonnelByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: deletePersonnelId, // Pass the correct ID to the server
    },
    success: function (result) {
      console.log(result.data)
    }, 
    error: function (jqXHR, textStatus, errorThrown) {
      showToast("Error deleting employee", 4000, false);
    }
})

})

/*FUNCTION TO REFRESH PERSONNEL TABLE USING #ADDBTN*/
function refreshPersonnelTable() {
  $.ajax({
    url: "libs/php/updateAllPersonnel.php",  // Modify this with the correct URL for fetching personnel
    type: "GET",
    dataType: "json",
    success: function (result) {
      // Clear the existing table rows (optional, depending on how your table is structured)
      //$("#personnelTable tbody").empty();

      // Loop through the data and append new rows
      result.data.forEach(function (person) {
        $("#personnelTable tbody").append(
          `<tr>
            <td>${person.firstName}</td>
            <td>${person.lastName}</td>
            <td>${person.jobTitle}</td>
            <td>${person.email}</td>
            <td>${person.departmentName}</td>
            </tr>`
        );
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // Show an error message if fetching personnel data fails
      showToast("Error refreshing personnel table", 4000, false);
    }
  });
}

/*TOAST MESSAGE FUNCTION */
function showToast(message, duration, close) {
  
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
});