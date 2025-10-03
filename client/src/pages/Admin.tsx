import axios from "axios";

function Admin() {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyNWNkNzVkNy1lOTI2LTQyYjctOTM0OS1lYmViNWEzYWJiNzAiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NTk0OTkwMTEsImV4cCI6MTc1OTU0MjIxMX0.Us2jIwACPxZhiI9eAvw3hQY6aBVBNJ0OxX9OScQ7KI4";

  axios
    .get("http://localhost:3000/questions/status?status=pending", {
      headers: {
        // Due to login not being implemented yet, hard-code JWT token from Postman call here.
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log(response);
    })
    .catch((err) => console.log(err));

  return (
    <>
      <div>Admin</div>
    </>
  );
}

export default Admin;
