(function () {
  const form = document.getElementById("tdReportForm");
  const descriptionEl = document.getElementById("description");
  const charCounterEl = document.getElementById("charCounter");

  descriptionEl.addEventListener("input", function () {
    charCounterEl.textContent = descriptionEl.value.length + "/500";
  });

  const dropzone = document.getElementById("tdDropzone");
  const fileInput = document.getElementById("evidenceFile");
  const chooseFileBtn = document.getElementById("chooseFileBtn");
  const fileStatus = document.getElementById("fileStatus");
  const fileThumb = document.getElementById("fileThumb");
  const fileLabel = document.getElementById("fileLabel");
  const removeFileBtn = document.getElementById("removeFileBtn");

  chooseFileBtn.addEventListener("click", function () {
    fileInput.click();
  });

  function showFilePreview(file) {
    if (!file) return;
    fileLabel.textContent = file.name;
    if (file.type && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = function (ev) {
        fileThumb.src = ev.target.result;
        fileThumb.style.display = "block";
      };
      reader.readAsDataURL(file);
    } else {
      fileThumb.style.display = "none";
    }
    fileStatus.classList.add("visible");
  }

  fileInput.addEventListener("change", function () {
    if (fileInput.files && fileInput.files[0]) {
      showFilePreview(fileInput.files[0]);
    }
  });

  ["dragenter", "dragover"].forEach(function (evt) {
    dropzone.addEventListener(evt, function (e) {
      e.preventDefault();
      dropzone.classList.add("is-dragover");
    });
  });

  ["dragleave", "drop"].forEach(function (evt) {
    dropzone.addEventListener(evt, function (e) {
      e.preventDefault();
      dropzone.classList.remove("is-dragover");
    });
  });

  dropzone.addEventListener("drop", function (e) {
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
      fileInput.files = e.dataTransfer.files;
      showFilePreview(e.dataTransfer.files[0]);
    }
  });

  removeFileBtn.addEventListener("click", function () {
    fileInput.value = "";
    fileThumb.src = "";
    fileLabel.textContent = "";
    fileStatus.classList.remove("visible");
  });

  const validationBanner = document.getElementById("validationBanner");
  const validationHeading = document.getElementById("validationHeading");
  const validationText = document.getElementById("validationText");
  const successBanner = document.getElementById("successBanner");
  const ticketRefDisplay = document.getElementById("ticketRefDisplay");

  const requiredFields = [
    { id: "fullName", wrapId: "wrap-fullName", label: "Full Name" },
    { id: "idNumber", wrapId: "wrap-idNumber", label: "Student/Employee ID" },
    { id: "email", wrapId: "wrap-email", label: "Email" },
    { id: "category", wrapId: "wrap-category", label: "Category" },
    { id: "location", wrapId: "wrap-location", label: "Building and Room No." },
    { id: "urgency", wrapId: "wrap-urgency", label: "Urgency/Impact Level" },
    { id: "incidentDateTime", wrapId: "wrap-incidentDateTime", label: "Date and Time of Incident" },
    { id: "description", wrapId: "wrap-description", label: "Description" }
  ];

  requiredFields.forEach(function (item) {
    const el = document.getElementById(item.id);
    const wrap = document.getElementById(item.wrapId);
    ["input", "change"].forEach(function (evt) {
      el.addEventListener(evt, function () {
        wrap.classList.remove("is-invalid");
      });
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    successBanner.classList.remove("visible");

    const missing = [];

    requiredFields.forEach(function (item) {
      const el = document.getElementById(item.id);
      const wrap = document.getElementById(item.wrapId);
      const val = el.value.trim();
      const invalidEmail = item.id === "email" && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

      if (!val || invalidEmail) {
        wrap.classList.add("is-invalid");
        missing.push(invalidEmail ? "valid Email" : item.label);
      } else {
        wrap.classList.remove("is-invalid");
      }
    });

    const confirmBox = document.getElementById("confirmAccuracy");
    if (!confirmBox.checked) {
      missing.push("Accuracy Confirmation");
    }

    if (missing.length > 0) {
      validationHeading.textContent = "Please complete all required fields";
      validationText.textContent = "Missing or incomplete: " + missing.join(", ") + ".";
      validationBanner.classList.add("visible");
      validationBanner.scrollIntoView({ behavior: "smooth", block: "nearest" });
      return;
    }

    validationBanner.classList.remove("visible");

    const refNumber = "TS-2026-" + String(Math.floor(10000 + Math.random() * 90000));
    const savedReports = JSON.parse(localStorage.getItem("techdesk_reports") || "[]");
    savedReports.unshift({
      reportNumber: refNumber,
      fullName: document.getElementById("fullName").value.trim(),
      idNumber: document.getElementById("idNumber").value.trim(),
      email: document.getElementById("email").value.trim(),
      contactNumber: document.getElementById("contactNumber").value.trim(),
      category: document.getElementById("category").value,
      location: document.getElementById("location").value.trim(),
      urgency: document.getElementById("urgency").value,
      incidentDateTime: document.getElementById("incidentDateTime").value,
      description: descriptionEl.value.trim(),
      statusTitle: "Submitted",
      submittedAt: new Date().toISOString()
    });
    localStorage.setItem("techdesk_reports", JSON.stringify(savedReports));

    ticketRefDisplay.textContent = refNumber;
    document.getElementById("trackLink").href = "track.html?ref=" + encodeURIComponent(refNumber);
    successBanner.classList.add("visible");
    form.reset();
    charCounterEl.textContent = "0/500";
    removeFileBtn.click();
    successBanner.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
})();
  