const messages = {
    serverError: "An error occurred on the server. Please try again later.",
    // login
    wrongEmailFormat: "Incorrect email format. Please enter a valid email address.",
    noUser: "User not found. Please check your email or register.",
    wrongPass: "Incorrect password. Please enter the correct password.",
    // registration
    existingUser: "This email is already registered. Please log in or use a different email to register.",
    weakPassword: "Password is too weak. Please use a stronger password.",
    registrationError: "An error occurred during registration. Please try again later.",
    // validation
    emptyField: "Field cannot be empty. Please provide a value.",
    invalidFormat: "Invalid format. Please review and correct the input.",
    // confirmation
    confirmationSent: "Confirmation email has been sent. Please check your email to complete the registration process.",
};
  
export function msgStr(messageType) {
    return messages[messageType] || "Message not found";
}

export default messages;