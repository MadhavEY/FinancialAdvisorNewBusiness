const {
  responseFormatter,
  statusCodes
} = require("../utils");
const {
  common,
  event
} = require("../db");

exports.kyc = async (request, reply) => {
  try {
    const {
      kycIdentityType,
      IdentityNumber
    } = request.body;
    const response = {
      "aadhaar": {
        "aadhaar_number": "XXXX-XXXX-1234",
        "aadhaar_status": "Verified",
        "aadhaar_holder_name": "Ravi Kumar",
        "aadhaar_verification_date": "2024-12-01",
        "aadhaar_expiry_date": "2034-12-01",
        "aadhaar_issue_authority": "UIDAI",
        "aadhaar_consent_status": "Granted",
        "aadhaar_status_message": "Aadhaar is verified and active.",
        "aadhaar_address": {
          "house_number": "45",
          "street": "Shivaji Nagar",
          "locality": "Gandhinagar",
          "city": "Bangalore",
          "state": "Karnataka",
          "postal_code": "560001"
        },
        "aadhaar_dob": "1988-08-15",
        "aadhaar_age": 36,
        "aadhaar_gender": "Male"
      },
      "pan": {
        "pan_number": "ABCDE****F",
        "pan_status": "Active",
        "pan_holder_name": "Ravi Kumar",
        "pan_verification_date": "2024-11-25",
        "pan_expiry_date": "2030-11-25",
        "pan_issue_authority": "Income Tax Department",
        "pan_consent_status": "Granted",
        "pan_status_message": "PAN is active and linked to tax records."
      }
    }

    if (response) {
      await event.insertEventTransaction(request.isValid);
      return reply
        .status(statusCodes.OK)
        .send(
          responseFormatter(
            statusCodes.OK,
            "KYC data fetched successfully",
            response
          )
        );
    } else {
      return reply
        .status(statusCodes.OK)
        .send(
          responseFormatter(
            statusCodes.OK,
            "Data not found",
            response
          )
        );
    }
  } catch (error) {
    return reply
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .send(
        responseFormatter(
          statusCodes.INTERNAL_SERVER_ERROR,
          "Internal server error occurred", {
            error: error.message
          }
        )
      );
  }
}

exports.verifyKyc = async (request, reply) => {
  try {
    const {
      otp
    } = request.body;
    const dummyOtp = ['123456', '987654'];
    const response = {
      "aadhaar": {
        "aadhaar_number": "XXXX-XXXX-1234",
        "aadhaar_status": "Verified",
        "aadhaar_holder_name": "Ravi Kumar",
        "aadhaar_verification_date": "2024-12-01",
        "aadhaar_expiry_date": "2034-12-01",
        "aadhaar_issue_authority": "UIDAI",
        "aadhaar_consent_status": "Granted",
        "aadhaar_status_message": "Aadhaar is verified and active.",
        "aadhaar_address": {
          "house_number": "45",
          "street": "Shivaji Nagar",
          "locality": "Gandhinagar",
          "city": "Bangalore",
          "state": "Karnataka",
          "postal_code": "560001"
        },
        "aadhaar_dob": "1988-08-15",
        "aadhaar_age": 36,
        "aadhaar_gender": "Male"
      },
      "pan": {
        "pan_number": "ABCDE****F",
        "pan_status": "Active",
        "pan_holder_name": "Ravi Kumar",
        "pan_verification_date": "2024-11-25",
        "pan_expiry_date": "2030-11-25",
        "pan_issue_authority": "Income Tax Department",
        "pan_consent_status": "Granted",
        "pan_status_message": "PAN is active and linked to tax records."
      }
    }
    if (dummyOtp.includes(otp)) {
      await event.insertEventTransaction(request.isValid);
      return reply
        .status(statusCodes.OK)
        .send(
          responseFormatter(
            statusCodes.OK,
            "Otp verified successfully",
            response
          )
        );
    } else {
      return reply
        .status(statusCodes.BAD_REQUEST)
        .send(
          responseFormatter(
            statusCodes.BAD_REQUEST,
            "OTP not matched"
          )
        );
    }
  } catch (error) {
    return reply
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .send(
        responseFormatter(
          statusCodes.INTERNAL_SERVER_ERROR,
          "Internal server error occurred", {
            error: error.message
          }
        )
      );
  }
}