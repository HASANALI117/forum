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
