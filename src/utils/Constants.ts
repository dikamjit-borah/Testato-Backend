
export module Constants{
    export class Messages{
        static USER_CREATED: string = "User created successfully"
        static SOMETHING_WENT_WRONG: string = "Something went wrong. Please try again"
        static USER_UNAUTHORIZED: string = "User is not authorized"
        static LOGIN_SUCCESS: string = "Login successful"
        static LOGIN_FAILED: string = "Login failed. Please check credentials"
        static USER_NOT_FOUND: string = "User not found"

        static MEDICINES_UPDATED: string = "Medicines updated successfully"

        static MEDICINES_FOUND: string = "Medicines found"
        static MEDICINES_NOT_FOUND: string = "No medicines found. Please try again"
        static MEDICINES_ERR: string = "Error fetching medicines. Please try again"

        static MEDICINE_DETAILS_FOUND: string = "Medicine details found"
        static MEDICINE_DETAILS_NOT_FOUND: string = "Medicine details not found. Please try again"
        static MEDICINE_DETAILS_ERR: string = "Error fetching medicine details. Please try again"
    }
    export class RabbitMqConfig{
        static MEDICINE_DATA_QUEUE = "MEDICINE-DATA"
        static MEDICINE_DATA_PATTERN = "UPDATE-MEDICINE-DATA"
    }
}