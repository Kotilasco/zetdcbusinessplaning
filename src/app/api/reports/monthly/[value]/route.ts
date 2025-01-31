import type { NextApiRequest, NextApiResponse } from 'next';

export interface ReportData {
  outputStage: string;
  description: string;
  startDate: string;
  finishDate: string;
  expenditure: string;
  responsibility: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReportData[] | { error: string }>
) {
  const { method, query } = req;
  const { value } = query;
console.log("LLLLL")
  try {
    switch (method) {
      case 'GET': {
        // Simulate fetching data based on 'value' 
        // (Replace with your actual data fetching logic)
        let data: ReportData[] = [];

        console.log("kkkkk")

        switch (value) {
          case 'initial':
            data = getDepartmentalData();
            break;
          case 'quarter':
            data = getFinancialData();
            break;
          // Add more cases for other 'value' options
          default:
            return res.status(404).json({ error: 'Report type not found' });
        }

        return res.status(200).json(data);
      }

      default: {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${method} Not Allowed`);
      }
    }
  } catch (error: any) {
    return res.status(500).json({ error: `An error occurred: ${error.message}` });
  }
}

// Helper functions for fetching data (replace with your actual data fetching logic)
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