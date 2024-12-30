export const customFetch = (url, type, data) => {
  const options = {
    method: type,
    headers: { "Content-type": "application/json" },
  };

  if (type !== "GET") {
    options.body = JSON.stringify({ data });
  }

  return fetch(url, options)
    .then((res) => {
      if (res.ok) {
        console.log("HTTP request successful");
      } else {
        console.log("HTTP request unsuccessful");
      }
      return res.json();
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
