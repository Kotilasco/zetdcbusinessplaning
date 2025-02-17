import { NextResponse, NextRequest } from "next/server";


 interface ReportData {
    outputStage: string;
    description: string;
    startDate: string;
    finishDate: string;
    expenditure: string;
    responsibility: string;
  }

export const GET = async (req: NextRequest, res: NextResponse) => {
    const { method } = req;
    const pathSegments = req.url.split('/');
    const value = pathSegments[pathSegments.length - 1];
    console.log(value); // This will log 'quarter' based on the provided URL
    try {
       
 let data: ReportData[] = [];

 switch (value) {
    case 'initial':
      data = getDepartmentalData();
      break;
    case 'quarter':
      data = getFinancialData();
      break;
    // Add more cases for other 'value' options
    default:
      data = getFinancialData();
      break;
  }
        return new NextResponse(JSON.stringify({ message: "Files read successfully", data: data }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error(error);
        return new NextResponse(JSON.stringify({ message: "Error reading files" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
};

function getDepartmentalData(): ReportData[] {
  // ... your logic to fetch departmental data
  return [
      {
        outputStage: "1",
        description: "Output not commenced",
        startDate: "",
        finishDate: "",
        expenditure: "",
        responsibility: "",
      },
      {
        outputStage: "2",
        description: "Preparatory Actions",
        startDate: "",
        finishDate: "",
        expenditure: "",
        responsibility: "",
      },
      {
        outputStage: "Act 1",
        description: "CT Upgrades",
        startDate: "",
        finishDate: "",
        expenditure: "",
        responsibility: "Harare Region",
      },
      {
        outputStage: "Act 2",
        description:
          "Relocate 20MVA, 88KV Txf from Hwange Local to Vic Falls 88kv Sub",
        startDate: "January 2018",
        finishDate: "",
        expenditure: "USD 100 000",
        responsibility: "Regional Transmission West",
      },
      {
        outputStage: "Act 3",
        description:
          "Replace Ncema-Mzinyathini ‘H’ wood poles with steel monopole towers",
        startDate: "January 2015",
        finishDate: "",
        expenditure: "USD 300 000",
        responsibility: "Regional Transmission West",
      },
      {
        outputStage: "Act 4",
        description: "Commission ZIMPLATS 40MW Solar Plant",
        startDate: "Jan 2024",
        finishDate: "",
        expenditure: "",
        responsibility: "SMETO",
      },
      {
        outputStage: "Act 5",
        description: "Commission T&D Solar 40MW Plant",
        startDate: "Jan 2024",
        finishDate: "",
        expenditure: "",
        responsibility: "SMETO",
      },
      {
          outputStage: "Act 5",
          description: "Commission T&D Solar 40MW Plant",
          startDate: "Jan 2024",
          finishDate: "",
          expenditure: "",
          responsibility: "SMETO",
        },
  ];
}

function getFinancialData(): ReportData[] {
  // ... your logic to fetch financial data
  return [
    {
      outputStage: "1", 
      description: "Output not commenced",
      startDate: "",
      finishDate: "",
      expenditure: "",
      responsibility: "",
    },
    {
      outputStage: "2", 
      description: "Preparatory Actions",
      startDate: "",
      finishDate: "",
      expenditure: "",
      responsibility: "",
    },
    {
      outputStage: "Act 3", 
      description: "CT Upgrades",
      startDate: "",
      finishDate: "",
      expenditure: "",
      responsibility: "Harare Region",
    },
    {
      outputStage: "Act 4", 
      description:
        "Relocate 20MVA, 88KV Txf from Hwange Local to Vic Falls 88kv Sub",
      startDate: "January 2018",
      finishDate: "",
      expenditure: "USD 100 000",
      responsibility: "Regional Transmission West",
    },
    {
      outputStage: "Act 5", 
      description:
        "Replace Ncema-Mzinyathini ‘H’ wood poles with steel monopole towers",
      startDate: "January 2015",
      finishDate: "",
      expenditure: "USD 300 000",
      responsibility: "Regional Transmission West",
    },
    {
      outputStage: "Act 6", 
      description: "Commission ZIMPLATS 40MW Solar Plant",
      startDate: "Jan 2024",
      finishDate: "",
      expenditure: "",
      responsibility: "SMETO",
    },
    {
      outputStage: "Act 7", 
      description: "Commission T&D Solar 40MW Plant",
      startDate: "Jan 2024",
      finishDate: "",
      expenditure: "",
      responsibility: "SMETO",
    },
    {
      outputStage: "Act 8", 
      description: "Commission T&D Solar 40MW Plant", 
      startDate: "Jan 2024",
      finishDate: "",
      expenditure: "",
      responsibility: "SMETO",
    },
  ];
}