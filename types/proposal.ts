import {Review} from "@/types/review";

export interface Proposal {
  chainId: string;
  proposalId: string;
  reviews: Review[];
}

export interface ResponseProposal {
  proposal_id: string;
  status: string;
  content: {
    title: string;
    description: string;
  }
}
