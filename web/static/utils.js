export const customFetch = (url, type, data, onSuccess, onError) => {
  const options = {
    method: type,
    headers: { "Content-type": "application/json" },
  };

  if (type !== "GET") {
    options.body = JSON.stringify(data);
  }

  return fetch(url, options)
    .then(async (res) => {
      if (res.status === 401) {
        return { error: "Unauthorized" };
      }
      if (res.ok) {
        const jsonResponse = await res.json().catch(() => null);
        console.log("HTTP Request Successful", jsonResponse);

        if (onSuccess) {
          onSuccess(jsonResponse);
        }

        return jsonResponse;
      } else {
        const error = new Error("Request failed");
        if (onError) {
          onError(error);
        }
        throw error;
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      if (onError) {
        onError(jsonResponse);
      }
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
      // console.log(data);
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

export const getCurrentUser = async () => {
  try {
    const response = await customFetch(
      "http://localhost:8080/api/current_user",
      "GET"
    );
    if (response.error === "Unauthorized") {
      return [false, null];
    }
    return [true, response.user];
  } catch (error) {
    console.error("Error fetching current user:", error);
    return [false, null];
  }
};
