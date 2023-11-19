const messages = {
    serverError: "An error occurred on the server. Please try again later.", // 500 Internal Server Error
    
    // Validation
    emptyField: "Field cannot be empty. Please provide a value.", // 400 Bad Request
    invalidFormat: "Invalid format. Please review and correct the input.", // 400 Bad Request

    // Signup
    emailExists: "Email already exists. Please use a different email to register.", // 409 Conflict
    passwordNotProvided: "Password not provided. Please enter your password to register.", // 400 Bad Request
    userCreated: "User successfully created.", // 200 OK
    errorCreatingUser: "An error occurred while creating the user. Please try again later.", // 502 Bad Gateway
    passwordHashError: "An error occurred while encrypting the password.", // 500 Internal Server Error

    // Login
    userNotFound: "User not found. Please check your email or register.", // 404 Not Found
    invalidCredentials: "Invalid credentials. Please enter the correct email and password.", // 401 Unauthorized
    userLoggedIn: "User successfully logged in.", // 200 OK
    errorComparingPassword: "An error occurred while checking the user's password.", // 502 Bad Gateway

    // Authorization
    notAuthenticated: "User is not authenticated. Please log in to access this resource.", // 401 Unauthorized
    unauthorized: "User is not authorized to access this resource.", // 401 Unauthorized
    tokenDecodingError: "Error decoding the authentication token. Please log in again.", // 500 Internal Server Error
};
  
export function msgStr(messageType) {
    return messages[messageType] || "Message not found";
}

export default messages;