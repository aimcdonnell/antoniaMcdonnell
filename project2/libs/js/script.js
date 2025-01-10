/*PRELOADER HANDLING */
$(window).on("load", function () {
  if ($("#preloader").length) {
    $("#preloader")
      .delay(1500)
      .fadeOut("slow", function () {
        $(this).remove();
      });
  }

/* GET ALL PERSONNEL DYNAMICALLY */
$.ajax({
  url: "libs/php/getAll.php",
  type: "GET",
  dataType: "json",
  success: function (result) {
    if (result.status.name == "ok") {
      const personnelFrag = document.createDocumentFragment();

      result.data.forEach((personnel) => {
        const row = document.createElement("tr");

        // Name Column
        const nameCell = document.createElement("td");
        nameCell.classList = "align-middle text-nowrap";
        const nameLink = document.createElement("a");
        nameLink.href = "#";
        nameLink.classList = "view-personnel-name";
        nameLink.setAttribute("data-id", personnel.id);
        nameLink.textContent = `${personnel.lastName}, ${personnel.firstName}`;
        nameCell.append(nameLink);
        row.append(nameCell);

        // Department Column
        const departmentCell = document.createElement("td");
        departmentCell.classList = "align-middle text-nowrap d-none d-md-table-cell";
        departmentCell.textContent = personnel.departmentName;
        row.append(departmentCell);

        // Location Column
        const locationCell = document.createElement("td");
        locationCell.classList = "align-middle text-nowrap d-none d-md-table-cell";
        locationCell.textContent = personnel.location;
        row.append(locationCell);

        // Email Column
        const emailCell = document.createElement("td");
        emailCell.classList = "align-middle text-nowrap d-none d-md-table-cell";
        emailCell.textContent = personnel.email;
        row.append(emailCell);

        // Action Buttons Column
        const actionsCell = document.createElement("td");
        actionsCell.classList = "align-middle text-end text-nowrap";

        // Edit Button
        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.classList = "btn btn-primary btn-sm edit-personnel-btn";
        editButton.setAttribute("data-bs-toggle", "modal");
        editButton.setAttribute("data-bs-target", "#editPersonnelModal");
        editButton.setAttribute("data-id", personnel.id);
        editButton.innerHTML = `<i class="fa-solid fa-pencil fa-fw"></i>`;
        actionsCell.append(editButton);

        // Add spacing between buttons
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.classList = "btn btn-primary btn-sm delete-personnel-btn ms-2"; // Added Bootstrap's ms-2 class for spacing
        deleteButton.setAttribute("data-id", personnel.id);
        deleteButton.innerHTML = `<i class="fa-solid fa-trash fa-fw"></i>`;
        actionsCell.append(deleteButton);

        row.append(actionsCell);


        // Append row to the fragment
        personnelFrag.appendChild(row);
      });

      // Append the fragment to the table body
      $("#personnelTableBody").append(personnelFrag);
    } else{

      document.querySelector("#popupErrorModal .modal-body").textContent = "Failed to fetch all personnel data.";

      const modalElement = document.getElementById("popupErrorModal");
      const bootstrapModal = new bootstrap.Modal(modalElement);
      bootstrapModal.show();
    }
  },
  error: function () {
    document.querySelector("#popupErrorModal .modal-body").textContent = "Error fetching all personnel data.";

    const modalElement = document.getElementById("popupErrorModal");
    const bootstrapModal = new bootstrap.Modal(modalElement);
    bootstrapModal.show();
  }
});


  /*GET ALL DEPARTMENTS DYNAMICALLY */
  $.ajax({
    url: "libs/php/getAll.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      if (result.status.name == "ok") {
        const departmentFrag = document.createDocumentFragment();
        result.data.forEach((department) => {
          const row = document.createElement("tr");

          //Department column
          const departmentCell = document.createElement("td");
          departmentCell.classList = "align-middle-text-nowrap";
          departmentCell.textContent = department.departmentName;
          row.append(departmentCell);

          //Location column
          const locationCell = document.createElement("td");
          locationCell.classList = "align-middle-text-nowrap d-none d-md-table-cell";
          locationCell.textContent = department.location;
          row.append(locationCell);

          //Action Buttons column
          const actionsCell = document.createElement("td");
          actionsCell.classList = "align-middle text-end text-nowrap";

          //Edit button
          const editButton = document.createElement("button");
          editButton.type = "button";
          editButton.classList = "btn btn-primary btn-sm edit-department-btn ms-2";
          editButton.setAttribute("data-bs-toggle", "modal");
          editButton.setAttribute("data-bs-target", "#editDepartmentModal");
          editButton.innerHTML = '<i class="fa-solid fa-pencil fa-fw"></i>';
          editButton.setAttribute("data-id", department.departmentId);
          actionsCell.append(editButton);

          //Delete button
          const deleteButton = document.createElement("button");
          deleteButton.type = "button";
          deleteButton.classList = "btn btn-primary btn-sm delete-department-btn ms-2";
          deleteButton.setAttribute("data-id", department.departmentId);
          deleteButton.innerHTML = '<i class="fa-solid fa-trash fa-fw"></i>';
          actionsCell.append(deleteButton);

          row.append(actionsCell);

          departmentFrag.appendChild(row);
        });
        $("#departmentTableBody").append(departmentFrag);
      } else {
        // Set the text content of the modal body
        document.querySelector("#popupErrorModal .modal-body").textContent = "Failed to fetch all departments.";

        // Show the modal (assuming Bootstrap 5 is used)
        const modalElement = document.getElementById("popupErrorModal");
        const bootstrapModal = new bootstrap.Modal(modalElement);
        bootstrapModal.show();
      }
    },
    error: function () {
       // Set the text content of the modal body
       document.querySelector("#popupErrorModal .modal-body").textContent = "Error fetching all departments.";

       // Show the modal (assuming Bootstrap 5 is used)
       const modalElement = document.getElementById("popupErrorModal");
       const bootstrapModal = new bootstrap.Modal(modalElement);
       bootstrapModal.show();
    }
  });  

  /*GET ALL LOCATIONS DYNAMICALLY*/
  $.ajax({
    url: "libs/php/getAll.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      if (result.status.name == "ok") {
        const locationFrag = document.createDocumentFragment();
        result.data.forEach((location) => {
          const row = document.createElement("tr");

          //Location column
          const locationCell = document.createElement("td");
          locationCell.classList = "align-middle-text-nowrap";
          locationCell.textContent = location.location;
          row.append(locationCell);

          //Action Buttons column
          const actionsCell = document.createElement("td");
          actionsCell.classList = "align-middle text-end text-nowrap";

          //Edit button
          const editButton = document.createElement("button");
          editButton.type = "button";
          editButton.classList = "btn btn-primary btn-sm edit-location-btn ms-2";
          editButton.setAttribute("data-bs-toggle", "modal");
          editButton.setAttribute("data-bs-target", "#editLocationModal");
          editButton.innerHTML = '<i class="fa-solid fa-pencil fa-fw"></i>';
          editButton.setAttribute("data-id", location.id);
          actionsCell.append(editButton);

          //Delete button
          const deleteButton = document.createElement("button");
          deleteButton.type = "button";
          deleteButton.classList = "btn btn-primary btn-sm delete-location-btn ms-2";
          deleteButton.setAttribute("data-id", location.id);
          deleteButton.innerHTML = '<i class="fa-solid fa-trash fa-fw"></i>';
          actionsCell.append(deleteButton);

          row.append(actionsCell);

          locationFrag.appendChild(row);
        });
        $("#locationTableBody").append(locationFrag);
      } else {
        // Set the text content of the modal body
        document.querySelector("#popupErrorModal .modal-body").textContent = "Failed to fetch all locations from.";

        // Show the modal (assuming Bootstrap 5 is used)
        const modalElement = document.getElementById("popupErrorModal");
        const bootstrapModal = new bootstrap.Modal(modalElement);
        bootstrapModal.show();
      }
    },
    error: function () {
      document.querySelector("#popupErrorModal .modal-body").textContent = "Error fetching all locations.";

      // Show the modal (assuming Bootstrap 5 is used)
      const modalElement = document.getElementById("popupErrorModal");
      const bootstrapModal = new bootstrap.Modal(modalElement);
      bootstrapModal.show();
    }
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
          const personnelTableBody = document.getElementById("personnelTableBody");
          const departmentTableBody = document.getElementById("departmentTableBody");
          const locationTableBody = document.getElementById("locationTableBody");

          // Clear existing content
          personnelTableBody.innerHTML = "";
          departmentTableBody.innerHTML = "";
          locationTableBody.innerHTML = "";
          /*PERSONNEL TABLE*/
          if (result.data.personnel && result.data.personnel.length > 0) {
            const personnelFrag = document.createDocumentFragment();
              result.data.personnel.forEach((item) => {
                const row = document.createElement("tr");

                // Name Column
                const nameCell = document.createElement("td");
                nameCell.classList = "align-middle text-nowrap";
                const nameLink = document.createElement("a");
                nameLink.href = "#";
                nameLink.classList = "view-personnel-name";
                nameLink.setAttribute("data-id", item.id);
                nameLink.textContent = `${item.lastName}, ${item.firstName}`;
                nameCell.append(nameLink);
                row.append(nameCell);
        
                // Department Column
                const departmentCell = document.createElement("td");
                departmentCell.classList = "align-middle text-nowrap d-none d-md-table-cell";
                departmentCell.textContent = item.departmentName;
                row.append(departmentCell);
        
                // Location Column
                const locationCell = document.createElement("td");
                locationCell.classList = "align-middle text-nowrap d-none d-md-table-cell";
                locationCell.textContent = item.locationName;
                row.append(locationCell);
        
                // Email Column
                const emailCell = document.createElement("td");
                emailCell.classList = "align-middle text-nowrap d-none d-md-table-cell";
                emailCell.textContent = item.email;
                row.append(emailCell);
        
                // Action Buttons Column
                const actionsCell = document.createElement("td");
                actionsCell.classList = "align-middle text-end text-nowrap";
        
                // Edit Button
                const editButton = document.createElement("button");
                editButton.type = "button";
                editButton.classList = "btn btn-primary btn-sm edit-personnel-btn";
                editButton.setAttribute("data-bs-toggle", "modal");
                editButton.setAttribute("data-bs-target", "#editPersonnelModal");
                editButton.setAttribute("data-id", item.id);
                editButton.innerHTML = `<i class="fa-solid fa-pencil fa-fw"></i>`;
                actionsCell.append(editButton);
        
                // Add spacing between buttons
                const deleteButton = document.createElement("button");
                deleteButton.type = "button";
                deleteButton.classList = "btn btn-primary btn-sm delete-personnel-btn ms-2"; // Added Bootstrap's ms-2 class for spacing
                deleteButton.setAttribute("data-id", item.id);
                deleteButton.innerHTML = `<i class="fa-solid fa-trash fa-fw"></i>`;
                actionsCell.append(deleteButton);
        
                row.append(actionsCell);
        
        
                // Append row to the fragment
                personnelFrag.appendChild(row);
              });
              personnelTableBody.appendChild(personnelFrag);
          } else {
            const noDataRow = document.createElement("tr");
            const noDataCell = document.createElement("td");
            noDataCell.colSpan = 5;
            noDataCell.classList = "text-center";
            noDataCell.textContent = "No personnel found";
            noDataRow.append(noDataCell);
            personnelTableBody.appendChild(noDataRow);
          }

          /*LOCATIONS TABLE */
          if (result.data.locations && result.data.locations.length > 0) {
            const locationFrag = document.createDocumentFragment();
              result.data.locations.forEach((item) => {
                const row = document.createElement("tr");

                //Location column
                const locationCell = document.createElement("td");
                locationCell.classList = "align-middle-text-nowrap";
                locationCell.textContent = item.locationName;
                row.append(locationCell);
      
                //Action Buttons column
                const actionsCell = document.createElement("td");
                actionsCell.classList = "align-middle text-end text-nowrap";
      
                //Edit button
                const editButton = document.createElement("button");
                editButton.type = "button";
                editButton.classList = "btn btn-primary btn-sm edit-location-btn ms-2";
                editButton.setAttribute("data-bs-toggle", "modal");
                editButton.setAttribute("data-bs-target", "#editLocationModal");
                editButton.innerHTML = '<i class="fa-solid fa-pencil fa-fw"></i>';
                editButton.setAttribute("data-id", item.id);
                actionsCell.append(editButton);
      
                //Delete button
                const deleteButton = document.createElement("button");
                deleteButton.type = "button";
                deleteButton.classList = "btn btn-primary btn-sm delete-location-btn ms-2";
                deleteButton.setAttribute("data-id", item.id);
                deleteButton.innerHTML = '<i class="fa-solid fa-trash fa-fw"></i>';
                actionsCell.append(deleteButton);
      
                row.append(actionsCell);
      
                locationFrag.appendChild(row);
              });
              locationTableBody.appendChild(locationFrag);
          } else {
            const noDataRow = document.createElement("tr");
            const noDataCell = document.createElement("td");
            noDataCell.colSpan = 2;
            noDataCell.classList = "text-center";
            noDataCell.textContent = "No locations found";
            noDataRow.append(noDataCell);
            locationTableBody.appendChild(noDataRow);
          }
          if (result.data.departments && result.data.departments.length > 0) {
            const departmentFrag = document.createDocumentFragment();
            result.data.departments.forEach((item) => {
              const row = document.createElement("tr");
              //Department column
              const departmentCell = document.createElement("td");
              departmentCell.classList = "align-middle-text-nowrap";
              departmentCell.textContent = item.departmentName;
              row.append(departmentCell);

              //Location column
              const locationCell = document.createElement("td");
              locationCell.classList = "align-middle-text-nowrap d-none d-md-table-cell";
              locationCell.textContent = item.locationName;
              row.append(locationCell);

              //Action Buttons column
              const actionsCell = document.createElement("td");
              actionsCell.classList = "align-middle text-end text-nowrap";

              //Edit button
              const editButton = document.createElement("button");
              editButton.type = "button";
              editButton.classList = "btn btn-primary btn-sm edit-department-btn ms-2";
              editButton.setAttribute("data-bs-toggle", "modal");
              editButton.setAttribute("data-bs-target", "#editDepartmentModal");
              editButton.innerHTML = '<i class="fa-solid fa-pencil fa-fw"></i>';
              editButton.setAttribute("data-id", item.id);
              actionsCell.append(editButton);

              //Delete button
              const deleteButton = document.createElement("button");
              deleteButton.type = "button";
              deleteButton.classList = "btn btn-primary btn-sm delete-department-btn ms-2";
              deleteButton.setAttribute("data-id", item.id);
              deleteButton.innerHTML = '<i class="fa-solid fa-trash fa-fw"></i>';
              actionsCell.append(deleteButton);

              row.append(actionsCell);

              departmentFrag.appendChild(row);
            });
            $("#departmentTableBody").append(departmentFrag);
        } else {
          const noDataRow = document.createElement("tr");
          const noDataCell = document.createElement("td");
          noDataCell.colSpan = 2;
          noDataCell.classList = "text-center";
          noDataCell.textContent = "No departments found";
          noDataRow.append(noDataCell);
          departmentTableBody.appendChild(noDataRow);
        }
    } else {
      document.querySelector("#popupErrorModal .modal-body").textContent = "Error searching all data.";

      const modalElement = document.getElementById("popupErrorModal");
      const bootstrapModal = new bootstrap.Modal(modalElement);
      bootstrapModal.show();
    }
        },
        error: function (xhr, status, error) {
          document.querySelector("#popupErrorModal .modal-body").textContent = "Failed to search all data.";

          const modalElement = document.getElementById("popupErrorModal");
          const bootstrapModal = new bootstrap.Modal(modalElement);
          bootstrapModal.show();
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
    $("#filterPersonnelModal").modal("show");
    $.ajax({
      url: "libs/php/getAllDepartments.php",
      type: "GET",
      success: function (response) {
        const result = typeof response === "string" ? JSON.parse(response) : response;
        if (result.status.name == "ok") {
          const departmentFilter = document.getElementById("filterPersonnelByDepartment");
          departmentFilter.innerHTML = `<option value="0">All</option>`;
          
          // Create a document fragment
          const frag = document.createDocumentFragment();
          
          result.data.forEach(department => {
            const option = document.createElement("option");
            option.value = department.departmentID;
            option.textContent = department.departmentName;
            frag.appendChild(option);
          });
  
          departmentFilter.appendChild(frag);
          
        } else {
          document.querySelector("#popupErrorModal .modal-body").textContent = "Error getting all departments.";

          const modalElement = document.getElementById("popupErrorModal");
          const bootstrapModal = new bootstrap.Modal(modalElement);
          bootstrapModal.show();
        }
      },
      error: function () {
        document.querySelector("#popupErrorModal .modal-body").textContent = "Failed to fetch departments.";

        const modalElement = document.getElementById("popupErrorModal");
        const bootstrapModal = new bootstrap.Modal(modalElement);
        bootstrapModal.show();
      }
    });

    $.ajax({
      url: "libs/php/getAllLocations.php",
      type: "GET",
      success: function (response) {
        const result = typeof response === "string" ? JSON.parse(response) : response;
        if (result.status.name == "ok") {
          const locationFilter = document.getElementById("filterPersonnelByLocation");
          locationFilter.innerHTML = `<option value="0">All</option>`;
          
          // Create a document fragment
          const frag = document.createDocumentFragment();
          
          result.data.forEach(location => {
            const option = document.createElement("option");
            option.value = location.locationID;
            option.textContent = location.locationName;
            frag.appendChild(option); // Append each option to the fragment
          });
          // Append the entire fragment to the department filter in one go
          locationFilter.appendChild(frag);
        } else {
          document.querySelector("#popupErrorModal .modal-body").textContent = "Error getting all locations.";

          const modalElement = document.getElementById("popupErrorModal");
          const bootstrapModal = new bootstrap.Modal(modalElement);
          bootstrapModal.show();
        }
      },
      error: function () {
        document.querySelector("#popupErrorModal .modal-body").textContent = "Failed to fetch all locations.";
        const modalElement = document.getElementById("popupErrorModal");
        const bootstrapModal = new bootstrap.Modal(modalElement);
        bootstrapModal.show();
      }
    });

  });

