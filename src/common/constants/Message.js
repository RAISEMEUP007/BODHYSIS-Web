const messages = {
    serverError: "Server error. Please try again later.", // 500 Internal Server Error
    unknownError: "An error occurred.", // 500 Internal Server Error
    
    // Validation
    emptyField: "Field cannot be empty. Please enter a value.", // 400 Bad Request
    invalidFormat: "Invalid format. Correct the input.", // 400 Bad Request
    invalidEmailFormat: "Invalid email format. Correct the email.", // 400 Bad Request

    // Signup
    emailExists: "Email already exists. Please use a different email.", // 409 Conflict
    passwordNotProvided: "Please enter your password to register.", // 400 Bad Request
    userCreated: "User successfully created.", // 200 OK
    errorCreatingUser: "An error occurred while creating the user.", // 502 Bad Gateway
    passwordHashError: "An error occurred while encrypting the password.", // 500 Internal Server Error

    // Login
    userNotFound: "User not found. Check your email or register.", // 404 Not Found
    invalidCredentials: "Invalid credentials. Enter correct details.", // 401 Unauthorized
    userLoggedIn: "User successfully logged in.", // 200 OK
    errorComparingPassword: "The password is incorrect.", // 502 Bad Gateway

    // Authorization
    notAuthenticated: "User is not authenticated. Please log in.", // 401 Unauthorized
    unauthorized: "User is not authorized to access this resource.", // 401 Unauthorized
    tokenDecodingError: "Error decoding the authentication token. Please log in again.", // 500 Internal Server Error

    // Reste password
    emailNotFound: "Cannot find this email.", // 404 Not Found
    resetPasslinkSent: "Reset password link is sent. Please check your email.", // 200 OK
    noMatchPass: "The password doesn't match.",
    passUpdatedSuccessfully: "Password updated successfully.", // 200 OK
    linkExpired: "This link is expired.", // 400 Bad Request

    //confirmation
    deleteConfirmStr: "Are you sure you want to delete?",
};
  
export function msgStr(messageType) {
    return messages[messageType] || "Message not found";
}

export default messages;