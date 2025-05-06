(function() {
  // Inject CSS to hide body and error container
  const style = document.createElement('style');
  style.innerHTML = `
    body { display: none !important; }
  `;
  document.head.appendChild(style);

  const API_URL = 'https://api.legitimate.tech/external/v1/tags/verify';

  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, making API request');
    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(Object.fromEntries(new URLSearchParams(window.location.search)))
    }).then(async res => {
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 422 && data.errors.cmac.indexOf('has expired') !== -1) {
          renderErrorMessage('expired_cmac');
        } else {
          renderErrorMessage();
        }
        return;
      }
      if (!data.errors) {
        style.innerHTML = `
          body { display: block !important; }
          #legitimate-custom-error-message { display: none !important; }
          #legitimate-expired-cmac-message { display: none !important; }
        `;
      } else {
        renderErrorMessage();
      }
    })
    .catch(() => {
      renderErrorMessage();
    });
  });

  function renderErrorMessage(errorType = 'default') {
    let errorContainer = document.getElementById('legitimate-error-message-container');
    if (!errorContainer) {
      console.log('Creating error message container');
      errorContainer = document.createElement('div');
      errorContainer.id = 'legitimate-error-message-container';
      document.body.appendChild(errorContainer);
    }

    let errorContent = `
      <div style="font-family: sans-serif; color: red; padding: 2rem; text-align: center;">
        An error occurred. Please try again later.
      </div>
    `;

    if (errorType === 'expired_cmac') {
      const expiredCmacErrorEl = document.getElementById('legitimate-expired-cmac-message');
      if (expiredCmacErrorEl) {
        console.log('Using expired cmac error message');
        errorContent = expiredCmacErrorEl.innerHTML;
      }
    } else {
      const customErrorEl = document.getElementById('legitimate-custom-error-message');
      if (customErrorEl) {
        console.log('Using custom error message');
        errorContent = customErrorEl.innerHTML;
      }
    }

    errorContainer.innerHTML = errorContent;
    style.innerHTML = `
      body { display: block !important; }
      body > *:not(#legitimate-error-message-container) { display: none !important; }
    `;
  }
})(); 