export const customFetch = async (url, type, data, onSuccess, onError) => {
  const options = {
    method: type,
    headers: { 'Content-type': 'application/json' },
    credentials: 'include',
  };

  if (type !== 'GET') {
    options.body = JSON.stringify(data);
  }

  try {
    const res = await fetch(url, options);

    if (res.status === 401) {
      window.toast.show('Session expired. Please sign in again.', 'warning', {
        position: { horizontal: 'right', vertical: 'top' }
      });
      return { error: 'Unauthorized' };
    }

    if (res.ok) {
      const jsonResponse = await res.json().catch(() => null);
      if (jsonResponse?.message) {
        window.toast.show(jsonResponse.message, 'success', {
          position: { horizontal: 'right', vertical: 'top' }
        });
      }

      if (onSuccess) {
        onSuccess(jsonResponse);
      }

      return jsonResponse;
    }

    const jsonResponse = await res
      .json()
      .catch(() => ({ message: 'Request failed' }));
    window.toast.show(
      jsonResponse.message || 'Something went wrong',
      'error',
      {
        duration: 5000,
        position: { horizontal: 'right', vertical: 'top' }
      }
    );
    const error = new Error(jsonResponse.message || 'Request failed');
    if (onError) {
      onError(error);
    }
    throw error;
  } catch (error) {
    console.error('Fetch error:', error);
    window.toast.show('Network error occurred', 'error', {
      position: { horizontal: 'right', vertical: 'top' }
    });
    if (onError) {
      onError(error);
    }
    throw error;
  }
};

export const handleFormSubmit = (formId, callback) => {
  const form = document.getElementById(formId);
  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        if (callback) {
          await callback(data);
        }
      } catch (error) {
        window.toast.show(error.message || 'Form submission failed', 'error', {
          position: { horizontal: 'right', vertical: 'top' }
        });
      }
    });
  } else {
    console.error(`Form with id ${formId} not found`);
    window.toast.show(`Form with id ${formId} not found`, 'error', {
      position: { horizontal: 'right', vertical: 'top' }
    });
  }
};

export const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) {
    return 'now';
  }

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1)
    return interval + ' year' + (interval > 1 ? 's' : '') + ' ago';

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1)
    return interval + ' month' + (interval > 1 ? 's' : '') + ' ago';

  interval = Math.floor(seconds / 86400);
  if (interval >= 1)
    return interval + ' day' + (interval > 1 ? 's' : '') + ' ago';

  interval = Math.floor(seconds / 3600);
  if (interval >= 1)
    return interval + ' hour' + (interval > 1 ? 's' : '') + ' ago';

  return Math.floor(seconds / 60) + ' min' + (interval > 1 ? 's' : '') + ' ago';
};

export const updateTimestamps = () => {
  const timeElements = document.querySelectorAll('.timestamp');
  timeElements.forEach((element) => {
    const timestamp = element.getAttribute('data-timestamp');
    if (timestamp) {
      element.textContent = formatTimeAgo(timestamp);
    }
  });
};

// Start the timer to update timestamps every minute
setInterval(updateTimestamps, 60000);

export const getCurrentUser = async () => {
  try {
    const response = await customFetch(
      'http://localhost:8080/api/current_user',
      'GET'
    );
    if (response.error === 'Unauthorized') {
      return [false, null];
    }
    return [true, response];
  } catch (error) {
    console.error('Error fetching current user:', error);
    return [false, null];
  }
};
