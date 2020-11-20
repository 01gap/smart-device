'use strict';

(function() {
  const form = document.querySelector('.form');
  const phone = form.querySelector('input[type="tel"]');
  const message = form.querySelector('textarea');
  const firstName = form.querySelector('input[type="text"]');

  let isNameInStorage = true;
  let isPhoneInStorage = true;
  let storageName = '';
  let storagePhone = '';

  try {
    storageName = localStorage.getItem('name');
  } catch (err) {
    isNameInStorage = false;
  }

  try {
    storagePhone = localStorage.getItem('phone');
  } catch (err) {
    isPhoneInStorage = false;
  }

  if (form !== null && phone !== null && message !== null && firstName !==null) {
    window.addEventListener('load', () => {
      form.reset();
      if (storageName) {
        firstName.value = storageName;
      }
      if (storagePhone) {
        phone.value = storagePhone;
      }
    });

    phone.addEventListener('focus', () => {
      phone.value = '+7(';
    });

    phone.addEventListener('input', () => {
      let regex = /^\+7\([0-9]{3}$/i;
      let val = phone.value;
      if (regex.test(val)) {
        val.concat(')');
      }
    });

    form.addEventListener('submit', () => {
      if (firstName.value) {
        localStorage.setItem('name', firstName.value);
      }
      if (phone.value) {
        localStorage.setItem('phone', phone.value);
      }
    })
  }

})();
