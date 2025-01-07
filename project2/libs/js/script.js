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
      $("#popupErrorModal .modal-body").text("Error fetching personnel data.");
      $("#popupErrorModal").modal("show");
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
                $("#personnelTableBody").empty();
                $("#departmentTableBody").empty();
                $("#locationTableBody").empty();

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
    refreshPersonnelTable();

  });

  /*REFRESH DEPARTMENT TABLE*/

  $("#departmentsBtn").on("click", function () {
    refreshDepartmentTable();
  });
  
  /*REFRESH LOCATION TABLE*/
  $("#locationsBtn").on("click", function () {
   
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
          const departmentFilter = $("#departmentFilter");
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
          const locationFilter = $("#locationFilter");
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

    /*FILTER PERSONNEL APPLY BUTTON */
    $("#applyFilters").on("click", function () {
      var selectedDepartment = $("#departmentFilter input:radio:checked").val() || "";
      var selectedLocation = $("#locationFilter input:radio:checked").val() || "";
      $.ajax({
        url: "libs/php/filterPersonnel.php",
        type: "POST",
        data: { department: selectedDepartment, location: selectedLocation },
        dataType: "json",
        success: function (result) {
          if (result.status.name == "ok") {
            $("#personnelTableBody").empty();
            if (result.data.personnel.length > 0) {
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
              $("#filterPersonnelModal").modal("hide");
              $("#personnelTableBody").append(`
              <tr>
                <td colspan="5" class="text-center">No personnel found.</td>
              </tr>              
            `);
            }
          } else {
            $("#popupErrorModal .modal-body").text("Error fetching personnel.");
            $("#popupErrorModal").modal("show");
          }
        },
        error: function () {
          $("#popupErrorModal .modal-body").text("Failed to fetch filtered personnel.");
          $("#popupErrorModal").modal("show");
        }
      });
    });
    
    /*FILTER PERSONNEL CLEAR FILTERS BUTTON */
$("#clearFilters").on("click", function () {
  $("#filterForm input:radio").prop("checked", false);
  $("#personnelTableBody").empty();
  $.ajax({
    url: "libs/php/updateAllPersonnel.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      if (result.status.name == "ok" && Array.isArray(result.data)) {
        if (result.data.length === 0) {
          $("#personnelTableBody").append(`
            <tr><td colspan="6">No personnel data available</td></tr>
            `);
        } else {
          result.data.forEach(function (personnel) {
            $("#personnelTableBody").append(`
            <tr>
              <td class="align-middle text-nowrap"><a href="#" class="view-personnel-name" data-id=${personnel.id}>${personnel.lastName}, ${personnel.firstName}
                </a></td>
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
        $("#popupErrorModal .modal-body").text("No personnel data available.");
        $("#popupErrorModal").modal("show");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#popupErrorModal .modal-body").text("Error refreshing personnel table.");
      $("#popupErrorModal").modal("show");
    }
  });
});
  
/* ADD PERSONNEL, LOCATIONS AND DEPARTMENTS USING #ADDBTN */
$("#addBtn").on("click", function () {
  $("#addPersonnelForm")[0].reset();
  $("#addDepartmentForm")[0].reset();
  $("#addLocationForm")[0].reset();

  /* 1ST CONDITION: ADD PERSONNEL */
  if ($("#personnelBtn").hasClass("active")) {
      $("#addPersonnelModal").modal("show");
      $.ajax({
          url: "libs/php/getAllDepartments.php",
          type: "GET",
          dataType: "json",
          success: function (result) {
              if (result.status.name == "ok") {
                  $("#addPersonnelDepartment").html("");
                  result.data.forEach((department) => {
                      $("#addPersonnelDepartment").append(
                          $("<option>", {
                              value: department.departmentID,
                              text: department.departmentName,
                          })
                      );
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
                  $("#addPersonnelLocation").html("");
                  result.data.forEach((location) => {
                      $("#addPersonnelLocation").append(
                          $("<option>", {
                              value: location.locationID,
                              text: location.locationName
                          })
                      );
                  });
              } else {
                  $("#popupErrorModal .modal-body").text("Failed to fetch locations for Add Personnel modal.");
                  $("#popupErrorModal").modal("show");
              }
          }
      });

/* 2ND CONDITION: ADD DEPARTMENT */
} else if ($("#departmentsBtn").hasClass("active")) {
  $("#addDepartmentModal").modal("show");
  $.ajax({
    url: "libs/php/getAllLocations.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      if (result.status.name == "ok") {
        $("#addDepartmentLocation").empty();

        result.data.forEach(function(location) {
          $("#addDepartmentLocation").append(
            $("<option>", {
              value: location.locationID,
              text: location.locationName
            })
          );
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
/*3RD CONDITION: ADD LOCATION */
} else {
    $("#addLocationModal").modal("show");
}
});
   
/* ADD PERSONNEL FORM SUBMIT */
$("#addPersonnelModal").on("submit", "#addPersonnelForm", function (e) {
  e.preventDefault();

  let firstName = $("#addPersonnelFirstName").val();
  let lastName = $("#addPersonnelLastName").val();
  let email = $("#addPersonnelEmailAddress").val();

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
          if (result.status.name == "ok" && result.data.exists) {
              firstName = result.data.firstName;
              lastName = result.data.lastName;
              $("#addPersonnelModal").modal("hide");
              $("#addPersonnelErrorModal .modal-body").text(`${firstName} ${lastName} cannot be added as it already exists in the directory.`);
              $("#addPersonnelErrorModal").modal("show");
          } else {
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
                       let firstName = result.data.firstName;
                       let lastName = result.data.lastName;
                          $("#addPersonnelModal").modal("hide");
                          $("#addPersonnelSuccessModal .modal-body").text(`${firstName} ${lastName} was added successfully.`);
                          $("#addPersonnelSuccessModal").modal("show");
                          refreshPersonnelTable();
                      }
                  },
                  error: function (jqXHR, textStatus, errorThrown) {
                    $("#popupErrorModal .modal-body").text("Failed to add personnel.");
                    $("#popupErrorModal").modal("show");
                  }
              });
          }
      },
      error: function (jqXHR, textStatus, errorThrown) {
          $("#popupErrorModal .modal-body").text("Failed to check for duplicate employees.");
          $("#popupErrorModal").modal("show");
      }
  });
});

/*VIEW PERSONNEL MODAL */
$("#personnelTableBody").on("click", ".view-personnel-name", function(e) {
  e.preventDefault();
  
  const personnelId = $(this).data("id");
  
  $.ajax({
    url: "libs/php/getPersonnelById.php",
    type: "GET",
    dataType: "json",
    data: {
      id: personnelId
    },
    success: function (result) {
      if (result.status.name == "ok") {
        const personnel = result.data.personnel[0];
        $("#viewPersonnelFirstName").val(personnel.firstName);
        $("#viewPersonnelLastName").val(personnel.lastName);
        $("#viewPersonnelJobTitle").val(personnel.jobTitle || "Not specified");
        $("#viewPersonnelEmailAddress").val(personnel.email);
        $("#viewPersonnelLocation").val(personnel.location);
        $("#viewPersonnelDepartment").val(personnel.departmentName);

        $("#viewPersonnelModal").modal("show");
      }
    }, 
    error: function (jqXHR, textStatus, errorThrown) {
      $("#popupErrorModal .modal-body").text("Failed to fetch view personnel details.");
      $("#popupErrorModal").modal("show");
    }
  })
})
  
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
      console.log("Get personnel by id", result);
      if (result.status.name == "ok" && result.data.personnel.length > 0) {

        let personnel = result.data.personnel[0];
        let department = result.data.department;
        $("#editPersonnelEmployeeID").val(personnel.id);
        $("#editPersonnelFirstName").val(personnel.firstName);
        $("#editPersonnelLastName").val(personnel.lastName);
        $("#editPersonnelJobTitle").val(personnel.jobTitle);
        $("#editPersonnelEmailAddress").val(personnel.email);

        $("#editPersonnelDepartment").html("");
        $.each(department, function () {
          $("#editPersonnelDepartment").append(
            $("<option>", {
              value: this.id,
              text: this.name,
            })
          );
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
        let firstName = result.data[0].firstName;
        let lastName = result.data[0].lastName;
        $("#editPersonnelModal").modal("hide");

        $("#editPersonnelSuccessModal .modal-body").text(`${firstName} ${lastName} was successfully updated.`);
        $("#editPersonnelSuccessModal").modal("show");
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
    data: { id: deletePersonnelId },
    success: function (response) {
  const result = typeof response === "string" ? JSON.parse(response) : response;

  if (result.status.name == "ok") {
    let firstName = result.data.firstName;
    let lastName = result.data.lastName;

    if (firstName && lastName) {
      $("#deletePersonnelConfirmationModal .modal-body").text(
        `Are you sure you want to delete ${firstName} ${lastName}?`
      );
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
$("#deletePersonnelConfirmationModal .btn-delete-personnel-confirmation").on("click", function() {
  const deletePersonnelId = $("#deletePersonnelConfirmationModal").data("id");

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

        $("#deletePersonnelSuccessModal .modal-body").text(`${firstName} ${lastName} was successfully deleted.`);
        $("#deletePersonnelSuccessModal").modal("show");
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
      if (result.status.name == "ok" && result.data.exists) {
        let departmentName = result.data.duplicates[0].departmentName;
        let departmentLocation = result.data.duplicates[0].locationName;
        $("#addDepartmentModal").modal("hide");

        $("#addDepartmentErrorModal .modal-body").text(`The ${departmentName} department in ${departmentLocation} cannot be added as it already exists in the directory.`);;
        $("#addDepartmentErrorModal").modal("show");
      } else {
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
          
              $("#addDepartmentModal").modal("hide");
              $("#addDepartmentSuccessModal .modal-body").text(`The ${departmentName} department in ${locationName} was successfully added.`);
              $("#addDepartmentSuccessModal").modal("show");
              refreshDepartmentTable();
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            $("#addDepartmentErrorModal .modal-body").text("Failed to add department.");
          }
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#popupErrorModal .modal-body").text("Failed to check for duplicate departments.");
      $("#popupErrorModal").modal("show");
    }
  });
});

/*EDIT DEPARTMENT MODAL */
  $("#editDepartmentModal").on("show.bs.modal", function (e) {

  $("#editDepartmentName").val("");

  const editDepartmentId = $(e.relatedTarget).attr("data-id");

  $(this).data("editDepartmentId", editDepartmentId);

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
        let location = result.data.locations;
       $("#editDepartmentName").val(department.departmentName);

        $("#editDepartmentLocation").html("");
        $.each(location, function () {
          $("#editDepartmentLocation").append(
            $("<option>", {
              value: this.locationID,
              text: this.locationName,
            })
          );
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
      let departmentName = result.data[0].departmentName;
      let locationName = result.data[0].locationName;
      if (result.status.name == "ok") {
        $("#editDepartmentModal").modal("hide");

        $("#editDepartmentSuccessModal .modal-body").text(`The ${departmentName} department in ${locationName} was successfully updated.`);
        $("#editDepartmentSuccessModal").modal("show");
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
          const locationName = result.data.locationName;
  
          if (personnelCount > 0) {

            const errorMessage = `Sorry, you cannot delete ${departmentName} in ${locationName} as there ${
              personnelCount === 1 ? "is" : "are"
            } ${personnelCount} employee${personnelCount === 1 ? "" : "s"} assigned to it.`;
            $("#deleteDepartmentErrorModal .modal-body").text(errorMessage);
            $("#deleteDepartmentErrorModal").modal("show");

            return;
          } else {

            $("#deleteDepartmentConfirmationModal .modal-body").text(
              `Are you sure you want to delete the ${departmentName} department in ${locationName}?`
            );
            $("#deleteDepartmentConfirmationModal").modal("show");
          }
        } else {
          $("#popupErrorModal .modal-body").text("Error retrieving department details.");
          $("#popupErrorModal").modal("show");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#popupErrorModal .modal-body").text("Error retrieving department details.");
        $("#popupErrorModal").modal("show");
      },
    });
  });  

/* DELETE DEPARTMENT CONFIRMATION MODAL*/
$("#deleteDepartmentConfirmationModal .btn-delete-department-confirmation").on("click", function() {
  const deleteDepartmentId = $("#deleteDepartmentConfirmationModal").data("id");
  $.ajax({
    url: "libs/php/deleteDepartmentByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: deleteDepartmentId,
    },
    success: function(result) {
      if (result.status.name == "ok") {
        let departmentName = result.data.departmentName;
        let locationName = result.data.departmentLocation;

        $("#deleteDepartmentConfirmationModal").modal("hide");

        refreshDepartmentTable();
        $("#deleteDepartmentSuccessModal .modal-body").text(`The ${departmentName} department in ${locationName} was successfully deleted.`);
        $("#deleteDepartmentSuccessModal").modal("show");

      } else {
        $("#deleteDepartmentConfirmationModal").modal("hide");
        $("#popupErrorModal .modal-body").text("Error deleting department.");
        $("#popupErrorModal").modal("show");
        
      }
},
    error: function(jqXHR, textStatus, errorThrown) {
      $("#popupErrorModal .modal-body").text("Error deleting department.");
      $("#popupErrorModal").modal("show");
    }
  });
});

 /*ADD LOCATION FORM SUBMIT */
 $("#addLocationModal").on("submit", "#addLocationForm", function (e) {
  e.preventDefault();
   
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
          
              $("#addLocationModal").modal("hide");
              $("#addLocationSuccessModal .modal-body").text(`The location ${locationName} was successfully added.`);
              $("#addLocationSuccessModal").modal("show");
              refreshLocationTable();
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            $("#popupErrorModal .modal-body").text("Failed to add location.");
            $("#popupErrorModal").modal("show");
          }
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#popupErrorModal .modal-body").text("Failed to check for duplicate locations.");
      $("#popupErrorModal").modal("show");
    }
  });
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
        let locationName = result.data[0].locationName;
        $("#editLocationModal").modal("hide");

        $("#editLocationSuccessModal .modal-body").text(`The location name was successfully updated to ${locationName}.`);
        $("#editLocationSuccessModal").modal("show");
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
            const errorMessage = `Sorry, you cannot delete ${locationName} as there ${
              departmentCount === 1 ? "is" : "are"
            } ${departmentCount} department${departmentCount === 1 ? "" : "s"} assigned to it.`;
            
            $("#deleteLocationConfirmationModal").modal("hide");
            $("#deleteLocationErrorModal").modal("hide");
            
            $("#deleteLocationErrorModal .modal-body").text(errorMessage);
            $("#deleteLocationErrorModal").modal("show");
            
            return;
          } else {
            $("#deleteLocationConfirmationModal .modal-body").text(
              `Are you sure you want to delete the location ${locationName}?`
            );
            $("#deleteLocationConfirmationModal").modal("show");
          }
        } else {
          $("#popupErrorModal .modal-body").text("Error retrieving location details.");
          $("#popupErrorModal").modal("show");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#popupErrorModal .modal-body").text("An error occurred when trying to retrieve location details.");
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
        $("#deleteLocationConfirmationModal").modal("hide");
        $("#popupErrorModal .modal-body").text("Error deleting location.");
        $("#popupErrorModal").modal("show");
      }
},
    error: function(jqXHR, textStatus, errorThrown) {
      $("#popupErrorModal .modal-body").text("An error occurred while attempting to delete the location.");
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
      if (result.status.name == "ok" && Array.isArray(result.data)) {
        if (result.data.length === 0) {
          $("#personnelTableBody").append(`
            <tr><td colspan="6">No personnel data available</td></tr>
            `);
        } else {
          result.data.forEach(function (personnel) {
            $("#personnelTableBody").append(`
            <tr>
              <td class="align-middle text-nowrap"><a href="#" class="view-personnel-name" data-id=${personnel.id}>${personnel.lastName}, ${personnel.firstName}
                </a></td>
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
        $("#popupErrorModal .modal-body").text("No personnel data available.");
        $("#popupErrorModal").modal("show");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#popupErrorModal .modal-body").text("Error refreshing personnel table.");
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
      if (result.status.name == "ok" && Array.isArray(result.data)) {
        if (result.data.length === 0) {
          $("#departmentTableBody").append(`
            <tr><td colspan="6">No department data available</td></tr>
            `);
          } else {
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
      } else {
        $("#popupErrorModal .modal-body").text("No department data available.");
        $("#popupErrorModal").modal("show");
      }
    }, 
    error: function (jqXHR, textStatus, errorThrown) {
      $("#popupErrorModal .modal-body").text("Error refreshing department table.");
      $("#popupErrorModal").modal("show");
      
    }
  })
}

/*REFRESH LOCATION TABLE FUNCTION*/
function refreshLocationTable() {
  $("#locationTableBody").empty();
  $("#searchInp").val("");

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
      } else {
        $("#popupErrorModal .modal-body").text("No location data available.");
        $("#popupErrorModal").modal("show");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#popupErrorModal .modal-body").text("Error refreshing location table.");
      $("#popupErrorModal").modal("show");
    }
  })
}

});