/*FILTER PERSONNEL ON CHANGE BUTTON */
$("#filterPersonnelByDepartment").on("change", function () {
  if (this.value > 0) {
      $("#filterPersonnelByLocation").val(0);
  }
  var selectedDepartment = $("#filterPersonnelByDepartment option:selected").val() || "";
  console.log("selected department", selectedDepartment);
  var selectedLocation = $("#filterPersonnelByLocation option:selected").val() || "";
  console.log("selected location", selectedLocation);
  $.ajax({
    url: "libs/php/filterPersonnel.php",
    type: "POST",
    data: { department: selectedDepartment, location: selectedLocation },
    dataType: "json",
    success: function (result) {
      console.log("filter personnel by department", result.data);
      if (result.status.name == "ok") {
        const personnelFrag = document.createDocumentFragment();
        $("#personnelTableBody").empty();
        if (result.data.personnel.length > 0) {
        result.data.personnel.forEach(personnel => {
          const row = document.createElement("tr");

          // Name Column
          const nameCell = document.createElement("td");
          nameCell.classList = "align-middle text-nowrap";
          const nameLink = document.createElement("a");
          nameLink.href = "#";
          nameLink.classList = "view-personnel-name";
          nameLink.setAttribute("data-id", personnel.id);
          nameLink.textContent = `${personnel.lastName}, ${personnel.firstName}`;
          nameCell.append(nameLink);
          row.append(nameCell);

          // Department Column
          const departmentCell = document.createElement("td");
          departmentCell.classList = "align-middle text-nowrap d-none d-md-table-cell";
          departmentCell.textContent = personnel.departmentName;
          row.append(departmentCell);

          // Location Column
          const locationCell = document.createElement("td");
          locationCell.classList = "align-middle text-nowrap d-none d-md-table-cell";
          locationCell.textContent = personnel.location;
          row.append(locationCell);

          // Email Column
          const emailCell = document.createElement("td");
          emailCell.classList = "align-middle text-nowrap d-none d-md-table-cell";
          emailCell.textContent = personnel.email;
          row.append(emailCell);

          // Action Buttons Column
          const actionsCell = document.createElement("td");
          actionsCell.classList = "align-middle text-end text-nowrap";

          // Edit Button
          const editButton = document.createElement("button");
          editButton.type = "button";
          editButton.classList = "btn btn-primary btn-sm edit-personnel-btn";
          editButton.setAttribute("data-bs-toggle", "modal");
          editButton.setAttribute("data-bs-target", "#editPersonnelModal");
          editButton.setAttribute("data-id", personnel.id);
          editButton.innerHTML = `<i class="fa-solid fa-pencil fa-fw"></i>`;
          actionsCell.append(editButton);

          // Add spacing between buttons
          const deleteButton = document.createElement("button");
          deleteButton.type = "button";
          deleteButton.classList = "btn btn-primary btn-sm delete-personnel-btn ms-2";
          deleteButton.setAttribute("data-id", personnel.id);
          deleteButton.innerHTML = `<i class="fa-solid fa-trash fa-fw"></i>`;
          actionsCell.append(deleteButton);

          row.append(actionsCell);


          // Append row to the fragment
          personnelFrag.appendChild(row);
      });
      // Append the fragment to the table body
      $("#personnelTableBody").append(personnelFrag);

        } else {
            const noDataRow = document.createElement("tr");
            const noDataCell = document.createElement("td");
            noDataCell.colSpan = 5;
            noDataCell.classList = "text-center";
            noDataCell.textContent = "No personnel found";
            noDataRow.append(noDataCell);
            personnelTableBody.appendChild(noDataRow);
        }
      } else {
        document.querySelector("#popupErrorModal .modal-body").textContent = "Error fetching personnel for filtering by department.";

        const modalElement = document.getElementById("popupErrorModal");
        const bootstrapModal = new bootstrap.Modal(modalElement);
        bootstrapModal.show();
      }
    },
    error: function () {
      document.querySelector("#popupErrorModal .modal-body").textContent = "Failed to fetch personnel for filtering by department.";

      const modalElement = document.getElementById("popupErrorModal");
      const bootstrapModal = new bootstrap.Modal(modalElement);
      bootstrapModal.show();
    }
  });
});

