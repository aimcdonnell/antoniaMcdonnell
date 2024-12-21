// Preloader handling
$(window).on("load", function () {
  if ($("#preloader").length) {
    $("#preloader")
      .delay(1500)
      .fadeOut("slow", function () {
        $(this).remove();
      });
  }

//get all personnel to appear dynamically
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
              <td class="align-middle text-nowrap d-none d-md-table-cell">${personnel.department}</td>
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

  //get all departments to appear dynamically
  $.ajax({
    url: "libs/php/getAll.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      result.data.forEach((department) => {
        $("#departmentTableBody").append(`
          <tr>
                <td class="align-middle text-nowrap">
                  ${department.department}
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

  //get all locations to appear dynamically
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
  
  $("#refreshBtn").on("click", function () {
    
    if ($("#personnelBtn").hasClass("active")) {      
      // Refresh personnel table
      refreshPersonnelTable();
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
  
  $("#filterBtn").on("click", function () {
    
    // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location
    
  });
  
  $("#addBtn").on("click", function () {
    
    // Replicate the logic of the refresh button click to open the add modal for the table that is currently on display
    
  });
  
  $("#departmentsBtn").on("click", function () {
    
    // Call function to refresh department table
    
  });
  
  $("#locationsBtn").on("click", function () {
    
    // Call function to refresh location table
    
  });
  
  $("#editPersonnelModal").on("show.bs.modal", function (e) {
    // Use `e.relatedTarget` to access the button that triggered the modal
    const editPersonnelId = $(e.relatedTarget).attr("data-id");
  
    // Retrieve the `data-id` of the clicked edit button
  
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
          $("#editPersonnelModal .modal-title").text("Error retrieving data");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#editPersonnelModal .modal-title").text("Error retrieving data");
      },
    });
  });
  
  
  // Executes when the form button with type="submit" is clicked
  
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
        departmentID: $("#editPersonnelDepartment").val()
      },
      success: function (result) {

        if (result.status.name == "ok") {
          // Close the modal
          $("#editPersonnelModal").modal("hide");

          // Show a toast message
          showToast("Personnel updated successfully", 4000, true);
        } else {
          // Show a toast message
          showToast("Error updating personnel", 4000, false);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Show a toast message
        showToast("Error updating personnel", 4000, false);
      }
    
  });
  
})

// Function to refresh the personnel table
function refreshPersonnelTable() {
  $.ajax({
    url: "libs/php/updatePersonnelByID.php",  // Modify this with the correct URL for fetching personnel
    type: "GET",
    dataType: "json",
    success: function (result) {
      // Clear the existing table rows (optional, depending on how your table is structured)
      //$("#personnelTable tbody").empty();

      // Loop through the data and append new rows
      result.data.forEach(function (person) {
        $("#personnelTable tbody").append(
          "<tr>" +
            "<td>" + person.firstName + "</td>" +
            "<td>" + person.lastName + "</td>" +
            "<td>" + person.jobTitle + "</td>" +
            "<td>" + person.email + "</td>" +
            "<td>" + person.departmentName + "</td>" +
            "</tr>"
        );
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // Show an error message if fetching personnel data fails
      showToast("Error refreshing personnel table", 4000, false);
    }
  });
}

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