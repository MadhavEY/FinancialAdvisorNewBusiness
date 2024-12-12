const {
  responseFormatter,
  statusCodes
} = require("../utils");
const {
  application,
  event,
  quote
} = require("../db");
const {
  v4: uuidv4
} = require("uuid");
const {
  REQUIRED_DOCUMENTS,
  findAndUpdateDocument,
  notRequiredDocuments
} = require("../utils/application");

exports.appTrackerCount = async (request, reply) => {
  try {
    await event.insertEventTransaction(request.isValid);
    const [draft, requirementPending, qcUW, decisionProvided] =
    await Promise.all([
      application.getApplicationTrackerDetails(true, 1),
      application.getApplicationTrackerDetails(true, 2),
      application.getApplicationTrackerDetails(true, 3),
      application.getApplicationTrackerDetails(true, 4),
    ]);

    reply.status(statusCodes.OK).send(
      responseFormatter(statusCodes.OK, "Data fetched successfully!", {
        draft,
        requirementPending,
        qcUW,
        decisionProvided,
      })
    );
  } catch (error) {
    await event.insertEventTransaction(request.inValid);
    return reply.status(statusCodes.INTERNAL_SERVER_ERROR).send(
      responseFormatter(
        statusCodes.INTERNAL_SERVER_ERROR,
        "Internal server error occurred", {
          error: error.message,
        }
      )
    );
  }
};

exports.appTrackerList = async (request, reply) => {
  try {
    await event.insertEventTransaction(request.isValid);
    const {
      statusType,
      limit,
      pageNo,
      searchKeyword
    } = request.body;

    const pageLimit = Number(limit);
    const offset = pageLimit * Number(pageNo);
    const response = await application.getApplicationTrackerDetails(
      false,
      statusType,
      pageLimit,
      offset,
      searchKeyword
    );
    reply
      .status(statusCodes.OK)
      .send(
        responseFormatter(
          statusCodes.OK,
          "List fetched successfully!",
          response
        )
      );
  } catch (error) {
    await event.insertEventTransaction(request.inValid);
    return reply.status(statusCodes.INTERNAL_SERVER_ERROR).send(
      responseFormatter(
        statusCodes.INTERNAL_SERVER_ERROR,
        "Internal server error occurred", {
          error: error.message,
        }
      )
    );
  }
};

exports.appDetails = async (request, reply) => {
  try {
    await event.insertEventTransaction(request.isValid);
    const {
      applicationId
    } = request.body;
    const response = await application.getApplicationDetails(applicationId);

    reply
      .status(statusCodes.OK)
      .send(
        responseFormatter(
          response?.length === 0 ? statusCodes.NOT_FOUND : statusCodes.OK,
          response?.length === 0 ?
          "Application not found!" :
          "Application details fetched successfully",
          response
        )
      );
  } catch (error) {
    await event.insertEventTransaction(request.inValid);
    return reply.status(statusCodes.INTERNAL_SERVER_ERROR).send(
      responseFormatter(
        statusCodes.INTERNAL_SERVER_ERROR,
        "Internal server error occurred", {
          error: error.message,
        }
      )
    );
  }
};

exports.agentDetails = async (request, reply) => {
  try {
    const {
      agentCode
    } = request.body;

    const response = {
      agentCode: "AGT12345",
      name: "Rahul Sharma",
      branchCode: "BRC5678",
      branchName: "Mumbai Central",
      branchLocation: "Mumbai, Maharashtra",
    };
    if (response) {
      await event.insertEventTransaction(request.isValid);
      return reply
        .status(statusCodes.OK)
        .send(
          responseFormatter(
            statusCodes.OK,
            "Agent data fetched successfully",
            response
          )
        );
    } else {
      return reply
        .status(statusCodes.OK)
        .send(responseFormatter(statusCodes.OK, "Data not found", response));
    }
  } catch (error) {
    return reply.status(statusCodes.INTERNAL_SERVER_ERROR).send(
      responseFormatter(
        statusCodes.INTERNAL_SERVER_ERROR,
        "Internal server error occurred", {
          error: error.message,
        }
      )
    );
  }
};

