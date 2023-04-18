$("[app='open_multisales_modal_button']").on("click", function () {
  $("[app='multisales_modal']").addClass("modal--open");
});

console.log(fbclid, gclid);
//  grab form
formWrappers = document.querySelectorAll("[app='form_lp']");
// grab form trigger

formWrappers.forEach((n) => {
  phoneInput = n.querySelector("[app='phone']");
  emailInput = n.querySelector("[app='email']");
  urlInput = n.querySelector("[app='url']");
  formTrigger = n.querySelector("[app='form_lp-submit']");
  let action = n.getAttribute("action");

  phoneInput.addEventListener("blur", checkPhoneBlurTwo);

  emailInput.addEventListener("blur", checkMailBlurTwo);

  urlInput.addEventListener("blur", checkUrlBlurTwo);

  formTrigger.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    formWrapper = e.target.closest("form");
    loader = formWrapper.querySelector(".loading-in-button");
    phoneInput = formWrapper.querySelector("[app='phone']");
    emailInput = formWrapper.querySelector("[app='email']");
    urlInput = formWrapper.querySelector("[app='url']");

    checkUrlBlur();
    checkPhoneBlur();
    checkEmailBlur();

    if (outcomeOne && outcomeTwo && outcomeThree) {
      loader.style.display = "block";
      $.ajax({
        url: "https://www.shoper.pl/ajax.php",
        headers: {},
        method: "POST",
        data: {
          action: action,
          email: emailValue,
          phone: phoneInputValue,
          url: urlValue,
          form_name: action,
          thulium_id: 52,
          zapier: "aHR0cHM6Ly9ob29rcy56YXBpZXIuY29tL2hvb2tzL2NhdGNoLzQ5Mjc4OS8zb2gxc29nLw==",
        },
        success: function (data) {
          if (data.status === 1) {
            loader.style.display = "none";
            n.querySelector("form").style.display = "none";
            n.parentElement.querySelector(".w-form-done").style.display = "block";
            n.parentElement.querySelector(".w-form-done").textContent = "Sprawdź wiadomość, którą właśnie od nas otrzymałeś!";
            n.querySelector("form").reset();
          } else {
            loader.style.display = "none";
            n.parentElement.querySelector(".w-form-fail").style.display = "block";
          }
        },
      });
    } else {
    }
  });
});
