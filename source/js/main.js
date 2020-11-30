'use strict';

(function() {
  var forms = document.querySelectorAll('.form');
  var firstNames = document.querySelectorAll('input[type=text]');
  var phones = document.querySelectorAll('input[type=tel]');
  var messages = document.querySelectorAll('textarea');
  var formSection = document.querySelector('.form-section');


  var popup = document.querySelector('.modal');
  var popupClose = popup.querySelector('.modal__close');
  var contactUsLink = document.querySelector('.contact-us__callback');

  var footerForm = {
    elements: [forms[0], firstNames[0], phones[0], messages[0]],
    flag: true
  }

  var popupForm = {
    elements: [forms[1], firstNames[1], phones[1], messages[1]],
    subElements: [contactUsLink, popupClose],
    flag: true
  }

  var userName = {
    domElementForm: firstNames[0],
    domElementPopup: firstNames[1],
    content: null,
    nameInStorage: 'name',
    storageFlag: false
  };

  var userPhone = {
    domElementForm: phones[0],
    domElementPopup: phones[1],
    content: null,
    nameInStorage: 'phone',
    storageFlag: false
  };

  var userMessage = {
    domElementForm: messages[0],
    domElementPopup: messages[1],
    content: null,
    nameInStorage: 'message',
    storageFlag: false
  };

  var storageElements = [userName, userPhone, userMessage];

  /* test dom elements for both forms */

  var verifyFormElements = function (obj) {
    obj.elements.forEach(function (element) {
      if (element === null) {
        obj.flag = false;
      }
    });
  };

  var verifySubElements = function (obj) {
    obj.subElements.forEach(function (element) {
      if (element === null) {
        obj.flag = false;
      }
    });
  };

  var verifyFooterForm = function () {
    verifyFormElements(footerForm);
  };


  var verifyPopupForm = function () {
    verifyFormElements(popupForm);
    verifySubElements(popupForm);
  };

  verifyFooterForm();
  verifyPopupForm();

  /* test storage */

  var verifyStorage = function () {
    storageElements.forEach(function (element) {
      var memorized = localStorage.getItem(element.nameInStorage);
      if (memorized !== null) {
        element.storageFlag = true;
        element.content = memorized;
      }
    });
  };

  verifyStorage();

  /* set phone mask */

  var setPhoneMask = function (inputElement) {
    var maskOptions = {
      mask: '+7(000)0000000'
    };

    var mask = IMask(inputElement, maskOptions);

    if (!userPhone.storageFlag || inputElement.value === "") {
      inputElement.addEventListener('focus', function () {
        mask.value = '+7(';
      });
    }
  };

  /* add stored data to footer inputs */

  var addDataToFooterForm = function () {
    storageElements.forEach(function (element) {
      if (element.storageFlag) {
        var nodeElement = element.domElementForm;
        nodeElement.value = element.content;
      }
    });
  };

  var onSubmitWriteDataToStorage = function () {
    storageElements.forEach(function (element) {
      var nodeElement = element.domElementForm;
      if (nodeElement.value) {
        localStorage.setItem(element.nameInStorage, nodeElement.value);
      }
    });
  };

  /* validate footer form */

  var validateFooterForm = function () {
    if (footerForm.flag) {
      formSection.addEventListener('mouseover', function () {
        addDataToFooterForm();
      });
      setPhoneMask(phones[0]);
      forms[0].addEventListener('submit', onSubmitWriteDataToStorage);
    }
  };

  validateFooterForm();

  /* popup */

  /* add stored data to popup form */

  var addDataToPopupForm = function () {
    storageElements.forEach(function (element) {
      if (element.storageFlag) {
        var nodeElement = element.domElementPopup;
        nodeElement.value = element.content;
      }
    });
  };

  /* close popup */
  var closePopup = function () {
    document.querySelector('body').classList.remove('overlay');
    popup.classList.add('modal--closed');
    popupClose.removeEventListener('click', onClickClosePopup);
    window.removeEventListener('keydown', onEscPressClosePopup);
  };

  var onClickClosePopup = function () {
    closePopup();
  }

  /* close popup on esc */

  var onEscPressClosePopup = function (evt) {
    if (evt.keyCode === 27) {
      evt.preventDefault();
      closePopup();
    }
  };

  var onClickOutsideClose = function (evt) {
    if (evt.target === evt.currentTarget) {
      closePopup();
    }
  };

  /* on submit store data & close popup*/
  var onSubmitStoreDataClosePopup = function () {
    storageElements.forEach(function (element) {
      var nodeElement = element.domElementPopup;
      if (nodeElement.value) {
        localStorage.setItem(element.nameInStorage, nodeElement.value);
      }
    });
    closePopup();
  }

  /* set focus on opening popup */

  var setFocus = function () {
    if (firstNames[1].value === '') {
      firstNames[1].focus();
    } else if (phones[1].value === '') {
      phones[1].focus();
    }  else if (messages[1].value === '') {
      messages[1].focus();
    }
  };

  /* show popup */
  var openPopup = function () {
    document.querySelector('body').classList.add('overlay');
    popup.classList.remove('modal--closed');
    addDataToPopupForm();
    setFocus();
    setPhoneMask(phones[1]);
    forms[1].addEventListener('submit', onSubmitStoreDataClosePopup);
    popupClose.addEventListener('click', onClickClosePopup);
    window.addEventListener('keydown', onEscPressClosePopup);
    popup.addEventListener('mouseup', onClickOutsideClose);
  };

  if (popupForm.flag) {
    contactUsLink.addEventListener('click', function (evt) {
      evt.preventDefault();
      openPopup();
    });
  }

  /* accordion */
  var mQueryMobile = window.matchMedia('(max-width: 767px)');
  var accordionButtons = document.querySelectorAll('.accordion__button');

  var setInitialToggle = function (toggle) {
    toggle.setAttribute('aria-expanded', false);
    toggle.classList.add('accordion__button--closed');
  };

  var setInitialPanel = function (toggle) {
    var hiddenText = toggle.parentNode.parentNode.childNodes[3];
    hiddenText.classList.add('accordion__panel--closed');
  };

  var closeOtherPanels = function (toggle) {
    var otherToggles = Array.from(accordionButtons).filter(function (element) {
      return element != toggle;
    });
    if (otherToggles.length) {
      otherToggles.forEach(function (otherToggle) {
        if (otherToggle.classList.contains('accordion__button--opened')) {
          setInitialToggle(otherToggle);
          setInitialPanel(otherToggle);
        }
      });
    }
  };

  var setInitialAccordion = function (toggle) {
    toggle.disabled = false;
    setInitialToggle(toggle);
    setInitialPanel(toggle);
  };

  var inverseAttributes = function (toggle) {
    var hiddenText = toggle.parentNode.parentNode.childNodes[3];
    var expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', !expanded);
    hiddenText.classList.toggle('accordion__panel--closed');
  };

  var inverseClasses = function (toggle) {
    if (toggle.classList.contains('accordion__button--closed')) {
      toggle.classList.remove('accordion__button--closed');
      toggle.classList.add('accordion__button--opened');
      closeOtherPanels(toggle);
    } else {
      toggle.classList.remove('accordion__button--opened');
      toggle.classList.add('accordion__button--closed');
    }
  }

  if (mQueryMobile.matches && accordionButtons !== null) {
    accordionButtons.forEach(function (button) {
      setInitialAccordion(button);
      button.addEventListener('click', function () {
        inverseAttributes(button);
        inverseClasses(button);
      });
    });
  }
})();
