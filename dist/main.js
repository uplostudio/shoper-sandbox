
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

const omittedAtributes = ["method", "name", "id", "class", "aria-label", "fs-formsubmit-element"];

const url = "https://www.shoper.pl/ajax.php";

let error;

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

  console.log(error);

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


function sendFormDataToURL(url, formElement, form) {
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
  inputElements.forEach((inputElement) => {
    const inputValue = inputElement.value;
    const inputName = inputElement.getAttribute("data-form");
    if (inputValue !== "") {
      formData.append(inputName, inputValue);
    }
  });

  $.ajax({
    type: "POST",
    url: url,
    data: formData,
    processData: false,
    contentType: false,
    success: function () {
      $(form).parent().hide();
      $(form).parent().next().show();
    },
    error: function () {
      $(form).siblings(".error-message").show();
    },
  });
}

function handleSubmitClick(e) {
  e.preventDefault();
  const form = this;
  const formElement = this.closest("form");

  if (validateForm(formElement) === 0) {
    sendFormDataToURL(url, formElement, form);
  }
}

$("[data-form='submit']").click(handleSubmitClick);

$("[data-app^='open_']").on("click", function () {
  const triggerName = $(this)
    .data("app")
    .replace(/^open_|_modal_button$/g, "");
  $(`[data-app='${triggerName}']`).addClass("modal--open");
  console.log(triggerName);
});

function trackFormSubmit(formSelector, successParams, errorParams) {
  $(document).ajaxComplete(function (xhr) {
    const form = $(formSelector)[0];
    const eventData = {
      eventLabel: window.location.href,
      eventType: form.getAttribute("data-app"),
    };
    if (xhr.status === 200) {
      Object.assign(eventData, successParams, { eventAction: "submitSuccess" });
    } else {
      Object.assign(eventData, errorParams, { eventAction: "submitError" });
    }
    window.dataLayer.push(eventData);
    console.log(window.dataLayer);
  });
}

trackFormSubmit("[data-app='consult']", { event: "event1-onsuccess", eventCategory: "category1" }, { event: "event2-onerror", eventCategory: "category2" });
