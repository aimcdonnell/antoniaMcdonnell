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
        result.data.forEach((personnel) => {
          $("#personnelTableBody").append(`
            <tr>
              <td class="align-middle text-nowrap">${personnel.lastName}, ${personnel.firstName}</td>
              <td class="align-middle text-nowrap d-none d-md-table-cell">${personnel.department}</td>
              <td class="align-middle text-nowrap d-none d-md-table-cell">${personnel.location}</td>
              <td class="align-middle text-nowrap d-none d-md-table-cell">${personnel.email}</td>
              <td class="text-end text-nowrap">
                  <button type="button" class="btn btn-primary btn-sm edit-btn" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id=${personnel.id}>
                    <i class="fa-solid fa-pencil fa-fw"></i>
                  </button>
                  <button type="button" class="btn btn-primary btn-sm delete-btn" data-bs-toggle="modal" data-bs-target="#deletePersonnelModal" data-id=${personnel.id}>
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

  //get all locations to appear dynamically


  //get all departments to appear dynamically


$("#searchInp").on("keyup", function () {
  
    // your code
    
  });
  
  $("#refreshBtn").on("click", function () {
    
    if ($("#personnelBtn").hasClass("active")) {
      
      // Refresh personnel table
      
    } else {
      
      if ($("#departmentsBtn").hasClass("active")) {
        
        // Refresh department table
        
      } else {
        
        // Refresh location table
        
      }
      
    }
    
  });
  
  $("#filterBtn").on("click", function () {
    
    // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location
    
  });
  
  $("#addBtn").on("click", function () {
    
    // Replicate the logic of the refresh button click to open the add modal for the table that is currently on display
    
  });
  
  $("#personnelBtn").on("click", function () {
    
    // Call function to refresh personnel table
    
  });
  
  $("#departmentsBtn").on("click", function () {
    
    // Call function to refresh department table
    
  });
  
  $("#locationsBtn").on("click", function () {
    
    // Call function to refresh location table
    
  });
  
  $("#editPersonnelModal").on("show.bs.modal", function (e) {
    
    $.ajax({
      url:
        "libs/php/getPersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: {
        // Retrieve the data-id attribute from the calling button
        // see https://getbootstrap.com/docs/5.0/components/modal/#varying-modal-content
        // for the non-jQuery JavaScript alternative
        //e.relatedTarget refers to the button that triggered the modal to open/ close
        id: $(e.relatedTarget).attr("data-id") 
      },
      success: function (result) {
        if (result.status.name == "ok") {
          
          // Update the hidden input with the employee id so that
          // it can be referenced when the form is submitted
  
          $("#editPersonnelEmployeeID").val(result.data.personnel[0].id);
  
          $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
          $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
          $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
          $("#editPersonnelEmailAddress").val(result.data.personnel[0].email);
  
          $("#editPersonnelDepartment").html("");
  
          $.each(result.data.department, function () {
            $("#editPersonnelDepartment").append(
              $("<option>", {
                value: this.id,
                text: this.name
              })
            );
          });
  
          $("#editPersonnelDepartment").val(result.data.personnel[0].departmentID);
          
        } else {
          $("#editPersonnelModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#editPersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    });
  });
  
  // Executes when the form button with type="submit" is clicked
  
  $("#editPersonnelForm").on("submit", function (e) {
    
    // Executes when the form button with type="submit" is clicked
    // stop the default browser behviour
  
    e.preventDefault();
  //CONTINUE WORKING ON FORM
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
        if (result.status.name =="ok") {
          // Close the modal
          $("#editPersonnelModal").modal("hide");

          // Refresh the personnel table
          $("#personnelBtn").click();

          // Show a toast message
          showToast("Personnel updated successfully", 4000, true);
        } else {
          // Show a toast message
          showToast("Error updating personnel", 4000, false);
        }
      },
    
  });
  
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