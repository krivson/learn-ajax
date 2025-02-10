$(document).ready(function () {
  loadStudents();

  // Mobile menu toggle
  $(".mobile-menu-button").click(function () {
    $(".mobile-menu").toggleClass("hidden");
  });

  // Form submission handler
  $("#studentForm").on("submit", function (e) {
    e.preventDefault();
    const studentData = {
      id: $("#studentId").val(),
      nis: $("#nis").val(),
      name: $("#name").val(),
      class: $("#class").val(),
      major: $("#major").val(),
      gender: $("#gender").val(),
      address: $("#address").val(),
    };

    // Validate form
    if (!validateForm(studentData)) {
      return;
    }

    // If ID exists, update; otherwise, create new
    const isUpdate = studentData.id !== "";
    const url = isUpdate ? "update_student.php" : "add_student.php";

    $.ajax({
      url: url,
      type: "POST",
      data: studentData,
      dataType: "json",
      success: function (response) {
        if (response.success) {
          closeModal();
          loadStudents();
          alert(
            response.message ||
              (isUpdate
                ? "Student updated successfully!"
                : "Student added successfully!")
          );
        } else {
          alert("Error: " + (response.error || "Unknown error occurred"));
        }
      },
      error: function (xhr, status, error) {
        console.error("Error:", error);
        alert("Error processing request. Please try again.");
      },
    });
  });
});

function loadStudents() {
  $.ajax({
    url: "get_students.php",
    type: "GET",
    dataType: "json",
    success: function (response) {
      let tableContent = "";

      if (Array.isArray(response)) {
        response.forEach((student) => {
          tableContent += `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">${escapeHtml(
                              student.nis || ""
                            )}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${escapeHtml(
                              student.name || ""
                            )}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${escapeHtml(
                              student.class || ""
                            )}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${escapeHtml(
                              student.major || ""
                            )}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${escapeHtml(
                              student.gender || ""
                            )}</td>
                            <td class="px-6 py-4">${escapeHtml(
                              student.address || ""
                            )}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <button onclick="editStudent(${student.id})" 
                                        class="text-indigo-600 hover:text-indigo-900 mr-3">
                                    Edit
                                </button>
                                <button onclick="deleteStudent(${student.id})" 
                                        class="text-red-600 hover:text-red-900">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    `;
        });
      }

      $("#studentTableBody").html(tableContent);
    },
    error: function (xhr, status, error) {
      console.error("Error loading students:", error);
      alert("Error loading students. Please try again.");
    },
  });
}

function editStudent(id) {
  $("#modalTitle").text("Edit Student");

  $.ajax({
    url: `get_student.php?id=${id}`,
    type: "GET",
    dataType: "json",
    success: function (response) {
      if (response.error) {
        alert("Error: " + response.error);
        return;
      }

      $("#studentId").val(response.id || "");
      $("#nis").val(response.nis || "");
      $("#name").val(response.name || "");
      $("#class").val(response.class || "");
      $("#major").val(response.major || "");
      $("#gender").val(response.gender || "");
      $("#address").val(response.address || "");
      $("#studentModal").removeClass("hidden");
    },
    error: function (xhr, status, error) {
      console.error("Error loading student data:", error);
      alert("Error loading student data. Please try again.");
    },
  });
}

function deleteStudent(id) {
  if (confirm("Are you sure you want to delete this student?")) {
    $.ajax({
      url: "delete_student.php",
      type: "POST",
      data: { id: id },
      dataType: "json",
      success: function (response) {
        if (response.success) {
          loadStudents();
          alert(response.message || "Student deleted successfully!");
        } else {
          alert("Error: " + (response.error || "Failed to delete student"));
        }
      },
      error: function (xhr, status, error) {
        console.error("Error deleting student:", error);
        alert("Error deleting student. Please try again.");
      },
    });
  }
}

function validateForm(data) {
  if (!data.nis || !data.name || !data.class || !data.major || !data.gender) {
    alert("Please fill in all required fields");
    return false;
  }
  return true;
}

function escapeHtml(unsafe) {
  if (typeof unsafe !== "string") return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function openAddModal() {
  $("#modalTitle").text("Add New Student");
  $("#studentId").val("");
  $("#studentForm")[0].reset();
  $("#studentModal").removeClass("hidden");
}

function closeModal() {
  $("#studentModal").addClass("hidden");
  $("#studentForm")[0].reset();
}
