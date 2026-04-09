import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';

const defaultOptions = {} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface BudgetAdjustment {
  id: string;
  projectId: string;
  date: string;
  amount: number;
  note?: string | null;
  createdAt: string;
}

export interface DailySpendRecord {
  date: string;
  hours: number;
  cost: number;
}

export interface InvoiceRecord {
  invoiceId: string;
  startDate: string;
  endDate: string;
  amount: number;
}

export interface BurndownData {
  projectId: string;
  projectName: string;
  projectRate: number;
  adjustments: BudgetAdjustment[];
  dailyRecords: DailySpendRecord[];
  invoices: InvoiceRecord[];
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export const GetProjectAdjustmentsDocument = gql`
  query getProjectAdjustments($projectId: String!) {
    getProjectAdjustments(projectId: $projectId) {
      id
      projectId
      date
      amount
      note
      createdAt
    }
  }
`;

export const GetBurndownDataDocument = gql`
  query getBurndownData($projectId: String!, $startDate: DateTime!, $endDate: DateTime!) {
    getBurndownData(projectId: $projectId, startDate: $startDate, endDate: $endDate) {
      projectId
      projectName
      projectRate
      adjustments {
        id
        projectId
        date
        amount
        note
        createdAt
      }
      dailyRecords {
        date
        hours
        cost
      }
      invoices {
        invoiceId
        startDate
        endDate
        amount
      }
    }
  }
`;

// ─── Mutations ────────────────────────────────────────────────────────────────

export const AddBudgetAdjustmentDocument = gql`
  mutation addBudgetAdjustment($input: AddBudgetAdjustmentInput!) {
    addBudgetAdjustment(input: $input) {
      id
      projectId
      date
      amount
      note
      createdAt
    }
  }
`;

export const DeleteBudgetAdjustmentDocument = gql`
  mutation deleteBudgetAdjustment($id: String!) {
    deleteBudgetAdjustment(id: $id) {
      id
    }
  }
`;

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useGetProjectAdjustmentsQuery(projectId: string, skip?: boolean) {
  return Apollo.useQuery<{ getProjectAdjustments: BudgetAdjustment[] }>(GetProjectAdjustmentsDocument, {
    variables: { projectId },
    skip
  });
}

export function useGetBurndownDataQuery(
  variables: { projectId: string; startDate: string; endDate: string },
  options?: Omit<Apollo.QueryHookOptions<{ getBurndownData: BurndownData }>, 'variables'>
) {
  return Apollo.useQuery<{ getBurndownData: BurndownData }>(GetBurndownDataDocument, {
    variables,
    ...options
  });
}

export function useAddBudgetAdjustmentMutation(options?: Apollo.MutationHookOptions) {
  return Apollo.useMutation<{ addBudgetAdjustment: BudgetAdjustment }>(AddBudgetAdjustmentDocument, {
    ...defaultOptions,
    ...options
  });
}

export function useDeleteBudgetAdjustmentMutation(options?: Apollo.MutationHookOptions) {
  return Apollo.useMutation<{ deleteBudgetAdjustment: { id: string } }>(DeleteBudgetAdjustmentDocument, {
    ...defaultOptions,
    ...options
  });
}

