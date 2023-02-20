window.addEventListener("load", () => {
  $("[app='open_create_trial_step1_modal_button']").on("click", function () {
    $("[app='create_trial_step1_modal']").addClass("modal--open");
    $(document.body).css("overflow", "hidden");
  });
  $("[app='open_custom_modal_button']").on("click", function () {
    $("[app='bannerModal']").addClass("modal--open");
    let cardType = this.parentElement.getAttribute("card");
    if (cardType === "enterprise") {
      document
        .querySelector("[app='custom_form']")
        .setAttribute("package", "31");
    }
    $(document.body).css("overflow", "hidden");
  });
  // form + checkbox
  let toggleForm = document.querySelector("[app='toggle_form']");
  let toggle = document.querySelector("[app='toggle_button']");
  let checkbox = toggleForm.querySelector("input[type='checkbox']");
  // promo prices
  let priceBoxStandard = document.querySelector("[pricebox='standard']")
    .children[0];
  let priceBoxPremium = document.querySelector("[pricebox='premium']")
    .children[0];
  let priceBoxEnterprise = document.querySelector("[pricebox='enterprise']")
    .children[0];
  // regular prices
  let priceBoxStandardRegular = document.querySelector("[regular='standard']");
  let priceBoxPremiumRegular = document.querySelector("[regular='premium']");
  let priceBoxEnterpriseRegular = document.querySelector(
    "[regular='enterprise']"
  );
  // labels
  let boxLabelStandard = document.querySelector("[pricelabel='standard']");
  let boxLabelPremium = document.querySelector("[pricelabel='premium']");
  let boxLabelEnterprise = document.querySelector("[pricelabel='enterprise']");

  //  grab form
  formWrapper = document.querySelector("[app='custom_form']");
  // grab form trigger
  formTrigger = formWrapper.querySelector("[app='bcm-submit']");
  // grab all input fields from form without checkboxes
  phoneInput = formWrapper.querySelector("[app='phone_campaign']");
  emailInput = formWrapper.querySelector("[app='email_campaign']");

  // Attach EventListeners to inputs

  emailInput.addEventListener("blur", function () {
    checkEmailBlur();
  });

  phoneInput.addEventListener("blur", function () {
    checkPhoneBlur();
  });

  formTrigger.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    checkEmailBlur();
    checkPhoneBlur();

    if (checkEmailBlur() && checkPhoneBlur()) {
      $.ajax({
        url: "https://www.shoper.pl/ajax.php",
        headers: {},
        method: "POST",
        data: {
          action: formWrapper.getAttribute("action"),
          type: formWrapper.getAttribute("type"),
          source_id: formWrapper.getAttribute("source_id"),
          package: formWrapper.getAttribute("package"),
          phone: phoneInputValue,
          email: emailValue,
        },
        success: function (data) {
          formWrapper.querySelector("form").style.display = "none";
          formWrapper.parentElement.querySelector(
            ".w-form-done"
          ).style.display = "block";
          formWrapper.querySelector("form").reset();
        },
        error: function (data) {
          formWrapper.parentElement.querySelector(
            ".w-form-fail"
          ).style.display = "block";
          formWrapper.parentElement.querySelector(".w-form-fail").textContent =
            "Coś poszło nie tak, spróbuj ponownie.";
        },
      });
    } else {
    }
  });

  // fetch

  $.ajax({
    url: "https://www.shoper.pl/ajax.php",
    headers: {},
    method: "POST",
    data: {
      action: "get_prices_list",
    },
    success: function (data) {
      let regular = data.price;
      let promotion = data.promotion;

      priceBoxStandard.textContent = "25";
      priceBoxPremium.textContent = regular.premium[1].net;
      priceBoxEnterprise.textContent = regular.enterprise[1].net;

      console.log(data);

      toggle.addEventListener("click", () => {
        checkbox.click();

        if (checkbox.checked) {
          boxLabelStandard.textContent = "brutto miesięcznie";
          boxLabelPremium.textContent = "brutto miesięcznie";
          boxLabelEnterprise.textContent = "brutto miesięcznie";
          priceBoxStandard.textContent = "30.75";
          priceBoxPremium.textContent = regular.premium[1].gross;
          priceBoxEnterprise.textContent = regular.enterprise[1].gross;
        } else {
          boxLabelStandard.textContent = "netto miesięcznie";
          boxLabelPremium.textContent = "netto miesięcznie";
          boxLabelEnterprise.textContent = "netto miesięcznie";
          priceBoxStandard.textContent = "25";
          priceBoxPremium.textContent = regular.premium[1].net;
          priceBoxEnterprise.textContent = regular.enterprise[1].net;
        }
      });
    },
    error: function (err) {},
  });
});