exports.requiredDocList = async (request, reply) => {
  try {
    const docListData = await quote.getList();

    // Loop through the data and organize by `meta_master_name`
    function formatMetadata(data) {
      const result = {};

      // Loop through the data and organize by `meta_master_name`
      data.forEach((item) => {
        const masterName = item.meta_master_name;

        // Initialize the array if it's not already created
        if (!result[masterName]) {
          result[masterName] = [];
        }

        // Prepare the document structure
        const doc = {
          idmetadata: item.idmetadata,
          docName: item.meta_data_name,
          required: notRequiredDocuments().includes(item.idmetadata) ? false : true,
          info: "",
        };

        // Add 'info' field if it's available
        if (item.info !== undefined) {
          doc.info = item.info;
        }

        // Push the document into the respective master array
        result[masterName].push(doc);
      });

      return result;
    }
    const response = formatMetadata(docListData);
    if (response) {
      await event.insertEventTransaction(request.isValid);
      return reply
        .status(statusCodes.OK)
        .send(
          responseFormatter(
            statusCodes.OK,
            "Document list fetched successfully",
            response
          )
        );
    } else {
      return reply
        .status(statusCodes.OK)
        .send(responseFormatter(statusCodes.OK, "Data not found", response));
    }
  } catch (error) {
    return reply.status(statusCodes.INTERNAL_SERVER_ERROR).send(
      responseFormatter(
        statusCodes.INTERNAL_SERVER_ERROR,
        "Internal server error occurred", {
          error: error.message,
        }
      )
    );
  }
};

exports.uploadDocument = async (request, reply) => {
  try {
    const {
      applicationId
    } = request.body;

    // Find application document list
    const appDetails = await application.getApplicationDetails(applicationId);
    if (!appDetails?.length) {
      return reply
        .status(statusCodes.NOT_FOUND)
        .send(
          responseFormatter(statusCodes.NOT_FOUND, "Application not found")
        );
    }
    const updatedDocList = await findAndUpdateDocument(appDetails[0].requirement_json, request.body);

    const status = updatedDocList?.filter(item => item.required == true)?.length > 0 ? "2" : "3";

    const response = await application.updateRequirementJson(
      updatedDocList,
      status,
      applicationId
    );

    reply
      .status(statusCodes.OK)
      .send(
        responseFormatter(
          statusCodes.OK,
          "Document uploaded successfully!",
          response
        )
      );
  } catch (error) {
    return reply.status(statusCodes.INTERNAL_SERVER_ERROR).send(
      responseFormatter(
        statusCodes.INTERNAL_SERVER_ERROR,
        "Internal server error occurred", {
          error: error.message,
        }
      )
    );
  }
};

exports.appDetailSubmit = async (request, reply) => {
  try {
    const {
      leadId,
      status,
      applicationId,
      personalDetails,
      analysis,
      agentDetails,
      proposerDetails,
      nomineeDetails,
      payoutDetails,
      healthDetails,
      fatcaCraDetails,
    } = request.body;
    const uuid = uuidv4();

    let tableData, row;
    if (applicationId) {
      const data = await application.getApplicationDetails(applicationId);
      if (!data?.length) {
        return reply
          .status(statusCodes.NOT_FOUND)
          .send(
            responseFormatter(statusCodes.NOT_FOUND, "Application not found")
          );
      }
      row = data[0];
    }

    const documentList = [];
    if (!row?.requirement_json && !applicationId) {
      const list = await quote.getList();
      for (let i = 0; i < list?.length; i++) {
        documentList.push({
          idmetadata: list[i].idmetadata,
          docName: list[i].meta_data_name,
          required: notRequiredDocuments().includes(list[i].idmetadata) ? false : true,
        })
      }
    }

    tableData = {
      applicationId: applicationId || uuid,
      quoteId: row?.quote_id || null,
      leadId: leadId || row?.lead_id,
      status: status || row?.status || 1,
      applicationJson: {
        ...row?.application_json,
        personalDetails: personalDetails || row?.application_json?.personalDetails,
        analysis: analysis || row?.application_json?.analysis,
        agentDetails: agentDetails || row?.application_json?.agentDetails,
        proposerDetails: proposerDetails || row?.application_json?.proposerDetails,
        nomineeDetails: nomineeDetails || row?.application_json?.nomineeDetails,
        payoutDetails: payoutDetails || row?.application_json?.payoutDetails,
        healthDetails: healthDetails || row?.application_json?.healthDetails,
        fatcaCraDetails: fatcaCraDetails || row?.application_json?.fatcaCraDetails,
      },
      quoteJson: row?.quote_json || null,
      requirementJson: row?.requirement_json || documentList || [],
      premium: row?.premium || 0,
    };

    const response = await application.createUpdateApplication(
      applicationId,
      tableData
    );

    reply
      .status(statusCodes.OK)
      .send(
        responseFormatter(
          statusCodes.OK,
          !applicationId ?
          "Application created successfully!" :
          "Application updated successfully!",
          response
        )
      );
  } catch (error) {
    await event.insertEventTransaction(request.inValid);
    return reply.status(statusCodes.INTERNAL_SERVER_ERROR).send(
      responseFormatter(
        statusCodes.INTERNAL_SERVER_ERROR,
        "Internal server error occurred", {
          error: error.message,
        }
      )
    );
  }
};

exports.appSubmission = async (request, reply) => {};