$("#filterPersonnelByLocation").on("change", function () {
  if (this.value > 0) {
      $("#filterPersonnelByDepartment").val(0);
  }
  var selectedDepartment = $("#filterPersonnelByDepartment option:selected").val() || "";
  var selectedLocation = $("#filterPersonnelByLocation option:selected").val() || "";
  $.ajax({
    url: "libs/php/filterPersonnel.php",
    type: "POST",
    data: { department: selectedDepartment, location: selectedLocation },
    dataType: "json",
    success: function (result) {
      console.log("filter personnel by location", result.data);
      if (result.status.name == "ok") {
        $("#personnelTableBody").empty();
        const personnelFrag = document.createDocumentFragment();
        if (result.data.personnel.length > 0) {
        result.data.personnel.forEach(personnel => {
          const row = document.createElement("tr");

          // Name Column
          const nameCell = document.createElement("td");
          nameCell.classList = "align-middle text-nowrap";
          const nameLink = document.createElement("a");
          nameLink.href = "#";
          nameLink.classList = "view-personnel-name";
          nameLink.setAttribute("data-id", personnel.id);
          nameLink.textContent = `${personnel.lastName}, ${personnel.firstName}`;
          nameCell.append(nameLink);
          row.append(nameCell);

          // Department Column
          const departmentCell = document.createElement("td");
          departmentCell.classList = "align-middle text-nowrap d-none d-md-table-cell";
          departmentCell.textContent = personnel.departmentName;
          row.append(departmentCell);

          // Location Column
          const locationCell = document.createElement("td");
          locationCell.classList = "align-middle text-nowrap d-none d-md-table-cell";
          locationCell.textContent = personnel.location;
          row.append(locationCell);

          // Email Column
          const emailCell = document.createElement("td");
          emailCell.classList = "align-middle text-nowrap d-none d-md-table-cell";
          emailCell.textContent = personnel.email;
          row.append(emailCell);

          // Action Buttons Column
          const actionsCell = document.createElement("td");
          actionsCell.classList = "align-middle text-end text-nowrap";

          // Edit Button
          const editButton = document.createElement("button");
          editButton.type = "button";
          editButton.classList = "btn btn-primary btn-sm edit-personnel-btn";
          editButton.setAttribute("data-bs-toggle", "modal");
          editButton.setAttribute("data-bs-target", "#editPersonnelModal");
          editButton.setAttribute("data-id", personnel.id);
          editButton.innerHTML = `<i class="fa-solid fa-pencil fa-fw"></i>`;
          actionsCell.append(editButton);

          // Add spacing between buttons
          const deleteButton = document.createElement("button");
          deleteButton.type = "button";
          deleteButton.classList = "btn btn-primary btn-sm delete-personnel-btn ms-2";
          deleteButton.setAttribute("data-id", personnel.id);
          deleteButton.innerHTML = `<i class="fa-solid fa-trash fa-fw"></i>`;
          actionsCell.append(deleteButton);

          row.append(actionsCell);

          // Append row to the fragment
          personnelFrag.appendChild(row);
        });
        // Append the fragment to the table body
        $("#personnelTableBody").append(personnelFrag);
        } else {
          const noDataRow = document.createElement("tr");
          const noDataCell = document.createElement("td");
          noDataCell.colSpan = 5;
          noDataCell.classList = "text-center";
          noDataCell.textContent = "No personnel found";
          noDataRow.append(noDataCell);
          personnelTableBody.appendChild(noDataRow);
        }
      } else {
      document.querySelector("#popupErrorModal .modal-body").textContent = "Error fetching personnel for filtering by location.";

      const modalElement = document.getElementById("popupErrorModal");
      const bootstrapModal = new bootstrap.Modal(modalElement);
      bootstrapModal.show();
      }
    },
    error: function () {
      document.querySelector("#popupErrorModal .modal-body").textContent = "Failed to fetch personnel to filter by location.";

      const modalElement = document.getElementById("popupErrorModal");
      const bootstrapModal = new bootstrap.Modal(modalElement);
      bootstrapModal.show();
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
      const modalElement = document.getElementById("addPersonnelModal");
      const bootstrapModal = new bootstrap.Modal(modalElement);
      bootstrapModal.show();

      $.ajax({
          url: "libs/php/getAllDepartments.php",
          type: "GET",
          dataType: "json",
          success: function (result) {
              if (result.status.name == "ok") {
                const frag = document.createDocumentFragment();
                const addDepartment = document.getElementById("addPersonnelDepartment");
                addDepartment.innerHTML = `<option value="0">All</option>`;
                document.getElementById("addPersonnelDepartment").innerHTML = "" ;
                result.data.forEach((department) => {
                  const option = document.createElement("option");
                  option.value = department.departmentID;
                  option.textContent = department.departmentName;
                  frag.appendChild(option);
                });
                addDepartment.appendChild(frag);    
              } else {
                document.querySelector("#popupErrorModal .modal-body").textContent = "Error fetching departments to add personnel.";

                const modalElement = document.getElementById("popupErrorModal");
                const bootstrapModal = new bootstrap.Modal(modalElement);
                bootstrapModal.show();
                  
              }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            document.querySelector("#popupErrorModal .modal-body").textContent = "Failed to fetch departments to add personnel.";
            
            const modalElement = document.getElementById("popupErrorModal");
            const bootstrapModal = new bootstrap.Modal(modalElement);
            bootstrapModal.show();
            
          },
      });

      $.ajax({
          url: "libs/php/getAllLocations.php",
          type: "GET",
          dataType: "json",
          success: function (result) {
              if (result.status.name == "ok") {
                const frag = document.createDocumentFragment();
                const addLocation = document.getElementById("addPersonnelLocation");
                addLocation.innerHTML = `<option value="0">All</option>`;
                document.getElementById("addPersonnelLocation").innerHTML = "";

                  result.data.forEach((location) => {
                    const option = document.createElement("option");
                    option.value = location.locationID;
                    option.textContent = location.locationName;
                    frag.appendChild(option); // Append each option to the fragment
                  });
                  addLocation.appendChild(frag);
              } else {
                document.querySelector("#popupErrorModal .modal-body").textContent = "Error fetching locations to add personnel.";

                const modalElement = document.getElementById("popupErrorModal");
                const bootstrapModal = new bootstrap.Modal(modalElement);
                bootstrapModal.show();
              }
          }, error: function (jqXHR, textStatus, errorThrown) {
              document.querySelector("#popupErrorModal .modal-body").textContent = "Failed to fetch locations to add personnel.";

                const modalElement = document.getElementById("popupErrorModal");
                const bootstrapModal = new bootstrap.Modal(modalElement);
                bootstrapModal.show();
          }
      });

  /* 2ND CONDITION: ADD DEPARTMENT */
  } else if ($("#departmentsBtn").hasClass("active")) {
    const modalElement = document.getElementById("addDepartmentModal");
    const bootstrapModal = new bootstrap.Modal(modalElement);
    bootstrapModal.show();
    
    $.ajax({
      url: "libs/php/getAllLocations.php",
      type: "GET",
      dataType: "json",
      success: function (result) {
        if (result.status.name == "ok") {
          const frag = document.createDocumentFragment();
          const addLocation = document.getElementById("addDepartmentLocation");
          addLocation.innerHTML = `<option value="0">All</option>`;
          document.getElementById("addDepartmentLocation").innerHTML = "";
          result.data.forEach((location) => {
            const option = document.createElement("option");
            option.value = location.locationID;
            option.textContent = location.locationName;
            frag.appendChild(option); // Append each option to the fragment
          });
          addLocation.appendChild(frag);
        } else {
          document.querySelector("#popupErrorModal .modal-body").textContent = "Error fetching locations to add department.";

          const modalElement = document.getElementById("popupErrorModal");
          const bootstrapModal = new bootstrap.Modal(modalElement);
          bootstrapModal.show();
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        document.querySelector("#popupErrorModal .modal-body").textContent = "Failed to fetch locations to add department.";

        const modalElement = document.getElementById("popupErrorModal");
        const bootstrapModal = new bootstrap.Modal(modalElement);
        bootstrapModal.show();
      }
    });
  /*3RD CONDITION: ADD LOCATION */
  } else {
      const modalElement = document.getElementById("addLocationModal");
      const bootstrapModal = new bootstrap.Modal(modalElement);
      bootstrapModal.show();
  }
  });
    
  /* ADD PERSONNEL FORM SUBMIT */
  $("#addPersonnelForm").on("submit", function (e) {
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
          if (result.status.name == "ok") {
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
                          $("#addPersonnelModal").modal("hide");
                          refreshPersonnelTable();
                      }
                  },
                  error: function (jqXHR, textStatus, errorThrown) {
                    $("#popupErrorModal .modal-body").text("Failed to add personnel.");
                    $("#popupErrorModal").modal("show");
                  }
              });                
          } else {
              firstName = result.data.firstName;
              lastName = result.data.lastName;
              $("#addPersonnelModal").modal("hide");
              $("#addPersonnelErrorModal .modal-body").html(`The entry for <b>${firstName}</b> <b>${lastName}</b> cannot be added as it already exists in the directory.`);
              $("#addPersonnelErrorModal").modal("show");
          }
      },
      error: function (jqXHR, textStatus, errorThrown) {
          $("#popupErrorModal .modal-body").text("Failed to check for duplicate employees.");
          $("#popupErrorModal").modal("show");
      }
  });
});

  /*VIEW PERSONNEL MODAL */
  // Delegate the event listener for dynamically added elements
