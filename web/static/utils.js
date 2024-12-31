export const customFetch = (url, type, data) => {
  const options = {
    method: type,
    headers: { "Content-type": "application/json" },
  };

  if (type !== "GET") {
    options.body = JSON.stringify(data);
  }

  return fetch(url, options)
    .then((res) => {
      if (res.ok) {
        console.log("HTTP request successful");
        return res.json();
      } else {
        console.log("HTTP request unsuccessful");
      }
    })
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

export const handleFormSubmit = (formId, callback) => {
  const form = document.getElementById(formId);
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      console.log(data);
      if (callback) {
        callback(data);
      }
    });
  } else {
    console.error(`Form with id ${formId} not found`);
  }
};

export const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1)
    return interval + " year" + (interval > 1 ? "s" : "") + " ago";

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1)
    return interval + " month" + (interval > 1 ? "s" : "") + " ago";

  interval = Math.floor(seconds / 86400);
  if (interval >= 1)
    return interval + " day" + (interval > 1 ? "s" : "") + " ago";

  interval = Math.floor(seconds / 3600);
  if (interval >= 1)
    return interval + " hour" + (interval > 1 ? "s" : "") + " ago";

  interval = Math.floor(seconds / 60);
  if (interval >= 1)
    return interval + " min" + (interval > 1 ? "s" : "") + " ago";

  return Math.floor(seconds) + " second" + (seconds > 1 ? "s" : "") + " ago";
};
