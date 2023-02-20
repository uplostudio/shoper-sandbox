window.addEventListener("load", () => {
  $("[app='open_create_trial_step1_modal_button']").on("click", function () {
    $("[app='create_trial_step1_modal']").addClass("modal--open");
    $(document.body).css("overflow", "hidden");
  });
  $("[app='open_custom_modal_button']").on("click", function () {
    $("[app='bannerModal']").addClass("modal--open");
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
    error: function (err) {
      console.log(err);
    },
  });
});
