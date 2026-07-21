/**
 * NWT Infotech – careers.js
 * Handles Job Application form validation, file size checks, and submissions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initCareers();
});

function initCareers() {
  const form = document.getElementById('careers-form');
  const fileInput = document.getElementById('resume-file');
  const feedback = document.getElementById('file-size-feedback');
  const uploadArea = document.getElementById('resume-upload-area');
  const fileNameDisplay = uploadArea ? uploadArea.querySelector('.file-name') : null;
  const designationSelect = document.getElementById('designation-select');
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

  // Initialize interactive job cards
  document.querySelectorAll('[data-apply-role]').forEach(btn => {
    btn.addEventListener('click', () => {
      const role = btn.getAttribute('data-apply-role');
      if (designationSelect) {
        designationSelect.value = role;
      }
      
      const formSection = document.getElementById('careers-form-section');
      if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth' });
        // Add a temporary highlight effect to the form card
        formSection.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.4)';
        setTimeout(() => {
          formSection.style.boxShadow = '';
        }, 1500);
      }
    });
  });

  // Handle file selection and dynamic size validation (around 70 KB limit)
  if (fileInput) {
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (file) {
        const sizeKB = file.size / 1024;
        if (sizeKB > 80) {
          // Set custom validation error
          fileInput.setCustomValidity("Please upload a compressed resume around 70 KB.");
          if (feedback) {
            feedback.innerHTML = `⚠️ File size is <strong>${sizeKB.toFixed(1)} KB</strong>. Please compress it to around 70 KB before uploading.`;
            feedback.style.color = '#ef4444';
          }
          if (fileNameDisplay) {
            fileNameDisplay.textContent = `❌ ${file.name} (Too Large)`;
            fileNameDisplay.style.color = '#ef4444';
          }
          if (uploadArea) {
            uploadArea.style.borderColor = '#ef4444';
          }
        } else {
          // File is within limits
          fileInput.setCustomValidity("");
          if (feedback) {
            feedback.innerHTML = `✓ Ready to upload! Size: <strong>${sizeKB.toFixed(1)} KB</strong>.`;
            feedback.style.color = '#10b981';
          }
          if (fileNameDisplay) {
            fileNameDisplay.textContent = `✓ ${file.name}`;
            fileNameDisplay.style.color = '#10b981';
          }
          if (uploadArea) {
            uploadArea.style.borderColor = 'var(--emerald)';
          }
        }
      } else {
        fileInput.setCustomValidity("");
        if (feedback) {
          feedback.textContent = 'PDF, DOC, DOCX, JPG, PNG — max 80 KB (aim for 70 KB)';
          feedback.style.color = '';
        }
        if (fileNameDisplay) {
          fileNameDisplay.textContent = '';
          fileNameDisplay.style.color = '';
        }
        if (uploadArea) {
          uploadArea.style.borderColor = '';
        }
      }
    });
  }

  // Handle application form submission
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        if (typeof showToast === 'function') {
          showToast('Form Incomplete', 'Please fill in all required fields correctly.');
        } else {
          alert('Please fill in all required fields correctly.');
        }
        return;
      }

      // Check designation explicitly
      if (!designationSelect || !designationSelect.value) {
        if (typeof showToast === 'function') {
          showToast('Select Role', 'Please select the designation you are applying for.');
        } else {
          alert('Please select the designation you are applying for.');
        }
        return;
      }

      // Read values
      const appData = {
        name: document.getElementById('applicant-name').value,
        email: document.getElementById('applicant-email').value,
        phone: document.getElementById('applicant-phone').value,
        designation: designationSelect.value
      };

      const file = fileInput.files[0];

      // Set loading state
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit Application';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '⚡ Submitting Application...';
      }

      try {
        // Submit to Supabase database (or fallback mock)
        const result = await submitApplicationToSupabase(appData, file);

        if (submitBtn) submitBtn.innerHTML = '✓ Success!';

        // Update popup message
        const popupInfoVal = document.querySelector('.popup-info-box .popup-info-val');
        if (popupInfoVal) {
          popupInfoVal.textContent = appData.name;
        }

        // Show Success Popup
        const successPopup = document.getElementById('success-popup');
        if (successPopup) {
          successPopup.classList.add('visible');
        } else {
          alert('Application submitted successfully!');
          window.location.href = 'index.html';
        }

        // Reset form
        form.reset();
        if (feedback) {
          feedback.textContent = 'PDF, DOC, DOCX, JPG, PNG — max 80 KB (aim for 70 KB)';
          feedback.style.color = '';
        }
        if (fileNameDisplay) {
          fileNameDisplay.textContent = '';
        }
        if (uploadArea) {
          uploadArea.style.borderColor = '';
        }

      } catch (err) {
        console.error(err);
        if (typeof showToast === 'function') {
          showToast('Submission Failed', err.message || 'Something went wrong. Please try again.');
        } else {
          alert('Submission Failed: ' + (err.message || 'Something went wrong. Please try again.'));
        }

        // Restore button state
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });
  }
}
