const {
  responseFormatter,
  statusCodes
} = require("../utils");
const {
  common,
  event
} = require("../db");

exports.ekyc = async (request, reply) => {
  try {
    const {
      kycIdentityType,
      IdentityNumber
    } = request.body;
    const response = {
      "Certificate": {
        "CertificateData": {
          "KycRes": {
            "code": "42d044af1b3542c993e4f453e67e2d90",
            "ret": "Y",
            "ts": "2023-08-14T12:50:55.963+05:30",
            "ttl": "2024-08-13T12:50:55",
            "txn": "UKC:7b4ec534ad17bf62e08f61421dde2ed320230814125036",
            "UidData": {
              "tkn": "0100227408hNcQYBw1tPly5gUBmZ+RRleGsg+finHxuh+5CO/6WsZbnqnbp6+7Gs6kzvRk+M",
              "uid": "xxxxxxxx9852",
              "Poi": {
                "dob": "14-09-1990",
                "gender": "M",
                "name": "Ketan Gopal Jangade",
                "age": "35"
              },
              "Poa": {
                "co": "S/O Gopal Jangade",
                "country": "India",
                "dist": "Nagpur",
                "house": "",
                "lm": "",
                "loc": "",
                "pc": 440009,
                "state": "Maharashtra",
                "street": "",
                "vtc": "Hanuman Nagar S.O"
              },
              "LData": {
                "co": "S/O  गोपाल जांगडे",
                "country": " ",
                "dist": "नागपूर",
                "house": "",
                "lang": 13,
                "lm": "",
                "loc": "",
                "name": "केतन गोपाल जांगडे",
                "pc": 440009,
                "state": "महाराष्ट्र",
                "street": "",
                "vtc": ""
              },
              "Pht": "/9j/4AAQxkZJRgABAgAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCADIAKADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCcEGgAc4wKXFLgYrlKGgEdadjiloxxQA09KhZGLE8c1PTGFDAaBgUZx2pCwAqCW5ii+/IqZOMscD86AJi1Ju/Gs2TWbBd2LqJiONquCc1WPiSwUn5n/BaLMRsn72aeD71zI/hCZBwQaKKNkPdmUIjEv7tFQxRLEEUADnbjA9uatom6VnTgM4U++3NFFICC2QmzjUc/un5/GkWI7UiwPmMcZ9Puf40UUyTZsNPlWZXTJlEpdfTG5c/pXT6buOlwl0wxjJJ+jA/wBaKKAZl6Y5bUpiRkFw3X1VR/WorW4Z7u9DD95EZnB/4Dgf0oooH0P/2Q=="
            }
          }
        }
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

exports.ckyc = async (request, reply) => {
  try {
    const {
      kycIdentityType,
      IdentityNumber
    } = request.body;
    const response = {
      "PID_DATA": {
        "CKYC_NO": 50008055039603,
        "NAME": "Mr Ketan Gopal Jangade",
        "FATHERS_NAME": "Mr Mahesh Jangade",
        "AGE": 33,
        "IMAGE_TYPE": "jpg",
        "PHOTO": "/9j/4AAQSkZJRgABAQEAeAB4AAD/+ZyMnbzXZXXhcXc25ncD2NTroI2LEw3xj+9zVcw9EeZeE9UbXLrynR1/3lIro11D7GzxyRu2DxgGurj8L2trcebCoU/wCyMVd/s2E4yik/SolK4ehZj6UooorMYbRupkhK9KKKYhI2PrQ33qKKQxG60LRRQAMaTFFFAmFNyaKKBkbk+tKrEd6KKGBNG7etLvb1ooqQGq7Z605s+tFFaxIYbaVRRRQCHU7aKKKCkOWlxRRQIWiiigApKKKTGj//2Q==",
        "KYC_DATE": "21-08-2023",
        "UPDATED_DATE": "21-08-2023",
        "ID_LIST": {
          "ID": [{
              "TYPE": "B",
              "STATUS": "03"
            },
            {
              "TYPE": "F",
              "STATUS": "03"
            },
            {
              "TYPE": "A",
              "STATUS": "03"
            },
            {
              "TYPE": "C",
              "STATUS": "03"
            }
          ]
        },
        "REMARKS": {}
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