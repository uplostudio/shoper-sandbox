
const validationPatterns = [
  {
    type: "email",
    pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/,
  },
  {
    type: "phone",
    pattern: /^\d\d\d\d\d\d\d\d\d$/,
  },
  {
    type: "text",
    pattern: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/,
  },
  {
    type: "nip",
    pattern: /^\d\d\d\d\d\d\d\d\d\d$/,
  },
  {
    type: "url",
    pattern: /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
  },
];

const omittedAtributes = ["method", "name", "id", "class", "aria-label", "fs-formsubmit-element", "wf-page-id", "wf-element-id"];

const urlN = "https://www.shoper.pl/ajax.php";

function createEnterKeydownHandler(inputElement, submitTriggerElement) {
  return function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      inputElement.blur();
      submitTriggerElement.click();
    }
  };
}


function validateInput(input) {
  const name = input.getAttribute("data-form");
  const value = input.value;
  const required = input.required;
  const type = input.getAttribute("data-type");

  error = required ? (value === "" ? `${name} - jest wymagane` : null) : null;

  if (!error && value !== "" && required) {
    const pattern = validationPatterns.find((p) => p.type === type)?.pattern;
    if (pattern && !pattern.test(value)) {
      error = `${name} nie jest wypełnione prawidłowo`;
    }
  }

  if (required && value === "") {
    $(input).next().next().toggleClass("show", true);
    $(input).next().toggleClass("show", false);
    $(input).addClass("error");
  } else {
    $(input).next().next().toggleClass("show", false);
    $(input)
      .next()
      .toggleClass("show", error !== null);
    $(input).toggleClass("error", error !== null);
  }

  return error;
}

function handleBlur(event) {
  validateInput(event.target);
}


document.querySelectorAll("input").forEach((input) => {
  const submitButton = input.closest("form").querySelector("[data-form='submit']");

  input.addEventListener("blur", handleBlur);
  input.addEventListener("keydown", createEnterKeydownHandler(input, submitButton));
});

function validateForm(formElement) {
  const inputs = formElement.querySelectorAll("input");

  let errors = 0;

  inputs.forEach((input) => {
    if (validateInput(input)) {
      errors++;
    }
  });

  return errors;
}


function sendFormDataToURL(urlN, formElement, form, loader) {
  const formData = new FormData();

  const attributes = formElement.attributes;
  for (let i = 0; i < attributes.length; i++) {
    const attributeName = attributes[i].name.replace("data-", "");
    const attributeValue = attributes[i].value;
    if (attributeValue !== "" && !omittedAtributes.includes(attributeName)) {
      formData.append(attributeName, attributeValue);
    }
  }

  const inputElements = formElement.querySelectorAll("input, textarea");
  let countryValues = [];
  let marketplaceValues = [];
  inputElements.forEach((inputElement) => {
    let inputValue = inputElement.value;
    const inputName = inputElement.getAttribute("data-form");
    if (inputElement.type === "checkbox") {
      inputValue = inputElement.nextElementSibling.textContent.replace(/[^\u0000-\u007F\u0100-\u017F]+/g, "").trim();
      if (inputName === "country" && inputElement.checked) {
        countryValues.push(inputValue);
      } else if (inputName === "marketplace" && inputElement.checked) {
        marketplaceValues.push(inputValue);
      }
    } else if (inputValue !== "") {
      formData.append(inputName, inputValue);
    }
  });

  if (countryValues.length > 0) {
    formData.append("country", countryValues);
  }

  if (marketplaceValues.length > 0) {
    formData.append("marketplace", marketplaceValues);
  }

  $.ajax({
    type: "POST",
    url: urlN,
    data: formData,
    processData: false,
    contentType: false,
    success: function (data) {
      loader.show();
      if (formData.has("host")) {
        if (data.status === 1) {
          $(formElement).siblings(".error-message").hide();
          loader.hide();
          window.location.href = data.redirect;
          return;
        } else {
          loader.hide();
          $(formElement).siblings(".error-message").show();
          return;
        }
      }
      successResponse(formElement);
      $(form).parent().hide();
      $(form).parent().next().show();
    },
    error: function () {
      errorResponse(formElement);
      $(formElement).siblings(".error-message").show();
    },
  });
}

function handleSubmitClick(e) {
  e.preventDefault();
  const form = this;
  const formElement = this.closest("form");
  const loader = $(this).find(".loading-in-button");
  if (validateForm(formElement) === 0) {
    sendFormDataToURL(urlN, formElement, form, loader);
  }
}

$("[data-form='submit']").click(handleSubmitClick);

$("[data-app^='open_']").on("click", function () {
  originalTrigger = $(this);
  const triggerName = originalTrigger.data("app").replace(/^open_|_modal_button$/g, "");
  $(`[data-app='${triggerName}']`).addClass("modal--open");
  $(document.body).toggleClass("overflow-hidden", true);
});


$("[fs-formsubmit-element='reset']").on("click", function () {
  $(".loading-in-button").hide();
});

function pushDataToDataLayer(formElement, eventCategory) {
  if (formElement.getAttribute("data-layer") !== "true") {
    return;
  }

  const data = {
    event: "myTrackEvent",
    eventCategory: eventCategory,
    eventAction: $(formElement).find("#label").text(),
    eventLabel: window.location.pathname,
  };

  const leadOfferText = $(originalTrigger).attr("data-lead_offer");

  if (leadOfferText) {
    data.lead_offer = leadOfferText;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
  console.log(window.dataLayer);
}

function successResponse(formElement) {
  pushDataToDataLayer(formElement, "Button modal form sent");
}

function errorResponse(formElement) {
  pushDataToDataLayer(formElement, "Button modal form error");
}