$(document).on("click", ".view-personnel-name", function (e) {
  e.preventDefault();

  const viewPersonnelId = $(this).data("id"); // Retrieve data-id from the clicked link

  if (!viewPersonnelId) {
    alert("Personnel ID is missing!");
    return;
  }

  // Show the modal and make AJAX call to fetch details
  $("#viewPersonnelModal").data("viewPersonnelId", viewPersonnelId).modal("show");

  $.ajax({
    url: "libs/php/getPersonnelById.php",
    type: "GET",
    dataType: "json",
    data: { id: viewPersonnelId },
    success: function (result) {
      if (result.status.name === "ok") {
        const personnel = result.data.personnel[0];
        $("#viewPersonnelFirstName").val(personnel.firstName);
        $("#viewPersonnelLastName").val(personnel.lastName);
        $("#viewPersonnelJobTitle").val(personnel.jobTitle || "Not specified");
        $("#viewPersonnelEmailAddress").val(personnel.email);
        $("#viewPersonnelLocation").val(personnel.location);
        $("#viewPersonnelDepartment").val(personnel.departmentName);
      } else {
        alert("No personnel data found.");
      }
    },
    error: function () {
      alert("Failed to fetch personnel details.");
    },
  });
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


/*ADD DEPARTMENT FORM SUBMIT */
$("#addDepartmentForm").on("submit", function (e) {
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

// DELETE DEPARTMENT FORM SUBMIT
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

/*ADD LOCATION FORM SUBMIT */
$("#addLocationForm").on("submit", function (e) {
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
          
          // $("#deleteLocationConfirmationModal").modal("hide");
          // $("#deleteLocationErrorModal").modal("hide");
          
          $("#deleteLocationErrorModal .modal-body").html(errorMessage);
          $("#deleteLocationErrorModal").modal("show");
          
          return;
        } else {
          $("#deleteLocationConfirmationMessage").html(
            `Are you sure that you want to remove the entry for <b>${locationName}</b>?`
          );
          $("#deleteLocationId").val(deleteLocationId);
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
$("#deleteLocationForm").on("submit", function(e) {
  e.preventDefault();
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