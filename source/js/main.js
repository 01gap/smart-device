'use strict';

(function() {
  const forms = document.querySelectorAll('.form');
  const firstNames = document.querySelectorAll('input[type="text"]');
  const phones = document.querySelectorAll('input[type="tel"]');
  const messages = document.querySelectorAll('textarea');
  const formSection = document.querySelector('.form-section');


  const popup = document.querySelector('.modal');
  const popupClose = popup.querySelector('.modal__close');
  const contactUsLink = document.querySelector('.contact-us__callback');

  const footerForm = {
    elements: [forms[0], firstNames[0], phones[0], messages[0]],
    flag: true
  }

  const popupForm = {
    elements: [forms[1], firstNames[1], phones[1], messages[1]],
    subElements: [contactUsLink, popupClose],
    flag: true
  }

  const userName = {
    domElementForm: firstNames[0],
    domElementPopup: firstNames[1],
    content: null,
    nameInStorage: 'name',
    storageFlag: false
  };

  const userPhone = {
    domElementForm: phones[0],
    domElementPopup: phones[1],
    content: null,
    nameInStorage: 'phone',
    storageFlag: false
  };

  const userMessage = {
    domElementForm: messages[0],
    domElementPopup: messages[1],
    content: null,
    nameInStorage: 'message',
    storageFlag: false
  };

  const storageElements = [userName, userPhone, userMessage];

  /* test dom elements for both forms */

  const verifyFormElements = (obj) => {
    obj.elements.forEach(element => {
      if (element === null) {
        obj.flag = false;
      }
    });
  };

  const verifySubElements = (obj) => {
    obj.subElements.forEach(element => {
      if (element === null) {
        obj.flag = false;
      }
    });
  };

  const verifyFooterForm = () => {
    verifyFormElements(footerForm);
  };


  const verifyPopupForm = () => {
    verifyFormElements(popupForm);
    verifySubElements(popupForm);
  };

  verifyFooterForm();
  verifyPopupForm();

  /* test storage */

  const verifyStorage = () => {
    storageElements.forEach(element => {
      let memorized = localStorage.getItem(element.nameInStorage);
      if (memorized !== null) {
        element.storageFlag = true;
        element.content = memorized;
      }
    });
  };

  verifyStorage();

  /* set phone mask */

  const setPhoneMask = (inputElement) => {
    const maskOptions = {
      mask: '+7(000)0000000'
    };

    const mask = IMask(inputElement, maskOptions);

    if (!userPhone.storageFlag || inputElement.value === "") {
      inputElement.addEventListener('focus', () => {
        mask.value = '+7(';
      });
    }
  };

  /* add stored data to footer inputs */

  const addDataToFooterForm = () => {
    storageElements.forEach(element => {
      if (element.storageFlag) {
        let nodeElement = element.domElementForm;
        nodeElement.value = element.content;
      }
    });
  };

  const onSubmitWriteDataToStorage = () => {
    storageElements.forEach(element => {
      let nodeElement = element.domElementForm;
      if (nodeElement.value) {
        localStorage.setItem(element.nameInStorage, nodeElement.value);
      }
    });
  };

  /* validate footer form */

  const validateFooterForm = () => {
    if (footerForm.flag) {
      formSection.addEventListener('mouseover', () => {
        addDataToFooterForm();
      });
      setPhoneMask(phones[0]);
      forms[0].addEventListener('submit', onSubmitWriteDataToStorage);
    }
  };

  validateFooterForm();

  /* popup */

  /* add stored data to popup form */

  const addDataToPopupForm = () => {
    storageElements.forEach(element => {
      if (element.storageFlag) {
        let nodeElement = element.domElementPopup;
        nodeElement.value = element.content;
      }
    });
  };

  /* close popup */
  const closePopup = () => {
    popup.classList.add('modal--closed');
    popupClose.removeEventListener('click', onClickClosePopup);
    window.removeEventListener('keydown', onEscPressClosePopup);
  };

  const onClickClosePopup = () => {
    closePopup();
  }

  /* close popup on esc */

  const onEscPressClosePopup = (evt) => {
    if (evt.keyCode === 27) {
      evt.preventDefault();
      closePopup();
    }
  };

  const onClickOutsideClose = (evt) => {
    if (evt.target === evt.currentTarget) {
      closePopup();
    }
  };

  /* on submit store data & close popup*/
  const onSubmitStoreDataClosePopup = () => {
    storageElements.forEach(element => {
      let nodeElement = element.domElementPopup;
      if (nodeElement.value) {
        localStorage.setItem(element.nameInStorage, nodeElement.value);
      }
    });
    closePopup();
  }

  /* show popup */
  if (popupForm.flag) {
    contactUsLink.addEventListener('click', (evt) => {
      evt.preventDefault();
      popup.classList.remove('modal--closed');
      addDataToPopupForm();
      if (firstNames[1] === null) {
        firstNames[1].focus();
      }
      setPhoneMask(phones[1]);
      forms[1].addEventListener('submit', onSubmitStoreDataClosePopup);
      popupClose.addEventListener('click', onClickClosePopup);
      window.addEventListener('keydown', onEscPressClosePopup);
      popup.addEventListener('mouseup', onClickOutsideClose);
    });
  }

  /* accordion */
  const mQuery = window.matchMedia('(max-width: 767px)');
  const accordionButtons = document.querySelectorAll('.accordion__button');

  if (mQuery.matches && accordionButtons !== null) {
    accordionButtons.forEach(button => {
      button.removeAttribute('disabled');
      button.classList.add('accordion__button--closed')
      const hiddenText = button.parentNode.childNodes[3];
      hiddenText.classList.add('accordion__panel--closed');

      button.addEventListener('click', () => {
        let expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', !expanded);
        hiddenText.classList.toggle('accordion__panel--closed');

        if (button.classList.contains('accordion__button--closed')) {
          button.classList.remove('accordion__button--closed');
          button.classList.add('accordion__button--opened');
        } else {
          button.classList.remove('accordion__button--opened');
          button.classList.add('accordion__button--closed');
        }
      });
    });
  }
})();
