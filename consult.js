//  grab form
formWrapper = document.querySelector("[app='consult']");
// grab form trigger
formTrigger = formWrapper.querySelector("[app='consult-submit']");
// grab all input fields from form without checkboxes
phoneInput = formWrapper.querySelector("[app='consult']");
emailInput = formWrapper.querySelector("[app='consult']");
urlInput = formWrapper.querySelector("[app='consult']");

// Attach EventListeners to inputs

phoneInput.addEventListener("blur", function () {
  checkPhoneBlur();
});

emailInput.addEventListener("blur", function () {
  checkEmailBlur();
});

urlInput.addEventListener("blur", function () {
  checkUrlBlur();
});

// Attach EventListener to submit button

formTrigger.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();

  checkPhoneBlur();
  checkEmailBlur();
  checkUrlBlur();

  const successInfo = formWrapper.querySelector(".w-form-done");
  const errorInfo = formWrapper.querySelector(".w-form-fail");

  if (checkPhoneBlur() && checkEmailBlur() && checkUrlBlur()) {
    $.ajax({
      url: "https://www.shoper.pl/ajax.php",
      headers: {},
      method: "POST",
      data: {
        action: formWrapper.getAttribute("action"),
        email: emailValue,
        phone: phoneInputValue,
        url: urlValue,
      },
      success: function (data) {
        if (data.status === 1) {
          formWrapper.querySelector("form").style.display = "none";
          formWrapper.parentElement.querySelector(
            ".w-form-done"
          ).style.display = "block";
          formWrapper.parentElement.querySelector(".w-form-done").textContent =
            "Sprawdź wiadomość, którą właśnie od nas otrzymałeś!";
          formWrapper.querySelector("form").reset();
        } else {
          formWrapper.parentElement.querySelector(
            ".w-form-fail"
          ).style.display = "block";
        }
      },
    });
  } else {
  }
});
