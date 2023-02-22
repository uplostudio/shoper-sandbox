window.addEventListener("load", () => {
  $("[app='open_create_trial_step1_modal_button']").on("click", function () {
    $("[app='create_trial_step1_modal']").addClass("modal--open");
    $(document.body).css("overflow", "hidden");
  });
  $("[app='open_custom_modal_button']").on("click", function () {
    $("[app='bannerModal']").addClass("modal--open");
    let cardType = this.parentElement.getAttribute("card");
    this.parentElement.style.display = "grid";
    this.parentElement.querySelector(".w-form-done").style.display = "none";
    if (cardType === "enterprise") {
      document
        .querySelector("[app='custom_form']")
        .setAttribute("package", "31");
    } else {
      document
        .querySelector("[app='custom_form']")
        .setAttribute("package", "7");
    }
    $(document.body).css("overflow", "hidden");
  });
  // form + checkbox
  let toggleForm = document.querySelector("[app='toggle_form']");
  let togglePrice = document.querySelector("[app='toggle_button']");
  let checkboxPrice = toggleForm.querySelector("input[type='checkbox']");
  let toggleFormYear = document.querySelector("[app='yearly_form']");
  let toggleYear = document.querySelector("[app='yearlyToggle']");
  let checkboxYear = toggleFormYear.querySelector("input[type='checkbox']");
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

  let net = "netto miesięcznie";
  let gross = "brutto miesięcznie";

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
    e.stopPropagation();
    e.preventDefault();

    console.log(e.target);

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

      // Standard Gross 1 month price
      let standardWholePriceGross = promotion.price.standard[12].month.gross;
      let standardMainPartGross = standardWholePriceGross
        .toString()
        .split(".")[0];
      let standardSparePartGross = standardWholePriceGross
        .toString()
        .split(".")[1];
      // Standard Net 1 month price
      let standardWholePriceNet = promotion.price.standard[12].month.net;
      let standardMainPartNet = standardWholePriceNet.toString().split(".")[0];
      let standardSparePartNet = standardWholePriceNet.toString().split(".")[1];
      // Premium  Gross 1 month price
      let premiumWholePriceGross = regular.premium[1].gross;
      let premiumMainPartGross = premiumWholePriceGross
        .toString()
        .split(".")[0];
      let premiumSparePartGross = premiumWholePriceGross
        .toString()
        .split(".")[1];
      // Premium  Net 1 month price
      let premiumWholePriceNet = regular.premium[1].net;
      let premiumMainPartNet = premiumWholePriceNet.toString().split(".")[0];
      let premiumSparePartNet = premiumWholePriceNet.toString().split(".")[1];
      // Enterprise Gross 1 month price
      let enterpriseWholePriceGross = regular.enterprise[1].gross;
      let enterpriseMainPartGross = enterpriseWholePriceGross
        .toString()
        .split(".")[0];
      let enterpriseSparePartGross = enterpriseWholePriceGross
        .toString()
        .split(".")[1];
      // Enterprise Net 1 month price
      let enterpriseWholePriceNet = regular.enterprise[1].net;
      let enterpriseMainPartNet = enterpriseWholePriceNet
        .toString()
        .split(".")[0];
      let enterpriseSparePartNet = enterpriseWholePriceNet
        .toString()
        .split(".")[1];

      // Standard Gross year price
      let standardWholePriceGrossY = regular.standard[12].year.gross;
      let standardMainPartGrossY = standardWholePriceGrossY
        .toString()
        .split(".")[0];
      let standardSparePartGrossY = standardWholePriceGrossY
        .toString()
        .split(".")[1];
      // Standard Net year price
      let standardWholePriceNetY = regular.standard[12].year.net;
      let standardMainPartNetY = standardWholePriceNetY
        .toString()
        .split(".")[0];
      let standardSparePartNetY = standardWholePriceNetY
        .toString()
        .split(".")[1];
      // Premium  Gross year price
      let premiumWholePriceGrossY = regular.premium[12].year.gross;
      let premiumMainPartGrossY = premiumWholePriceGrossY
        .toString()
        .split(".")[0];
      let premiumSparePartGrossY = premiumWholePriceGrossY
        .toString()
        .split(".")[1];
      // Premium  Net year price
      let premiumWholePriceNetY = regular.premium[12].year.net;
      let premiumMainPartNetY = premiumWholePriceNetY.toString().split(".")[0];
      let premiumSparePartNetY = premiumWholePriceNetY.toString().split(".")[1];
      // Enterprise Gross year price
      let enterpriseWholePriceGrossY = regular.enterprise[12].year.gross;
      let enterpriseMainPartGrossY = enterpriseWholePriceGrossY
        .toString()
        .split(".")[0];
      let enterpriseSparePartGrossY = enterpriseWholePriceGrossY
        .toString()
        .split(".")[1];
      // Enterprise Net year price
      let enterpriseWholePriceNetY = regular.enterprise[12].year.net;
      let enterpriseMainPartNetY = enterpriseWholePriceNetY
        .toString()
        .split(".")[0];
      let enterpriseSparePartNetY = enterpriseWholePriceNetY
        .toString()
        .split(".")[1];

      priceBoxStandard.textContent = standardWholePriceNet;
      priceBoxPremium.textContent = premiumWholePriceNet;
      priceBoxEnterprise.textContent = enterpriseWholePriceNet;

      function checkValues() {
        if (checkboxPrice.checked && !checkboxYear.checked) {
          boxLabelStandard.textContent = gross;
          boxLabelPremium.textContent = gross;
          boxLabelEnterprise.textContent = gross;
          priceBoxStandard.textContent = standardMainPartGross;
          priceBoxStandard.nextElementSibling.children[0].textContent = `,${standardSparePartGross}`;
          priceBoxPremium.textContent = premiumMainPartGross;
          priceBoxPremium.nextElementSibling.children[0].textContent = `,${premiumSparePartGross}`;
          priceBoxEnterprise.textContent = enterpriseMainPartGross;
          priceBoxEnterprise.nextElementSibling.children[0].textContent = `,${enterpriseSparePartGross}`;
        } else if (!checkboxPrice.checked && !checkboxYear.checked) {
          boxLabelStandard.textContent = net;
          boxLabelPremium.textContent = net;
          boxLabelEnterprise.textContent = net;
          priceBoxStandard.textContent = promotion.price.standard[12].month.net;
          priceBoxStandard.nextElementSibling.children[0].textContent = ``;
          priceBoxPremium.textContent = regular.premium[1].net;
          priceBoxPremium.nextElementSibling.children[0].textContent = ``;
          priceBoxEnterprise.textContent = regular.enterprise[1].net;
          priceBoxEnterprise.nextElementSibling.children[0].textContent = ``;
        } else if (checkboxPrice.checked && checkboxYear.checked) {
          boxLabelStandard.textContent = gross;
          boxLabelPremium.textContent = gross;
          boxLabelEnterprise.textContent = gross;
          priceBoxStandard.textContent = standardMainPartGrossY;
          priceBoxStandard.nextElementSibling.children[0].textContent = `,${standardSparePartGrossY}`;
          priceBoxPremium.textContent = premiumMainPartGrossY;
          priceBoxPremium.nextElementSibling.children[0].textContent = `,${premiumSparePartGrossY}`;
          priceBoxEnterprise.textContent = enterpriseMainPartGrossY;
          priceBoxEnterprise.nextElementSibling.children[0].textContent = ``;
        } else {
          boxLabelStandard.textContent = net;
          boxLabelPremium.textContent = net;
          boxLabelEnterprise.textContent = net;
          priceBoxStandard.textContent = standardWholePriceNetY;
          priceBoxStandard.nextElementSibling.children[0].textContent = ``;
          priceBoxPremium.textContent = premiumWholePriceNetY;
          priceBoxPremium.nextElementSibling.children[0].textContent = ``;
          priceBoxEnterprise.textContent = enterpriseWholePriceNetY;
          priceBoxEnterprise.nextElementSibling.children[0].textContent = ``;
        }
      }

      togglePrice.addEventListener("click", () => {
        checkboxPrice.click();
        checkValues();
      });
      toggleYear.addEventListener("click", () => {
        checkboxYear.click();
        checkValues();
      });
    },
    error: function (err) {},
  });
});
