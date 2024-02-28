# Allah(SWT) 99 Names API

This API provides information about the 99 names of Allah (SWT) along with their meanings. It allows users to retrieve, add, update, and delete names of Allah.

## API Endpoints

### Retrieve All Names of Allah

- **Endpoint:** GET /names-of-allah
- **Description:** Fetches a list of all 99 names of Allah (SWT)
- **Response:** Returns a JSON object containing the names of Allah

### Retrieve a Single Name of Allah

- **Endpoint:** GET /name/{number}
- **Description:** Fetches a single name of Allah (SWT) based on the provided number
- **Parameters:**
  - number (integer): The number of the name
- **Response:** Returns a JSON object containing the single name of Allah

### Search Names of Allah

- **Endpoint:** GET /search/{keyword}
- **Description:** Searches for names of Allah (SWT) based on the provided keyword
- **Parameters:**
  - keyword (string): The keyword to search for
- **Response:** Returns a JSON array containing the matching names of Allah

### Add a New Name of Allah

- **Endpoint:** POST /add-name
- **Description:** Adds a new name of Allah to the database
- **Request Body:**
  - number (integer): The number of the name
  - arabicName (string): The name in Arabic
  - transliteration (string): The transliteration of the name
  - translation (string): The translation of the name
  - briefMeaning (string): The brief meaning of the name
- **Response:** Returns a JSON object with a success message if the name is added successfully

### Update a Name of Allah

- **Endpoint:** PUT /update-name/{number}
- **Description:** Updates a name of Allah in the database
- **Parameters:**
  - number (integer): The number of the name
- **Request Body:**
  - briefMeaning (string): The updated brief meaning of the name
- **Response:** Returns a JSON object with the updated name if the update is successful

### Delete a Name of Allah

- **Endpoint:** DELETE /delete-name/{number}
- **Description:** Deletes a name of Allah from the database
- **Parameters:**
  - number (integer): The number of the name
- **Response:** Returns a JSON object with a success message if the name is deleted successfully

## API Documentation

API documentation is available using Swagger UI. You can access the documentation by visiting the following URL:

```
http://localhost:8000/api-docs
```

## Installation

1. Clone the repository.
2. Install the dependencies using the command `npm install`.
3. Create a `.env` file and configure the environment variables.
4. Start the server using the command `npm start`.

## Dependencies

- cors: ^2.8.5
- dotenv: ^16.4.5
- express: ^4.18.2
- mongoose: ^8.2.0
- swagger-jsdoc: ^6.2.8
- swagger-ui-express: ^5.0.0

## Author

This API is developed by A Servant of Allah(SWT).
