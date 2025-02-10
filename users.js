$(document).ready(function () {
  loadUsers();

  // Mobile menu toggle
  $(".mobile-menu-button").click(function () {
    $(".mobile-menu").toggleClass("hidden");
  });

  // Form submission handler
  $("#userForm").on("submit", function (e) {
    e.preventDefault();
    const userData = {
      id: $("#userId").val(),
      name: $("#name").val(),
      email: $("#email").val(),
      phone: $("#phone").val(),
      city: $("#city").val(),
    };

    // Validate form
    if (!validateForm(userData)) {
      return;
    }

    // If ID exists, update; otherwise, create new
    const isUpdate = userData.id !== "";
    const url = isUpdate ? "api/update_user.php" : "api/add_user.php";

    $.ajax({
      url: url,
      type: "POST",
      data: userData,
      dataType: "json",
      success: function (response) {
        if (response.success) {
          closeModal();
          loadUsers();
          alert(
            response.message ||
              (isUpdate
                ? "User updated successfully!"
                : "User added successfully!")
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

function loadUsers() {
  $.ajax({
    url: "api/get_users.php",
    type: "GET",
    dataType: "json",
    success: function (response) {
      let tableContent = "";

      if (Array.isArray(response)) {
        response.forEach((user) => {
          tableContent += `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">${escapeHtml(
                              user.name || ""
                            )}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${escapeHtml(
                              user.email || ""
                            )}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${escapeHtml(
                              user.phone || ""
                            )}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${escapeHtml(
                              user.city || ""
                            )}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${formatDate(
                              user.created_at
                            )}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${formatDate(
                              user.updated_at
                            )}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <button onclick="editUser(${user.id})" 
                                        class="text-indigo-600 hover:text-indigo-900 mr-3">
                                    Edit
                                </button>
                                <button onclick="deleteUser(${user.id})" 
                                        class="text-red-600 hover:text-red-900">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    `;
        });
      }

      $("#userTableBody").html(tableContent);
    },
    error: function (xhr, status, error) {
      console.error("Error loading users:", error);
      alert("Error loading users. Please try again.");
    },
  });
}

function editUser(id) {
  $("#modalTitle").text("Edit User");

  $.ajax({
    url: `api/get_user.php?id=${id}`,
    type: "GET",
    dataType: "json",
    success: function (response) {
      if (response.error) {
        alert("Error: " + response.error);
        return;
      }

      $("#userId").val(response.id || "");
      $("#name").val(response.name || "");
      $("#email").val(response.email || "");
      $("#phone").val(response.phone || "");
      $("#city").val(response.city || "");
      $("#userModal").removeClass("hidden");
    },
    error: function (xhr, status, error) {
      console.error("Error loading user data:", error);
      alert("Error loading user data. Please try again.");
    },
  });
}

function deleteUser(id) {
  if (confirm("Are you sure you want to delete this user?")) {
    $.ajax({
      url: "api/delete_user.php",
      type: "POST",
      data: { id: id },
      dataType: "json",
      success: function (response) {
        if (response.success) {
          loadUsers();
          alert(response.message || "User deleted successfully!");
        } else {
          alert("Error: " + (response.error || "Failed to delete user"));
        }
      },
      error: function (xhr, status, error) {
        console.error("Error deleting user:", error);
        alert("Error deleting user. Please try again.");
      },
    });
  }
}

function validateForm(data) {
  if (!data.name || !data.email || !data.phone || !data.city) {
    alert("Please fill in all required fields");
    return false;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    alert("Please enter a valid email address");
    return false;
  }

  return true;
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString();
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
  $("#modalTitle").text("Add New User");
  $("#userId").val("");
  $("#userForm")[0].reset();
  $("#userModal").removeClass("hidden");
}

function closeModal() {
  $("#userModal").addClass("hidden");
  $("#userForm")[0].reset();
}
