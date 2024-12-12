const REQUIRED_DOCUMENTS = [{
        "idmetadata": "1ae4c7ebae6942749791370ba5c4025f",
        "docName": "Address Proof",
        "required": true,
        "info": ""
    },
    {
        "idmetadata": "db7b866a9a2c4163926e9b33b53cfb3b",
        "docName": "Age Proof",
        "required": true,
        "info": ""
    },
    {
        "idmetadata": "1033c853f3ba4c61ab240490c2031f84",
        "docName": "Identity Proof",
        "required": true,
        "info": ""
    },
    {
        "idmetadata": "d4a553b6f95a4812a07fb8fe643c1d34",
        "docName": "Income Proof",
        "required": true,
        "info": ""
    },
    {
        "idmetadata": "575d9c0eda244976ae422ec77cc7942c",
        "docName": "Photo Proof",
        "required": true,
        "info": ""
    },
    {
        "idmetadata": "ca3a9b5874ab41a0b5e40dfbf604c6ef",
        "docName": "Physical medical",
        "required": true,
        "info": ""
    },
    {
        "idmetadata": "67f4c134a55c464789618e71f91f4c2f",
        "docName": "PIVC",
        "required": true,
        "info": ""
    },
    {
        "idmetadata": "f9964b0d15b244b393df6b111e62096b",
        "docName": "TMER",
        "required": true,
        "info": ""
    },
    {
        "idmetadata": "e64c2aba1b7b4796a0b77d1e6dc41f9f",
        "docName": "VMER",
        "required": true,
        "info": ""
    }
];


const findAndUpdateDocument = async (documents, document) => {
    try {
        let index = documents.findIndex(item => document.idmetadata === item.idmetadata);

        if (index !== -1) {
            documents[index] = {
                ...documents[index],
                required: false
            };
        }

        return documents;
    } catch (error) {
        console.error("Util Error:", error);
        throw error;
    }

};

module.exports = {
    REQUIRED_DOCUMENTS,
    findAndUpdateDocument
}